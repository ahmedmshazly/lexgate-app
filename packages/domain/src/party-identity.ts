import type { AggregateId, DomainEvent } from "./index.js";

export const partyKinds = ["person", "organization"] as const;
export type PartyKind = (typeof partyKinds)[number];

export const assertionReviewStates = [
  "unreviewed",
  "reviewed",
  "rejected",
] as const;
export type AssertionReviewState = (typeof assertionReviewStates)[number];

export const partyNameFormTypes = [
  "legal",
  "common",
  "alternate",
  "former",
  "trading",
  "abbreviated",
  "transliterated",
  "other",
] as const;
export type PartyNameFormType = (typeof partyNameFormTypes)[number];

export const partyContactTypes = [
  "email",
  "phone",
  "address",
  "other",
] as const;
export type PartyContactType = (typeof partyContactTypes)[number];

export const representationClaimStates = [
  "asserted",
  "disputed",
  "withdrawn",
  "expired",
] as const;
export type RepresentationClaimState =
  (typeof representationClaimStates)[number];

export const privacySubjectCategories = [
  "synthetic_individual",
  "synthetic_organization",
  "synthetic_representative",
  "synthetic_unknown",
] as const;
export type PrivacySubjectCategory = (typeof privacySubjectCategories)[number];

export type SyntheticPrivacyHandlingMetadata = Readonly<{
  processingPurpose: string;
  dataClassification: "internal";
  subjectCategory: PrivacySubjectCategory;
  source: string;
  retentionCandidate: "synthetic_development_only";
  accessBoundary: "internal_authorized_only";
  validationRequirement: "privacy_and_g2_required";
}>;

export type PartyNameFormInput = Readonly<{
  id: string;
  value: string;
  formType: PartyNameFormType;
  languageTag: string;
  script?: string;
  reviewState: AssertionReviewState;
  privacy: SyntheticPrivacyHandlingMetadata;
  supersedesNameFormId?: string;
}>;

export type PrimaryNameAssignmentInput = Readonly<{
  id: string;
  nameFormId: string;
  supersedesAssignmentId?: string;
}>;

export type PartyContactInput = Readonly<{
  id: string;
  contactType: PartyContactType;
  value: string;
  operationalPurpose: string;
  reviewState: AssertionReviewState;
  privacy: SyntheticPrivacyHandlingMetadata;
  supersedesContactId?: string;
}>;

export type RepresentationClaimInput = Readonly<{
  id: string;
  representedPartyId: string;
  representativePartyId: string;
  claimState: RepresentationClaimState;
  reviewState: AssertionReviewState;
  privacy: SyntheticPrivacyHandlingMetadata;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
  supersedesClaimId?: string;
}>;

/**
 * What a reviewer concluded about a flagged pair, distinct from whether they
 * looked. None of these clears a conflict — that is a lawyer's decision under
 * G2, not a data state.
 */
export const duplicateDispositions = [
  "confirmed_same_party",
  "confirmed_distinct_parties",
  "insufficient_information",
] as const;
export type DuplicateDisposition = (typeof duplicateDispositions)[number];

export type PossibleDuplicateInput = Readonly<{
  id: string;
  firstPartyId: string;
  secondPartyId: string;
  reviewState: AssertionReviewState;
  /** Why the pair was raised. A flag with no rationale is unreviewable. */
  matchRationale: string;
  /** Set only once a reviewer has reached a conclusion. */
  disposition?: DuplicateDisposition;
  privacy: SyntheticPrivacyHandlingMetadata;
}>;

export type CreateNeutralPartyInput = Readonly<{
  commandId: string;
  correlationId: string;
  partyId: string;
  kind: PartyKind;
  partyPrivacy: SyntheticPrivacyHandlingMetadata;
  primaryName: PartyNameFormInput;
  primaryNameAssignment: PrimaryNameAssignmentInput;
  initialContact?: PartyContactInput;
  occurredAt: Date;
}>;

export type RecordPartyNameInput = Readonly<{
  commandId: string;
  correlationId: string;
  partyId: string;
  name: PartyNameFormInput;
  primaryNameAssignment?: PrimaryNameAssignmentInput;
  occurredAt: Date;
}>;

export type RecordPartyContactInput = Readonly<{
  commandId: string;
  correlationId: string;
  partyId: string;
  contact: PartyContactInput;
  occurredAt: Date;
}>;

export type RecordRepresentationClaimInput = Readonly<{
  commandId: string;
  correlationId: string;
  claim: RepresentationClaimInput;
  occurredAt: Date;
}>;

export type FlagPossibleDuplicateInput = Readonly<{
  commandId: string;
  correlationId: string;
  duplicate: PossibleDuplicateInput;
  occurredAt: Date;
}>;

export type PartyIdentityMutation = Readonly<{
  commandId: string;
  event: DomainEvent<
    | "party.created"
    | "party.name_recorded"
    | "party.contact_recorded"
    | "party.representation_recorded"
    | "party.possible_duplicate_flagged",
    Readonly<{
      partyId: string;
      assertionId: string;
      assertionCategory:
        "party" | "name" | "contact" | "representation" | "possible_duplicate";
    }>
  >;
}>;

export class PartyIdentityValidationError extends Error {
  override name = "PartyIdentityValidationError";
}

const isNonEmpty = (value: string): boolean => value.trim().length > 0;

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const assertNonEmpty = (value: string, label: string): void => {
  if (!isNonEmpty(value)) {
    throw new PartyIdentityValidationError(`${label} is required.`);
  }
};

const assertUuid = (value: string, label: string): void => {
  if (!isUuid(value)) {
    throw new PartyIdentityValidationError(`${label} must be a UUID.`);
  }
};

function assertOneOf<T extends string>(
  value: string,
  values: readonly T[],
  label: string,
): asserts value is T {
  if (!values.includes(value as T)) {
    throw new PartyIdentityValidationError(`${label} is not supported.`);
  }
}

const assertDate = (value: Date, label: string): void => {
  if (Number.isNaN(value.valueOf())) {
    throw new PartyIdentityValidationError(`${label} must be a valid date.`);
  }
};

/**
 * Domains reserved by the IETF for documentation and testing. An address at
 * one of these cannot reach a real mailbox, so it is safe in a fixture.
 */
const reservedEmailDomains =
  /@([a-z0-9-]+\.)*(test|example|invalid|localhost)$|@example\.(com|net|org)$/i;

/**
 * Rejects content shaped like real personal data.
 *
 * The synthetic-only posture was previously a classification label validated
 * on the metadata while the value itself went uninspected, so nothing stopped
 * a real name, national identifier, or contact point being written. A label
 * asserted by the caller is not a control; this is.
 *
 * It is deliberately shape-based and therefore imperfect — it cannot tell a
 * real name from an invented one. It exists to stop the accidents that are
 * detectable: identifiers, reachable addresses, and dialable numbers.
 */
export const assertSyntheticValue = (
  value: string,
  label: string,
  kind: "email" | "phone" | "other" = "other",
): void => {
  // Egyptian national identifiers are 14 digits.
  if (/(?:\D|^)\d{14}(?:\D|$)/.test(value)) {
    throw new PartyIdentityValidationError(
      `${label} looks like a real national identifier. Only synthetic values may be stored.`,
    );
  }
  if (value.includes("@") && !reservedEmailDomains.test(value.trim())) {
    throw new PartyIdentityValidationError(
      `${label} looks like a reachable email address. Use a reserved domain such as example.test.`,
    );
  }
  // Only applied to values declared as telephone numbers. Counting digits
  // across any value would reject a synthetic address carrying a UUID, and
  // would do so only for some UUIDs — a flaky control is worse than none.
  if (kind === "phone") {
    const digitsOnly = value.replace(/\D/g, "");
    if (/\+20\d/.test(value) || digitsOnly.length >= 7) {
      throw new PartyIdentityValidationError(
        `${label} looks like a dialable telephone number. Only synthetic values may be stored.`,
      );
    }
  }
};

export const validateSyntheticPrivacyHandlingMetadata = (
  input: SyntheticPrivacyHandlingMetadata,
): void => {
  assertNonEmpty(input.processingPurpose, "Processing purpose");
  assertNonEmpty(input.source, "Source");
  assertOneOf(
    input.subjectCategory,
    privacySubjectCategories,
    "Privacy subject category",
  );

  if (
    input.dataClassification !== "internal" ||
    input.retentionCandidate !== "synthetic_development_only" ||
    input.accessBoundary !== "internal_authorized_only" ||
    input.validationRequirement !== "privacy_and_g2_required"
  ) {
    throw new PartyIdentityValidationError(
      "Party identity data must keep the synthetic-development privacy posture.",
    );
  }
};

export const validatePartyNameForm = (input: PartyNameFormInput): void => {
  assertUuid(input.id, "Name form ID");
  assertNonEmpty(input.value, "Name value");
  assertSyntheticValue(input.value, "Name value");
  assertNonEmpty(input.languageTag, "Name language tag");
  assertOneOf(input.formType, partyNameFormTypes, "Name form type");
  assertOneOf(input.reviewState, assertionReviewStates, "Name review state");
  validateSyntheticPrivacyHandlingMetadata(input.privacy);

  if (input.script !== undefined) assertNonEmpty(input.script, "Name script");
  if (input.supersedesNameFormId !== undefined) {
    assertUuid(input.supersedesNameFormId, "Superseded name form ID");
    if (input.supersedesNameFormId === input.id) {
      throw new PartyIdentityValidationError(
        "A name form cannot supersede itself.",
      );
    }
  }
};

export const validatePrimaryNameAssignment = (
  input: PrimaryNameAssignmentInput,
): void => {
  assertUuid(input.id, "Primary-name assignment ID");
  assertUuid(input.nameFormId, "Primary-name form ID");
  if (input.supersedesAssignmentId !== undefined) {
    assertUuid(input.supersedesAssignmentId, "Superseded assignment ID");
    if (input.supersedesAssignmentId === input.id) {
      throw new PartyIdentityValidationError(
        "A primary-name assignment cannot supersede itself.",
      );
    }
  }
};

export const validatePartyContact = (input: PartyContactInput): void => {
  assertUuid(input.id, "Contact ID");
  assertNonEmpty(input.value, "Contact value");
  assertSyntheticValue(
    input.value,
    "Contact value",
    input.contactType === "email" || input.contactType === "phone"
      ? input.contactType
      : "other",
  );
  assertNonEmpty(input.operationalPurpose, "Contact operational purpose");
  assertOneOf(input.contactType, partyContactTypes, "Contact type");
  assertOneOf(input.reviewState, assertionReviewStates, "Contact review state");
  validateSyntheticPrivacyHandlingMetadata(input.privacy);

  if (input.supersedesContactId !== undefined) {
    assertUuid(input.supersedesContactId, "Superseded contact ID");
    if (input.supersedesContactId === input.id) {
      throw new PartyIdentityValidationError(
        "A contact assertion cannot supersede itself.",
      );
    }
  }
};

export const validateRepresentationClaim = (
  input: RepresentationClaimInput,
): void => {
  assertUuid(input.id, "Representation claim ID");
  assertUuid(input.representedPartyId, "Represented party ID");
  assertUuid(input.representativePartyId, "Representative party ID");
  assertOneOf(
    input.claimState,
    representationClaimStates,
    "Representation claim state",
  );
  assertOneOf(
    input.reviewState,
    assertionReviewStates,
    "Representation review state",
  );
  validateSyntheticPrivacyHandlingMetadata(input.privacy);

  if (input.representedPartyId === input.representativePartyId) {
    throw new PartyIdentityValidationError(
      "A party cannot claim to represent itself in this foundation.",
    );
  }
  if (input.effectiveFrom !== undefined) {
    assertDate(input.effectiveFrom, "Representation effective-from date");
  }
  if (input.effectiveUntil !== undefined) {
    assertDate(input.effectiveUntil, "Representation effective-until date");
  }
  if (
    input.effectiveFrom !== undefined &&
    input.effectiveUntil !== undefined &&
    input.effectiveUntil < input.effectiveFrom
  ) {
    throw new PartyIdentityValidationError(
      "Representation effective-until date cannot precede effective-from date.",
    );
  }
  if (input.supersedesClaimId !== undefined) {
    assertUuid(input.supersedesClaimId, "Superseded representation claim ID");
    if (input.supersedesClaimId === input.id) {
      throw new PartyIdentityValidationError(
        "A representation claim cannot supersede itself.",
      );
    }
  }
};

export const validatePossibleDuplicate = (
  input: PossibleDuplicateInput,
): void => {
  assertUuid(input.id, "Possible-duplicate ID");
  assertUuid(input.firstPartyId, "First party ID");
  assertUuid(input.secondPartyId, "Second party ID");
  assertOneOf(
    input.reviewState,
    assertionReviewStates,
    "Possible-duplicate review state",
  );
  assertNonEmpty(input.matchRationale, "Possible-duplicate match rationale");
  if (input.disposition !== undefined) {
    assertOneOf(
      input.disposition,
      duplicateDispositions,
      "Possible-duplicate disposition",
    );
    // A conclusion cannot precede the review that reached it.
    if (input.reviewState === "unreviewed") {
      throw new PartyIdentityValidationError(
        "An unreviewed possible duplicate cannot carry a disposition.",
      );
    }
  }
  validateSyntheticPrivacyHandlingMetadata(input.privacy);

  if (input.firstPartyId >= input.secondPartyId) {
    throw new PartyIdentityValidationError(
      "Possible-duplicate parties must be distinct and stored in deterministic order.",
    );
  }
};

const createMutation = (input: {
  commandId: string;
  correlationId: string;
  partyId: string;
  assertionId: string;
  assertionCategory: PartyIdentityMutation["event"]["payload"]["assertionCategory"];
  eventType: PartyIdentityMutation["event"]["type"];
  occurredAt: Date;
}): PartyIdentityMutation => {
  assertUuid(input.commandId, "Command ID");
  assertNonEmpty(input.correlationId, "Correlation ID");
  assertUuid(input.partyId, "Party ID");
  assertUuid(input.assertionId, "Assertion ID");
  assertDate(input.occurredAt, "Occurred-at date");

  return {
    commandId: input.commandId,
    event: {
      id: input.commandId,
      type: input.eventType,
      occurredAt: input.occurredAt,
      aggregateId: input.partyId as AggregateId,
      payload: {
        partyId: input.partyId,
        assertionId: input.assertionId,
        assertionCategory: input.assertionCategory,
      },
    },
  };
};

export const createNeutralPartyMutation = (
  input: CreateNeutralPartyInput,
): PartyIdentityMutation => {
  assertUuid(input.partyId, "Party ID");
  assertOneOf(input.kind, partyKinds, "Party kind");
  validateSyntheticPrivacyHandlingMetadata(input.partyPrivacy);
  validatePartyNameForm(input.primaryName);
  validatePrimaryNameAssignment(input.primaryNameAssignment);
  if (input.primaryNameAssignment.nameFormId !== input.primaryName.id) {
    throw new PartyIdentityValidationError(
      "The initial primary-name assignment must select the initial name form.",
    );
  }
  if (input.primaryNameAssignment.supersedesAssignmentId !== undefined) {
    throw new PartyIdentityValidationError(
      "The initial primary-name assignment cannot supersede an earlier assignment.",
    );
  }
  if (input.initialContact !== undefined)
    validatePartyContact(input.initialContact);

  return createMutation({
    commandId: input.commandId,
    correlationId: input.correlationId,
    partyId: input.partyId,
    assertionId: input.primaryName.id,
    assertionCategory: "party",
    eventType: "party.created",
    occurredAt: input.occurredAt,
  });
};

export const recordPartyNameMutation = (
  input: RecordPartyNameInput,
): PartyIdentityMutation => {
  assertUuid(input.partyId, "Party ID");
  validatePartyNameForm(input.name);
  if (input.primaryNameAssignment !== undefined) {
    validatePrimaryNameAssignment(input.primaryNameAssignment);
    if (input.primaryNameAssignment.nameFormId !== input.name.id) {
      throw new PartyIdentityValidationError(
        "A new primary-name assignment must select the recorded name form.",
      );
    }
  }

  return createMutation({
    commandId: input.commandId,
    correlationId: input.correlationId,
    partyId: input.partyId,
    assertionId: input.name.id,
    assertionCategory: "name",
    eventType: "party.name_recorded",
    occurredAt: input.occurredAt,
  });
};

export const recordPartyContactMutation = (
  input: RecordPartyContactInput,
): PartyIdentityMutation => {
  assertUuid(input.partyId, "Party ID");
  validatePartyContact(input.contact);

  return createMutation({
    commandId: input.commandId,
    correlationId: input.correlationId,
    partyId: input.partyId,
    assertionId: input.contact.id,
    assertionCategory: "contact",
    eventType: "party.contact_recorded",
    occurredAt: input.occurredAt,
  });
};

export const recordRepresentationClaimMutation = (
  input: RecordRepresentationClaimInput,
): PartyIdentityMutation => {
  validateRepresentationClaim(input.claim);

  return createMutation({
    commandId: input.commandId,
    correlationId: input.correlationId,
    partyId: input.claim.representedPartyId,
    assertionId: input.claim.id,
    assertionCategory: "representation",
    eventType: "party.representation_recorded",
    occurredAt: input.occurredAt,
  });
};

export const flagPossibleDuplicateMutation = (
  input: FlagPossibleDuplicateInput,
): PartyIdentityMutation => {
  validatePossibleDuplicate(input.duplicate);

  return createMutation({
    commandId: input.commandId,
    correlationId: input.correlationId,
    partyId: input.duplicate.firstPartyId,
    assertionId: input.duplicate.id,
    assertionCategory: "possible_duplicate",
    eventType: "party.possible_duplicate_flagged",
    occurredAt: input.occurredAt,
  });
};
