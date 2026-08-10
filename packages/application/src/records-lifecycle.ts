import type {
  EffectiveLegalHold,
  HeldResource,
  LegalHoldCommand,
} from "@lexgate/domain";
import {
  deriveLegalHoldTransition,
  evaluateRecordDestruction,
  evaluateSubjectErasure,
} from "@lexgate/domain";

/**
 * Trusted server-side orchestration for legal holds and erasure.
 *
 * Nothing here decides whether a hold may be bypassed. The domain answers
 * that, and the answer takes no authority as an input, so this layer can only
 * carry a refusal outward — never convert one into a success.
 */

export type RecordsLifecycleActor = Readonly<{
  accountId: string;
  organizationId: string;
}>;

export interface LegalHoldPersistencePort {
  applyLegalHold(input: {
    actor: RecordsLifecycleActor;
    command: LegalHoldCommand;
    transition: ReturnType<typeof deriveLegalHoldTransition>;
  }): Promise<{ eventId: string; revision: number }>;
  readHolds(input: {
    organizationId: string;
    resource: HeldResource;
  }): Promise<EffectiveLegalHold[]>;
  eraseSubject(input: {
    subjectId: string;
    organizationId: string;
    actor: { accountId: string; reasonCode: string };
  }): Promise<
    | { outcome: "erased" }
    | { outcome: "already_erased" }
    | { outcome: "refused"; reason: "held" }
  >;
}

export type LegalHoldOutcome =
  | Readonly<{ outcome: "recorded"; eventId: string; revision: number }>
  | Readonly<{ outcome: "denied"; reason: "not_authorized" }>
  | Readonly<{ outcome: "invalid"; reason: "invalid_legal_hold_command" }>;

export type SubjectErasureOutcome =
  | Readonly<{ outcome: "erased" }>
  | Readonly<{ outcome: "already_erased" }>
  | Readonly<{ outcome: "refused"; reason: "held" }>;

const actorMatchesCommand = (
  actor: RecordsLifecycleActor,
  command: LegalHoldCommand,
): boolean =>
  actor.organizationId === command.organizationId &&
  actor.accountId === command.operatorAccountId;

export const applyLegalHoldCommand = async (input: {
  actor: RecordsLifecycleActor;
  command: LegalHoldCommand;
  persistence: LegalHoldPersistencePort;
}): Promise<LegalHoldOutcome> => {
  const { actor, command, persistence } = input;

  // A caller cannot record a hold in another operator's name, or outside
  // their own organization.
  if (!actorMatchesCommand(actor, command)) {
    return { outcome: "denied", reason: "not_authorized" };
  }

  const holds = await persistence.readHolds({
    organizationId: command.organizationId,
    resource: command.resource,
  });
  const current = holds.find((hold) => hold.holdId === command.holdId) ?? null;

  try {
    const transition = deriveLegalHoldTransition({ command, current });
    const result = await persistence.applyLegalHold({
      actor,
      command,
      transition,
    });
    return { outcome: "recorded", ...result };
  } catch {
    // Generic to the caller: a refusal must not become an oracle for what
    // exists or what state it is in.
    return { outcome: "invalid", reason: "invalid_legal_hold_command" };
  }
};

/**
 * Erasure. The hold decision is the domain's, and this layer propagates a
 * refusal unchanged — it never retries past one, and never converts one into
 * a success.
 */
export const eraseSubjectCommand = async (input: {
  actor: RecordsLifecycleActor;
  subjectId: string;
  reasonCode: string;
  persistence: LegalHoldPersistencePort;
}): Promise<SubjectErasureOutcome> => {
  const { actor, subjectId, reasonCode, persistence } = input;
  const subject: HeldResource = {
    resourceType: "party",
    resourceId: subjectId,
  };

  const holds = await persistence.readHolds({
    organizationId: actor.organizationId,
    resource: subject,
  });

  const decision = evaluateSubjectErasure({ subject, holds });
  if (decision.outcome === "refused") {
    return { outcome: "refused", reason: decision.reason };
  }

  // Persistence re-checks the hold inside its own transaction, so a hold
  // placed between this decision and that write still stops the erasure.
  return persistence.eraseSubject({
    subjectId,
    organizationId: actor.organizationId,
    actor: { accountId: actor.accountId, reasonCode },
  });
};

/**
 * Whether a record may be destroyed. It may not. Exposed so a caller can ask
 * and receive a reason, rather than discovering the refusal by attempting it.
 */
export const mayDestroyRecord = (input: {
  resource: HeldResource;
  holds: readonly EffectiveLegalHold[];
}) =>
  evaluateRecordDestruction({
    resource: input.resource,
    holds: input.holds,
    hasApprovedRetentionSchedule: false,
    recordsGateOpen: false,
  });
