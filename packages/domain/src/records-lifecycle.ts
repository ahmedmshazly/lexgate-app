/**
 * Records lifecycle: legal hold, erasure decisions, and destruction refusal.
 *
 * Framework-free. Every function here is a pure decision — no clock beyond an
 * injected time, no database, no provider.
 *
 * The governing constraint is ADR-010: material history is append-only, so
 * nothing in this module ever authorises destroying a record. Erasure is
 * modelled as destroying the means of reading a subject, which leaves the
 * record and its guarantees intact.
 */

export type LegalHoldState = "active" | "released";

export type LegalHoldEventType = "placed" | "released";

export type HeldResource = Readonly<{
  /** `party` today; `matter` and `document` arrive at M4–M6. */
  resourceType: string;
  resourceId: string;
}>;

export type LegalHoldCommand = Readonly<{
  holdId: string;
  organizationId: string;
  resource: HeldResource;
  eventType: LegalHoldEventType;
  expectedRevision: number | null;
  operatorAccountId: string;
  reasonCode: string;
  correlationId: string;
  occurredAt: Date;
}>;

export type EffectiveLegalHold = Readonly<{
  holdId: string;
  organizationId: string;
  resource: HeldResource;
  state: LegalHoldState;
  revision: number;
  placedAt: Date;
  releasedAt: Date | null;
  lastEventId: string;
}>;

export type LegalHoldTransition = Readonly<{
  holdId: string;
  organizationId: string;
  resource: HeldResource;
  eventType: LegalHoldEventType;
  resultingState: LegalHoldState;
  priorRevision: number | null;
  revision: number;
  operatorAccountId: string;
  reasonCode: string;
  correlationId: string;
  occurredAt: Date;
}>;

/**
 * Why a record may not be destroyed. There is deliberately no successful
 * counterpart: while G6 is shut, destruction has no permitted form.
 *
 * A hold is reported ahead of the shut gate because the two become different
 * answers once G6 opens, and a reader must be able to tell them apart now.
 */
export type DestructionRefusalReason =
  "held" | "gate_g6_closed" | "no_approved_retention_schedule";

export type DestructionDecision = Readonly<{
  outcome: "refused";
  reason: DestructionRefusalReason;
}>;

export type ErasureDecision =
  | Readonly<{ outcome: "permitted" }>
  | Readonly<{ outcome: "refused"; reason: "held" }>;

export class RecordsLifecycleValidationError extends Error {
  override name = "RecordsLifecycleValidationError";
}

const nonEmpty = (value: string): boolean => value.trim().length > 0;

const coversResource = (
  hold: EffectiveLegalHold,
  resource: HeldResource,
): boolean =>
  hold.resource.resourceType === resource.resourceType &&
  hold.resource.resourceId === resource.resourceId;

const isActive = (hold: EffectiveLegalHold): boolean => hold.state === "active";

/**
 * A record is held when at least one active hold covers it. Multiple holds may
 * exist for different reasons, and releasing one does not release the others.
 */
export const isResourceHeld = (
  resource: HeldResource,
  holds: readonly EffectiveLegalHold[],
): boolean =>
  holds.some((hold) => isActive(hold) && coversResource(hold, resource));

export const deriveLegalHoldTransition = (input: {
  command: LegalHoldCommand;
  current: EffectiveLegalHold | null;
}): LegalHoldTransition => {
  const { command, current } = input;

  if (
    !nonEmpty(command.holdId) ||
    !nonEmpty(command.organizationId) ||
    !nonEmpty(command.resource.resourceType) ||
    !nonEmpty(command.resource.resourceId) ||
    !nonEmpty(command.correlationId)
  ) {
    throw new RecordsLifecycleValidationError(
      "A legal hold command requires complete opaque identifiers.",
    );
  }
  // An unexplained or unattributed hold is refused: a hold nobody is
  // accountable for cannot be reviewed, and review is its whole purpose.
  if (!nonEmpty(command.operatorAccountId) || !nonEmpty(command.reasonCode)) {
    throw new RecordsLifecycleValidationError(
      "A legal hold requires an accountable operator and a stated reason.",
    );
  }
  if (!Number.isFinite(command.occurredAt.getTime())) {
    throw new RecordsLifecycleValidationError(
      "A legal hold command requires a valid time.",
    );
  }

  if (command.eventType === "placed") {
    if (current !== null || command.expectedRevision !== null) {
      throw new RecordsLifecycleValidationError(
        "A hold placement must create a previously absent hold.",
      );
    }
    return {
      holdId: command.holdId,
      organizationId: command.organizationId,
      resource: command.resource,
      eventType: "placed",
      resultingState: "active",
      priorRevision: null,
      revision: 1,
      operatorAccountId: command.operatorAccountId,
      reasonCode: command.reasonCode,
      correlationId: command.correlationId,
      occurredAt: command.occurredAt,
    };
  }

  // Release. Recorded as a successor fact so the original placement stays
  // readable; the placement is never edited to represent release.
  if (!current || command.expectedRevision === null) {
    throw new RecordsLifecycleValidationError(
      "Releasing a hold requires an existing hold and its expected revision.",
    );
  }
  if (
    current.holdId !== command.holdId ||
    current.organizationId !== command.organizationId ||
    !coversResource(current, command.resource) ||
    current.revision !== command.expectedRevision
  ) {
    throw new RecordsLifecycleValidationError(
      "The release is stale or outside the current hold.",
    );
  }
  if (current.state !== "active") {
    throw new RecordsLifecycleValidationError(
      "Only an active hold can be released.",
    );
  }

  return {
    holdId: command.holdId,
    organizationId: command.organizationId,
    resource: command.resource,
    eventType: "released",
    resultingState: "released",
    priorRevision: current.revision,
    revision: current.revision + 1,
    operatorAccountId: command.operatorAccountId,
    reasonCode: command.reasonCode,
    correlationId: command.correlationId,
    occurredAt: command.occurredAt,
  };
};

/**
 * Whether a record may be destroyed. It may not, ever, in this increment.
 *
 * REC-HLD-001's acceptance criterion is that a destruction command rejects
 * held records, so there is a real command doing the rejecting rather than an
 * unimplemented interface.
 */
export const evaluateRecordDestruction = (input: {
  resource: HeldResource;
  holds: readonly EffectiveLegalHold[];
  hasApprovedRetentionSchedule: boolean;
  recordsGateOpen: boolean;
}): DestructionDecision => {
  if (isResourceHeld(input.resource, input.holds)) {
    return { outcome: "refused", reason: "held" };
  }
  if (!input.recordsGateOpen) {
    return { outcome: "refused", reason: "gate_g6_closed" };
  }
  // Reached only if G6 ever opens. Destruction still requires a versioned,
  // reviewer-approved retention schedule under LEG-RUL-001, which does not
  // exist. There is no fourth branch: this function cannot permit anything.
  return { outcome: "refused", reason: "no_approved_retention_schedule" };
};

/**
 * Whether a subject's key may be shredded.
 *
 * Note what is absent from the input: no operator, no role, no authority. A
 * hold is not a permission that a sufficiently privileged actor can pass, so
 * there is structurally no argument that could override one.
 */
export const evaluateSubjectErasure = (input: {
  subject: HeldResource;
  holds: readonly EffectiveLegalHold[];
}): ErasureDecision =>
  isResourceHeld(input.subject, input.holds)
    ? { outcome: "refused", reason: "held" }
    : { outcome: "permitted" };
