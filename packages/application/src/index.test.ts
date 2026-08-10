import { describe, expect, it, vi } from "vitest";
import type { AggregateId, DomainEvent } from "@lexgate/domain";
import { recordMaterialTransition } from "./index.js";

const actor = {
  accountId: "synthetic-account-001",
  organizationId: "synthetic-organization-001",
};

const resource = {
  type: "m0-foundation-transition",
  id: "synthetic-resource-001",
};

const event: DomainEvent<"M0TransitionRecorded", { synthetic: true }> = {
  id: "00000000-0000-4000-8000-000000000001",
  type: "M0TransitionRecorded",
  aggregateId: "synthetic-aggregate-001" as AggregateId,
  occurredAt: new Date("2026-08-09T00:00:00.000Z"),
  payload: { synthetic: true },
};

describe("recordMaterialTransition", () => {
  it("authorizes before atomically recording the audit and outbox intent (ARC-OUT-001)", async () => {
    const callOrder: string[] = [];
    const authorization = {
      assertAuthorized: vi.fn(async () => {
        callOrder.push("authorization");
      }),
    };
    const persistence = {
      record: vi.fn(async () => {
        callOrder.push("persistence");
      }),
    };

    await recordMaterialTransition({
      actor,
      action: "RecordM0FoundationTransition",
      resource,
      event,
      authorization,
      persistence,
    });

    expect(callOrder).toEqual(["authorization", "persistence"]);
    expect(persistence.record).toHaveBeenCalledWith({
      actor,
      action: "RecordM0FoundationTransition",
      resource,
      event,
    });
  });

  it("does not persist anything when authorization rejects the explicit command", async () => {
    const persistence = { record: vi.fn() };

    await expect(
      recordMaterialTransition({
        actor,
        action: "RecordM0FoundationTransition",
        resource,
        event,
        authorization: {
          assertAuthorized: vi.fn(async () => {
            throw new Error("Synthetic authorization denial");
          }),
        },
        persistence,
      }),
    ).rejects.toThrow("Synthetic authorization denial");

    expect(persistence.record).not.toHaveBeenCalled();
  });
});
