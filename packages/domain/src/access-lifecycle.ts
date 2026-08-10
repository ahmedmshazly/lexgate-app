import type { RestrictedResourceReference } from "./authorization.js";

export type AccessLifecycleRelationshipKind =
  "membership" | "restricted_resource_grant";

export type AccessLifecycleState =
  "active" | "suspended" | "revoked" | "expired" | "offboarded";

export type AccessLifecycleEventType =
  | "granted"
  | "suspended"
  | "reinstated"
  | "revoked"
  | "corrected"
  | "expired"
  | "offboarded";

export type MembershipAccessScope = Readonly<{
  kind: "membership";
}>;

export type RestrictedResourceAccessScope = Readonly<{
  kind: "restricted_resource_grant";
  resource: RestrictedResourceReference;
  operation: string;
}>;

export type AccessLifecycleScope =
  MembershipAccessScope | RestrictedResourceAccessScope;

export type AccessApprovalRecord = Readonly<{
  id: string;
  organizationId: string;
  requesterAccountId: string;
  approverAccountId: string;
  subjectAccountId: string;
  scope: AccessLifecycleScope;
  approvedAt: Date;
  expiresAt: Date | null;
  correlationId: string;
  reasonCode: string;
}>;

export type AccessLifecycleCommand = Readonly<{
  commandId: string;
  correlationId: string;
  relationshipId: string;
  organizationId: string;
  subjectAccountId: string;
  operatorAccountId: string;
  scope: AccessLifecycleScope;
  eventType: AccessLifecycleEventType;
  expectedRevision: number | null;
  occurredAt: Date;
  effectiveAt: Date;
  expiresAt: Date | null;
  reasonCode: string;
  approvalId: string | null;
}>;

export type AccessLifecycleEvent = Readonly<{
  id: string;
  relationshipId: string;
  organizationId: string;
  subjectAccountId: string;
  scope: AccessLifecycleScope;
  eventType: AccessLifecycleEventType;
  resultingState: AccessLifecycleState;
  priorRevision: number | null;
  revision: number;
  operatorAccountId: string;
  requesterAccountId: string | null;
  approverAccountId: string | null;
  approvalId: string | null;
  correlationId: string;
  commandId: string;
  reasonCode: string;
  effectiveAt: Date;
  expiresAt: Date | null;
  occurredAt: Date;
}>;

export type AccessLifecycleTransition = Omit<AccessLifecycleEvent, "id">;

export type EffectiveAccessRelationship = Readonly<{
  relationshipId: string;
  organizationId: string;
  subjectAccountId: string;
  scope: AccessLifecycleScope;
  state: AccessLifecycleState;
  revision: number;
  effectiveAt: Date;
  expiresAt: Date | null;
  lastEventId: string;
}>;

export type AccessLifecycleCommandResult = Readonly<{
  relationshipId: string;
  eventId: string;
  revision: number;
  state: AccessLifecycleState;
  replayed: boolean;
}>;

export type AccessLifecycleCommandOutcome =
  | Readonly<{
      outcome: "applied";
      result: AccessLifecycleCommandResult;
    }>
  | Readonly<{
      outcome: "denied";
      reason: "not_authorized";
    }>
  | Readonly<{
      outcome: "conflict";
      reason: "stale_state" | "incompatible_command";
    }>
  | Readonly<{
      outcome: "invalid";
      reason: "invalid_access_lifecycle_command";
    }>;

export class AccessLifecycleValidationError extends Error {
  override name = "AccessLifecycleValidationError";
}

const nonEmpty = (value: string): boolean => value.trim().length > 0;

const isValidDate = (value: Date): boolean => Number.isFinite(value.getTime());

const scopeMatches = (
  left: AccessLifecycleScope,
  right: AccessLifecycleScope,
): boolean => {
  if (left.kind !== right.kind) return false;
  if (left.kind === "membership" || right.kind === "membership") {
    return left.kind === right.kind;
  }

  return (
    left.resource.type === right.resource.type &&
    left.resource.id === right.resource.id &&
    left.operation === right.operation
  );
};

const resultingStateByEvent: Record<
  AccessLifecycleEventType,
  AccessLifecycleState
> = {
  granted: "active",
  suspended: "suspended",
  reinstated: "active",
  revoked: "revoked",
  corrected: "active",
  expired: "expired",
  offboarded: "offboarded",
};

const requiresApproval = (eventType: AccessLifecycleEventType): boolean =>
  eventType === "granted" ||
  eventType === "reinstated" ||
  eventType === "corrected";

const assertBaseCommandIsValid = (command: AccessLifecycleCommand): void => {
  const requiredValues = [
    command.commandId,
    command.correlationId,
    command.relationshipId,
    command.organizationId,
    command.subjectAccountId,
    command.operatorAccountId,
    command.reasonCode,
  ];
  if (!requiredValues.every(nonEmpty)) {
    throw new AccessLifecycleValidationError(
      "An access lifecycle command requires complete opaque identifiers and a reason.",
    );
  }
  if (!isValidDate(command.occurredAt) || !isValidDate(command.effectiveAt)) {
    throw new AccessLifecycleValidationError(
      "An access lifecycle command requires valid timestamps.",
    );
  }
  if (
    command.expiresAt &&
    (!isValidDate(command.expiresAt) ||
      command.expiresAt <= command.effectiveAt)
  ) {
    throw new AccessLifecycleValidationError(
      "An access lifecycle expiry must be after its effective time.",
    );
  }
  if (
    command.scope.kind === "restricted_resource_grant" &&
    (!nonEmpty(command.scope.resource.type) ||
      !nonEmpty(command.scope.resource.id) ||
      !nonEmpty(command.scope.operation))
  ) {
    throw new AccessLifecycleValidationError(
      "A restricted-resource lifecycle command requires an exact scope.",
    );
  }
};

const assertApprovalIsValid = (input: {
  command: AccessLifecycleCommand;
  approval: AccessApprovalRecord | null;
}): AccessApprovalRecord => {
  const { command, approval } = input;
  if (!command.approvalId || !approval || approval.id !== command.approvalId) {
    throw new AccessLifecycleValidationError(
      "New or expanded access requires its recorded approval.",
    );
  }
  if (
    approval.organizationId !== command.organizationId ||
    approval.subjectAccountId !== command.subjectAccountId ||
    !scopeMatches(approval.scope, command.scope) ||
    approval.approvedAt > command.occurredAt ||
    (approval.expiresAt !== null && approval.expiresAt <= command.occurredAt)
  ) {
    throw new AccessLifecycleValidationError(
      "The access approval does not apply to this command.",
    );
  }
  if (
    approval.requesterAccountId === approval.approverAccountId ||
    approval.requesterAccountId === command.subjectAccountId ||
    approval.approverAccountId === command.subjectAccountId ||
    command.operatorAccountId === command.subjectAccountId
  ) {
    throw new AccessLifecycleValidationError(
      "An access subject cannot request, approve, or operate their own expansion.",
    );
  }
  return approval;
};

const assertPredecessorIsValid = (input: {
  command: AccessLifecycleCommand;
  current: EffectiveAccessRelationship | null;
}): void => {
  const { command, current } = input;
  if (command.eventType === "granted") {
    if (current !== null || command.expectedRevision !== null) {
      throw new AccessLifecycleValidationError(
        "A grant must create a previously absent relationship.",
      );
    }
    return;
  }
  if (!current || command.expectedRevision === null) {
    throw new AccessLifecycleValidationError(
      "A lifecycle successor requires a current relationship and expected revision.",
    );
  }
  if (
    current.relationshipId !== command.relationshipId ||
    current.organizationId !== command.organizationId ||
    current.subjectAccountId !== command.subjectAccountId ||
    !scopeMatches(current.scope, command.scope) ||
    current.revision !== command.expectedRevision
  ) {
    throw new AccessLifecycleValidationError(
      "The lifecycle command is stale or outside the current relationship scope.",
    );
  }

  const stateIsValid =
    (command.eventType === "suspended" && current.state === "active") ||
    (command.eventType === "reinstated" && current.state === "suspended") ||
    (command.eventType === "revoked" &&
      (current.state === "active" || current.state === "suspended")) ||
    (command.eventType === "corrected" && current.state === "active") ||
    (command.eventType === "expired" && current.state === "active") ||
    (command.eventType === "offboarded" &&
      command.scope.kind === "membership" &&
      (current.state === "active" || current.state === "suspended"));
  if (!stateIsValid) {
    throw new AccessLifecycleValidationError(
      "The requested lifecycle transition is not valid from the current state.",
    );
  }
};

export const deriveAccessLifecycleTransition = (input: {
  command: AccessLifecycleCommand;
  current: EffectiveAccessRelationship | null;
  approval: AccessApprovalRecord | null;
}): AccessLifecycleTransition => {
  const { command, current } = input;
  assertBaseCommandIsValid(command);
  assertPredecessorIsValid({ command, current });

  const approval = requiresApproval(command.eventType)
    ? assertApprovalIsValid({ command, approval: input.approval })
    : null;
  if (!requiresApproval(command.eventType) && command.approvalId !== null) {
    throw new AccessLifecycleValidationError(
      "A removal lifecycle command must not reuse an expansion approval.",
    );
  }

  return {
    relationshipId: command.relationshipId,
    organizationId: command.organizationId,
    subjectAccountId: command.subjectAccountId,
    scope: command.scope,
    eventType: command.eventType,
    resultingState: resultingStateByEvent[command.eventType],
    priorRevision: current?.revision ?? null,
    revision: (current?.revision ?? 0) + 1,
    operatorAccountId: command.operatorAccountId,
    requesterAccountId: approval?.requesterAccountId ?? null,
    approverAccountId: approval?.approverAccountId ?? null,
    approvalId: approval?.id ?? null,
    correlationId: command.correlationId,
    commandId: command.commandId,
    reasonCode: command.reasonCode,
    effectiveAt: command.effectiveAt,
    expiresAt: command.expiresAt,
    occurredAt: command.occurredAt,
  };
};
