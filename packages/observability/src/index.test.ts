import { describe, expect, it, vi } from "vitest";
import {
  createAuthorizationDecisionLogContext,
  createPartyIdentityCommandLogContext,
  createRedactingLogger,
  redactForLog,
} from "./index.js";

describe("log context construction", () => {
  it("records an authorization decision without widening its shape", () => {
    const context = createAuthorizationDecisionLogContext({
      correlationId: "synthetic-correlation",
      outcome: "denied",
      reason: "not_authorized",
    });

    expect(context).toEqual({
      correlationId: "synthetic-correlation",
      operation: "authorization.evaluate",
      outcome: "denied",
      reason: "not_authorized",
    });
  });

  it("carries no subject, resource, or actor identifier", () => {
    const context = createAuthorizationDecisionLogContext({
      correlationId: "synthetic-correlation",
      outcome: "allowed",
      reason: "explicit_relationship",
    });

    // A denial must not become an enumeration oracle, and an allow must not
    // leak which resource was reached.
    expect(Object.keys(context).sort()).toEqual([
      "correlationId",
      "operation",
      "outcome",
      "reason",
    ]);
  });

  it("records a party identity command without the party's data", () => {
    const context = createPartyIdentityCommandLogContext({
      correlationId: "synthetic-correlation",
      action: "party.record_name",
      outcome: "recorded",
    });

    expect(context).toEqual({
      correlationId: "synthetic-correlation",
      operation: "party_identity.command",
      action: "party.record_name",
      outcome: "recorded",
    });
  });
});

describe("log redaction (PRV-MIN-001)", () => {
  it("redacts a restricted value at the top level", () => {
    expect(
      redactForLog({ password: "synthetic-secret", operation: "keep" }),
    ).toEqual({ password: "[REDACTED]", operation: "keep" });
  });

  it("redacts a restricted value nested inside an object", () => {
    // A national identifier one level down is exactly the value that must
    // never reach a log in the clear. A party's name goes with it: for an
    // adverse party, the fact their name appears in Lex Gate's logs at all is
    // a confidentiality fact independent of any identifier.
    expect(
      redactForLog({
        subject: { nationalId: "synthetic-id", displayName: "synthetic-name" },
      }),
    ).toEqual({
      subject: { nationalId: "[REDACTED]", displayName: "[REDACTED]" },
    });
  });

  it("redacts ordinary personal data, not only credentials", () => {
    expect(
      redactForLog({
        fullName: "synthetic",
        email: "synthetic@example.test",
        phoneNumber: "synthetic",
        homeAddress: "synthetic",
      }),
    ).toEqual({
      fullName: "[REDACTED]",
      email: "[REDACTED]",
      phoneNumber: "[REDACTED]",
      homeAddress: "[REDACTED]",
    });
  });

  it("redacts a restricted value inside an array", () => {
    expect(redactForLog({ items: [{ token: "synthetic-token" }] })).toEqual({
      items: [{ token: "[REDACTED]" }],
    });
  });

  it("matches a restricted key regardless of casing or affix", () => {
    expect(
      redactForLog({
        Password: "synthetic",
        accessToken: "synthetic",
        API_KEY: "synthetic",
        passportNumber: "synthetic",
      }),
    ).toEqual({
      Password: "[REDACTED]",
      accessToken: "[REDACTED]",
      API_KEY: "[REDACTED]",
      passportNumber: "[REDACTED]",
    });
  });

  it("keeps values that are safe to log", () => {
    expect(
      redactForLog({
        correlationId: "synthetic-correlation",
        operation: "party_identity.command",
        attempts: 2,
        published: null,
      }),
    ).toEqual({
      correlationId: "synthetic-correlation",
      operation: "party_identity.command",
      attempts: 2,
      published: null,
    });
  });

  it("routes every payload through redaction when a sink is wrapped", () => {
    const sink = { info: vi.fn(), error: vi.fn() };
    const logger = createRedactingLogger(sink);

    logger.info(
      { correlationId: "synthetic-correlation", operation: "party.read" },
      "read",
    );

    expect(sink.info).toHaveBeenCalledWith({
      level: "info",
      correlationId: "synthetic-correlation",
      operation: "party.read",
      message: "read",
    });
  });

  it("reduces an error to its type and message, never the whole object", () => {
    const sink = { info: vi.fn(), error: vi.fn() };
    const logger = createRedactingLogger(sink);

    // A driver error commonly carries the bound values that caused it as
    // enumerable properties. Serialising it whole would log them.
    const error = Object.assign(new Error("constraint violated"), {
      nationalId: "synthetic-id",
      detail: "Failing row contains (...)",
    });

    logger.error(
      { correlationId: "synthetic-correlation", operation: "party.create" },
      "write failed",
      error,
    );

    const payload = sink.error.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(payload).toEqual({
      level: "error",
      correlationId: "synthetic-correlation",
      operation: "party.create",
      message: "write failed",
      errorType: "Error",
      errorMessage: "constraint violated",
    });
    expect(JSON.stringify(payload)).not.toContain("synthetic-id");
    expect(JSON.stringify(payload)).not.toContain("Failing row");
  });

  it("terminates on a self-referencing structure", () => {
    const cyclic: Record<string, unknown> = { operation: "keep" };
    cyclic.self = cyclic;

    expect(() => redactForLog(cyclic)).not.toThrow();
  });
});
