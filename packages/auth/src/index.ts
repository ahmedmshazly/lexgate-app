export type AuthenticatedPrincipal = Readonly<{
  accountId: string;
  organizationId: string;
  authenticationStrength: "password" | "mfa" | "provider_asserted";
  sessionId: string;
  sessionExpiresAt: Date;
}>;

export interface IdentityProviderPort {
  getPrincipal(): Promise<AuthenticatedPrincipal | null>;
  invalidateSession(input: {
    sessionId: string;
    correlationId: string;
    reasonCode: string;
  }): Promise<void>;
}

export const isVerifiedPrincipalSessionActive = (
  principal: AuthenticatedPrincipal | null,
  at: Date = new Date(),
): boolean =>
  principal !== null &&
  principal.accountId.trim().length > 0 &&
  principal.organizationId.trim().length > 0 &&
  principal.sessionId.trim().length > 0 &&
  Number.isFinite(principal.sessionExpiresAt.getTime()) &&
  principal.sessionExpiresAt > at;

export type SessionInvalidationIntent = Readonly<{
  organizationId: string;
  accountId: string;
  correlationId: string;
  reasonCode: string;
}>;

export interface SessionInvalidationIntentSink {
  record(intent: SessionInvalidationIntent): Promise<void>;
}

const hasValue = (value: string): boolean => value.trim().length > 0;

/**
 * This produces an attributable invalidation intent only. A later approved
 * provider adapter may consume the intent; this foundation never invokes an
 * identity provider or treats it as access authorization.
 */
export const createSessionInvalidationIntentPort = (
  sink: SessionInvalidationIntentSink,
) => ({
  async record(intent: SessionInvalidationIntent): Promise<void> {
    if (
      !hasValue(intent.organizationId) ||
      !hasValue(intent.accountId) ||
      !hasValue(intent.correlationId) ||
      !hasValue(intent.reasonCode)
    ) {
      throw new Error(
        "A session invalidation intent requires opaque scope and reason.",
      );
    }
    await sink.record({
      organizationId: intent.organizationId,
      accountId: intent.accountId,
      correlationId: intent.correlationId,
      reasonCode: intent.reasonCode,
    });
  },
});

// Provider selection and implementation are deliberately deferred to M1/G1.
