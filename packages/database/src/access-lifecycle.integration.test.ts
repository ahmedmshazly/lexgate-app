import type {
  AccessApprovalRecord,
  AccessLifecycleCommand,
  AccessLifecycleScope,
} from "@lexgate/domain";
import { deriveAccessLifecycleTransition } from "@lexgate/domain";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, describe, expect, it } from "vitest";
import {
  AccessLifecycleConflictError,
  createAccessLifecyclePersistencePort,
  rebuildEffectiveAccessProjections,
} from "./access-lifecycle.js";
import {
  accessLifecycleApprovals,
  accessLifecycleCommandReceipts,
  auditEvents,
  effectiveOrganizationMemberships,
  membershipLifecycleEvents,
  outboxEvents,
} from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for SEC-AUT-001 lifecycle integration tests. Start local PostgreSQL before running them.",
  );
}

const client = postgres(databaseUrl, { max: 2 });
const database = drizzle({ client });
const persistence = createAccessLifecyclePersistencePort(database);
const occurredAt = new Date("2026-08-10T12:00:00.000Z");

const fixture = (scope: AccessLifecycleScope = { kind: "membership" }) => {
  const suffix = crypto.randomUUID();
  const organizationId = `synthetic-lifecycle-org-${suffix}`;
  const accountId = `synthetic-lifecycle-account-${suffix}`;
  const relationshipId = crypto.randomUUID();
  const approval: AccessApprovalRecord = {
    id: crypto.randomUUID(),
    organizationId,
    requesterAccountId: `synthetic-requester-${suffix}`,
    approverAccountId: `synthetic-approver-${suffix}`,
    subjectAccountId: accountId,
    scope,
    approvedAt: new Date("2026-08-10T11:00:00.000Z"),
    expiresAt: new Date("2026-08-11T11:00:00.000Z"),
    correlationId: `synthetic-approval-correlation-${suffix}`,
    reasonCode: "synthetic_access_need",
  };
  const command = (input: {
    eventType: AccessLifecycleCommand["eventType"];
    expectedRevision: number | null;
    approvalId?: string | null;
    commandId?: string;
  }): AccessLifecycleCommand => ({
    commandId: input.commandId ?? crypto.randomUUID(),
    correlationId: `synthetic-lifecycle-correlation-${crypto.randomUUID()}`,
    relationshipId,
    organizationId,
    subjectAccountId: accountId,
    operatorAccountId: `synthetic-operator-${suffix}`,
    scope,
    eventType: input.eventType,
    expectedRevision: input.expectedRevision,
    occurredAt,
    effectiveAt: occurredAt,
    // A grant may not outlive the approval that authorised it. Removal
    // commands carry no approval, so the bound is harmless for them.
    expiresAt: approval.expiresAt,
    reasonCode: "synthetic_access_lifecycle",
    approvalId:
      input.approvalId ??
      (input.eventType === "granted" || input.eventType === "reinstated"
        ? approval.id
        : null),
  });
  return {
    accountId,
    approval,
    command,
    organizationId,
    relationshipId,
    scope,
  };
};

const persistApproval = async (approval: AccessApprovalRecord) => {
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
};

describe("PostgreSQL access lifecycle", () => {
  afterAll(async () => {
    await client.end({ timeout: 5 });
  });

  it("writes immutable lifecycle, effective projection, receipt, audit, and minimized outbox evidence atomically", async () => {
    const current = fixture();
    await persistApproval(current.approval);
    const command = current.command({
      eventType: "granted",
      expectedRevision: null,
    });
    const transition = deriveAccessLifecycleTransition({
      command,
      current: null,
      approval: current.approval,
    });
    const input = {
      actor: {
        accountId: command.operatorAccountId,
        organizationId: current.organizationId,
      },
      command,
      transition,
      approval: current.approval,
      commandFingerprint: `fingerprint-${command.commandId}`,
    };

    const initialResult = await persistence.apply(input);
    expect(initialResult).toMatchObject({
      relationshipId: current.relationshipId,
      revision: 1,
      state: "active",
      replayed: false,
    });
    await expect(persistence.apply(input)).resolves.toMatchObject({
      replayed: true,
      revision: 1,
    });

    const [event] = await database
      .select()
      .from(membershipLifecycleEvents)
      .where(eq(membershipLifecycleEvents.commandId, command.commandId));
    const [projection] = await database
      .select()
      .from(effectiveOrganizationMemberships)
      .where(
        eq(
          effectiveOrganizationMemberships.relationshipId,
          current.relationshipId,
        ),
      );
    const [receipt] = await database
      .select()
      .from(accessLifecycleCommandReceipts)
      .where(eq(accessLifecycleCommandReceipts.commandId, command.commandId));
    const [outbox] = await database
      .select()
      .from(outboxEvents)
      .where(eq(outboxEvents.id, initialResult.eventId));

    expect(event).toMatchObject({
      organizationId: current.organizationId,
      accountId: current.accountId,
      resultingState: "active",
      revision: 1,
      approvalId: current.approval.id,
    });
    expect(projection).toMatchObject({
      relationshipId: current.relationshipId,
      state: "active",
      revision: 1,
      lastEventId: event!.id,
    });
    expect(receipt).toMatchObject({ eventId: event!.id, revision: 1 });
    expect(outbox?.payload).toEqual({
      eventId: event!.id,
      relationshipId: current.relationshipId,
      revision: 1,
      state: "active",
    });
    await expect(
      database
        .update(membershipLifecycleEvents)
        .set({ resultingState: "revoked" })
        .where(eq(membershipLifecycleEvents.id, event!.id)),
    ).rejects.toThrow();
  });

  it("serializes competing successors and rejects an incompatible command-id replay without a partial projection", async () => {
    const current = fixture();
    await persistApproval(current.approval);
    const grant = current.command({
      eventType: "granted",
      expectedRevision: null,
    });
    await persistence.apply({
      actor: {
        accountId: grant.operatorAccountId,
        organizationId: current.organizationId,
      },
      command: grant,
      transition: deriveAccessLifecycleTransition({
        command: grant,
        current: null,
        approval: current.approval,
      }),
      approval: current.approval,
      commandFingerprint: `fingerprint-${grant.commandId}`,
    });

    const first = current.command({
      eventType: "revoked",
      expectedRevision: 1,
    });
    const second = current.command({
      eventType: "suspended",
      expectedRevision: 1,
    });
    const apply = (command: AccessLifecycleCommand) =>
      persistence.apply({
        actor: {
          accountId: command.operatorAccountId,
          organizationId: current.organizationId,
        },
        command,
        transition: deriveAccessLifecycleTransition({
          command,
          current: {
            relationshipId: current.relationshipId,
            organizationId: current.organizationId,
            subjectAccountId: current.accountId,
            scope: current.scope,
            state: "active",
            revision: 1,
            effectiveAt: occurredAt,
            expiresAt: null,
            lastEventId: crypto.randomUUID(),
          },
          approval: null,
        }),
        approval: null,
        commandFingerprint: `fingerprint-${command.commandId}`,
      });

    const outcomes = await Promise.allSettled([apply(first), apply(second)]);
    expect(
      outcomes.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    expect(
      outcomes.filter((result) => result.status === "rejected"),
    ).toHaveLength(1);

    const replay = {
      ...grant,
      reasonCode: "different_synthetic_reason",
    };
    await expect(
      persistence.apply({
        actor: {
          accountId: grant.operatorAccountId,
          organizationId: current.organizationId,
        },
        command: replay,
        transition: deriveAccessLifecycleTransition({
          command: replay,
          current: null,
          approval: current.approval,
        }),
        approval: current.approval,
        commandFingerprint: "incompatible-fingerprint",
      }),
    ).rejects.toBeInstanceOf(AccessLifecycleConflictError);

    const projections = await database
      .select()
      .from(effectiveOrganizationMemberships)
      .where(
        and(
          eq(
            effectiveOrganizationMemberships.organizationId,
            current.organizationId,
          ),
          eq(effectiveOrganizationMemberships.accountId, current.accountId),
        ),
      );
    expect(projections).toHaveLength(1);
    expect(projections[0]!.revision).toBe(2);
  });

  it("refuses a new restricted-resource grant without an active effective membership", async () => {
    const current = fixture({
      kind: "restricted_resource_grant",
      resource: {
        type: "synthetic-restricted-resource",
        id: "synthetic-restricted-resource-001",
      },
      operation: "view",
    });
    await persistApproval(current.approval);
    const command = current.command({
      eventType: "granted",
      expectedRevision: null,
    });

    await expect(
      persistence.apply({
        actor: {
          accountId: command.operatorAccountId,
          organizationId: current.organizationId,
        },
        command,
        transition: deriveAccessLifecycleTransition({
          command,
          current: null,
          approval: current.approval,
        }),
        approval: current.approval,
        commandFingerprint: `fingerprint-${command.commandId}`,
      }),
    ).rejects.toBeInstanceOf(AccessLifecycleConflictError);
  });

  it("rebuilds a scoped effective projection from its immutable ledger and safely no-ops without events", async () => {
    const current = fixture();
    await persistApproval(current.approval);
    const command = current.command({
      eventType: "granted",
      expectedRevision: null,
    });
    const result = await persistence.apply({
      actor: {
        accountId: command.operatorAccountId,
        organizationId: current.organizationId,
      },
      command,
      transition: deriveAccessLifecycleTransition({
        command,
        current: null,
        approval: current.approval,
      }),
      approval: current.approval,
      commandFingerprint: "fingerprint-" + command.commandId,
    });

    await database
      .delete(effectiveOrganizationMemberships)
      .where(
        eq(
          effectiveOrganizationMemberships.relationshipId,
          current.relationshipId,
        ),
      );
    await expect(
      rebuildEffectiveAccessProjections(database, {
        organizationId: current.organizationId,
        actor: {
          accountId: "synthetic-recovery-operator",
          reasonCode: "synthetic_projection_recovery",
        },
      }),
    ).resolves.toEqual({ membershipCount: 1, grantCount: 0 });
    const [projection] = await database
      .select()
      .from(effectiveOrganizationMemberships)
      .where(
        eq(
          effectiveOrganizationMemberships.relationshipId,
          current.relationshipId,
        ),
      );
    expect(projection).toMatchObject({
      state: "active",
      revision: result.revision,
      lastEventId: result.eventId,
    });
    await expect(
      rebuildEffectiveAccessProjections(database, {
        organizationId: "synthetic-empty-org-" + crypto.randomUUID(),
        actor: {
          accountId: "synthetic-recovery-operator",
          reasonCode: "synthetic_projection_recovery",
        },
      }),
    ).resolves.toEqual({ membershipCount: 0, grantCount: 0 });

    // A privileged recovery operation that leaves no trace of who ran it is
    // the least defensible gap in an otherwise fully audited write path.
    await expect(
      rebuildEffectiveAccessProjections(database, {
        organizationId: current.organizationId,
        actor: { accountId: "  ", reasonCode: "" },
      }),
    ).rejects.toThrow();

    const [rebuildAudit] = await database
      .select()
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.action, "access_lifecycle.projection_rebuild"),
          eq(auditEvents.resourceId, current.organizationId),
        ),
      );
    expect(rebuildAudit).toMatchObject({
      actorAccountId: "synthetic-recovery-operator",
      resourceType: "organization",
    });
  });

  it("spends an approval on one grant so it cannot back a second (FR-003)", async () => {
    const current = fixture();
    await persistApproval(current.approval);

    const applyGrant = async (relationshipId: string) => {
      const command = {
        ...current.command({ eventType: "granted", expectedRevision: null }),
        relationshipId,
      };
      return persistence.apply({
        actor: {
          accountId: command.operatorAccountId,
          organizationId: current.organizationId,
        },
        command,
        transition: deriveAccessLifecycleTransition({
          command,
          current: null,
          approval: current.approval,
        }),
        approval: current.approval,
        commandFingerprint: `fingerprint-${command.commandId}`,
      });
    };

    await expect(applyGrant(current.relationshipId)).resolves.toMatchObject({
      revision: 1,
      state: "active",
    });

    // A second relationship citing the same approval. The domain accepts it —
    // subject and scope still match — so the single-use guarantee has to hold
    // where the event is written. Without it, an approver authorising one
    // grant silently backs an unlimited series.
    await expect(applyGrant(crypto.randomUUID())).rejects.toThrow();
  });
});
