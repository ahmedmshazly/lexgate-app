export type LogContext = Readonly<{
  correlationId: string;
  operation: string;
}>;

export interface Logger {
  info(context: LogContext, message: string): void;
  error(context: LogContext, message: string, error?: Error): void;
}

export type AuthorizationDecisionLogContext = LogContext &
  Readonly<{
    outcome: "allowed" | "denied";
    reason: "explicit_relationship" | "not_authorized";
  }>;

export const createAuthorizationDecisionLogContext = (input: {
  correlationId: string;
  outcome: "allowed" | "denied";
  reason: "explicit_relationship" | "not_authorized";
}): AuthorizationDecisionLogContext => ({
  correlationId: input.correlationId,
  operation: "authorization.evaluate",
  outcome: input.outcome,
  reason: input.reason,
});

export type PartyIdentityCommandLogContext = LogContext &
  Readonly<{
    action:
      | "party.create"
      | "party.record_name"
      | "party.record_contact"
      | "party.record_representation"
      | "party.flag_possible_duplicate"
      | "party.read";
    outcome: "recorded" | "denied" | "found";
  }>;

export const createPartyIdentityCommandLogContext = (input: {
  correlationId: string;
  action: PartyIdentityCommandLogContext["action"];
  outcome: PartyIdentityCommandLogContext["outcome"];
}): PartyIdentityCommandLogContext => ({
  correlationId: input.correlationId,
  operation: "party_identity.command",
  action: input.action,
  outcome: input.outcome,
});

/**
 * Keys whose values must never reach a log. Matched case-insensitively and as
 * a substring, so `accessToken`, `API_KEY`, and `passportNumber` are caught as
 * well as their bare forms. Redaction that only inspected exact top-level keys
 * would let a national identifier one object deep through in the clear.
 */
const restrictedKeyPattern =
  /pass(word|phrase|port)|secret|token|credential|api[-_]?key|national[-_]?id|document/i;

const redactedPlaceholder = "[REDACTED]";

const redactUnknown = (value: unknown, seen: WeakSet<object>): unknown => {
  if (value === null || typeof value !== "object") return value;
  // A self-referencing structure must terminate rather than exhaust the stack.
  if (seen.has(value)) return "[CIRCULAR]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => redactUnknown(item, seen));
  }
  if (value instanceof Date) return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      restrictedKeyPattern.test(key)
        ? redactedPlaceholder
        : redactUnknown(item, seen),
    ]),
  );
};

export const redactForLog = (
  value: Record<string, unknown>,
): Record<string, unknown> =>
  redactUnknown(value, new WeakSet()) as Record<string, unknown>;
