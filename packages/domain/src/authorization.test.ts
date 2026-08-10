import { describe, expect, it } from "vitest";
import { evaluateRestrictedResourceAccess } from "./authorization.js";

const request = {
  decisionId: "00000000-0000-4000-8000-000000000101",
  correlationId: "synthetic-correlation-001",
  actorAccountId: "synthetic-account-001",
  organizationId: "synthetic-organization-001",
  resource: {
    type: "restricted-resource",
    id: "synthetic-resource-001",
  },
  operation: "view",
};

const membership = {
  accountId: request.actorAccountId,
  organizationId: request.organizationId,
  systemRole: "administrator",
  isActive: true,
};

const exactGrant = {
  accountId: request.actorAccountId,
  organizationId: request.organizationId,
  resourceType: request.resource.type,
  resourceId: request.resource.id,
  operation: request.operation,
  isActive: true,
};

describe("restricted-resource authorization policy", () => {
  it("allows only an active explicit relationship that exactly matches its synthetic resource and operation (SEC-AUT-001, SEC-MAT-001)", () => {
    expect(
      evaluateRestrictedResourceAccess({
        request,
        membership,
        grants: [exactGrant],
      }),
    ).toEqual({ outcome: "allowed", reason: "explicit_relationship" });
  });

  it("fails closed without revealing whether a restricted resource exists", () => {
    const deniedInputs = [
      {
        request: { ...request, browserPermissionAssertion: true },
        membership,
        grants: [],
      },
      {
        request,
        membership,
        grants: [
          { ...exactGrant, organizationId: "synthetic-organization-002" },
        ],
      },
      {
        request,
        membership: { ...membership, isActive: false },
        grants: [exactGrant],
      },
      {
        request,
        membership: null,
        grants: [exactGrant],
      },
      {
        request,
        membership,
        grants: [{ ...exactGrant, resourceId: "synthetic-resource-002" }],
      },
      {
        request: { ...request, operation: "mutate" },
        membership,
        grants: [exactGrant],
      },
      {
        request: { ...request, emergencyAccessRequested: true },
        membership,
        grants: [exactGrant],
      },
      {
        request: { ...request, resource: { ...request.resource, id: "" } },
        membership,
        grants: [exactGrant],
      },
    ];

    for (const input of deniedInputs) {
      expect(evaluateRestrictedResourceAccess(input)).toEqual({
        outcome: "denied",
        reason: "not_authorized",
      });
    }
  });
});
