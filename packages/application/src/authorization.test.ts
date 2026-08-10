import { describe, expect, it, vi } from "vitest";
import { evaluateRestrictedResourceAccess } from "./authorization.js";

const input = {
  decisionId: "00000000-0000-4000-8000-000000000102",
  correlationId: "synthetic-correlation-002",
  actor: {
    accountId: "synthetic-account-001",
    organizationId: "synthetic-organization-001",
  },
  resource: {
    type: "restricted-resource",
    id: "synthetic-resource-001",
  },
  operation: "view",
};

describe("evaluateRestrictedResourceAccess", () => {
  it("passes only trusted server-side context to the authorization boundary (SEC-AUT-001)", async () => {
    const authorization = {
      evaluate: vi.fn(async () => ({
        outcome: "allowed" as const,
        reason: "explicit_relationship" as const,
      })),
    };

    const result = await evaluateRestrictedResourceAccess({
      ...input,
      authorization,
    });

    expect(result).toEqual({
      outcome: "allowed",
      reason: "explicit_relationship",
    });
    expect(authorization.evaluate).toHaveBeenCalledWith({
      decisionId: input.decisionId,
      correlationId: input.correlationId,
      actorAccountId: input.actor.accountId,
      organizationId: input.actor.organizationId,
      resource: input.resource,
      operation: input.operation,
    });
  });

  it("does not turn a browser permission assertion into an authorization input", async () => {
    const authorization = {
      evaluate: vi.fn(async () => ({
        outcome: "denied" as const,
        reason: "not_authorized" as const,
      })),
    };
    const untrustedInput = {
      ...input,
      browserPermissionAssertion: true,
      authorization,
    };

    await expect(
      evaluateRestrictedResourceAccess(untrustedInput),
    ).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });
    expect(authorization.evaluate).toHaveBeenCalledWith(
      expect.not.objectContaining({ browserPermissionAssertion: true }),
    );
  });

  it("returns the server-side generic denial without attempting to infer a role-based allow", async () => {
    const authorization = {
      evaluate: vi.fn(async () => ({
        outcome: "denied" as const,
        reason: "not_authorized" as const,
      })),
    };

    await expect(
      evaluateRestrictedResourceAccess({ ...input, authorization }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
  });

  it("logs only correlation, operation, outcome, and generic reason", async () => {
    const logger = { info: vi.fn(), error: vi.fn() };
    const authorization = {
      evaluate: vi.fn(async () => ({
        outcome: "denied" as const,
        reason: "not_authorized" as const,
      })),
    };

    await evaluateRestrictedResourceAccess({ ...input, authorization, logger });

    expect(logger.info).toHaveBeenCalledWith(
      {
        correlationId: input.correlationId,
        operation: "authorization.evaluate",
        outcome: "denied",
        reason: "not_authorized",
      },
      "Restricted-resource access evaluated.",
    );
  });
});
