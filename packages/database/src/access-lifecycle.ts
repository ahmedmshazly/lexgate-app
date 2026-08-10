import {
  AccessLifecyclePersistenceConflictError,
  type AccessLifecycleApprovalPort,
  type AccessLifecyclePersistencePort,
} from "@lexgate/application";
import type {
  AccessApprovalRecord,
  AccessLifecycleCommand,
  AccessLifecycleCommandResult,
  AccessLifecycleScope,
  AccessLifecycleState,
  AccessLifecycleTransition,
  EffectiveAccessRelationship,
} from "@lexgate/domain";
import {
  AccessLifecycleValidationError,
  deriveAccessLifecycleTransition,
} from "@lexgate/domain";
import { and, asc, eq, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  accessLifecycleApprovals,
  accessLifecycleCommandReceipts,
  auditEvents,
  effectiveOrganizationMemberships,
  effectiveRestrictedResourceAccessGrants,
  membershipLifecycleEvents,
  outboxEvents,
  restrictedResourceAccessLifecycleEvents,
} from "./schema.js";

type Database = PostgresJsDatabase;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export { AccessLifecyclePersistenceConflictError as AccessLifecycleConflictError };

const lifecycleStates = new Set<AccessLifecycleState>([
  "active",
  "suspended",
  "revoked",
  "expired",
  "offboarded",
]);

const asState = (value: string): AccessLifecycleState => {
  if (!lifecycleStates.has(value as AccessLifecycleState)) {
    throw new Error("Access lifecycle evidence has an invalid state.");
  }
  return value as AccessLifecycleState;
};

const toScope = (input: {
  relationshipKind: string;
  resourceType: string | null;
  resourceId: string | null;
  operation: string | null;
}): AccessLifecycleScope => {
  if (input.relationshipKind === "membership") {
    return { kind: "membership" };
  }
  if (
    input.relationshipKind === "restricted_resource_grant" &&
    input.resourceType &&
    input.resourceId &&
    input.operation
  ) {
    return {
      kind: "restricted_resource_grant",
      resource: { type: input.resourceType, id: input.resourceId },
      operation: input.operation,
    };
  }
  throw new Error("Access lifecycle evidence has an invalid scope.");
};

const toApproval = (
  row: typeof accessLifecycleApprovals.$inferSelect,
): AccessApprovalRecord => ({
  id: row.id,
  organizationId: row.organizationId,
  requesterAccountId: row.requesterAccountId,
  approverAccountId: row.approverAccountId,
  subjectAccountId: row.subjectAccountId,
  scope: toScope(row),
  approvedAt: row.approvedAt,
  expiresAt: row.expiresAt,
  correlationId: row.correlationId,
  reasonCode: row.reasonCode,
});

const readApproval = async (
  database: Database | Transaction,
  input: { organizationId: string; approvalId: string },
): Promise<AccessApprovalRecord | null> => {
  const [approval] = await database
    .select()
    .from(accessLifecycleApprovals)
    .where(
      and(
        eq(accessLifecycleApprovals.id, input.approvalId),
        eq(accessLifecycleApprovals.organizationId, input.organizationId),
      ),
    );
  return approval ? toApproval(approval) : null;
};

const readEffectiveRelationship = async (
  database: Database | Transaction,
  input: { relationshipId: string; organizationId: string },
): Promise<EffectiveAccessRelationship | null> => {
  const [membership] = await database
    .select()
    .from(effectiveOrganizationMemberships)
    .where(
      and(
        eq(
          effectiveOrganizationMemberships.relationshipId,
          input.relationshipId,
        ),
        eq(
          effectiveOrganizationMemberships.organizationId,
          input.organizationId,
        ),
      ),
    );
  if (membership) {
    return {
      relationshipId: membership.relationshipId,
      organizationId: membership.organizationId,
      subjectAccountId: membership.accountId,
      scope: { kind: "membership" },
      state: asState(membership.state),
      revision: membership.revision,
      effectiveAt: membership.effectiveAt,
      expiresAt: membership.expiresAt,
      lastEventId: membership.lastEventId,
    };
  }

  const [grant] = await database
    .select()
    .from(effectiveRestrictedResourceAccessGrants)
    .where(
      and(
        eq(
          effectiveRestrictedResourceAccessGrants.relationshipId,
          input.relationshipId,
        ),
        eq(
          effectiveRestrictedResourceAccessGrants.organizationId,
          input.organizationId,
        ),
      ),
    );
  if (!grant) return null;
  return {
    relationshipId: grant.relationshipId,
    organizationId: grant.organizationId,
    subjectAccountId: grant.accountId,
    scope: {
      kind: "restricted_resource_grant",
      resource: { type: grant.resourceType, id: grant.resourceId },
      operation: grant.operation,
    },
    state: asState(grant.state),
    revision: grant.revision,
    effectiveAt: grant.effectiveAt,
    expiresAt: grant.expiresAt,
    lastEventId: grant.lastEventId,
  };
};

const resultFromReceipt = (
  receipt: typeof accessLifecycleCommandReceipts.$inferSelect,
): AccessLifecycleCommandResult => ({
  relationshipId: receipt.relationshipId,
  eventId: receipt.eventId,
  revision: receipt.revision,
  state: asState(receipt.state),
  replayed: true,
});

const assertTransitionMatches = (input: {
  expected: AccessLifecycleTransition;
  received: AccessLifecycleTransition;
}): void => {
  const comparable = (transition: AccessLifecycleTransition) =>
    JSON.stringify({
      ...transition,
      occurredAt: transition.occurredAt.toISOString(),
      effectiveAt: transition.effectiveAt.toISOString(),
      expiresAt: transition.expiresAt?.toISOString() ?? null,
    });
  if (comparable(input.expected) !== comparable(input.received)) {
    throw new AccessLifecyclePersistenceConflictError(
      "incompatible_command",
      "The supplied lifecycle transition no longer matches the durable relationship state.",
    );
  }
};

const writeOutboxAndAudit = async (input: {
  transaction: Transaction;
  command: AccessLifecycleCommand;
  eventId: string;
  transition: AccessLifecycleTransition;
}) => {
  const { transaction, command, eventId, transition } = input;
  await transaction.insert(auditEvents).values({
    id: crypto.randomUUID(),
    actorAccountId: command.operatorAccountId,
    action: `access_lifecycle.${command.eventType}`,
    resourceType: command.scope.kind,
    resourceId: command.relationshipId,
    occurredAt: command.occurredAt,
  });
  await transaction.insert(outboxEvents).values({
    id: eventId,
    type: `access_lifecycle.${command.scope.kind}.${command.eventType}`,
    aggregateId: command.relationshipId,
    payload: {
      eventId,
      relationshipId: command.relationshipId,
      revision: transition.revision,
      state: transition.resultingState,
    },
    occurredAt: command.occurredAt,
    attempts: 0,
    lastAttemptedAt: null,
    lastError: null,
    publishedAt: null,
  });
};

const writeOffboardedGrantEvents = async (input: {
  transaction: Transaction;
  command: AccessLifecycleCommand;
}) => {
  const activeGrants = await input.transaction
    .select()
    .from(effectiveRestrictedResourceAccessGrants)
    .where(
      and(
        eq(
          effectiveRestrictedResourceAccessGrants.organizationId,
          input.command.organizationId,
        ),
        eq(
          effectiveRestrictedResourceAccessGrants.accountId,
          input.command.subjectAccountId,
        ),
        eq(effectiveRestrictedResourceAccessGrants.state, "active"),
      ),
    );
  for (const grant of activeGrants) {
    const eventId = crypto.randomUUID();
    const revision = grant.revision + 1;
    await input.transaction
      .insert(restrictedResourceAccessLifecycleEvents)
      .values({
        id: eventId,
        relationshipId: grant.relationshipId,
        commandId: input.command.commandId,
        organizationId: grant.organizationId,
        accountId: grant.accountId,
        resourceType: grant.resourceType,
        resourceId: grant.resourceId,
        operation: grant.operation,
        eventType: "offboarded",
        resultingState: "offboarded",
        priorRevision: grant.revision,
        revision,
        operatorAccountId: input.command.operatorAccountId,
        requesterAccountId: null,
        approverAccountId: null,
        approvalId: null,
        correlationId: input.command.correlationId,
        reasonCode: input.command.reasonCode,
        effectiveAt: input.command.effectiveAt,
        expiresAt: null,
        occurredAt: input.command.occurredAt,
      });
    await input.transaction
      .update(effectiveRestrictedResourceAccessGrants)
      .set({
        state: "offboarded",
        revision,
        effectiveAt: input.command.effectiveAt,
        expiresAt: null,
        lastEventId: eventId,
      })
      .where(
        eq(
          effectiveRestrictedResourceAccessGrants.relationshipId,
          grant.relationshipId,
        ),
      );
    await input.transaction.insert(outboxEvents).values({
      id: eventId,
      type: "access_lifecycle.restricted_resource_grant.offboarded",
      aggregateId: grant.relationshipId,
      payload: {
        eventId,
        relationshipId: grant.relationshipId,
        revision,
        state: "offboarded",
      },
      occurredAt: input.command.occurredAt,
      attempts: 0,
      lastAttemptedAt: null,
      lastError: null,
      publishedAt: null,
    });
  }
};

const uniqueLatestByRelationship = <T extends { relationshipId: string }>(
  events: readonly T[],
): T[] => {
  const latest = new Map<string, T>();
  for (const event of events) latest.set(event.relationshipId, event);
  return [...latest.values()];
};

/**
 * Recovery primitive: rebuilds effective projections from the immutable
 * ledgers. It rewrites every projection row for an organization, so it
 * requires an attributable operator and records who ran it. Every other
 * mutating path in this file writes audit evidence; a privileged recovery
 * operation that left no trace would be the one exception, and the least
 * defensible one.
 */
export const rebuildEffectiveAccessProjections = async (
  database: Database,
  input: {
    organizationId: string;
    actor: { accountId: string; reasonCode: string };
  },
): Promise<{ membershipCount: number; grantCount: number }> => {
  if (
    input.actor.accountId.trim().length === 0 ||
    input.actor.reasonCode.trim().length === 0
  ) {
    throw new Error(
      "A projection rebuild requires an attributable operator and reason.",
    );
  }

  return database.transaction(
    async (transaction) => {
      await transaction.execute(
        sql.raw(
          "lock table effective_organization_memberships, effective_restricted_resource_access_grants in share row exclusive mode",
        ),
      );
      const [membershipEvents, grantEvents] = await Promise.all([
        transaction
          .select()
          .from(membershipLifecycleEvents)
          .where(
            eq(membershipLifecycleEvents.organizationId, input.organizationId),
          )
          .orderBy(
            asc(membershipLifecycleEvents.relationshipId),
            asc(membershipLifecycleEvents.revision),
          ),
        transaction
          .select()
          .from(restrictedResourceAccessLifecycleEvents)
          .where(
            eq(
              restrictedResourceAccessLifecycleEvents.organizationId,
              input.organizationId,
            ),
          )
          .orderBy(
            asc(restrictedResourceAccessLifecycleEvents.relationshipId),
            asc(restrictedResourceAccessLifecycleEvents.revision),
          ),
      ]);
      const validateRevisions = <
        T extends { relationshipId: string; revision: number },
      >(
        events: readonly T[],
      ) => {
        const revisions = new Map<string, number>();
        for (const event of events) {
          const expected = (revisions.get(event.relationshipId) ?? 0) + 1;
          if (event.revision !== expected) {
            throw new Error(
              "Access lifecycle evidence cannot rebuild an invalid revision sequence.",
            );
          }
          revisions.set(event.relationshipId, event.revision);
        }
      };
      validateRevisions(membershipEvents);
      validateRevisions(grantEvents);
      const memberships = uniqueLatestByRelationship(membershipEvents);
      const grants = uniqueLatestByRelationship(grantEvents);

      await transaction
        .delete(effectiveOrganizationMemberships)
        .where(
          eq(
            effectiveOrganizationMemberships.organizationId,
            input.organizationId,
          ),
        );
      await transaction
        .delete(effectiveRestrictedResourceAccessGrants)
        .where(
          eq(
            effectiveRestrictedResourceAccessGrants.organizationId,
            input.organizationId,
          ),
        );
      if (memberships.length > 0) {
        await transaction.insert(effectiveOrganizationMemberships).values(
          memberships.map((event) => ({
            relationshipId: event.relationshipId,
            organizationId: event.organizationId,
            accountId: event.accountId,
            systemRole: "member",
            state: asState(event.resultingState),
            revision: event.revision,
            effectiveAt: event.effectiveAt,
            expiresAt: event.expiresAt,
            lastEventId: event.id,
          })),
        );
      }
      if (grants.length > 0) {
        await transaction
          .insert(effectiveRestrictedResourceAccessGrants)
          .values(
            grants.map((event) => ({
              relationshipId: event.relationshipId,
              organizationId: event.organizationId,
              accountId: event.accountId,
              resourceType: event.resourceType,
              resourceId: event.resourceId,
              operation: event.operation,
              state: asState(event.resultingState),
              revision: event.revision,
              effectiveAt: event.effectiveAt,
              expiresAt: event.expiresAt,
              lastEventId: event.id,
            })),
          );
      }
      await transaction.insert(auditEvents).values({
        id: crypto.randomUUID(),
        actorAccountId: input.actor.accountId,
        action: "access_lifecycle.projection_rebuild",
        resourceType: "organization",
        resourceId: input.organizationId,
        occurredAt: new Date(),
      });

      return {
        membershipCount: memberships.length,
        grantCount: grants.length,
      };
    },
    { isolationLevel: "serializable", accessMode: "read write" },
  );
};

export const createAccessLifecycleApprovalPort = (
  database: Database,
): AccessLifecycleApprovalPort => ({
  readApproval: (input) => readApproval(database, input),
});

export const createAccessLifecyclePersistencePort = (
  database: Database,
): AccessLifecyclePersistencePort => ({
  readEffectiveRelationship: (input) =>
    readEffectiveRelationship(database, input),
  async apply(input) {
    if (
      input.actor.organizationId !== input.command.organizationId ||
      input.actor.accountId !== input.command.operatorAccountId
    ) {
      throw new AccessLifecyclePersistenceConflictError(
        "incompatible_command",
        "A lifecycle command requires the trusted operator as its actor.",
      );
    }
    return database.transaction(
      async (transaction) => {
        await transaction.execute(
          sql`select pg_advisory_xact_lock(hashtext(${`${input.command.organizationId}:${input.command.subjectAccountId}`}))`,
        );
        const [receipt] = await transaction
          .select()
          .from(accessLifecycleCommandReceipts)
          .where(
            eq(
              accessLifecycleCommandReceipts.commandId,
              input.command.commandId,
            ),
          );
        if (receipt) {
          if (receipt.commandFingerprint !== input.commandFingerprint) {
            throw new AccessLifecyclePersistenceConflictError(
              "incompatible_command",
              "An access lifecycle command ID cannot be reused for another command.",
            );
          }
          return resultFromReceipt(receipt);
        }

        const [current, approval] = await Promise.all([
          readEffectiveRelationship(transaction, {
            relationshipId: input.command.relationshipId,
            organizationId: input.command.organizationId,
          }),
          input.command.approvalId
            ? readApproval(transaction, {
                organizationId: input.command.organizationId,
                approvalId: input.command.approvalId,
              })
            : Promise.resolve(null),
        ]);
        let transition: AccessLifecycleTransition;
        try {
          transition = deriveAccessLifecycleTransition({
            command: input.command,
            current,
            approval,
          });
        } catch (error) {
          if (error instanceof AccessLifecycleValidationError) {
            throw new AccessLifecyclePersistenceConflictError("stale_state");
          }
          throw error;
        }
        assertTransitionMatches({
          expected: transition,
          received: input.transition,
        });

        const eventId = crypto.randomUUID();
        if (transition.scope.kind === "membership") {
          await transaction.insert(membershipLifecycleEvents).values({
            id: eventId,
            relationshipId: transition.relationshipId,
            commandId: transition.commandId,
            organizationId: transition.organizationId,
            accountId: transition.subjectAccountId,
            eventType: transition.eventType,
            resultingState: transition.resultingState,
            priorRevision: transition.priorRevision,
            revision: transition.revision,
            operatorAccountId: transition.operatorAccountId,
            requesterAccountId: transition.requesterAccountId,
            approverAccountId: transition.approverAccountId,
            approvalId: transition.approvalId,
            correlationId: transition.correlationId,
            reasonCode: transition.reasonCode,
            effectiveAt: transition.effectiveAt,
            expiresAt: transition.expiresAt,
            occurredAt: transition.occurredAt,
          });
          await transaction
            .insert(effectiveOrganizationMemberships)
            .values({
              relationshipId: transition.relationshipId,
              organizationId: transition.organizationId,
              accountId: transition.subjectAccountId,
              systemRole: "member",
              state: transition.resultingState,
              revision: transition.revision,
              effectiveAt: transition.effectiveAt,
              expiresAt: transition.expiresAt,
              lastEventId: eventId,
            })
            .onConflictDoUpdate({
              target: effectiveOrganizationMemberships.relationshipId,
              set: {
                state: transition.resultingState,
                revision: transition.revision,
                effectiveAt: transition.effectiveAt,
                expiresAt: transition.expiresAt,
                lastEventId: eventId,
              },
            });
          if (transition.eventType === "offboarded") {
            await writeOffboardedGrantEvents({
              transaction,
              command: input.command,
            });
          }
        } else {
          if (
            transition.eventType === "granted" ||
            transition.eventType === "reinstated" ||
            transition.eventType === "corrected"
          ) {
            const [membership] = await transaction
              .select()
              .from(effectiveOrganizationMemberships)
              .where(
                and(
                  eq(
                    effectiveOrganizationMemberships.organizationId,
                    transition.organizationId,
                  ),
                  eq(
                    effectiveOrganizationMemberships.accountId,
                    transition.subjectAccountId,
                  ),
                ),
              );
            const membershipIsEffective =
              membership?.state === "active" &&
              membership.effectiveAt <= transition.effectiveAt &&
              (membership.expiresAt === null ||
                membership.expiresAt > transition.effectiveAt);
            if (!membershipIsEffective) {
              throw new AccessLifecyclePersistenceConflictError(
                "incompatible_command",
                "A restricted-resource grant requires an active effective membership.",
              );
            }
          }
          await transaction
            .insert(restrictedResourceAccessLifecycleEvents)
            .values({
              id: eventId,
              relationshipId: transition.relationshipId,
              commandId: transition.commandId,
              organizationId: transition.organizationId,
              accountId: transition.subjectAccountId,
              resourceType: transition.scope.resource.type,
              resourceId: transition.scope.resource.id,
              operation: transition.scope.operation,
              eventType: transition.eventType,
              resultingState: transition.resultingState,
              priorRevision: transition.priorRevision,
              revision: transition.revision,
              operatorAccountId: transition.operatorAccountId,
              requesterAccountId: transition.requesterAccountId,
              approverAccountId: transition.approverAccountId,
              approvalId: transition.approvalId,
              correlationId: transition.correlationId,
              reasonCode: transition.reasonCode,
              effectiveAt: transition.effectiveAt,
              expiresAt: transition.expiresAt,
              occurredAt: transition.occurredAt,
            });
          await transaction
            .insert(effectiveRestrictedResourceAccessGrants)
            .values({
              relationshipId: transition.relationshipId,
              organizationId: transition.organizationId,
              accountId: transition.subjectAccountId,
              resourceType: transition.scope.resource.type,
              resourceId: transition.scope.resource.id,
              operation: transition.scope.operation,
              state: transition.resultingState,
              revision: transition.revision,
              effectiveAt: transition.effectiveAt,
              expiresAt: transition.expiresAt,
              lastEventId: eventId,
            })
            .onConflictDoUpdate({
              target: effectiveRestrictedResourceAccessGrants.relationshipId,
              set: {
                state: transition.resultingState,
                revision: transition.revision,
                effectiveAt: transition.effectiveAt,
                expiresAt: transition.expiresAt,
                lastEventId: eventId,
              },
            });
        }
        await transaction.insert(accessLifecycleCommandReceipts).values({
          commandId: input.command.commandId,
          commandFingerprint: input.commandFingerprint,
          relationshipId: transition.relationshipId,
          eventId,
          revision: transition.revision,
          state: transition.resultingState,
          recordedAt: input.command.occurredAt,
        });
        await writeOutboxAndAudit({
          transaction,
          command: input.command,
          eventId,
          transition,
        });
        return {
          relationshipId: transition.relationshipId,
          eventId,
          revision: transition.revision,
          state: transition.resultingState,
          replayed: false,
        };
      },
      { isolationLevel: "serializable", accessMode: "read write" },
    );
  },
});
