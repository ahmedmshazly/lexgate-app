import type { MaterialTransitionPersistencePort } from "@lexgate/application";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { auditEvents, outboxEvents } from "./schema.js";

type Database = PostgresJsDatabase;

/**
 * M0 persistence boundary for a material transition. The database transaction
 * owns both writes so an outbox failure cannot leave an unpaired audit record.
 */
export const createMaterialTransitionPersistencePort = (
  database: Database,
): MaterialTransitionPersistencePort => ({
  async record(input) {
    await database.transaction(async (transaction) => {
      await transaction.insert(auditEvents).values({
        id: crypto.randomUUID(),
        actorAccountId: input.actor.accountId,
        action: input.action,
        resourceType: input.resource.type,
        resourceId: input.resource.id,
        occurredAt: input.event.occurredAt,
      });
      await transaction.insert(outboxEvents).values({
        id: input.event.id,
        type: input.event.type,
        aggregateId: input.event.aggregateId,
        payload: input.event.payload,
        occurredAt: input.event.occurredAt,
        attempts: 0,
        lastAttemptedAt: null,
        lastError: null,
        publishedAt: null,
      });
    });
  },
});
