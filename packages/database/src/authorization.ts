import type { RestrictedResourceAuthorizationPort } from "@lexgate/application";
import {
  evaluateRestrictedResourceAccess,
  type AuthorizationDecision,
  type RestrictedResourceAuthorizationRequest,
} from "@lexgate/domain";
import { and, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  authorizationDecisions,
  effectiveOrganizationMemberships,
  effectiveRestrictedResourceAccessGrants,
  organizationMemberships,
  restrictedResourceAccessGrants,
} from "./schema.js";

type Database = PostgresJsDatabase;

const asAuthorizationDecision = (input: {
  outcome: string;
  reason: string;
}): AuthorizationDecision => {
  if (input.outcome === "allowed" && input.reason === "explicit_relationship") {
    return { outcome: "allowed", reason: "explicit_relationship" };
  }

  if (input.outcome === "denied" && input.reason === "not_authorized") {
    return { outcome: "denied", reason: "not_authorized" };
  }

  throw new Error("Authorization decision evidence has an invalid outcome.");
};

const deniedDecision: AuthorizationDecision = {
  outcome: "denied",
  reason: "not_authorized",
};

/**
 * Re-runs the policy against current state for a replayed decision.
 *
 * Only the effective projections are read. A legacy relationship can no
 * longer produce an allow — an allowed decision must carry revision evidence
 * — so reading them here would add nothing. The domain evaluator is called
 * rather than reimplemented, so this cannot drift from the policy.
 */
const currentDecisionAllows = async (
  transaction: Parameters<Parameters<Database["transaction"]>[0]>[0],
  request: RestrictedResourceAuthorizationRequest,
): Promise<boolean> => {
  const [membership] = await transaction
    .select()
    .from(effectiveOrganizationMemberships)
    .where(
      and(
        eq(effectiveOrganizationMemberships.accountId, request.actorAccountId),
        eq(
          effectiveOrganizationMemberships.organizationId,
          request.organizationId,
        ),
      ),
    );
  const grants = await transaction
    .select()
    .from(effectiveRestrictedResourceAccessGrants)
    .where(
      and(
        eq(
          effectiveRestrictedResourceAccessGrants.accountId,
          request.actorAccountId,
        ),
        eq(
          effectiveRestrictedResourceAccessGrants.organizationId,
          request.organizationId,
        ),
        eq(
          effectiveRestrictedResourceAccessGrants.resourceType,
          request.resource.type,
        ),
        eq(
          effectiveRestrictedResourceAccessGrants.resourceId,
          request.resource.id,
        ),
        eq(
          effectiveRestrictedResourceAccessGrants.operation,
          request.operation,
        ),
      ),
    );

  if (!membership || grants.length === 0) return false;

  const at = new Date();
  const isLive = (state: string, effectiveAt: Date, expiresAt: Date | null) =>
    state === "active" &&
    effectiveAt <= at &&
    (expiresAt === null || expiresAt > at);

  return (
    evaluateRestrictedResourceAccess({
      request,
      membership: {
        accountId: membership.accountId,
        organizationId: membership.organizationId,
        systemRole: membership.systemRole,
        isActive: isLive(
          membership.state,
          membership.effectiveAt,
          membership.expiresAt,
        ),
      },
      grants: grants.map((grant) => ({
        accountId: grant.accountId,
        organizationId: grant.organizationId,
        resourceType: grant.resourceType,
        resourceId: grant.resourceId,
        operation: grant.operation,
        isActive: isLive(grant.state, grant.effectiveAt, grant.expiresAt),
      })),
    }).outcome === "allowed"
  );
};

export const createRestrictedResourceAuthorizationPort = (
  database: Database,
): RestrictedResourceAuthorizationPort => ({
  async evaluate(request: RestrictedResourceAuthorizationRequest) {
    return database.transaction(async (transaction) => {
      const [existingDecision] = await transaction
        .select({
          correlationId: authorizationDecisions.correlationId,
          accountId: authorizationDecisions.accountId,
          organizationId: authorizationDecisions.organizationId,
          resourceType: authorizationDecisions.resourceType,
          resourceId: authorizationDecisions.resourceId,
          operation: authorizationDecisions.operation,
          outcome: authorizationDecisions.outcome,
          reason: authorizationDecisions.reason,
        })
        .from(authorizationDecisions)
        .where(eq(authorizationDecisions.id, request.decisionId));

      if (existingDecision) {
        const matchesRequest =
          existingDecision.correlationId === request.correlationId &&
          existingDecision.accountId === request.actorAccountId &&
          existingDecision.organizationId === request.organizationId &&
          existingDecision.resourceType === request.resource.type &&
          existingDecision.resourceId === request.resource.id &&
          existingDecision.operation === request.operation;

        if (!matchesRequest) {
          throw new Error(
            "An authorization decision ID cannot be reused for a different request.",
          );
        }

        // A replayed decision must not outlive the access it recorded. The
        // stored answer is evidence of what was decided, never a standing
        // permission: a decision taken before a revocation would otherwise
        // keep returning "allowed" indefinitely, because a decision ID is
        // supplied by the caller and nothing constrains its lifetime.
        if (existingDecision.outcome === "allowed") {
          const stillAllowed = await currentDecisionAllows(
            transaction,
            request,
          );
          if (!stillAllowed) return deniedDecision;
        }

        return asAuthorizationDecision(existingDecision);
      }

      const [effectiveMembership] = await transaction
        .select()
        .from(effectiveOrganizationMemberships)
        .where(
          and(
            eq(
              effectiveOrganizationMemberships.accountId,
              request.actorAccountId,
            ),
            eq(
              effectiveOrganizationMemberships.organizationId,
              request.organizationId,
            ),
          ),
        );
      const [legacyMembership] = effectiveMembership
        ? [null]
        : await transaction
            .select({
              accountId: organizationMemberships.accountId,
              organizationId: organizationMemberships.organizationId,
              systemRole: organizationMemberships.systemRole,
              isActive: organizationMemberships.isActive,
            })
            .from(organizationMemberships)
            .where(
              and(
                eq(organizationMemberships.accountId, request.actorAccountId),
                eq(
                  organizationMemberships.organizationId,
                  request.organizationId,
                ),
              ),
            );
      const effectiveGrants = await transaction
        .select()
        .from(effectiveRestrictedResourceAccessGrants)
        .where(
          and(
            eq(
              effectiveRestrictedResourceAccessGrants.accountId,
              request.actorAccountId,
            ),
            eq(
              effectiveRestrictedResourceAccessGrants.organizationId,
              request.organizationId,
            ),
            eq(
              effectiveRestrictedResourceAccessGrants.resourceType,
              request.resource.type,
            ),
            eq(
              effectiveRestrictedResourceAccessGrants.resourceId,
              request.resource.id,
            ),
            eq(
              effectiveRestrictedResourceAccessGrants.operation,
              request.operation,
            ),
          ),
        );
      const legacyGrants =
        effectiveGrants.length > 0
          ? []
          : await transaction
              .select({
                accountId: restrictedResourceAccessGrants.accountId,
                organizationId: restrictedResourceAccessGrants.organizationId,
                resourceType: restrictedResourceAccessGrants.resourceType,
                resourceId: restrictedResourceAccessGrants.resourceId,
                operation: restrictedResourceAccessGrants.operation,
                isActive: restrictedResourceAccessGrants.isActive,
              })
              .from(restrictedResourceAccessGrants)
              .where(
                and(
                  eq(
                    restrictedResourceAccessGrants.accountId,
                    request.actorAccountId,
                  ),
                  eq(
                    restrictedResourceAccessGrants.organizationId,
                    request.organizationId,
                  ),
                  eq(
                    restrictedResourceAccessGrants.resourceType,
                    request.resource.type,
                  ),
                  eq(
                    restrictedResourceAccessGrants.resourceId,
                    request.resource.id,
                  ),
                  eq(
                    restrictedResourceAccessGrants.operation,
                    request.operation,
                  ),
                ),
              );
      const authorizationTime = new Date();
      const membership = effectiveMembership
        ? {
            accountId: effectiveMembership.accountId,
            organizationId: effectiveMembership.organizationId,
            systemRole: effectiveMembership.systemRole,
            isActive:
              effectiveMembership.state === "active" &&
              effectiveMembership.effectiveAt <= authorizationTime &&
              (effectiveMembership.expiresAt === null ||
                effectiveMembership.expiresAt > authorizationTime),
          }
        : legacyMembership;
      const grants = effectiveGrants.length
        ? effectiveGrants.map((grant) => ({
            accountId: grant.accountId,
            organizationId: grant.organizationId,
            resourceType: grant.resourceType,
            resourceId: grant.resourceId,
            operation: grant.operation,
            isActive:
              grant.state === "active" &&
              grant.effectiveAt <= authorizationTime &&
              (grant.expiresAt === null || grant.expiresAt > authorizationTime),
          }))
        : legacyGrants;
      const evaluated = evaluateRestrictedResourceAccess({
        request,
        membership: membership ?? null,
        grants,
      });
      // Every allowed decision must name the effective membership and grant
      // revisions it relied on. A legacy relationship that predates the
      // lifecycle freeze carries no revision, so it can be read for rollback
      // safety but can never authorize.
      const hasRevisionEvidence =
        effectiveMembership !== undefined && effectiveGrants.length > 0;
      const decision =
        evaluated.outcome === "allowed" && !hasRevisionEvidence
          ? ({ outcome: "denied", reason: "not_authorized" } as const)
          : evaluated;

      await transaction.insert(authorizationDecisions).values({
        id: request.decisionId,
        correlationId: request.correlationId,
        accountId: request.actorAccountId,
        organizationId: request.organizationId,
        resourceType: request.resource.type,
        resourceId: request.resource.id,
        operation: request.operation,
        outcome: decision.outcome,
        reason: decision.reason,
        membershipRelationshipId: effectiveMembership?.relationshipId ?? null,
        membershipRevision: effectiveMembership?.revision ?? null,
        grantRelationshipId: effectiveGrants[0]?.relationshipId ?? null,
        grantRevision: effectiveGrants[0]?.revision ?? null,
        decidedAt: new Date(),
      });

      return decision;
    });
  },
});
