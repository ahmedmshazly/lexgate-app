import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import type { AggregateId, DomainEvent } from "@lexgate/domain";
import { createMaterialTransitionPersistencePort } from "./material-transition.js";
import { auditEvents, outboxEvents } from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for ARC-OUT-001 integration tests. Start local PostgreSQL before running them.",
  );
}

const client = postgres(databaseUrl, { max: 1 });
const database = drizzle({ client });
const persistence = createMaterialTransitionPersistencePort(database);

const createEvent = (
  id: string,
): DomainEvent<"M0TransitionRecorded", { synthetic: true }> => ({
  id,
  type: "M0TransitionRecorded",
  aggregateId: "synthetic-aggregate-001" as AggregateId,
  occurredAt: new Date("2026-08-09T00:00:00.000Z"),
  payload: { synthetic: true },
});

const createInput = (resourceId: string, eventId: string) => ({
  actor: {
    accountId: "synthetic-account-001",
    organizationId: "synthetic-organization-001",
  },
  action: "RecordM0FoundationTransition",
  resource: { type: "m0-foundation-transition", id: resourceId },
  event: createEvent(eventId),
});

describe("PostgreSQL material transition persistence", () => {
  beforeEach(async () => {
    await database.delete(outboxEvents);
    await database.delete(auditEvents);
  });

  afterAll(async () => {
    await client.end({ timeout: 5 });
  });

  it("commits the synthetic audit and outbox records together (ARC-OUT-001)", async () => {
    const input = createInput(
      "synthetic-resource-success",
      "00000000-0000-4000-8000-000000000011",
    );

    await persistence.record(input);

    const audits = await database
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.resourceId, input.resource.id));
    const outbox = await database
      .select()
      .from(outboxEvents)
      .where(eq(outboxEvents.id, input.event.id));

    expect(audits).toHaveLength(1);
    expect(outbox).toHaveLength(1);
    expect(outbox[0]).toMatchObject({
      id: input.event.id,
      type: input.event.type,
      aggregateId: input.event.aggregateId,
      payload: input.event.payload,
      attempts: 0,
      lastAttemptedAt: null,
      lastError: null,
      publishedAt: null,
    });
  });

  it("rolls back the audit insert when the outbox event identifier conflicts", async () => {
    const duplicateEventId = "00000000-0000-4000-8000-000000000022";
    await persistence.record(
      createInput("synthetic-resource-existing", duplicateEventId),
    );
    const conflictingInput = createInput(
      "synthetic-resource-rolled-back",
      duplicateEventId,
    );

    await expect(persistence.record(conflictingInput)).rejects.toThrow();

    const rolledBackAudits = await database
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.resourceId, conflictingInput.resource.id));
    const outbox = await database
      .select()
      .from(outboxEvents)
      .where(eq(outboxEvents.id, duplicateEventId));

    expect(rolledBackAudits).toEqual([]);
    expect(outbox).toHaveLength(1);
  });
});
