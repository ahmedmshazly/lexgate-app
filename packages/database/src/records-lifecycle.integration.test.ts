import type {
  CreateNeutralPartyInput,
  LegalHoldCommand,
} from "@lexgate/domain";
import {
  createNeutralPartyMutation,
  deriveLegalHoldTransition,
} from "@lexgate/domain";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, describe, expect, it } from "vitest";
import {
  createRecordsLifecyclePersistencePort,
  rebuildEffectiveLegalHolds,
} from "./records-lifecycle.js";
import { createPartyIdentityPersistencePort } from "./party-identity.js";
import {
  auditEvents,
  legalHoldEvents,
  partyNameForms,
  subjectEncryptionKeys,
} from "./schema.js";
import { ERASED_VALUE } from "./subject-keys.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for REC-HLD-001 integration tests. Start local PostgreSQL before running them.",
  );
}

const client = postgres(databaseUrl, { max: 2 });
const database = drizzle({ client });
const records = createRecordsLifecyclePersistencePort(database);
const parties = createPartyIdentityPersistencePort(database);

const syntheticPrivacy = {
  processingPurpose: "party_identity_foundation",
  dataClassification: "internal",
  subjectCategory: "synthetic_individual",
  source: "synthetic-fixture",
  retentionCandidate: "synthetic_development_only",
  accessBoundary: "internal_authorized_only",
  validationRequirement: "privacy_and_g2_required",
} as const;

const createPartyCommand = (input: {
  partyId: string;
  name: string;
}): CreateNeutralPartyInput => {
  const nameId = crypto.randomUUID();
  return {
    commandId: crypto.randomUUID(),
    correlationId: `synthetic-records-party-${crypto.randomUUID()}`,
    partyId: input.partyId,
    kind: "person",
    partyPrivacy: syntheticPrivacy,
    primaryName: {
      id: nameId,
      value: input.name,
      formType: "legal",
      languageTag: "ar",
      script: "Arabic",
      reviewState: "unreviewed",
      privacy: syntheticPrivacy,
    },
    primaryNameAssignment: { id: crypto.randomUUID(), nameFormId: nameId },
    occurredAt,
  };
};
const occurredAt = new Date("2026-08-10T12:00:00.000Z");

const fixture = () => {
  const suffix = crypto.randomUUID();
  const organizationId = `synthetic-records-org-${suffix}`;
  const subjectId = crypto.randomUUID();
  const holdId = crypto.randomUUID();
  const operatorAccountId = `synthetic-records-officer-${suffix}`;

  const command = (
    overrides: Partial<LegalHoldCommand> = {},
  ): LegalHoldCommand => ({
    holdId,
    organizationId,
    resource: { resourceType: "party", resourceId: subjectId },
    eventType: "placed",
    expectedRevision: null,
    operatorAccountId,
    reasonCode: "synthetic_litigation_hold",
    correlationId: `synthetic-records-correlation-${crypto.randomUUID()}`,
    occurredAt,
    ...overrides,
  });

  return { organizationId, subjectId, holdId, operatorAccountId, command };
};

const place = async (current: ReturnType<typeof fixture>) => {
  const command = current.command();
  return records.applyLegalHold({
    actor: {
      accountId: command.operatorAccountId,
      organizationId: current.organizationId,
    },
    command,
    transition: deriveLegalHoldTransition({ command, current: null }),
  });
};

describe("PostgreSQL records lifecycle", () => {
  afterAll(async () => {
    await client.end({ timeout: 5 });
  });

  it("refuses erasure while held, permits it after release, and keeps the history (REC-HLD-001)", async () => {
    const current = fixture();
    await records.ensureSubjectKey({
      subjectId: current.subjectId,
      organizationId: current.organizationId,
    });

    await place(current);

    // The test that matters. If this ever permits an erasure, REC-HLD-001 is
    // not satisfied regardless of what else works.
    await expect(
      records.eraseSubject({
        subjectId: current.subjectId,
        organizationId: current.organizationId,
        actor: {
          accountId: "synthetic-privacy-officer",
          reasonCode: "synthetic_erasure_request",
        },
      }),
    ).resolves.toEqual({ outcome: "refused", reason: "held" });

    const releaseCommand = current.command({
      eventType: "released",
      expectedRevision: 1,
      reasonCode: "synthetic_hold_lifted",
    });
    const holds = await records.readHolds({
      organizationId: current.organizationId,
      resource: releaseCommand.resource,
    });
    await records.applyLegalHold({
      actor: {
        accountId: releaseCommand.operatorAccountId,
        organizationId: current.organizationId,
      },
      command: releaseCommand,
      transition: deriveLegalHoldTransition({
        command: releaseCommand,
        current: holds[0] ?? null,
      }),
    });

    await expect(
      records.eraseSubject({
        subjectId: current.subjectId,
        organizationId: current.organizationId,
        actor: {
          accountId: "synthetic-privacy-officer",
          reasonCode: "synthetic_erasure_request",
        },
      }),
    ).resolves.toEqual({ outcome: "erased" });

    // The content is gone; the record of what happened is not.
    const ledger = await database
      .select()
      .from(legalHoldEvents)
      .where(eq(legalHoldEvents.holdId, current.holdId));
    expect(ledger).toHaveLength(2);
    expect(ledger.map((event) => event.eventType).sort()).toEqual([
      "placed",
      "released",
    ]);

    const [erasure] = await database
      .select()
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.action, "records_lifecycle.subject_erased"),
          eq(auditEvents.resourceId, current.subjectId),
        ),
      );
    expect(erasure).toMatchObject({
      actorAccountId: "synthetic-privacy-officer",
      resourceType: "party",
    });
  });

  it("keeps the placement readable after release, rather than editing it", async () => {
    const current = fixture();
    await place(current);

    const releaseCommand = current.command({
      eventType: "released",
      expectedRevision: 1,
    });
    const holds = await records.readHolds({
      organizationId: current.organizationId,
      resource: releaseCommand.resource,
    });
    await records.applyLegalHold({
      actor: {
        accountId: releaseCommand.operatorAccountId,
        organizationId: current.organizationId,
      },
      command: releaseCommand,
      transition: deriveLegalHoldTransition({
        command: releaseCommand,
        current: holds[0] ?? null,
      }),
    });

    const [placement] = await database
      .select()
      .from(legalHoldEvents)
      .where(
        and(
          eq(legalHoldEvents.holdId, current.holdId),
          eq(legalHoldEvents.eventType, "placed"),
        ),
      );
    expect(placement).toMatchObject({ revision: 1, priorRevision: null });

    // The ledger is evidence. An attempt to edit it must fail.
    await expect(
      database
        .update(legalHoldEvents)
        .set({ eventType: "released" })
        .where(eq(legalHoldEvents.id, placement!.id)),
    ).rejects.toThrow();
  });

  it("resolves a repeated erasure without recording a second removal", async () => {
    const current = fixture();
    await records.ensureSubjectKey({
      subjectId: current.subjectId,
      organizationId: current.organizationId,
    });
    const actor = {
      accountId: "synthetic-privacy-officer",
      reasonCode: "synthetic_erasure_request",
    };

    await expect(
      records.eraseSubject({
        subjectId: current.subjectId,
        organizationId: current.organizationId,
        actor,
      }),
    ).resolves.toEqual({ outcome: "erased" });

    await expect(
      records.eraseSubject({
        subjectId: current.subjectId,
        organizationId: current.organizationId,
        actor,
      }),
    ).resolves.toEqual({ outcome: "already_erased" });

    const erasures = await database
      .select()
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.action, "records_lifecycle.subject_erased"),
          eq(auditEvents.resourceId, current.subjectId),
        ),
      );
    expect(erasures).toHaveLength(1);
  });

  it("rebuilds hold state from its ledger and records who rebuilt it", async () => {
    const current = fixture();
    await place(current);

    await expect(
      rebuildEffectiveLegalHolds(database, {
        organizationId: current.organizationId,
        actor: {
          accountId: "synthetic-recovery-operator",
          reasonCode: "synthetic_projection_recovery",
        },
      }),
    ).resolves.toEqual({ holdCount: 1 });

    const holds = await records.readHolds({
      organizationId: current.organizationId,
      resource: { resourceType: "party", resourceId: current.subjectId },
    });
    expect(holds[0]).toMatchObject({ state: "active", revision: 1 });

    await expect(
      rebuildEffectiveLegalHolds(database, {
        organizationId: current.organizationId,
        actor: { accountId: "  ", reasonCode: "" },
      }),
    ).rejects.toThrow();
  });

  it("refuses an erasure with no attributable operator", async () => {
    const current = fixture();
    await records.ensureSubjectKey({
      subjectId: current.subjectId,
      organizationId: current.organizationId,
    });

    await expect(
      records.eraseSubject({
        subjectId: current.subjectId,
        organizationId: current.organizationId,
        actor: { accountId: "", reasonCode: "" },
      }),
    ).rejects.toThrow();
  });

  it("makes a real party's values unreadable while its history survives (FR-007, FR-008)", async () => {
    const suffix = crypto.randomUUID();
    const organizationId = `synthetic-records-org-${suffix}`;
    const partyId = crypto.randomUUID();
    const actor = { accountId: `synthetic-operator-${suffix}`, organizationId };
    const command = createPartyCommand({ partyId, name: "أحمد اختبار" });

    await parties.createParty({
      actor,
      command,
      mutation: createNeutralPartyMutation(command),
      commandFingerprint: `fingerprint-${partyId}`,
    });

    const readActor = {
      accountId: actor.accountId,
      correlationId: `synthetic-read-${suffix}`,
    };
    await expect(
      parties.readPartyHistory({ organizationId, partyId, actor: readActor }),
    ).resolves.toMatchObject({
      names: [{ value: "أحمد اختبار" }],
    });

    await expect(
      records.eraseSubject({
        subjectId: partyId,
        organizationId,
        actor: {
          accountId: "synthetic-privacy-officer",
          reasonCode: "synthetic_erasure_request",
        },
      }),
    ).resolves.toEqual({ outcome: "erased" });

    // The value is gone, but the record of it is not: the read still resolves,
    // still names the assertion, and still carries its provenance.
    const erased = await parties.readPartyHistory({
      organizationId,
      partyId,
      actor: readActor,
    });
    expect(erased).toMatchObject({
      id: partyId,
      names: [{ id: command.primaryName.id, value: ERASED_VALUE }],
    });

    // And nothing readable remains in storage.
    const [stored] = await database
      .select()
      .from(partyNameForms)
      .where(eq(partyNameForms.id, command.primaryName.id));
    expect(stored!.value).not.toContain("أحمد");

    const [key] = await database
      .select()
      .from(subjectEncryptionKeys)
      .where(eq(subjectEncryptionKeys.subjectId, partyId));
    expect(key).toMatchObject({
      keyMaterial: null,
      shreddedByAccountId: "synthetic-privacy-officer",
      shredReasonCode: "synthetic_erasure_request",
    });
  });
});
