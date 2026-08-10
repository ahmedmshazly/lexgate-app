import { describe, expect, it } from "vitest";
import {
  assertSyntheticValue,
  createNeutralPartyMutation,
  flagPossibleDuplicateMutation,
  PartyIdentityValidationError,
  recordPartyContactMutation,
  recordPartyNameMutation,
  recordRepresentationClaimMutation,
  type SyntheticPrivacyHandlingMetadata,
} from "./party-identity.js";

const privacy: SyntheticPrivacyHandlingMetadata = {
  processingPurpose: "party_identity_foundation",
  dataClassification: "internal",
  subjectCategory: "synthetic_individual",
  source: "synthetic-fixture",
  retentionCandidate: "synthetic_development_only",
  accessBoundary: "internal_authorized_only",
  validationRequirement: "privacy_and_g2_required",
};

const ids = {
  command: "00000000-0000-4000-8000-000000000301",
  party: "00000000-0000-4000-8000-000000000302",
  otherParty: "00000000-0000-4000-8000-000000000303",
  name: "00000000-0000-4000-8000-000000000304",
  priorName: "00000000-0000-4000-8000-000000000305",
  assignment: "00000000-0000-4000-8000-000000000306",
  priorAssignment: "00000000-0000-4000-8000-000000000307",
  contact: "00000000-0000-4000-8000-000000000308",
  claim: "00000000-0000-4000-8000-000000000309",
  duplicate: "00000000-0000-4000-8000-000000000310",
} as const;

const occurredAt = new Date("2026-08-10T00:00:00.000Z");

const primaryName = {
  id: ids.name,
  value: "أحمد اختبار",
  formType: "legal" as const,
  languageTag: "ar",
  script: "Arabic",
  reviewState: "unreviewed" as const,
  privacy,
};

describe("party identity domain model", () => {
  it("creates a neutral person with an immutable primary name and no client, matter, authority, or legal-verification state (DAT-PRT-001)", () => {
    const mutation = createNeutralPartyMutation({
      commandId: ids.command,
      correlationId: "synthetic-party-create-001",
      partyId: ids.party,
      kind: "person",
      partyPrivacy: privacy,
      primaryName,
      primaryNameAssignment: {
        id: ids.assignment,
        nameFormId: ids.name,
      },
      initialContact: {
        id: ids.contact,
        contactType: "email",
        value: "synthetic.ahmed@example.test",
        operationalPurpose: "party_identity_foundation",
        reviewState: "unreviewed",
        privacy,
      },
      occurredAt,
    });

    expect(mutation).toMatchObject({
      commandId: ids.command,
      event: {
        type: "party.created",
        aggregateId: ids.party,
        payload: {
          partyId: ids.party,
          assertionId: ids.name,
          assertionCategory: "party",
        },
      },
    });
    expect(mutation.event.payload).not.toHaveProperty("clientId");
    expect(mutation.event.payload).not.toHaveProperty("matterId");
    expect(mutation.event.payload).not.toHaveProperty("authority");
  });

  it("preserves Arabic/English name history and forbids blank provenance or an overwrite-shaped primary assignment", () => {
    const mutation = recordPartyNameMutation({
      commandId: "00000000-0000-4000-8000-000000000311",
      correlationId: "synthetic-party-name-001",
      partyId: ids.party,
      name: {
        id: ids.priorName,
        value: "Ahmed Ekhtibar",
        formType: "transliterated",
        languageTag: "en",
        script: "Latin",
        reviewState: "reviewed",
        privacy,
        supersedesNameFormId: ids.name,
      },
      primaryNameAssignment: {
        id: "00000000-0000-4000-8000-000000000312",
        nameFormId: ids.priorName,
        supersedesAssignmentId: ids.priorAssignment,
      },
      occurredAt,
    });

    expect(mutation.event.type).toBe("party.name_recorded");
    expect(mutation.event.payload).toMatchObject({
      assertionId: ids.priorName,
      assertionCategory: "name",
    });

    expect(() =>
      recordPartyNameMutation({
        commandId: "00000000-0000-4000-8000-000000000313",
        correlationId: "synthetic-party-name-invalid",
        partyId: ids.party,
        name: {
          ...primaryName,
          id: ids.priorName,
          privacy: { ...privacy, source: " " },
        },
        primaryNameAssignment: {
          id: "00000000-0000-4000-8000-000000000314",
          nameFormId: ids.name,
        },
        occurredAt,
      }),
    ).toThrow(PartyIdentityValidationError);
  });

  it("requires purpose-limited contacts and keeps representation and duplicate cues non-authoritative", () => {
    expect(() =>
      recordPartyContactMutation({
        commandId: "00000000-0000-4000-8000-000000000315",
        correlationId: "synthetic-party-contact-invalid",
        partyId: ids.party,
        contact: {
          id: ids.contact,
          contactType: "phone",
          value: "01000000000",
          operationalPurpose: " ",
          reviewState: "unreviewed",
          privacy,
        },
        occurredAt,
      }),
    ).toThrow(PartyIdentityValidationError);

    const claim = recordRepresentationClaimMutation({
      commandId: "00000000-0000-4000-8000-000000000316",
      correlationId: "synthetic-party-representation-001",
      claim: {
        id: ids.claim,
        representedPartyId: ids.party,
        representativePartyId: ids.otherParty,
        claimState: "asserted",
        reviewState: "unreviewed",
        privacy: { ...privacy, subjectCategory: "synthetic_representative" },
      },
      occurredAt,
    });
    expect(claim.event.payload).toMatchObject({
      assertionCategory: "representation",
    });
    expect(claim.event.payload).not.toHaveProperty("authority");

    expect(() =>
      recordRepresentationClaimMutation({
        commandId: "00000000-0000-4000-8000-000000000320",
        correlationId: "synthetic-party-representation-invalid",
        claim: {
          id: "00000000-0000-4000-8000-000000000321",
          representedPartyId: ids.party,
          representativePartyId: ids.otherParty,
          claimState: "asserted",
          reviewState: "unreviewed",
          privacy: {
            ...privacy,
            subjectCategory: "synthetic_representative",
          },
          effectiveFrom: new Date("2026-08-11T00:00:00.000Z"),
          effectiveUntil: new Date("2026-08-10T00:00:00.000Z"),
        },
        occurredAt,
      }),
    ).toThrow(PartyIdentityValidationError);

    const duplicate = flagPossibleDuplicateMutation({
      commandId: "00000000-0000-4000-8000-000000000317",
      correlationId: "synthetic-party-duplicate-001",
      duplicate: {
        id: ids.duplicate,
        firstPartyId: ids.party,
        secondPartyId: ids.otherParty,
        reviewState: "unreviewed",
        privacy,
      },
      occurredAt,
    });
    expect(duplicate.event.payload).toMatchObject({
      assertionCategory: "possible_duplicate",
    });

    expect(() =>
      flagPossibleDuplicateMutation({
        commandId: "00000000-0000-4000-8000-000000000318",
        correlationId: "synthetic-party-duplicate-invalid",
        duplicate: {
          id: "00000000-0000-4000-8000-000000000319",
          firstPartyId: ids.otherParty,
          secondPartyId: ids.party,
          reviewState: "unreviewed",
          privacy,
        },
        occurredAt,
      }),
    ).toThrow(PartyIdentityValidationError);
  });
});

describe("synthetic-value control (PRV-MIN-001)", () => {
  it("rejects a value shaped like a national identifier", () => {
    expect(() =>
      assertSyntheticValue("29801011234567", "Contact value"),
    ).toThrow(PartyIdentityValidationError);
  });

  it("rejects a reachable email address", () => {
    expect(() =>
      assertSyntheticValue("someone@gmail.com", "Contact value"),
    ).toThrow(PartyIdentityValidationError);
  });

  it("rejects a dialable telephone number", () => {
    expect(() =>
      assertSyntheticValue("+20 100 123 4567", "Contact value", "phone"),
    ).toThrow(PartyIdentityValidationError);
  });

  it("does not count digits in a value that is not a telephone number", () => {
    // A synthetic address carrying a UUID has well over seven digits. A blunt
    // digit count would reject it, and only for some UUIDs.
    expect(() =>
      assertSyntheticValue(
        "synthetic-3f2504e0-4f89-41d3-9a0c-0305e82c3301@example.test",
        "Contact value",
        "email",
      ),
    ).not.toThrow();
  });

  it("permits reserved documentation domains used by fixtures", () => {
    expect(() =>
      assertSyntheticValue("synthetic.contact@example.test", "Contact value"),
    ).not.toThrow();
  });

  it("permits an ordinary synthetic name in either script", () => {
    expect(() =>
      assertSyntheticValue("أحمد اختبار", "Name value"),
    ).not.toThrow();
    expect(() =>
      assertSyntheticValue("Ahmed Ekhtibar", "Name value"),
    ).not.toThrow();
  });
});
