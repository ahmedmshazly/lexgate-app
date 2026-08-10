import type { EffectiveLegalHold, LegalHoldCommand } from "@lexgate/domain";
import { describe, expect, it, vi } from "vitest";
import type { LegalHoldPersistencePort } from "./records-lifecycle.js";
import {
  applyLegalHoldCommand,
  eraseSubjectCommand,
  mayDestroyRecord,
} from "./records-lifecycle.js";

const organizationId = "synthetic-organization-records";
const operatorAccountId = "synthetic-records-officer";
const occurredAt = new Date("2026-08-10T12:00:00.000Z");
const resource = {
  resourceType: "party",
  resourceId: "00000000-0000-4000-8000-000000000701",
};

const command = (
  overrides: Partial<LegalHoldCommand> = {},
): LegalHoldCommand => ({
  holdId: "00000000-0000-4000-8000-000000000702",
  organizationId,
  resource,
  eventType: "placed",
  expectedRevision: null,
  operatorAccountId,
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
  lastEventId: "00000000-0000-4000-8000-000000000703",
};

const persistence = (
  overrides: Partial<LegalHoldPersistencePort> = {},
): LegalHoldPersistencePort => ({
  applyLegalHold: vi
    .fn()
    .mockResolvedValue({ eventId: "synthetic-event", revision: 1 }),
  readHolds: vi.fn().mockResolvedValue([]),
  eraseSubject: vi.fn().mockResolvedValue({ outcome: "erased" }),
  ...overrides,
});

const actor = { accountId: operatorAccountId, organizationId };

describe("legal hold orchestration", () => {
  it("records a hold for a trusted operator", async () => {
    await expect(
      applyLegalHoldCommand({
        actor,
        command: command(),
        persistence: persistence(),
      }),
    ).resolves.toMatchObject({ outcome: "recorded", revision: 1 });
  });

  it("refuses a hold recorded in another operator's name", async () => {
    const port = persistence();

    await expect(
      applyLegalHoldCommand({
        actor: { accountId: "synthetic-other-operator", organizationId },
        command: command(),
        persistence: port,
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
    expect(port.applyLegalHold).not.toHaveBeenCalled();
  });

  it("refuses a hold outside the operator's organization", async () => {
    await expect(
      applyLegalHoldCommand({
        actor: { accountId: operatorAccountId, organizationId: "other-org" },
        command: command(),
        persistence: persistence(),
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });
  });

  it("returns a generic failure rather than an enumeration oracle", async () => {
    // Releasing a hold that was never placed must not tell the caller that it
    // does not exist. The reason goes to the audit trail, not the requester.
    await expect(
      applyLegalHoldCommand({
        actor,
        command: command({ eventType: "released", expectedRevision: 1 }),
        persistence: persistence(),
      }),
    ).resolves.toEqual({
      outcome: "invalid",
      reason: "invalid_legal_hold_command",
    });
  });
});

describe("erasure orchestration (FR-003, FR-004)", () => {
  it("propagates a hold refusal unchanged and never reaches persistence", async () => {
    const port = persistence({
      readHolds: vi.fn().mockResolvedValue([activeHold]),
    });

    await expect(
      eraseSubjectCommand({
        actor,
        subjectId: resource.resourceId,
        reasonCode: "synthetic_erasure_request",
        persistence: port,
      }),
    ).resolves.toEqual({ outcome: "refused", reason: "held" });

    // The refusal is final. This layer never retries past one, and never
    // converts one into a success.
    expect(port.eraseSubject).not.toHaveBeenCalled();
  });

  it("erases once no active hold covers the subject", async () => {
    const port = persistence({
      readHolds: vi
        .fn()
        .mockResolvedValue([{ ...activeHold, state: "released" }]),
    });

    await expect(
      eraseSubjectCommand({
        actor,
        subjectId: resource.resourceId,
        reasonCode: "synthetic_erasure_request",
        persistence: port,
      }),
    ).resolves.toEqual({ outcome: "erased" });
  });

  it("honours a refusal raised by persistence itself", async () => {
    // A hold placed between this layer's check and the write is still caught,
    // because persistence re-checks inside its own transaction.
    const port = persistence({
      readHolds: vi.fn().mockResolvedValue([]),
      eraseSubject: vi
        .fn()
        .mockResolvedValue({ outcome: "refused", reason: "held" }),
    });

    await expect(
      eraseSubjectCommand({
        actor,
        subjectId: resource.resourceId,
        reasonCode: "synthetic_erasure_request",
        persistence: port,
      }),
    ).resolves.toEqual({ outcome: "refused", reason: "held" });
  });
});

describe("destruction is answerable without attempting it (FR-005)", () => {
  it("reports a hold ahead of the shut gate", () => {
    expect(mayDestroyRecord({ resource, holds: [activeHold] })).toEqual({
      outcome: "refused",
      reason: "held",
    });
  });

  it("reports the shut gate when nothing is held", () => {
    expect(mayDestroyRecord({ resource, holds: [] })).toEqual({
      outcome: "refused",
      reason: "gate_g6_closed",
    });
  });
});
