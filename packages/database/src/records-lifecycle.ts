import type {
  EffectiveLegalHold,
  HeldResource,
  LegalHoldCommand,
  LegalHoldTransition,
} from "@lexgate/domain";
import {
  deriveLegalHoldTransition,
  evaluateRecordDestruction,
} from "@lexgate/domain";
import { and, asc, eq, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  auditEvents,
  effectiveLegalHolds,
  legalHoldEvents,
  subjectEncryptionKeys,
} from "./schema.js";
import { createSubjectKey } from "./subject-keys.js";

type Database = PostgresJsDatabase;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

const asHoldState = (value: string): EffectiveLegalHold["state"] => {
  if (value === "active" || value === "released") return value;
  throw new Error("A legal hold projection has an invalid state.");
};

const asEffectiveHold = (
  row: typeof effectiveLegalHolds.$inferSelect,
): EffectiveLegalHold => ({
  holdId: row.holdId,
  organizationId: row.organizationId,
  resource: { resourceType: row.resourceType, resourceId: row.resourceId },
  state: asHoldState(row.state),
  revision: row.revision,
  placedAt: row.placedAt,
  releasedAt: row.releasedAt,
  lastEventId: row.lastEventId,
});

const readHoldsForResource = async (
  transaction: Transaction,
  organizationId: string,
  resource: HeldResource,
): Promise<EffectiveLegalHold[]> => {
  const rows = await transaction
    .select()
    .from(effectiveLegalHolds)
    .where(
      and(
        eq(effectiveLegalHolds.organizationId, organizationId),
        eq(effectiveLegalHolds.resourceType, resource.resourceType),
        eq(effectiveLegalHolds.resourceId, resource.resourceId),
      ),
    );

  return rows.map(asEffectiveHold);
};

export const createRecordsLifecyclePersistencePort = (database: Database) => ({
  /**
   * Applies a hold placement or release. The ledger row, the projection, and
   * the audit row commit together or not at all.
   */
  async applyLegalHold(input: {
    actor: { accountId: string; organizationId: string };
    command: LegalHoldCommand;
    transition: LegalHoldTransition;
  }): Promise<{ eventId: string; revision: number }> {
    const { actor, command } = input;
    if (actor.organizationId !== command.organizationId) {
      throw new Error(
        "A legal hold command must stay within its organization.",
      );
    }

    return database.transaction(
      async (transaction) => {
        await transaction.execute(
          sql`select pg_advisory_xact_lock(hashtext(${command.holdId}))`,
        );

        const [current] = await transaction
          .select()
          .from(effectiveLegalHolds)
          .where(eq(effectiveLegalHolds.holdId, command.holdId));

        // Re-derive inside the lock so a concurrent writer cannot slip a
        // successor between the caller's read and this write.
        const transition = deriveLegalHoldTransition({
          command,
          current: current ? asEffectiveHold(current) : null,
        });

        const eventId = crypto.randomUUID();
        await transaction.insert(legalHoldEvents).values({
          id: eventId,
          holdId: transition.holdId,
          organizationId: transition.organizationId,
          resourceType: transition.resource.resourceType,
          resourceId: transition.resource.resourceId,
          eventType: transition.eventType,
          priorRevision: transition.priorRevision,
          revision: transition.revision,
          operatorAccountId: transition.operatorAccountId,
          reasonCode: transition.reasonCode,
          correlationId: transition.correlationId,
          occurredAt: transition.occurredAt,
        });

        if (transition.eventType === "placed") {
          await transaction.insert(effectiveLegalHolds).values({
            holdId: transition.holdId,
            organizationId: transition.organizationId,
            resourceType: transition.resource.resourceType,
            resourceId: transition.resource.resourceId,
            state: transition.resultingState,
            revision: transition.revision,
            placedAt: transition.occurredAt,
            releasedAt: null,
            lastEventId: eventId,
          });
        } else {
          await transaction
            .update(effectiveLegalHolds)
            .set({
              state: transition.resultingState,
              revision: transition.revision,
              releasedAt: transition.occurredAt,
              lastEventId: eventId,
            })
            .where(eq(effectiveLegalHolds.holdId, transition.holdId));
        }

        await transaction.insert(auditEvents).values({
          id: crypto.randomUUID(),
          actorAccountId: transition.operatorAccountId,
          action: `legal_hold.${transition.eventType}`,
          resourceType: transition.resource.resourceType,
          resourceId: transition.resource.resourceId,
          occurredAt: transition.occurredAt,
        });

        return { eventId, revision: transition.revision };
      },
      { isolationLevel: "serializable", accessMode: "read write" },
    );
  },

  async readHolds(input: {
    organizationId: string;
    resource: HeldResource;
  }): Promise<EffectiveLegalHold[]> {
    return database.transaction(async (transaction) =>
      readHoldsForResource(transaction, input.organizationId, input.resource),
    );
  },

  /** Creates the key that makes a subject's personal data readable. */
  async ensureSubjectKey(input: {
    subjectId: string;
    organizationId: string;
  }): Promise<void> {
    await database
      .insert(subjectEncryptionKeys)
      .values({
        subjectId: input.subjectId,
        organizationId: input.organizationId,
        keyMaterial: createSubjectKey(),
        createdAt: new Date(),
      })
      .onConflictDoNothing();
  },

  /**
   * Erasure. Destroys the key, never the record.
   *
   * The hold check runs inside the transaction against current state, so a
   * hold placed between a caller's check and this call still stops it.
   */
  async eraseSubject(input: {
    subjectId: string;
    organizationId: string;
    actor: { accountId: string; reasonCode: string };
  }): Promise<
    | { outcome: "erased" }
    | { outcome: "already_erased" }
    | { outcome: "refused"; reason: "held" }
  > {
    const { subjectId, organizationId, actor } = input;
    if (
      actor.accountId.trim().length === 0 ||
      actor.reasonCode.trim().length === 0
    ) {
      throw new Error(
        "An erasure requires an attributable operator and reason.",
      );
    }

    return database.transaction(
      async (transaction) => {
        const resource: HeldResource = {
          resourceType: "party",
          resourceId: subjectId,
        };
        const holds = await readHoldsForResource(
          transaction,
          organizationId,
          resource,
        );

        // Routed through the destruction evaluator so that function has a real
        // caller rather than sitting unexercised. A hold is reported ahead of
        // the shut gate, which is what distinguishes a refusal we must honour
        // from one that merely reflects G6 being closed.
        const destruction = evaluateRecordDestruction({
          resource,
          holds,
          hasApprovedRetentionSchedule: false,
          recordsGateOpen: false,
        });
        if (destruction.reason === "held") {
          return { outcome: "refused" as const, reason: "held" as const };
        }

        const [key] = await transaction
          .select()
          .from(subjectEncryptionKeys)
          .where(eq(subjectEncryptionKeys.subjectId, subjectId));

        // Repeating an erasure resolves without recording a second removal of
        // something that no longer exists.
        if (!key || key.keyMaterial === null) {
          return { outcome: "already_erased" as const };
        }

        const shreddedAt = new Date();
        await transaction
          .update(subjectEncryptionKeys)
          .set({
            keyMaterial: null,
            shreddedAt,
            shreddedByAccountId: actor.accountId,
            shredReasonCode: actor.reasonCode,
          })
          .where(eq(subjectEncryptionKeys.subjectId, subjectId));

        await transaction.insert(auditEvents).values({
          id: crypto.randomUUID(),
          actorAccountId: actor.accountId,
          action: "records_lifecycle.subject_erased",
          resourceType: "party",
          resourceId: subjectId,
          occurredAt: shreddedAt,
        });

        return { outcome: "erased" as const };
      },
      { isolationLevel: "serializable", accessMode: "read write" },
    );
  },
});

/**
 * Rebuilds the hold projection from its immutable ledger. Like the access
 * lifecycle rebuild, it requires an attributable operator and records who ran
 * it — a privileged recovery operation that leaves no trace is indefensible.
 */
export const rebuildEffectiveLegalHolds = async (
  database: Database,
  input: {
    organizationId: string;
    actor: { accountId: string; reasonCode: string };
  },
): Promise<{ holdCount: number }> => {
  if (
    input.actor.accountId.trim().length === 0 ||
    input.actor.reasonCode.trim().length === 0
  ) {
    throw new Error(
      "A hold rebuild requires an attributable operator and reason.",
    );
  }

  return database.transaction(
    async (transaction) => {
      await transaction.execute(
        sql.raw("lock table effective_legal_holds in share row exclusive mode"),
      );

      const events = await transaction
        .select()
        .from(legalHoldEvents)
        .where(eq(legalHoldEvents.organizationId, input.organizationId))
        .orderBy(asc(legalHoldEvents.holdId), asc(legalHoldEvents.revision));

      const latest = new Map<string, (typeof events)[number]>();
      const placed = new Map<string, Date>();
      for (const event of events) {
        if (event.eventType === "placed")
          placed.set(event.holdId, event.occurredAt);
        latest.set(event.holdId, event);
      }

      await transaction
        .delete(effectiveLegalHolds)
        .where(eq(effectiveLegalHolds.organizationId, input.organizationId));

      const rows = [...latest.values()].map((event) => ({
        holdId: event.holdId,
        organizationId: event.organizationId,
        resourceType: event.resourceType,
        resourceId: event.resourceId,
        state: event.eventType === "placed" ? "active" : "released",
        revision: event.revision,
        placedAt: placed.get(event.holdId) ?? event.occurredAt,
        releasedAt: event.eventType === "released" ? event.occurredAt : null,
        lastEventId: event.id,
      }));
      if (rows.length > 0) {
        await transaction.insert(effectiveLegalHolds).values(rows);
      }

      await transaction.insert(auditEvents).values({
        id: crypto.randomUUID(),
        actorAccountId: input.actor.accountId,
        action: "legal_hold.projection_rebuild",
        resourceType: "organization",
        resourceId: input.organizationId,
        occurredAt: new Date(),
      });

      return { holdCount: rows.length };
    },
    { isolationLevel: "serializable", accessMode: "read write" },
  );
};
