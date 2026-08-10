import type {
  AccessApprovalRecord,
  AccessLifecycleCommand,
  AccessLifecycleScope,
} from "@lexgate/domain";
import { deriveAccessLifecycleTransition } from "@lexgate/domain";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createAccessLifecyclePersistencePort } from "./access-lifecycle.js";
import { createRestrictedResourceAuthorizationPort } from "./authorization.js";
import {
  accessLifecycleApprovals,
  authorizationDecisions,
  effectiveRestrictedResourceAccessGrants,
  membershipLifecycleEvents,
  organizationMemberships,
  restrictedResourceAccessGrants,
  restrictedResourceAccessLifecycleEvents,
} from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for SEC-AUT-001 integration tests. Start local PostgreSQL before running them.",
  );
}

const client = postgres(databaseUrl, { max: 1 });
const database = drizzle({ client });
const authorization = createRestrictedResourceAuthorizationPort(database);
const lifecycle = createAccessLifecyclePersistencePort(database);
const occurredAt = new Date("2026-08-09T12:00:00.000Z");

const createFixture = () => {
  const suffix = crypto.randomUUID();
  const organizationId = `synthetic-organization-${suffix}`;
  const accountId = `synthetic-account-${suffix}`;
  const resource = {
    type: "restricted-resource",
    id: `synthetic-resource-${suffix}`,
  };

  const request = (decisionId: string = crypto.randomUUID()) => ({
    decisionId,
    correlationId: `synthetic-correlation-${decisionId}`,
    actorAccountId: accountId,
    organizationId,
    resource,
    operation: "view",
  });

  const grantLifecycle = async (input: {
    organization: string;
    scope: AccessLifecycleScope;
  }): Promise<string> => {
    const approval: AccessApprovalRecord = {
      id: crypto.randomUUID(),
      organizationId: input.organization,
      requesterAccountId: `synthetic-access-requester-${crypto.randomUUID()}`,
      approverAccountId: `synthetic-access-approver-${crypto.randomUUID()}`,
      subjectAccountId: accountId,
      scope: input.scope,
      approvedAt: new Date("2026-08-09T11:00:00.000Z"),
      expiresAt: new Date("2026-08-11T11:00:00.000Z"),
      correlationId: `synthetic-access-approval-${crypto.randomUUID()}`,
      reasonCode: "synthetic_access_need",
    };
    await database.insert(accessLifecycleApprovals).values({
      id: approval.id,
      organizationId: approval.organizationId,
      requesterAccountId: approval.requesterAccountId,
      approverAccountId: approval.approverAccountId,
      subjectAccountId: approval.subjectAccountId,
      relationshipKind: approval.scope.kind,
      resourceType:
        approval.scope.kind === "restricted_resource_grant"
          ? approval.scope.resource.type
          : null,
      resourceId:
        approval.scope.kind === "restricted_resource_grant"
          ? approval.scope.resource.id
          : null,
      operation:
        approval.scope.kind === "restricted_resource_grant"
          ? approval.scope.operation
          : null,
      approvedAt: approval.approvedAt,
      expiresAt: approval.expiresAt,
      correlationId: approval.correlationId,
      reasonCode: approval.reasonCode,
      recordedAt: occurredAt,
    });
    const relationshipId = crypto.randomUUID();
    const command: AccessLifecycleCommand = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-access-lifecycle-${crypto.randomUUID()}`,
      relationshipId,
      organizationId: input.organization,
      subjectAccountId: accountId,
      operatorAccountId: `synthetic-access-operator-${crypto.randomUUID()}`,
      scope: input.scope,
      eventType: "granted",
      expectedRevision: null,
      occurredAt,
      effectiveAt: occurredAt,
      // A grant may not outlive the approval that authorised it.
      expiresAt: approval.expiresAt,
      reasonCode: "synthetic_access_lifecycle",
      approvalId: approval.id,
    };
    await lifecycle.apply({
      actor: {
        accountId: command.operatorAccountId,
        organizationId: input.organization,
      },
      command,
      transition: deriveAccessLifecycleTransition({
        command,
        current: null,
        approval,
      }),
      approval,
      commandFingerprint: `fingerprint-${command.commandId}`,
    });
    return relationshipId;
  };

  const seedMembership = async (): Promise<string> =>
    grantLifecycle({
      organization: organizationId,
      scope: { kind: "membership" },
    });

  const seedExactGrant = async (): Promise<string> =>
    grantLifecycle({
      organization: organizationId,
      scope: {
        kind: "restricted_resource_grant",
        resource,
        operation: "view",
      },
    });

  const revokeMembership = async (relationshipId: string): Promise<void> => {
    const current = await lifecycle.readEffectiveRelationship({
      relationshipId,
      organizationId,
    });
    if (!current)
      throw new Error("Synthetic membership relationship is missing.");
    const command: AccessLifecycleCommand = {
      commandId: crypto.randomUUID(),
      correlationId: `synthetic-access-revoke-${crypto.randomUUID()}`,
      relationshipId,
      organizationId,
      subjectAccountId: accountId,
      operatorAccountId: `synthetic-access-operator-${crypto.randomUUID()}`,
      scope: current.scope,
      eventType: "revoked",
      expectedRevision: current.revision,
      occurredAt,
      effectiveAt: occurredAt,
      expiresAt: null,
      reasonCode: "synthetic_access_revoked",
      approvalId: null,
    };
    await lifecycle.apply({
      actor: { accountId: command.operatorAccountId, organizationId },
      command,
      transition: deriveAccessLifecycleTransition({
        command,
        current,
        approval: null,
      }),
      approval: null,
      commandFingerprint: `fingerprint-${command.commandId}`,
    });
  };

  return {
    accountId,
    organizationId,
    resource,
    request,
    seedMembership,
    seedExactGrant,
    revokeMembership,
  };
};

let fixture: ReturnType<typeof createFixture>;

/**
 * Writes a legacy relationship the way it could only have been written before
 * the lifecycle freeze, by suspending the freeze triggers for the insert. This
 * reproduces historical rows without reopening the write path in product code.
 */
const seedPreFreezeLegacyRelationship = async (): Promise<void> => {
  await database.execute(
    sql`alter table organization_memberships disable trigger organization_memberships_insert_frozen`,
  );
  await database.execute(
    sql`alter table restricted_resource_access_grants disable trigger restricted_resource_access_grants_insert_frozen`,
  );
  try {
    await database.insert(organizationMemberships).values({
      id: crypto.randomUUID(),
      accountId: fixture.accountId,
      organizationId: fixture.organizationId,
      systemRole: "synthetic-staff",
      isActive: true,
      createdAt: occurredAt,
    });
    await database.insert(restrictedResourceAccessGrants).values({
      id: crypto.randomUUID(),
      accountId: fixture.accountId,
      organizationId: fixture.organizationId,
      resourceType: fixture.resource.type,
      resourceId: fixture.resource.id,
      operation: "view",
      isActive: true,
      grantedAt: occurredAt,
    });
  } finally {
    await database.execute(
      sql`alter table organization_memberships enable trigger organization_memberships_insert_frozen`,
    );
    await database.execute(
      sql`alter table restricted_resource_access_grants enable trigger restricted_resource_access_grants_insert_frozen`,
    );
  }
};

describe("PostgreSQL restricted-resource authorization", () => {
  beforeEach(() => {
    fixture = createFixture();
  });

  afterAll(async () => {
    await client.end({ timeout: 5 });
  });

  it("records minimal evidence for an exact active relationship allow (SEC-AUT-001, SEC-MAT-001)", async () => {
    await fixture.seedMembership();
    await fixture.seedExactGrant();
    const input = fixture.request();

    await expect(authorization.evaluate(input)).resolves.toEqual({
      outcome: "allowed",
      reason: "explicit_relationship",
    });

    const decisions = await database
      .select()
      .from(authorizationDecisions)
      .where(eq(authorizationDecisions.id, input.decisionId));

    expect(decisions).toHaveLength(1);
    expect(decisions[0]).toMatchObject({
      id: input.decisionId,
      accountId: fixture.accountId,
      organizationId: fixture.organizationId,
      resourceType: fixture.resource.type,
      resourceId: fixture.resource.id,
      operation: input.operation,
      outcome: "allowed",
      reason: "explicit_relationship",
      membershipRevision: 1,
      grantRevision: 1,
    });
  });

  it("denies a revoked effective membership even when the exact grant projection remains", async () => {
    const membershipId = await fixture.seedMembership();
    await fixture.seedExactGrant();
    await fixture.revokeMembership(membershipId);

    await expect(authorization.evaluate(fixture.request())).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });
  });

  it("denies a role-only actor and records only the generic outcome", async () => {
    await fixture.seedMembership();
    const input = fixture.request();

    await expect(authorization.evaluate(input)).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });

    const decisions = await database
      .select()
      .from(authorizationDecisions)
      .where(eq(authorizationDecisions.id, input.decisionId));

    expect(decisions[0]).toMatchObject({
      outcome: "denied",
      reason: "not_authorized",
    });

    await expect(
      authorization.evaluate({
        ...fixture.request(),
        browserPermissionAssertion: true,
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
  });

  it("denies cross-organization, mismatched, missing-membership, and unavailable-emergency requests without enumeration", async () => {
    await fixture.seedMembership();
    await fixture.seedExactGrant();

    // A genuinely different organization. Asking for the same actor and the
    // same resource under an organization they hold no relationship in must
    // deny, even though their own organization would allow it. This
    // previously reused the fixture's own organization, so it re-tested the
    // role-only case under a cross-organization name.
    const crossOrganization = {
      ...fixture.request(),
      organizationId: `synthetic-other-organization-${crypto.randomUUID()}`,
    };

    await expect(authorization.evaluate(crossOrganization)).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });

    await expect(
      authorization.evaluate({
        ...fixture.request(),
        actorAccountId: "synthetic-account-without-membership",
      }),
    ).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });

    const mismatchedResource = {
      ...fixture.request(),
      resource: {
        ...fixture.resource,
        id: "synthetic-resource-not-in-relationship",
      },
    };
    await expect(authorization.evaluate(mismatchedResource)).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });

    const [mismatchedResourceDecision] = await database
      .select()
      .from(authorizationDecisions)
      .where(eq(authorizationDecisions.id, mismatchedResource.decisionId));
    expect(mismatchedResourceDecision).toMatchObject({
      resourceId: mismatchedResource.resource.id,
      outcome: "denied",
      reason: "not_authorized",
    });

    await expect(
      authorization.evaluate({
        ...fixture.request(),
        operation: "mutate",
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
    await expect(
      authorization.evaluate({
        ...fixture.request(),
        emergencyAccessRequested: true,
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
    await expect(
      authorization.evaluate({
        ...fixture.request(),
        resource: { ...fixture.resource, id: "" },
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
  });

  it("keeps decision evidence append-only and prevents duplicate IDs from creating contradictory records", async () => {
    const membershipId = await fixture.seedMembership();
    const grantId = await fixture.seedExactGrant();
    const input = fixture.request();

    await authorization.evaluate(input);
    await expect(authorization.evaluate(input)).resolves.toEqual({
      outcome: "allowed",
      reason: "explicit_relationship",
    });

    const decisions = await database
      .select()
      .from(authorizationDecisions)
      .where(eq(authorizationDecisions.id, input.decisionId));
    expect(decisions).toHaveLength(1);

    await expect(
      database
        .update(authorizationDecisions)
        .set({ outcome: "denied" })
        .where(eq(authorizationDecisions.id, input.decisionId)),
    ).rejects.toThrow();
    await expect(
      database
        .delete(authorizationDecisions)
        .where(eq(authorizationDecisions.id, input.decisionId)),
    ).rejects.toThrow();
    await expect(
      database
        .update(membershipLifecycleEvents)
        .set({ resultingState: "revoked" })
        .where(eq(membershipLifecycleEvents.relationshipId, membershipId)),
    ).rejects.toThrow();
    await expect(
      database
        .delete(membershipLifecycleEvents)
        .where(eq(membershipLifecycleEvents.relationshipId, membershipId)),
    ).rejects.toThrow();
    await expect(
      database
        .update(restrictedResourceAccessLifecycleEvents)
        .set({ operation: "mutate" })
        .where(
          eq(restrictedResourceAccessLifecycleEvents.relationshipId, grantId),
        ),
    ).rejects.toThrow();
    await expect(
      database
        .delete(restrictedResourceAccessLifecycleEvents)
        .where(
          eq(restrictedResourceAccessLifecycleEvents.relationshipId, grantId),
        ),
    ).rejects.toThrow();
  });

  it("rolls back a failed decision write without changing a relationship or retaining partial evidence", async () => {
    await fixture.seedMembership();
    await fixture.seedExactGrant();
    const invalidDecision = fixture.request("not-a-uuid");

    await expect(authorization.evaluate(invalidDecision)).rejects.toThrow();

    const retainedEvidence = await database
      .select()
      .from(authorizationDecisions)
      .where(
        eq(authorizationDecisions.correlationId, invalidDecision.correlationId),
      );
    const retainedGrants = await database
      .select()
      .from(effectiveRestrictedResourceAccessGrants)
      .where(
        and(
          eq(
            effectiveRestrictedResourceAccessGrants.accountId,
            fixture.accountId,
          ),
          eq(
            effectiveRestrictedResourceAccessGrants.organizationId,
            fixture.organizationId,
          ),
          eq(
            effectiveRestrictedResourceAccessGrants.resourceId,
            fixture.resource.id,
          ),
        ),
      );

    expect(retainedEvidence).toHaveLength(0);
    expect(retainedGrants).toHaveLength(1);
  });

  it("does not let a replayed decision outlive the access it recorded", async () => {
    const membershipId = await fixture.seedMembership();
    await fixture.seedExactGrant();
    const input = fixture.request();

    await expect(authorization.evaluate(input)).resolves.toEqual({
      outcome: "allowed",
      reason: "explicit_relationship",
    });

    await fixture.revokeMembership(membershipId);

    // Replaying the same decision ID must not return the stored "allowed".
    // A decision ID is supplied by the caller and nothing bounds its
    // lifetime, so a cached allow would otherwise survive the revocation
    // indefinitely.
    await expect(authorization.evaluate(input)).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });

    // The original decision stays in evidence — the record is history, not
    // a standing permission.
    const [recorded] = await database
      .select()
      .from(authorizationDecisions)
      .where(eq(authorizationDecisions.id, input.decisionId));
    expect(recorded).toMatchObject({ outcome: "allowed" });
  });

  it("ignores a browser permission assertion in both directions (SC-002)", async () => {
    // Pairing the flag with an empty grant set proves nothing: the request
    // would be denied identically with the field deleted. The claim that a
    // browser assertion cannot create access only holds if the flag changes
    // no outcome either way.
    const asserted = { ...fixture.request(), browserPermissionAssertion: true };
    await expect(authorization.evaluate(asserted)).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });

    await fixture.seedMembership();
    await fixture.seedExactGrant();

    const allowedWithAssertion = {
      ...fixture.request(),
      browserPermissionAssertion: true,
    };
    const allowedWithout = fixture.request();

    // The flag must not create access, and must not withhold it either — an
    // inert field, not a second authority input.
    await expect(authorization.evaluate(allowedWithAssertion)).resolves.toEqual(
      { outcome: "allowed", reason: "explicit_relationship" },
    );
    await expect(authorization.evaluate(allowedWithout)).resolves.toEqual({
      outcome: "allowed",
      reason: "explicit_relationship",
    });
  });

  it("freezes new legacy relationship writes so access cannot bypass the lifecycle ledger", async () => {
    await expect(
      database.insert(organizationMemberships).values({
        id: crypto.randomUUID(),
        accountId: fixture.accountId,
        organizationId: fixture.organizationId,
        systemRole: "synthetic-staff",
        isActive: true,
        createdAt: occurredAt,
      }),
    ).rejects.toThrow();

    await expect(
      database.insert(restrictedResourceAccessGrants).values({
        id: crypto.randomUUID(),
        accountId: fixture.accountId,
        organizationId: fixture.organizationId,
        resourceType: fixture.resource.type,
        resourceId: fixture.resource.id,
        operation: "view",
        isActive: true,
        grantedAt: occurredAt,
      }),
    ).rejects.toThrow();

    const memberships = await database
      .select()
      .from(organizationMemberships)
      .where(eq(organizationMemberships.accountId, fixture.accountId));
    const grants = await database
      .select()
      .from(restrictedResourceAccessGrants)
      .where(eq(restrictedResourceAccessGrants.accountId, fixture.accountId));

    expect(memberships).toEqual([]);
    expect(grants).toEqual([]);
  });

  it("denies a legacy relationship that predates the freeze because it carries no revision evidence", async () => {
    // Simulates rows written before the lifecycle freeze. They can still be
    // read for rollback safety, but they must never authorize, because no
    // lifecycle event, approval, requester, or approver stands behind them.
    await seedPreFreezeLegacyRelationship();
    const input = fixture.request();

    await expect(authorization.evaluate(input)).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });

    const [decision] = await database
      .select()
      .from(authorizationDecisions)
      .where(eq(authorizationDecisions.id, input.decisionId));

    expect(decision).toMatchObject({
      outcome: "denied",
      reason: "not_authorized",
      membershipRevision: null,
      grantRevision: null,
    });
  });

  it("never records an allowed decision without traceable revision evidence", async () => {
    await fixture.seedMembership();
    await fixture.seedExactGrant();
    await seedPreFreezeLegacyRelationship();

    await authorization.evaluate(fixture.request());

    const allowedWithoutEvidence = await database
      .select()
      .from(authorizationDecisions)
      .where(
        and(
          eq(authorizationDecisions.accountId, fixture.accountId),
          eq(authorizationDecisions.organizationId, fixture.organizationId),
          eq(authorizationDecisions.outcome, "allowed"),
          sql`(${authorizationDecisions.membershipRevision} is null or ${authorizationDecisions.grantRevision} is null)`,
        ),
      );

    expect(allowedWithoutEvidence).toEqual([]);
  });
});
