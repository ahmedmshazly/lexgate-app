import type { DomainEvent } from "@lexgate/domain";

export {
  evaluateRestrictedResourceAccess,
  type RestrictedResourceAuthorizationPort,
} from "./authorization.js";

export {
  applyAccessLifecycleCommand,
  AccessLifecyclePersistenceConflictError,
  createAccessLifecycleCommandFingerprint,
  type AccessLifecycleAdministrationAction,
  type AccessLifecycleApprovalPort,
  type AccessLifecycleAuthorizationPort,
  type AccessLifecycleCommandHandler,
  type AccessLifecycleCommandInput,
  type AccessLifecyclePersistencePort,
  type SessionInvalidationIntentPort,
} from "./access-lifecycle.js";

export {
  createNeutralParty,
  createPartyIdentityCommandFingerprint,
  flagPossibleDuplicate,
  PartyIdentityConflictError,
  PartyIdentityNotFoundOrNotAuthorizedError,
  readPartyIdentityHistory,
  recordPartyContact,
  recordPartyName,
  recordRepresentationClaim,
  type PartyIdentityAssertionCategory,
  type PartyIdentityCommandOutcome,
  type PartyIdentityCommandReceipt,
  type PartyIdentityCommandResult,
  type PartyIdentityContactHistory,
  type PartyIdentityHistory,
  type PartyIdentityNameHistory,
  type PartyIdentityPrimaryNameAssignmentHistory,
  type PartyIdentityPersistencePort,
  type PartyIdentityReadOutcome,
} from "./party-identity.js";

export type Actor = Readonly<{
  accountId: string;
  organizationId: string;
}>;

export interface AuthorizationPort {
  assertAuthorized(input: {
    actor: Actor;
    action: string;
    resource: { type: string; id: string };
  }): Promise<void>;
}

export interface MaterialTransitionPersistencePort {
  record(input: {
    actor: Actor;
    action: string;
    resource: { type: string; id: string };
    event: DomainEvent;
  }): Promise<void>;
}

export const recordMaterialTransition = async (input: {
  actor: Actor;
  action: string;
  resource: { type: string; id: string };
  event: DomainEvent;
  authorization: AuthorizationPort;
  persistence: MaterialTransitionPersistencePort;
}): Promise<void> => {
  await input.authorization.assertAuthorized({
    actor: input.actor,
    action: input.action,
    resource: input.resource,
  });

  await input.persistence.record({
    actor: input.actor,
    action: input.action,
    resource: input.resource,
    event: input.event,
  });
};

export type {
  LegalHoldOutcome,
  LegalHoldPersistencePort,
  RecordsLifecycleActor,
  SubjectErasureOutcome,
} from "./records-lifecycle.js";
export {
  applyLegalHoldCommand,
  eraseSubjectCommand,
  mayDestroyRecord,
} from "./records-lifecycle.js";
