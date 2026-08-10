import { describe, expect, it } from "vitest";
import type {
  EffectiveLegalHold,
  LegalHoldCommand,
} from "./records-lifecycle.js";
import {
  deriveLegalHoldTransition,
  evaluateRecordDestruction,
  evaluateSubjectErasure,
  isResourceHeld,
  RecordsLifecycleValidationError,
} from "./records-lifecycle.js";

const organizationId = "synthetic-organization-records";
const occurredAt = new Date("2026-08-10T12:00:00.000Z");
const resource = {
  resourceType: "party",
  resourceId: "00000000-0000-4000-8000-000000000601",
};

const command = (
  overrides: Partial<LegalHoldCommand> = {},
): LegalHoldCommand => ({
  holdId: "00000000-0000-4000-8000-000000000602",
  organizationId,
  resource,
  eventType: "placed",
  expectedRevision: null,
  operatorAccountId: "synthetic-records-officer",
  reasonCode: "synthetic_litigation_hold",
  correlationId: "synthetic-correlation-records",
  occurredAt,
  ...overrides,
});

const activeHold: EffectiveLegalHold = {
  holdId: command().holdId,
  organizationId,
  resource,
  state: "active",
  revision: 1,
  placedAt: occurredAt,
  releasedAt: null,
  lastEventId: "00000000-0000-4000-8000-000000000603",
};

describe("legal hold transitions (FR-001, FR-002)", () => {
  it("places a hold as a first revision", () => {
    expect(
      deriveLegalHoldTransition({ command: command(), current: null }),
    ).toMatchObject({
      eventType: "placed",
      resultingState: "active",
      priorRevision: null,
      revision: 1,
    });
  });

  it("records a release as a successor fact, never an edit", () => {
    const transition = deriveLegalHoldTransition({
      command: command({ eventType: "released", expectedRevision: 1 }),
      current: activeHold,
    });

    expect(transition).toMatchObject({
      eventType: "released",
      resultingState: "released",
      priorRevision: 1,
      revision: 2,
    });
  });

  it("refuses to release a hold that was never placed", () => {
    expect(() =>
      deriveLegalHoldTransition({
        command: command({ eventType: "released", expectedRevision: 1 }),
        current: null,
      }),
    ).toThrow(RecordsLifecycleValidationError);
  });

  it("refuses a stale release", () => {
    expect(() =>
      deriveLegalHoldTransition({
        command: command({ eventType: "released", expectedRevision: 5 }),
        current: activeHold,
      }),
    ).toThrow(RecordsLifecycleValidationError);
  });

  it("refuses to release an already-released hold", () => {
    expect(() =>
      deriveLegalHoldTransition({
        command: command({ eventType: "released", expectedRevision: 2 }),
        current: { ...activeHold, state: "released", revision: 2 },
      }),
    ).toThrow(RecordsLifecycleValidationError);
  });

  it("refuses a hold nobody is accountable for", () => {
    // A hold with no operator or no reason cannot be reviewed, and review is
    // its whole purpose.
    expect(() =>
      deriveLegalHoldTransition({
        command: command({ operatorAccountId: "  " }),
        current: null,
      }),
    ).toThrow(RecordsLifecycleValidationError);
    expect(() =>
      deriveLegalHoldTransition({
        command: command({ reasonCode: "" }),
        current: null,
      }),
    ).toThrow(RecordsLifecycleValidationError);
  });

  it("keeps concurrent holds independent of each other", () => {
    const second: EffectiveLegalHold = {
      ...activeHold,
      holdId: "00000000-0000-4000-8000-000000000604",
      state: "released",
    };

    // One hold released, another still active: the resource stays held.
    expect(isResourceHeld(resource, [activeHold, second])).toBe(true);
    expect(
      isResourceHeld(resource, [{ ...activeHold, state: "released" }, second]),
    ).toBe(false);
  });
});

describe("record destruction is always refused (FR-005, SC-001)", () => {
  const base = {
    resource,
    hasApprovedRetentionSchedule: false,
    recordsGateOpen: false,
  };

  it("refuses a held record and names the hold", () => {
    expect(evaluateRecordDestruction({ ...base, holds: [activeHold] })).toEqual(
      { outcome: "refused", reason: "held" },
    );
  });

  it("refuses an unheld record because the records gate is shut", () => {
    expect(evaluateRecordDestruction({ ...base, holds: [] })).toEqual({
      outcome: "refused",
      reason: "gate_g6_closed",
    });
  });

  it("reports a hold ahead of the shut gate", () => {
    // These become different answers once G6 opens, so a reader must be able
    // to tell them apart now.
    expect(
      evaluateRecordDestruction({
        ...base,
        holds: [activeHold],
        recordsGateOpen: true,
      }).reason,
    ).toBe("held");
  });

  it("still refuses even if the gate opened, for want of a schedule", () => {
    expect(
      evaluateRecordDestruction({
        ...base,
        holds: [],
        recordsGateOpen: true,
      }),
    ).toEqual({ outcome: "refused", reason: "no_approved_retention_schedule" });
  });

  it("has no input combination that permits destruction", () => {
    for (const recordsGateOpen of [true, false]) {
      for (const hasApprovedRetentionSchedule of [true, false]) {
        for (const holds of [[], [activeHold]]) {
          expect(
            evaluateRecordDestruction({
              resource,
              holds,
              hasApprovedRetentionSchedule,
              recordsGateOpen,
            }).outcome,
          ).toBe("refused");
        }
      }
    }
  });
});

describe("erasure cannot be authorised past a hold (FR-003, FR-004, SC-002)", () => {
  it("refuses erasure of a held subject", () => {
    expect(
      evaluateSubjectErasure({ subject: resource, holds: [activeHold] }),
    ).toEqual({ outcome: "refused", reason: "held" });
  });

  it("permits erasure once no active hold covers the subject", () => {
    expect(
      evaluateSubjectErasure({
        subject: resource,
        holds: [{ ...activeHold, state: "released" }],
      }),
    ).toEqual({ outcome: "permitted" });
  });

  it("takes no operator, role, or authority as an input", () => {
    // This is the structural guarantee behind FR-004: there is no argument a
    // privileged actor could supply that changes the answer, because
    // authority is not part of the decision at all.
    expect(evaluateSubjectErasure.length).toBe(1);

    const decision = evaluateSubjectErasure({
      subject: resource,
      holds: [activeHold],
    });
    expect(decision).toEqual({ outcome: "refused", reason: "held" });
  });
});
