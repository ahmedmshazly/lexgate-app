import {
  PartyIdentityConflictError,
  PartyIdentityNotFoundOrNotAuthorizedError,
} from "@lexgate/application";
import {
  createNeutralPartyMutation,
  flagPossibleDuplicateMutation,
  recordPartyNameMutation,
  recordRepresentationClaimMutation,
  type CreateNeutralPartyInput,
  type SyntheticPrivacyHandlingMetadata,
} from "@lexgate/domain";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createPartyIdentityPersistencePort } from "./party-identity.js";
import {
  auditEvents,
  outboxEvents,
  parties,
  partyContactAssertions,
  partyIdentityAuditEvents,
  partyNameForms,
  partyPossibleDuplicateFlags,
  partyPrimaryNameAssignments,
  partyRepresentationClaims,
  effectiveRestrictedResourceAccessGrants,
} from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for DAT-PRT-001 integration tests. Start local PostgreSQL before running them.",
  );
}

const client = postgres(databaseUrl, { max: 1 });
const database = drizzle({ client });
const persistence = createPartyIdentityPersistencePort(database);

const privacy = (
  subjectCategory: SyntheticPrivacyHandlingMetadata["subjectCategory"],
) => ({
  processingPurpose: "party_identity_foundation",
  dataClassification: "internal" as const,
  subjectCategory,
  source: "synthetic-fixture",
  retentionCandidate: "synthetic_development_only" as const,
  accessBoundary: "internal_authorized_only" as const,
  validationRequirement: "privacy_and_g2_required" as const,
});

const occurredAt = new Date("2026-08-10T00:00:00.000Z");

const createFixture = () => {
  const organizationId = `synthetic-party-org-${crypto.randomUUID()}`;
  const actor = {
    accountId: `synthetic-party-account-${crypto.randomUUID()}`,
    organizationId,
  };

  const createParty = (input: {
    partyId?: string;
    kind: "person" | "organization";
    name: string;
    languageTag: "ar" | "en";
  }) => {
    const partyId = input.partyId ?? crypto.randomUUID();
    const nameId = crypto.randomUUID();
    const command: CreateNeutralPartyInput = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-party-create-${crypto.randomUUID()}`,
      partyId,
      kind: input.kind,
      partyPrivacy: privacy(
        input.kind === "person"
          ? "synthetic_individual"
          : "synthetic_organization",
      ),
      primaryName: {
        id: nameId,
        value: input.name,
        formType: "legal",
        languageTag: input.languageTag,
        script: input.languageTag === "ar" ? "Arabic" : "Latin",
        reviewState: "unreviewed",
        privacy: privacy(
          input.kind === "person"
            ? "synthetic_individual"
            : "synthetic_organization",
        ),
      },
      primaryNameAssignment: {
        id: crypto.randomUUID(),
        nameFormId: nameId,
      },
      initialContact: {
        id: crypto.randomUUID(),
        contactType: "email",
        value: `synthetic-${crypto.randomUUID()}@example.test`,
        operationalPurpose: "party_identity_foundation",
        reviewState: "unreviewed",
        privacy: privacy("synthetic_individual"),
      },
      occurredAt,
    };
    return command;
  };

  const persistParty = async (command: CreateNeutralPartyInput) =>
    persistence.createParty({
      actor,
      command,
      mutation: createNeutralPartyMutation(command),
      commandFingerprint: `fingerprint-${command.commandId}`,
    });

  return { actor, createParty, organizationId, persistParty };
};

let fixture: ReturnType<typeof createFixture>;

describe("PostgreSQL party identity foundation", () => {
  beforeEach(() => {
    fixture = createFixture();
  });

  afterAll(async () => {
    await client.end({ timeout: 5 });
  });

  it("persists a synthetic neutral party with privacy metadata, append-only audit receipt, and minimal outbox evidence", async () => {
    const initialCommand = fixture.createParty({
      kind: "person",
      name: "أحمد اختبار",
      languageTag: "ar",
    });
    const command: CreateNeutralPartyInput = {
      ...initialCommand,
      partyPrivacy: {
        ...initialCommand.partyPrivacy,
        processingPurpose: " party_identity_foundation ",
        source: " synthetic-fixture ",
      },
      primaryName: {
        ...initialCommand.primaryName,
        value: ` ${initialCommand.primaryName.value} `,
        languageTag: " ar ",
        script: " Arabic ",
        privacy: {
          ...initialCommand.primaryName.privacy,
          source: " synthetic-fixture ",
        },
      },
      initialContact: {
        ...initialCommand.initialContact!,
        value: ` ${initialCommand.initialContact!.value} `,
        operationalPurpose: " party_identity_foundation ",
        privacy: {
          ...initialCommand.initialContact!.privacy,
          source: " synthetic-fixture ",
        },
      },
    };

    await expect(fixture.persistParty(command)).resolves.toMatchObject({
      partyId: command.partyId,
      assertionId: command.primaryName.id,
      replayed: false,
    });
    await expect(fixture.persistParty(command)).resolves.toMatchObject({
      partyId: command.partyId,
      replayed: true,
    });
    const incompatibleReplay = {
      ...command,
      primaryName: {
        ...command.primaryName,
        value: "Different synthetic value",
      },
    };
    await expect(
      persistence.createParty({
        actor: fixture.actor,
        command: incompatibleReplay,
        mutation: createNeutralPartyMutation(incompatibleReplay),
        commandFingerprint: "incompatible-command-fingerprint",
      }),
    ).rejects.toBeInstanceOf(PartyIdentityConflictError);

    const [party] = await database
      .select()
      .from(parties)
      .where(eq(parties.id, command.partyId));
    const [name] = await database
      .select()
      .from(partyNameForms)
      .where(eq(partyNameForms.id, command.primaryName.id));
    const [contact] = await database
      .select()
      .from(partyContactAssertions)
      .where(eq(partyContactAssertions.id, command.initialContact!.id));
    const [receipt] = await database
      .select()
      .from(partyIdentityAuditEvents)
      .where(eq(partyIdentityAuditEvents.commandId, command.commandId));
    const [outbox] = await database
      .select()
      .from(outboxEvents)
      .where(eq(outboxEvents.id, command.commandId));

    expect(party).toMatchObject({
      organizationId: fixture.organizationId,
      kind: "person",
      processingPurpose: "party_identity_foundation",
      source: "synthetic-fixture",
      dataClassification: "internal",
      retentionCandidate: "synthetic_development_only",
      validationRequirement: "privacy_and_g2_required",
    });
    expect(name).toMatchObject({
      value: command.primaryName.value.trim(),
      languageTag: "ar",
      script: "Arabic",
      source: "synthetic-fixture",
    });
    expect(contact).toMatchObject({
      value: command.initialContact!.value.trim(),
      operationalPurpose: "party_identity_foundation",
      accessBoundary: "internal_authorized_only",
      source: "synthetic-fixture",
    });
    expect(receipt).toMatchObject({
      commandId: command.commandId,
      organizationId: fixture.organizationId,
      resourceId: command.partyId,
      assertionId: command.primaryName.id,
      assertionCategory: "party",
    });
    expect(outbox).toMatchObject({
      id: command.commandId,
      type: "party.created",
      aggregateId: command.partyId,
      payload: {
        partyId: command.partyId,
        assertionId: command.primaryName.id,
        assertionCategory: "party",
      },
    });
    expect(JSON.stringify(outbox?.payload)).not.toContain(
      command.primaryName.value,
    );
    expect(JSON.stringify(outbox?.payload)).not.toContain(
      command.initialContact!.value,
    );

    const projection = await persistence.readPartyHistory({
      organizationId: fixture.organizationId,
      partyId: command.partyId,
      actor: {
        accountId: "synthetic-reader",
        correlationId: "synthetic-read-correlation",
      },
    });
    expect(projection).toMatchObject({
      id: command.partyId,
      primaryNameId: command.primaryName.id,
      names: [{ value: command.primaryName.value.trim() }],
      contacts: [{ value: command.initialContact!.value.trim() }],
    });

    await expect(
      database
        .update(parties)
        .set({ kind: "organization" })
        .where(eq(parties.id, command.partyId)),
    ).rejects.toThrow();
    await expect(
      database
        .delete(partyIdentityAuditEvents)
        .where(eq(partyIdentityAuditEvents.commandId, command.commandId)),
    ).rejects.toThrow();
    await expect(
      database
        .update(partyContactAssertions)
        .set({ operationalPurpose: "overwritten" })
        .where(eq(partyContactAssertions.id, command.initialContact!.id)),
    ).rejects.toThrow();
    await expect(
      database
        .delete(partyPrimaryNameAssignments)
        .where(
          eq(partyPrimaryNameAssignments.id, command.primaryNameAssignment.id),
        ),
    ).rejects.toThrow();
    await expect(
      database.insert(partyContactAssertions).values({
        id: crypto.randomUUID(),
        organizationId: fixture.organizationId,
        partyId: command.partyId,
        contactType: "email",
        value: "synthetic-predecessor@example.test",
        operationalPurpose: "party_identity_foundation",
        reviewState: "unreviewed",
        ...privacy("synthetic_individual"),
        recordedAt: occurredAt,
        recordedByAccountId: fixture.actor.accountId,
        supersedesContactId: crypto.randomUUID(),
      }),
    ).rejects.toThrow();

    const receipts = await database
      .select()
      .from(partyIdentityAuditEvents)
      .where(eq(partyIdentityAuditEvents.commandId, command.commandId));
    expect(receipts).toHaveLength(1);
  });

  it("preserves name corrections and rejects an unauthorized organization boundary or partial event write", async () => {
    const command = fixture.createParty({
      kind: "organization",
      name: "Synthetic Legal Services LLC",
      languageTag: "en",
    });
    await fixture.persistParty(command);
    const replacementNameId = crypto.randomUUID();
    const replacementAssignmentId = crypto.randomUUID();
    const nameCommand = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-party-name-${crypto.randomUUID()}`,
      partyId: command.partyId,
      name: {
        id: replacementNameId,
        value: "Synthetic Legal Services",
        formType: "alternate" as const,
        languageTag: "en",
        script: "Latin",
        reviewState: "reviewed" as const,
        privacy: privacy("synthetic_organization"),
        supersedesNameFormId: command.primaryName.id,
      },
      primaryNameAssignment: {
        id: replacementAssignmentId,
        nameFormId: replacementNameId,
        supersedesAssignmentId: command.primaryNameAssignment.id,
      },
      occurredAt,
    };
    await persistence.recordName({
      actor: fixture.actor,
      command: nameCommand,
      mutation: recordPartyNameMutation(nameCommand),
      commandFingerprint: `fingerprint-${nameCommand.commandId}`,
    });

    const nameHistory = await database
      .select()
      .from(partyNameForms)
      .where(eq(partyNameForms.partyId, command.partyId));
    expect(nameHistory).toHaveLength(2);
    await expect(
      persistence.readPartyHistory({
        organizationId: fixture.organizationId,
        partyId: command.partyId,
        actor: {
          accountId: "synthetic-reader",
          correlationId: "synthetic-read-correlation",
        },
      }),
    ).resolves.toMatchObject({
      primaryNameId: replacementNameId,
      primaryNameAssignments: [
        {
          id: command.primaryNameAssignment.id,
          nameFormId: command.primaryName.id,
          supersedesAssignmentId: null,
        },
        {
          id: replacementAssignmentId,
          nameFormId: replacementNameId,
          supersedesAssignmentId: command.primaryNameAssignment.id,
        },
      ],
    });
    await expect(
      database
        .update(partyNameForms)
        .set({ value: "Overwritten" })
        .where(eq(partyNameForms.id, command.primaryName.id)),
    ).rejects.toThrow();

    const branchNameId = crypto.randomUUID();
    const branchCommand = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-party-name-branch-${crypto.randomUUID()}`,
      partyId: command.partyId,
      name: {
        id: branchNameId,
        value: "Synthetic Legal Services Branch",
        formType: "alternate" as const,
        languageTag: "en",
        script: "Latin",
        reviewState: "unreviewed" as const,
        privacy: privacy("synthetic_organization"),
        supersedesNameFormId: command.primaryName.id,
      },
      primaryNameAssignment: {
        id: crypto.randomUUID(),
        nameFormId: branchNameId,
        supersedesAssignmentId: command.primaryNameAssignment.id,
      },
      occurredAt: new Date("2026-08-10T00:00:01.000Z"),
    };
    await expect(
      persistence.recordName({
        actor: fixture.actor,
        command: branchCommand,
        mutation: recordPartyNameMutation(branchCommand),
        commandFingerprint: `fingerprint-${branchCommand.commandId}`,
      }),
    ).rejects.toThrow();
    const branchRows = await database
      .select()
      .from(partyNameForms)
      .where(eq(partyNameForms.id, branchNameId));
    const branchReceipts = await database
      .select()
      .from(partyIdentityAuditEvents)
      .where(eq(partyIdentityAuditEvents.commandId, branchCommand.commandId));
    expect(branchRows).toEqual([]);
    expect(branchReceipts).toEqual([]);

    await expect(
      database.insert(partyNameForms).values({
        id: crypto.randomUUID(),
        organizationId: fixture.organizationId,
        partyId: command.partyId,
        value: "Synthetic invalid predecessor",
        formType: "alternate",
        languageTag: "en",
        script: "Latin",
        reviewState: "unreviewed",
        ...privacy("synthetic_organization"),
        recordedAt: occurredAt,
        recordedByAccountId: fixture.actor.accountId,
        supersedesNameFormId: crypto.randomUUID(),
      }),
    ).rejects.toThrow();
    await expect(
      database.insert(partyPrimaryNameAssignments).values({
        id: crypto.randomUUID(),
        organizationId: fixture.organizationId,
        partyId: command.partyId,
        nameFormId: replacementNameId,
        supersedesAssignmentId: crypto.randomUUID(),
        recordedAt: occurredAt,
        recordedByAccountId: fixture.actor.accountId,
      }),
    ).rejects.toThrow();

    const crossOrganizationCommand = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-party-cross-org-${crypto.randomUUID()}`,
      partyId: command.partyId,
      name: { ...nameCommand.name, id: crypto.randomUUID() },
      occurredAt: new Date("2026-08-10T00:00:01.000Z"),
    };
    await expect(
      persistence.recordName({
        actor: {
          ...fixture.actor,
          organizationId: `synthetic-other-org-${crypto.randomUUID()}`,
        },
        command: crossOrganizationCommand,
        mutation: recordPartyNameMutation(crossOrganizationCommand),
        commandFingerprint: "cross-org-fingerprint",
      }),
    ).rejects.toBeInstanceOf(PartyIdentityNotFoundOrNotAuthorizedError);

    const rollbackCommand = fixture.createParty({
      kind: "person",
      name: "Synthetic Rollback",
      languageTag: "en",
    });
    const rollbackMutation = createNeutralPartyMutation(rollbackCommand);
    await expect(
      persistence.createParty({
        actor: fixture.actor,
        command: rollbackCommand,
        mutation: {
          ...rollbackMutation,
          event: { ...rollbackMutation.event, id: "not-a-uuid" },
        },
        commandFingerprint: `fingerprint-${rollbackCommand.commandId}`,
      }),
    ).rejects.toThrow();
    const rolledBackParties = await database
      .select()
      .from(parties)
      .where(eq(parties.id, rollbackCommand.partyId));
    expect(rolledBackParties).toEqual([]);
  });

  it("keeps a contact-free unreviewed party and its Arabic/English transliterated name history", async () => {
    const initialCommand = fixture.createParty({
      kind: "person",
      name: "أحمد اختبار",
      languageTag: "ar",
    });
    const { initialContact: _initialContact, ...command } = initialCommand;
    await fixture.persistParty(command);

    const transliteratedNameId = crypto.randomUUID();
    const transliteratedCommand = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-party-transliteration-${crypto.randomUUID()}`,
      partyId: command.partyId,
      name: {
        id: transliteratedNameId,
        value: "Ahmed Ekhtibar",
        formType: "transliterated" as const,
        languageTag: "en",
        script: "Latin",
        reviewState: "unreviewed" as const,
        privacy: privacy("synthetic_individual"),
      },
      occurredAt: new Date("2026-08-10T00:00:01.000Z"),
    };
    await persistence.recordName({
      actor: fixture.actor,
      command: transliteratedCommand,
      mutation: recordPartyNameMutation(transliteratedCommand),
      commandFingerprint: `fingerprint-${transliteratedCommand.commandId}`,
    });

    await expect(
      persistence.readPartyHistory({
        organizationId: fixture.organizationId,
        partyId: command.partyId,
        actor: {
          accountId: "synthetic-reader",
          correlationId: "synthetic-read-correlation",
        },
      }),
    ).resolves.toMatchObject({
      primaryNameId: command.primaryName.id,
      names: [
        {
          id: command.primaryName.id,
          value: "أحمد اختبار",
          languageTag: "ar",
          reviewState: "unreviewed",
        },
        {
          id: transliteratedNameId,
          value: "Ahmed Ekhtibar",
          languageTag: "en",
          formType: "transliterated",
          reviewState: "unreviewed",
        },
      ],
      contacts: [],
    });
  });

  it("stores non-authoritative representation and duplicate facts only for same-organization distinct parties", async () => {
    const person = fixture.createParty({
      kind: "person",
      name: "أحمد اختبار",
      languageTag: "ar",
    });
    const organization = fixture.createParty({
      kind: "organization",
      name: "Synthetic Organization",
      languageTag: "en",
    });
    await fixture.persistParty(person);
    await fixture.persistParty(organization);

    const firstPartyId =
      person.partyId < organization.partyId
        ? person.partyId
        : organization.partyId;
    const secondPartyId =
      person.partyId < organization.partyId
        ? organization.partyId
        : person.partyId;
    const claimCommand = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-party-representation-${crypto.randomUUID()}`,
      claim: {
        id: crypto.randomUUID(),
        representedPartyId: organization.partyId,
        representativePartyId: person.partyId,
        claimState: "asserted" as const,
        reviewState: "unreviewed" as const,
        privacy: privacy("synthetic_representative"),
      },
      occurredAt,
    };
    const duplicateCommand = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-party-duplicate-${crypto.randomUUID()}`,
      duplicate: {
        id: crypto.randomUUID(),
        firstPartyId,
        secondPartyId,
        matchRationale: "synthetic_name_similarity",
        reviewState: "unreviewed" as const,
        privacy: privacy("synthetic_unknown"),
      },
      occurredAt,
    };

    await persistence.recordRepresentationClaim({
      actor: fixture.actor,
      command: claimCommand,
      mutation: recordRepresentationClaimMutation(claimCommand),
      commandFingerprint: `fingerprint-${claimCommand.commandId}`,
    });
    await persistence.flagPossibleDuplicate({
      actor: fixture.actor,
      command: duplicateCommand,
      mutation: flagPossibleDuplicateMutation(duplicateCommand),
      commandFingerprint: `fingerprint-${duplicateCommand.commandId}`,
    });

    const [claim] = await database
      .select()
      .from(partyRepresentationClaims)
      .where(eq(partyRepresentationClaims.id, claimCommand.claim.id));
    const [duplicate] = await database
      .select()
      .from(partyPossibleDuplicateFlags)
      .where(eq(partyPossibleDuplicateFlags.id, duplicateCommand.duplicate.id));
    expect(claim).toMatchObject({
      claimState: "asserted",
      representedPartyId: organization.partyId,
      representativePartyId: person.partyId,
    });
    expect(duplicate).toMatchObject({
      firstPartyId,
      secondPartyId,
    });
    await expect(
      database
        .delete(partyRepresentationClaims)
        .where(eq(partyRepresentationClaims.id, claimCommand.claim.id)),
    ).rejects.toThrow();
    await expect(
      database
        .update(partyPossibleDuplicateFlags)
        .set({ reviewState: "reviewed" })
        .where(
          eq(partyPossibleDuplicateFlags.id, duplicateCommand.duplicate.id),
        ),
    ).rejects.toThrow();

    await expect(
      database.insert(partyRepresentationClaims).values({
        id: crypto.randomUUID(),
        organizationId: fixture.organizationId,
        representedPartyId: organization.partyId,
        representativePartyId: person.partyId,
        claimState: "asserted",
        reviewState: "unreviewed",
        ...privacy("synthetic_representative"),
        effectiveFrom: null,
        effectiveUntil: null,
        recordedAt: occurredAt,
        recordedByAccountId: fixture.actor.accountId,
        supersedesClaimId: crypto.randomUUID(),
      }),
    ).rejects.toThrow();

    const duplicatePrivacy = privacy("synthetic_unknown");
    await expect(
      database.insert(partyPossibleDuplicateFlags).values({
        id: crypto.randomUUID(),
        organizationId: fixture.organizationId,
        firstPartyId: person.partyId,
        secondPartyId: person.partyId,
        matchRationale: "synthetic_name_similarity",
        reviewState: "unreviewed",
        ...duplicatePrivacy,
        recordedAt: occurredAt,
        recordedByAccountId: fixture.actor.accountId,
      }),
    ).rejects.toThrow();
    await expect(
      database.insert(partyPossibleDuplicateFlags).values({
        id: crypto.randomUUID(),
        organizationId: fixture.organizationId,
        firstPartyId: secondPartyId,
        secondPartyId: firstPartyId,
        matchRationale: "synthetic_name_similarity",
        reviewState: "unreviewed",
        ...duplicatePrivacy,
        recordedAt: occurredAt,
        recordedByAccountId: fixture.actor.accountId,
      }),
    ).rejects.toThrow();

    const createdGrants = await database
      .select()
      .from(effectiveRestrictedResourceAccessGrants)
      .where(
        and(
          eq(
            effectiveRestrictedResourceAccessGrants.accountId,
            fixture.actor.accountId,
          ),
          eq(
            effectiveRestrictedResourceAccessGrants.organizationId,
            fixture.organizationId,
          ),
        ),
      );
    expect(createdGrants).toEqual([]);

    const outboxRows = await database
      .select()
      .from(outboxEvents)
      .where(
        and(
          eq(outboxEvents.aggregateId, organization.partyId),
          eq(outboxEvents.type, "party.representation_recorded"),
        ),
      );
    expect(outboxRows).toHaveLength(1);
  });

  it("records a lookup that found nothing, so silence is not clearance (G2)", async () => {
    const organizationId = `synthetic-org-${crypto.randomUUID()}`;
    const missingPartyId = crypto.randomUUID();

    await expect(
      persistence.readPartyHistory({
        organizationId,
        partyId: missingPartyId,
        actor: {
          accountId: "synthetic-reader",
          correlationId: "synthetic-read-correlation",
        },
      }),
    ).resolves.toBeNull();

    // The negative result is the one that matters. Without this record a
    // reviewer cannot tell "checked, found nothing" from "never checked",
    // and absence of a match reads as a clearance nobody granted.
    const [attempt] = await database
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.resourceId, missingPartyId));

    expect(attempt).toMatchObject({
      actorAccountId: "synthetic-reader",
      action: "party_identity.read.not_found",
      resourceType: "party",
    });
  });
});
