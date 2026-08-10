export type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

export {
  evaluateRestrictedResourceAccess,
  type AuthorizationDecision,
  type OrganizationMembership,
  type RestrictedResourceAccessGrant,
  type RestrictedResourceAuthorizationPolicyInput,
  type RestrictedResourceAuthorizationRequest,
  type RestrictedResourceReference,
} from "./authorization.js";

export {
  AccessLifecycleValidationError,
  deriveAccessLifecycleTransition,
  type AccessApprovalRecord,
  type AccessLifecycleCommand,
  type AccessLifecycleCommandOutcome,
  type AccessLifecycleCommandResult,
  type AccessLifecycleEvent,
  type AccessLifecycleEventType,
  type AccessLifecycleRelationshipKind,
  type AccessLifecycleScope,
  type AccessLifecycleState,
  type AccessLifecycleTransition,
  type EffectiveAccessRelationship,
  type MembershipAccessScope,
  type RestrictedResourceAccessScope,
} from "./access-lifecycle.js";

export {
  assertionReviewStates,
  createNeutralPartyMutation,
  flagPossibleDuplicateMutation,
  partyContactTypes,
  partyKinds,
  partyNameFormTypes,
  recordPartyContactMutation,
  recordPartyNameMutation,
  recordRepresentationClaimMutation,
  representationClaimStates,
  PartyIdentityValidationError,
  privacySubjectCategories,
  validatePartyContact,
  validatePartyNameForm,
  validatePossibleDuplicate,
  validatePrimaryNameAssignment,
  validateRepresentationClaim,
  validateSyntheticPrivacyHandlingMetadata,
  type AssertionReviewState,
  type CreateNeutralPartyInput,
  type FlagPossibleDuplicateInput,
  type PartyContactInput,
  type PartyContactType,
  type PartyIdentityMutation,
  type PartyKind,
  type PartyNameFormInput,
  type PartyNameFormType,
  type PossibleDuplicateInput,
  type PrimaryNameAssignmentInput,
  type PrivacySubjectCategory,
  type RecordPartyContactInput,
  type RecordPartyNameInput,
  type RecordRepresentationClaimInput,
  type RepresentationClaimInput,
  type RepresentationClaimState,
  type SyntheticPrivacyHandlingMetadata,
} from "./party-identity.js";

export type AggregateId = Brand<string, "AggregateId">;

export type DomainEvent<
  TType extends string = string,
  TPayload = unknown,
> = Readonly<{
  id: string;
  type: TType;
  occurredAt: Date;
  aggregateId: AggregateId;
  payload: TPayload;
}>;

export type Derived<T> = Readonly<{
  value: T;
  reviewState: "unreviewed" | "reviewed" | "rejected";
}>;

export const assertDerivedIsReviewed = <T>(derived: Derived<T>): T => {
  if (derived.reviewState !== "reviewed") {
    throw new Error(
      "Derived information cannot be used as a verified fact before review.",
    );
  }

  return derived.value;
};

export type DeadlineState = "calculated" | "confirmed" | "superseded";

export const assertDeadlineCanBeConfirmed = (input: {
  state: DeadlineState;
  ruleVersionId: string | undefined;
  reviewerId: string | undefined;
}): void => {
  if (input.state !== "calculated") {
    throw new Error("Only a calculated deadline can be confirmed.");
  }

  if (!input.ruleVersionId || !input.reviewerId) {
    throw new Error(
      "A confirmed deadline requires a source rule version and reviewer.",
    );
  }
};
