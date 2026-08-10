import { describe, expect, it, vi } from "vitest";
import {
  applyAccessLifecycleCommand,
  AccessLifecyclePersistenceConflictError,
  type AccessLifecycleCommandInput,
} from "./access-lifecycle.js";

const occurredAt = new Date("2026-08-10T12:00:00.000Z");
const organizationId = "synthetic-organization-access-lifecycle";
const subjectAccountId = "synthetic-subject-access-lifecycle";
const approval = {
  id: "00000000-0000-4000-8000-000000000403",
  organizationId,
  requesterAccountId: "synthetic-requester-access-lifecycle",
  approverAccountId: "synthetic-approver-access-lifecycle",
  subjectAccountId,
  scope: { kind: "membership" as const },
  approvedAt: occurredAt,
  expiresAt: new Date("2026-08-17T12:00:00.000Z"),
  correlationId: "synthetic-correlation-access-lifecycle",
  reasonCode: "approved_synthetic_access",
};

const input = (): AccessLifecycleCommandInput => ({
  actor: {
    accountId: "synthetic-operator-access-lifecycle",
    organizationId,
  },
  command: {
    commandId: "00000000-0000-4000-8000-000000000404",
    correlationId: "synthetic-correlation-access-lifecycle",
    relationshipId: "00000000-0000-4000-8000-000000000401",
    organizationId,
    subjectAccountId,
    operatorAccountId: "synthetic-operator-access-lifecycle",
    scope: { kind: "membership" },
    eventType: "granted",
    expectedRevision: null,
    occurredAt,
    effectiveAt: occurredAt,
    // A grant may not outlive the approval that authorised it.
    expiresAt: approval.expiresAt,
    reasonCode: "approved_synthetic_access",
    approvalId: approval.id,
  },
  authorization: { canAdminister: vi.fn(async () => true) },
  approvals: { readApproval: vi.fn(async () => approval) },
  persistence: {
    readEffectiveRelationship: vi.fn(async () => null),
    apply: vi.fn(async () => ({
      relationshipId: "00000000-0000-4000-8000-000000000401",
      eventId: "00000000-0000-4000-8000-000000000404",
      revision: 1,
      state: "active" as const,
      replayed: false,
    })),
  },
  sessionInvalidation: { record: vi.fn(async () => undefined) },
});

describe("access lifecycle commands", () => {
  it("uses trusted server-side administrator authority and persists an approved exact-scope command", async () => {
    const commandInput = input();

    await expect(applyAccessLifecycleCommand(commandInput)).resolves.toEqual({
      outcome: "applied",
      result: expect.objectContaining({ state: "active", replayed: false }),
    });
    expect(commandInput.authorization.canAdminister).toHaveBeenCalled();
    expect(commandInput.persistence.apply).toHaveBeenCalled();
  });

  it("returns only a generic denial for unauthorized administration without writing lifecycle state", async () => {
    const commandInput = input();
    commandInput.authorization.canAdminister = vi.fn(async () => false);

    await expect(applyAccessLifecycleCommand(commandInput)).resolves.toEqual({
      outcome: "denied",
      reason: "not_authorized",
    });
    expect(commandInput.persistence.apply).not.toHaveBeenCalled();
  });

  it("fails invalid expired approvals before persistence", async () => {
    const commandInput = input();
    commandInput.approvals.readApproval = vi.fn(async () => ({
      ...approval,
      expiresAt: occurredAt,
    }));

    await expect(applyAccessLifecycleCommand(commandInput)).resolves.toEqual({
      outcome: "invalid",
      reason: "invalid_access_lifecycle_command",
    });
    expect(commandInput.persistence.apply).not.toHaveBeenCalled();
  });

  it("returns a generic conflict when durable state changed after the trusted read", async () => {
    const commandInput = input();
    commandInput.persistence.apply = vi.fn(async () => {
      throw new AccessLifecyclePersistenceConflictError("stale_state");
    });

    await expect(applyAccessLifecycleCommand(commandInput)).resolves.toEqual({
      outcome: "conflict",
      reason: "stale_state",
    });
    expect(commandInput.sessionInvalidation.record).not.toHaveBeenCalled();
  });
});
