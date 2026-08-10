import type {
  AccessApprovalRecord,
  AccessLifecycleCommand,
  AccessLifecycleCommandOutcome,
  AccessLifecycleCommandResult,
  AccessLifecycleTransition,
  EffectiveAccessRelationship,
} from "@lexgate/domain";
import {
  AccessLifecycleValidationError,
  deriveAccessLifecycleTransition,
} from "@lexgate/domain";
import type { Logger } from "@lexgate/observability";
import type { Actor } from "./index.js";

export type AccessLifecycleAdministrationAction =
  | "access_lifecycle.request"
  | "access_lifecycle.approve"
  | "access_lifecycle.suspend"
  | "access_lifecycle.revoke"
  | "access_lifecycle.offboard";

export interface AccessLifecycleAuthorizationPort {
  canAdminister(input: {
    actor: Actor;
    organizationId: string;
    action: AccessLifecycleAdministrationAction;
    correlationId: string;
  }): Promise<boolean>;
}

export interface AccessLifecycleApprovalPort {
  readApproval(input: {
    organizationId: string;
    approvalId: string;
  }): Promise<AccessApprovalRecord | null>;
}

export interface AccessLifecyclePersistencePort {
  apply(input: {
    actor: Actor;
    command: AccessLifecycleCommand;
    transition: AccessLifecycleTransition;
    approval: AccessApprovalRecord | null;
    commandFingerprint: string;
  }): Promise<AccessLifecycleCommandResult>;
  readEffectiveRelationship(input: {
    relationshipId: string;
    organizationId: string;
  }): Promise<EffectiveAccessRelationship | null>;
}

export interface SessionInvalidationIntentPort {
  record(input: {
    organizationId: string;
    accountId: string;
    correlationId: string;
    reasonCode: string;
  }): Promise<void>;
}

export type AccessLifecycleCommandInput = Readonly<{
  actor: Actor;
  command: AccessLifecycleCommand;
  authorization: AccessLifecycleAuthorizationPort;
  approvals: AccessLifecycleApprovalPort;
  persistence: AccessLifecyclePersistencePort;
  sessionInvalidation: SessionInvalidationIntentPort;
  logger?: Logger;
}>;

export type AccessLifecycleCommandHandler = (
  input: AccessLifecycleCommandInput,
) => Promise<AccessLifecycleCommandOutcome>;

export class AccessLifecyclePersistenceConflictError extends Error {
  override name = "AccessLifecyclePersistenceConflictError";

  constructor(
    readonly reason: "stale_state" | "incompatible_command",
    message = "The access lifecycle command could not be applied.",
  ) {
    super(message);
  }
}

const canonicalize = (value: unknown): unknown => {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalize(item)]),
    );
  }
  return value;
};

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

export const createAccessLifecycleCommandFingerprint = async (
  command: AccessLifecycleCommand,
): Promise<string> => {
  const encoded = new TextEncoder().encode(
    JSON.stringify(canonicalize(command)),
  );
  return toHex(await globalThis.crypto.subtle.digest("SHA-256", encoded));
};

const actionFor = (
  eventType: AccessLifecycleCommand["eventType"],
): AccessLifecycleAdministrationAction => {
  if (
    eventType === "granted" ||
    eventType === "reinstated" ||
    eventType === "corrected"
  ) {
    return "access_lifecycle.approve";
  }
  if (eventType === "offboarded") return "access_lifecycle.offboard";
  if (eventType === "suspended") return "access_lifecycle.suspend";
  return "access_lifecycle.revoke";
};

const invalid: AccessLifecycleCommandOutcome = {
  outcome: "invalid",
  reason: "invalid_access_lifecycle_command",
};

const denied: AccessLifecycleCommandOutcome = {
  outcome: "denied",
  reason: "not_authorized",
};

const shouldInvalidateSession = (
  eventType: AccessLifecycleCommand["eventType"],
): boolean =>
  eventType === "suspended" ||
  eventType === "revoked" ||
  eventType === "expired" ||
  eventType === "offboarded";

export const applyAccessLifecycleCommand: AccessLifecycleCommandHandler =
  async (input) => {
    const { actor, command } = input;
    if (
      actor.organizationId !== command.organizationId ||
      actor.accountId !== command.operatorAccountId
    ) {
      input.logger?.info(
        {
          correlationId: command.correlationId,
          operation: "access_lifecycle.command",
        },
        "Access lifecycle command denied.",
      );
      return denied;
    }
    const authorized = await input.authorization.canAdminister({
      actor,
      organizationId: command.organizationId,
      action: actionFor(command.eventType),
      correlationId: command.correlationId,
    });
    if (!authorized) return denied;

    const [current, approval] = await Promise.all([
      input.persistence.readEffectiveRelationship({
        relationshipId: command.relationshipId,
        organizationId: command.organizationId,
      }),
      command.approvalId
        ? input.approvals.readApproval({
            organizationId: command.organizationId,
            approvalId: command.approvalId,
          })
        : Promise.resolve(null),
    ]);

    let transition: AccessLifecycleTransition;
    try {
      transition = deriveAccessLifecycleTransition({
        command,
        current,
        approval,
      });
    } catch (error) {
      if (error instanceof AccessLifecycleValidationError) return invalid;
      throw error;
    }

    let result: AccessLifecycleCommandResult;
    try {
      result = await input.persistence.apply({
        actor,
        command,
        transition,
        approval,
        commandFingerprint:
          await createAccessLifecycleCommandFingerprint(command),
      });
    } catch (error) {
      if (error instanceof AccessLifecyclePersistenceConflictError) {
        return { outcome: "conflict", reason: error.reason };
      }
      throw error;
    }
    if (shouldInvalidateSession(command.eventType)) {
      await input.sessionInvalidation.record({
        organizationId: command.organizationId,
        accountId: command.subjectAccountId,
        correlationId: command.correlationId,
        reasonCode: command.reasonCode,
      });
    }
    input.logger?.info(
      {
        correlationId: command.correlationId,
        operation: "access_lifecycle.command",
      },
      "Access lifecycle command applied.",
    );
    return { outcome: "applied", result };
  };
