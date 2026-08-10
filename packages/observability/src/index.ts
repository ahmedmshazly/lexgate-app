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
 *
 * Ordinary personal data is included, not only credentials. For a legal
 * practice a party's name is personal data, and for an adverse party the fact
 * that their name appears in Lex Gate's logs at all is a confidentiality fact
 * independent of any identifier.
 *
 * `value` is deliberately NOT matched: it is too generic to block safely, even
 * though it is the column holding party names and contact points. The control
 * for that is the allow-list log contexts below, which emit a fixed set of
 * opaque fields. A party row must never be handed to a logger wholesale.
 */
const restrictedKeyPattern =
  /pass(word|phrase|port)|secret|token|credential|api[-_]?key|national[-_]?id|document|name|email|phone|mobile|address/i;

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

export interface LogSink {
  info(payload: Record<string, unknown>): void;
  error(payload: Record<string, unknown>): void;
}

/**
 * Wraps a sink so every emitted payload passes through redaction. Without this
 * the redaction control is unreachable: a caller can hand an arbitrary object
 * straight to a raw sink and bypass it entirely.
 *
 * An Error is reduced to its type and message rather than serialised whole,
 * because an Error can carry arbitrary enumerable properties — a database
 * driver's error commonly echoes the bound values that caused it. The type is
 * published as `errorType` rather than `name` so redaction does not strip the
 * one field that makes a log entry diagnosable.
 */
export const createRedactingLogger = (sink: LogSink): Logger => ({
  info(context, message) {
    sink.info(redactForLog({ level: "info", ...context, message }));
  },
  error(context, message, error) {
    sink.error(
      redactForLog({
        level: "error",
        ...context,
        message,
        ...(error
          ? { errorType: error.name, errorMessage: error.message }
          : {}),
      }),
    );
  },
});
