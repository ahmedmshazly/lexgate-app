import { describe, expect, it, vi } from "vitest";
import {
  createSessionInvalidationIntentPort,
  isVerifiedPrincipalSessionActive,
} from "./index.js";

const principal = {
  accountId: "synthetic-account-001",
  organizationId: "synthetic-organization-001",
  authenticationStrength: "mfa" as const,
  sessionId: "synthetic-session-001",
  sessionExpiresAt: new Date("2026-08-10T01:00:00.000Z"),
};

describe("provider-neutral verified-principal expiry guard", () => {
  it("fails closed for absent, malformed, expired, and exact-expiry sessions", () => {
    const at = new Date("2026-08-10T00:00:00.000Z");

    expect(isVerifiedPrincipalSessionActive(principal, at)).toBe(true);
    expect(
      isVerifiedPrincipalSessionActive(
        { ...principal, sessionExpiresAt: at },
        at,
      ),
    ).toBe(false);
    expect(
      isVerifiedPrincipalSessionActive(
        { ...principal, sessionExpiresAt: new Date("invalid") },
        at,
      ),
    ).toBe(false);
    expect(isVerifiedPrincipalSessionActive(null, at)).toBe(false);
    expect(
      isVerifiedPrincipalSessionActive({ ...principal, sessionId: " " }, at),
    ).toBe(false);
  });
});

describe("provider-neutral session invalidation intent", () => {
  it("records a minimal, attributable intent without selecting or invoking a provider", async () => {
    const sink = { record: vi.fn(async () => undefined) };
    const invalidation = createSessionInvalidationIntentPort(sink);

    await invalidation.record({
      organizationId: "synthetic-organization-001",
      accountId: "synthetic-account-001",
      correlationId: "synthetic-correlation-001",
      reasonCode: "synthetic_access_revoked",
    });

    expect(sink.record).toHaveBeenCalledWith({
      organizationId: "synthetic-organization-001",
      accountId: "synthetic-account-001",
      correlationId: "synthetic-correlation-001",
      reasonCode: "synthetic_access_revoked",
    });
  });

  it("rejects an incomplete intent before it can be delivered", async () => {
    const sink = { record: vi.fn(async () => undefined) };
    const invalidation = createSessionInvalidationIntentPort(sink);

    await expect(
      invalidation.record({
        organizationId: "synthetic-organization-001",
        accountId: "",
        correlationId: "synthetic-correlation-001",
        reasonCode: "synthetic_access_revoked",
      }),
    ).rejects.toThrow("session invalidation intent");
    expect(sink.record).not.toHaveBeenCalled();
  });
});
