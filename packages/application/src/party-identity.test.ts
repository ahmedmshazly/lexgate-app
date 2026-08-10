import { describe, expect, it, vi } from "vitest";
import {
  createNeutralParty,
  flagPossibleDuplicate,
  type PartyIdentityPersistencePort,
  readPartyIdentityHistory,
  recordPartyContact,
  recordPartyName,
  recordRepresentationClaim,
} from "./party-identity.js";

const actor = {
  accountId: "synthetic-account-party-identity",
  organizationId: "synthetic-organization-party-identity",
};

const privacy = {
  processingPurpose: "party_identity_foundation",
  dataClassification: "internal" as const,
  subjectCategory: "synthetic_individual" as const,
  source: "synthetic-fixture",
  retentionCandidate: "synthetic_development_only" as const,
  accessBoundary: "internal_authorized_only" as const,
  validationRequirement: "privacy_and_g2_required" as const,
};

const personPartyId = "00000000-0000-4000-8000-000000000401";
const organizationPartyId = "00000000-0000-4000-8000-000000000402";

const createCommand = {
  commandId: "00000000-0000-4000-8000-000000000403",
  correlationId: "synthetic-party-application-create",
  partyId: personPartyId,
  kind: "person" as const,
  partyPrivacy: privacy,
  primaryName: {
    id: "00000000-0000-4000-8000-000000000404",
    value: "أحمد اختبار",
    formType: "legal" as const,
    languageTag: "ar",
    script: "Arabic",
    reviewState: "unreviewed" as const,
    privacy,
  },
  primaryNameAssignment: {
    id: "00000000-0000-4000-8000-000000000405",
    nameFormId: "00000000-0000-4000-8000-000000000404",
  },
  occurredAt: new Date("2026-08-10T00:00:00.000Z"),
};

const createPersistence = (): PartyIdentityPersistencePort => ({
  createParty: vi.fn(async ({ mutation }) => ({
    partyId: mutation.event.payload.partyId,
    assertionId: mutation.event.payload.assertionId,
    replayed: false,
  })),
  recordName: vi.fn(async ({ mutation }) => ({
    partyId: mutation.event.payload.partyId,
    assertionId: mutation.event.payload.assertionId,
    replayed: false,
  })),
  recordContact: vi.fn(async ({ mutation }) => ({
    partyId: mutation.event.payload.partyId,
    assertionId: mutation.event.payload.assertionId,
    replayed: false,
  })),
  recordRepresentationClaim: vi.fn(async ({ mutation }) => ({
    partyId: mutation.event.payload.partyId,
    assertionId: mutation.event.payload.assertionId,
    replayed: false,
  })),
  flagPossibleDuplicate: vi.fn(async ({ mutation }) => ({
    partyId: mutation.event.payload.partyId,
    assertionId: mutation.event.payload.assertionId,
    replayed: false,
  })),
  readPartyHistory: vi.fn(async () => null),
});

const allowAuthorization = () => ({
  evaluate: vi.fn(async () => ({
    outcome: "allowed" as const,
    reason: "explicit_relationship" as const,
  })),
});

describe("party identity application commands", () => {
  it("uses only trusted server actor context to authorize the registry before creating a neutral party", async () => {
    const authorization = allowAuthorization();
    const persistence = createPersistence();
    const logger = { info: vi.fn(), error: vi.fn() };

    await expect(
      createNeutralParty({
        actor,
        command: createCommand,
        authorization,
        persistence,
        logger,
      }),
    ).resolves.toMatchObject({
      outcome: "recorded",
      result: { partyId: personPartyId, replayed: false },
    });

    expect(authorization.evaluate).toHaveBeenCalledWith(
      expect.objectContaining({
        correlationId: createCommand.correlationId,
        actorAccountId: actor.accountId,
        organizationId: actor.organizationId,
        resource: { type: "party-registry", id: actor.organizationId },
        operation: "party.create",
      }),
    );
    expect(persistence.createParty).toHaveBeenCalledOnce();
    expect(logger.info).toHaveBeenCalledWith(
      {
        correlationId: createCommand.correlationId,
        operation: "party_identity.command",
        action: "party.create",
        outcome: "recorded",
      },
      "Party identity command completed.",
    );
    expect(JSON.stringify(logger.info.mock.calls)).not.toContain(
      createCommand.primaryName.value,
    );
  });

  it("fails closed for a denied or browser-asserted create without persisting party data", async () => {
    const authorization = {
      evaluate: vi.fn(async () => ({
        outcome: "denied" as const,
        reason: "not_authorized" as const,
      })),
    };
    const persistence = createPersistence();
    const untrustedInput = {
      ...createCommand,
      browserPermissionAssertion: true,
    };

    await expect(
      createNeutralParty({
        actor,
        command: untrustedInput,
        authorization,
        persistence,
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
    expect(persistence.createParty).not.toHaveBeenCalled();
    expect(authorization.evaluate).toHaveBeenCalledWith(
      expect.not.objectContaining({ browserPermissionAssertion: true }),
    );
  });

  it("requires an exact party grant for name and contact assertions, without trusting browser claims", async () => {
    const authorization = {
      evaluate: vi
        .fn()
        .mockResolvedValueOnce({
          outcome: "denied" as const,
          reason: "not_authorized" as const,
        })
        .mockResolvedValueOnce({
          outcome: "allowed" as const,
          reason: "explicit_relationship" as const,
        }),
    };
    const persistence = createPersistence();
    const nameCommand = {
      commandId: "00000000-0000-4000-8000-000000000410",
      correlationId: "synthetic-party-application-name",
      partyId: personPartyId,
      name: {
        id: "00000000-0000-4000-8000-000000000411",
        value: "Ahmed Ekhtibar",
        formType: "transliterated" as const,
        languageTag: "en",
        script: "Latin",
        reviewState: "unreviewed" as const,
        privacy,
      },
      occurredAt: new Date("2026-08-10T00:00:00.000Z"),
      browserPermissionAssertion: true,
    };

    await expect(
      recordPartyName({
        actor,
        command: nameCommand,
        authorization,
        persistence,
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
    expect(authorization.evaluate).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: { type: "party", id: personPartyId },
        operation: "party.record_name",
      }),
    );
    expect(persistence.recordName).not.toHaveBeenCalled();

    await expect(
      recordPartyContact({
        actor,
        command: {
          commandId: "00000000-0000-4000-8000-000000000412",
          correlationId: "synthetic-party-application-contact",
          partyId: personPartyId,
          contact: {
            id: "00000000-0000-4000-8000-000000000413",
            contactType: "email",
            value: "synthetic.contact@example.test",
            operationalPurpose: "party_identity_foundation",
            reviewState: "unreviewed",
            privacy,
          },
          occurredAt: new Date("2026-08-10T00:00:00.000Z"),
        },
        authorization,
        persistence,
      }),
    ).resolves.toMatchObject({ outcome: "recorded" });
    expect(persistence.recordContact).toHaveBeenCalledOnce();
    expect(authorization.evaluate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        resource: { type: "party", id: personPartyId },
        operation: "party.record_contact",
      }),
    );
  });

  it("requires exact authorization to both linked parties before recording a representation or duplicate cue", async () => {
    const authorization = {
      evaluate: vi
        .fn()
        .mockResolvedValueOnce({
          outcome: "allowed" as const,
          reason: "explicit_relationship" as const,
        })
        .mockResolvedValueOnce({
          outcome: "denied" as const,
          reason: "not_authorized" as const,
        }),
    };
    const persistence = createPersistence();
    const representationCommand = {
      commandId: "00000000-0000-4000-8000-000000000406",
      correlationId: "synthetic-party-application-representation",
      claim: {
        id: "00000000-0000-4000-8000-000000000407",
        representedPartyId: personPartyId,
        representativePartyId: organizationPartyId,
        claimState: "asserted" as const,
        reviewState: "unreviewed" as const,
        privacy: {
          ...privacy,
          subjectCategory: "synthetic_representative" as const,
        },
      },
      occurredAt: new Date("2026-08-10T00:00:00.000Z"),
    };

    await expect(
      recordRepresentationClaim({
        actor,
        command: representationCommand,
        authorization,
        persistence,
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
    expect(authorization.evaluate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        resource: { type: "party", id: personPartyId },
      }),
    );
    expect(authorization.evaluate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        resource: { type: "party", id: organizationPartyId },
      }),
    );
    expect(persistence.recordRepresentationClaim).not.toHaveBeenCalled();

    const duplicateAuthorization = allowAuthorization();
    await expect(
      flagPossibleDuplicate({
        actor,
        command: {
          commandId: "00000000-0000-4000-8000-000000000408",
          correlationId: "synthetic-party-application-duplicate",
          duplicate: {
            id: "00000000-0000-4000-8000-000000000409",
            firstPartyId: personPartyId,
            secondPartyId: organizationPartyId,
            matchRationale: "synthetic_name_similarity",
            reviewState: "unreviewed",
            privacy,
          },
          occurredAt: new Date("2026-08-10T00:00:00.000Z"),
        },
        authorization: duplicateAuthorization,
        persistence,
      }),
    ).resolves.toMatchObject({ outcome: "recorded" });
    expect(duplicateAuthorization.evaluate).toHaveBeenCalledTimes(2);
    expect(persistence.flagPossibleDuplicate).toHaveBeenCalledOnce();
  });

  it("returns the generic denial when an authorized read cannot find a party projection", async () => {
    const authorization = allowAuthorization();
    const persistence = createPersistence();

    await expect(
      readPartyIdentityHistory({
        actor,
        partyId: personPartyId,
        correlationId: "synthetic-party-read-missing",
        authorization,
        persistence,
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
  });
});
