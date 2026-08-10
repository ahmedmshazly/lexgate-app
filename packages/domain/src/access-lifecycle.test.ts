import { describe, expect, it } from "vitest";
import {
  AccessLifecycleValidationError,
  deriveAccessLifecycleTransition,
  type AccessApprovalRecord,
  type AccessLifecycleCommand,
} from "./access-lifecycle.js";

const organizationId = "synthetic-organization-access-lifecycle";
const requesterAccountId = "synthetic-requester-access-lifecycle";
const approverAccountId = "synthetic-approver-access-lifecycle";
const subjectAccountId = "synthetic-subject-access-lifecycle";
const operatorAccountId = "synthetic-operator-access-lifecycle";
const occurredAt = new Date("2026-08-10T12:00:00.000Z");

const approval: AccessApprovalRecord = {
  id: "00000000-0000-4000-8000-000000000403",
  organizationId,
  requesterAccountId,
  approverAccountId,
  subjectAccountId,
  scope: { kind: "membership" },
  approvedAt: occurredAt,
  expiresAt: new Date("2026-08-17T12:00:00.000Z"),
  correlationId: "synthetic-correlation-access-lifecycle",
  reasonCode: "approved_synthetic_access",
};

const command = (
  overrides: Partial<AccessLifecycleCommand> = {},
): AccessLifecycleCommand => ({
  commandId: "00000000-0000-4000-8000-000000000404",
  correlationId: "synthetic-correlation-access-lifecycle",
  relationshipId: "00000000-0000-4000-8000-000000000401",
  organizationId,
  subjectAccountId,
  operatorAccountId,
  scope: { kind: "membership" },
  eventType: "granted",
  expectedRevision: null,
  occurredAt,
  effectiveAt: occurredAt,
  expiresAt: null,
  reasonCode: "approved_synthetic_access",
  approvalId: approval.id,
  ...overrides,
});

describe("access lifecycle domain transitions", () => {
  it("creates an active initial membership only from a matching, unexpired, distinct approval", () => {
    expect(
      deriveAccessLifecycleTransition({
        command: command(),
        current: null,
        approval,
      }),
    ).toMatchObject({
      eventType: "granted",
      resultingState: "active",
      priorRevision: null,
      revision: 1,
      requesterAccountId,
      approverAccountId,
    });
  });

  it("models suspension, reinstatement, revocation, expiry, correction, and offboarding as successor facts", () => {
    const current = {
      relationshipId: command().relationshipId,
      organizationId,
      subjectAccountId,
      scope: { kind: "membership" as const },
      state: "active" as const,
      revision: 1,
      effectiveAt: occurredAt,
      expiresAt: null,
      lastEventId: "00000000-0000-4000-8000-000000000405",
    };

    expect(
      deriveAccessLifecycleTransition({
        command: command({
          eventType: "suspended",
          expectedRevision: 1,
          approvalId: null,
        }),
        current,
        approval: null,
      }),
    ).toMatchObject({ resultingState: "suspended", revision: 2 });

    expect(
      deriveAccessLifecycleTransition({
        command: command({
          eventType: "reinstated",
          expectedRevision: 2,
          approvalId: approval.id,
        }),
        current: { ...current, state: "suspended", revision: 2 },
        approval,
      }),
    ).toMatchObject({ resultingState: "active", revision: 3 });

    expect(
      deriveAccessLifecycleTransition({
        command: command({
          eventType: "revoked",
          expectedRevision: 1,
          approvalId: null,
        }),
        current,
        approval: null,
      }),
    ).toMatchObject({ resultingState: "revoked", revision: 2 });

    expect(
      deriveAccessLifecycleTransition({
        command: command({
          eventType: "expired",
          expectedRevision: 1,
          approvalId: null,
        }),
        current,
        approval: null,
      }),
    ).toMatchObject({ resultingState: "expired", revision: 2 });

    expect(
      deriveAccessLifecycleTransition({
        command: command({
          eventType: "corrected",
          expectedRevision: 1,
          approvalId: approval.id,
        }),
        current,
        approval,
      }),
    ).toMatchObject({ resultingState: "active", revision: 2 });

    expect(
      deriveAccessLifecycleTransition({
        command: command({
          eventType: "offboarded",
          expectedRevision: 1,
          approvalId: null,
        }),
        current,
        approval: null,
      }),
    ).toMatchObject({ resultingState: "offboarded", revision: 2 });
  });

  it("rejects self-expansion, expired/mismatched approval, stale revisions, and invalid predecessor states", () => {
    expect(() =>
      deriveAccessLifecycleTransition({
        command: command(),
        current: null,
        approval: { ...approval, approverAccountId: subjectAccountId },
      }),
    ).toThrow(AccessLifecycleValidationError);

    expect(() =>
      deriveAccessLifecycleTransition({
        command: command(),
        current: null,
        approval: { ...approval, expiresAt: occurredAt },
      }),
    ).toThrow(AccessLifecycleValidationError);

    expect(() =>
      deriveAccessLifecycleTransition({
        command: command({ expectedRevision: 1 }),
        current: null,
        approval,
      }),
    ).toThrow(AccessLifecycleValidationError);

    expect(() =>
      deriveAccessLifecycleTransition({
        command: command({
          eventType: "reinstated",
          expectedRevision: 1,
        }),
        current: {
          relationshipId: command().relationshipId,
          organizationId,
          subjectAccountId,
          scope: { kind: "membership" },
          state: "active",
          revision: 1,
          effectiveAt: occurredAt,
          expiresAt: null,
          lastEventId: "00000000-0000-4000-8000-000000000405",
        },
        approval,
      }),
    ).toThrow(AccessLifecycleValidationError);
  });
});
