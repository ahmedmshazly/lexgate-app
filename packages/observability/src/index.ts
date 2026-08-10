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

export const redactForLog = (
  value: Record<string, unknown>,
): Record<string, unknown> => {
  const restrictedKeys = new Set([
    "password",
    "token",
    "secret",
    "nationalId",
    "document",
  ]);
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      restrictedKeys.has(key) ? "[REDACTED]" : item,
    ]),
  );
};
