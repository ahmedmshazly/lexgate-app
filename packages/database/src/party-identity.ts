import {
  PartyIdentityConflictError,
  PartyIdentityNotFoundOrNotAuthorizedError,
  type PartyIdentityAssertionCategory,
  type PartyIdentityCommandResult,
  type PartyIdentityHistory,
  type PartyIdentityPersistencePort,
} from "@lexgate/application";
import type {
  CreateNeutralPartyInput,
  FlagPossibleDuplicateInput,
  PartyContactInput,
  PartyIdentityMutation,
  PartyNameFormInput,
  PrimaryNameAssignmentInput,
  RecordPartyContactInput,
  RecordPartyNameInput,
  RecordRepresentationClaimInput,
  RepresentationClaimInput,
  SyntheticPrivacyHandlingMetadata,
} from "@lexgate/domain";
import { and, asc, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  outboxEvents,
  parties,
  partyContactAssertions,
  partyIdentityAuditEvents,
  partyNameForms,
  partyPossibleDuplicateFlags,
  partyPrimaryNameAssignments,
  partyRepresentationClaims,
} from "./schema.js";

type Database = PostgresJsDatabase;

type PartyIdentityAction =
  | "party.create"
  | "party.record_name"
  | "party.record_contact"
  | "party.record_representation"
  | "party.flag_possible_duplicate";

type MutationCommand = Readonly<{
  commandId: string;
  correlationId: string;
}>;

type PersistInput<TCommand extends MutationCommand> = Readonly<{
  actor: Readonly<{ accountId: string; organizationId: string }>;
  command: TCommand;
  mutation: PartyIdentityMutation;
  commandFingerprint: string;
  action: PartyIdentityAction;
}>;

const normalizedText = (value: string): string => value.trim();

type PrimaryNameAssignmentHistory = Readonly<{
  id: string;
  supersedesAssignmentId: string | null;
  recordedAt: Date;
}>;

/**
 * A correction is causally later than the assignment it supersedes, even if
 * both commands deliberately use the same recorded timestamp. Preserve that
 * relationship in a deterministic history projection.
 */
const orderPrimaryNameAssignments = <T extends PrimaryNameAssignmentHistory>(
  assignments: readonly T[],
): T[] => {
  const byId = new Map(
    assignments.map((assignment) => [assignment.id, assignment]),
  );
  const depthFor = (assignment: T): number => {
    let depth = 0;
    let cursor: T | undefined = assignment;
    const seen = new Set<string>();

    while (cursor?.supersedesAssignmentId) {
      if (seen.has(cursor.id)) return depth;
      seen.add(cursor.id);
      const predecessor = byId.get(cursor.supersedesAssignmentId);
      if (!predecessor) return depth;
      depth += 1;
      cursor = predecessor;
    }

    return depth;
  };

  return [...assignments].sort(
    (left, right) =>
      depthFor(left) - depthFor(right) ||
      left.recordedAt.getTime() - right.recordedAt.getTime() ||
      left.id.localeCompare(right.id),
  );
};

const privacyValues = (privacy: SyntheticPrivacyHandlingMetadata) => ({
  processingPurpose: normalizedText(privacy.processingPurpose),
  dataClassification: normalizedText(privacy.dataClassification),
  subjectCategory: privacy.subjectCategory,
  source: normalizedText(privacy.source),
  retentionCandidate: normalizedText(privacy.retentionCandidate),
  accessBoundary: normalizedText(privacy.accessBoundary),
  validationRequirement: normalizedText(privacy.validationRequirement),
});

const existingReplay = async <TCommand extends MutationCommand>(
  database: Database,
  input: PersistInput<TCommand>,
): Promise<PartyIdentityCommandResult | null> => {
  const [receipt] = await database
    .select()
    .from(partyIdentityAuditEvents)
    .where(eq(partyIdentityAuditEvents.commandId, input.command.commandId));

  if (!receipt) return null;

  const matches =
    receipt.organizationId === input.actor.organizationId &&
    receipt.actorAccountId === input.actor.accountId &&
    receipt.correlationId === input.command.correlationId &&
    receipt.action === input.action &&
    receipt.resourceType === "party" &&
    receipt.resourceId === input.mutation.event.payload.partyId &&
    receipt.assertionId === input.mutation.event.payload.assertionId &&
    receipt.assertionCategory ===
      input.mutation.event.payload.assertionCategory &&
    receipt.commandFingerprint === input.commandFingerprint;

  if (!matches) {
    throw new PartyIdentityConflictError(
      "A party identity command ID cannot be reused for a different command.",
    );
  }

  return {
    partyId: receipt.resourceId,
    assertionId: receipt.assertionId,
    replayed: true,
  };
};

const writeReceiptAndOutbox = async <TCommand extends MutationCommand>(
  database: Database,
  input: PersistInput<TCommand>,
): Promise<void> => {
  const payload = input.mutation.event.payload;
  await database.insert(partyIdentityAuditEvents).values({
    commandId: input.command.commandId,
    organizationId: input.actor.organizationId,
    actorAccountId: input.actor.accountId,
    correlationId: input.command.correlationId,
    action: input.action,
    resourceType: "party",
    resourceId: payload.partyId,
    assertionId: payload.assertionId,
    assertionCategory: payload.assertionCategory,
    commandFingerprint: input.commandFingerprint,
    occurredAt: input.mutation.event.occurredAt,
  });
  await database.insert(outboxEvents).values({
    id: input.mutation.event.id,
    type: input.mutation.event.type,
    aggregateId: input.mutation.event.aggregateId,
    payload: {
      partyId: payload.partyId,
      assertionId: payload.assertionId,
      assertionCategory: payload.assertionCategory,
    },
    occurredAt: input.mutation.event.occurredAt,
    attempts: 0,
    lastAttemptedAt: null,
    lastError: null,
    publishedAt: null,
  });
};

const recorded = (
  mutation: PartyIdentityMutation,
): PartyIdentityCommandResult => ({
  partyId: mutation.event.payload.partyId,
  assertionId: mutation.event.payload.assertionId,
  replayed: false,
});

const assertPartyExists = async (input: {
  database: Database;
  organizationId: string;
  partyId: string;
}): Promise<void> => {
  const [party] = await input.database
    .select({ id: parties.id })
    .from(parties)
    .where(
      and(
        eq(parties.organizationId, input.organizationId),
        eq(parties.id, input.partyId),
      ),
    );
  if (!party) {
    throw new PartyIdentityNotFoundOrNotAuthorizedError(
      "Party identity was not found or is not authorized.",
    );
  }
};

const assertNameFormPredecessor = async (input: {
  database: Database;
  organizationId: string;
  partyId: string;
  predecessorId: string | undefined;
}): Promise<void> => {
  if (!input.predecessorId) return;
  const [predecessor] = await input.database
    .select({ id: partyNameForms.id })
    .from(partyNameForms)
    .where(
      and(
        eq(partyNameForms.organizationId, input.organizationId),
        eq(partyNameForms.partyId, input.partyId),
        eq(partyNameForms.id, input.predecessorId),
      ),
    );
  if (!predecessor) {
    throw new PartyIdentityConflictError(
      "A name correction must reference an existing party name form.",
    );
  }
};

const assertPrimaryAssignmentPredecessor = async (input: {
  database: Database;
  organizationId: string;
  partyId: string;
  predecessorId: string | undefined;
}): Promise<void> => {
  if (!input.predecessorId) return;
  const [predecessor] = await input.database
    .select({ id: partyPrimaryNameAssignments.id })
    .from(partyPrimaryNameAssignments)
    .where(
      and(
        eq(partyPrimaryNameAssignments.organizationId, input.organizationId),
        eq(partyPrimaryNameAssignments.partyId, input.partyId),
        eq(partyPrimaryNameAssignments.id, input.predecessorId),
      ),
    );
  if (!predecessor) {
    throw new PartyIdentityConflictError(
      "A primary-name correction must reference an existing assignment.",
    );
  }
};

const assertContactPredecessor = async (input: {
  database: Database;
  organizationId: string;
  partyId: string;
  predecessorId: string | undefined;
}): Promise<void> => {
  if (!input.predecessorId) return;
  const [predecessor] = await input.database
    .select({ id: partyContactAssertions.id })
    .from(partyContactAssertions)
    .where(
      and(
        eq(partyContactAssertions.organizationId, input.organizationId),
        eq(partyContactAssertions.partyId, input.partyId),
        eq(partyContactAssertions.id, input.predecessorId),
      ),
    );
  if (!predecessor) {
    throw new PartyIdentityConflictError(
      "A contact correction must reference an existing party contact assertion.",
    );
  }
};

const assertRepresentationPredecessor = async (input: {
  database: Database;
  organizationId: string;
  representedPartyId: string;
  predecessorId: string | undefined;
}): Promise<void> => {
  if (!input.predecessorId) return;
  const [predecessor] = await input.database
    .select({ id: partyRepresentationClaims.id })
    .from(partyRepresentationClaims)
    .where(
      and(
        eq(partyRepresentationClaims.organizationId, input.organizationId),
        eq(
          partyRepresentationClaims.representedPartyId,
          input.representedPartyId,
        ),
        eq(partyRepresentationClaims.id, input.predecessorId),
      ),
    );
  if (!predecessor) {
    throw new PartyIdentityConflictError(
      "A representation correction must reference an existing claim.",
    );
  }
};

const insertNameForm = async (input: {
  database: Database;
  actor: Readonly<{ accountId: string; organizationId: string }>;
  partyId: string;
  name: PartyNameFormInput;
  occurredAt: Date;
}): Promise<void> => {
  await input.database.insert(partyNameForms).values({
    id: input.name.id,
    organizationId: input.actor.organizationId,
    partyId: input.partyId,
    value: normalizedText(input.name.value),
    formType: input.name.formType,
    languageTag: normalizedText(input.name.languageTag),
    script: input.name.script ? normalizedText(input.name.script) : null,
    reviewState: input.name.reviewState,
    ...privacyValues(input.name.privacy),
    recordedAt: input.occurredAt,
    recordedByAccountId: input.actor.accountId,
    supersedesNameFormId: input.name.supersedesNameFormId ?? null,
  });
};

const insertPrimaryNameAssignment = async (input: {
  database: Database;
  actor: Readonly<{ accountId: string; organizationId: string }>;
  partyId: string;
  assignment: PrimaryNameAssignmentInput;
  occurredAt: Date;
}): Promise<void> => {
  await input.database.insert(partyPrimaryNameAssignments).values({
    id: input.assignment.id,
    organizationId: input.actor.organizationId,
    partyId: input.partyId,
    nameFormId: input.assignment.nameFormId,
    supersedesAssignmentId: input.assignment.supersedesAssignmentId ?? null,
    recordedAt: input.occurredAt,
    recordedByAccountId: input.actor.accountId,
  });
};

const insertContact = async (input: {
  database: Database;
  actor: Readonly<{ accountId: string; organizationId: string }>;
  partyId: string;
  contact: PartyContactInput;
  occurredAt: Date;
}): Promise<void> => {
  await input.database.insert(partyContactAssertions).values({
    id: input.contact.id,
    organizationId: input.actor.organizationId,
    partyId: input.partyId,
    contactType: input.contact.contactType,
    value: normalizedText(input.contact.value),
    operationalPurpose: normalizedText(input.contact.operationalPurpose),
    reviewState: input.contact.reviewState,
    ...privacyValues(input.contact.privacy),
    recordedAt: input.occurredAt,
    recordedByAccountId: input.actor.accountId,
    supersedesContactId: input.contact.supersedesContactId ?? null,
  });
};

const insertRepresentationClaim = async (input: {
  database: Database;
  actor: Readonly<{ accountId: string; organizationId: string }>;
  claim: RepresentationClaimInput;
  occurredAt: Date;
}): Promise<void> => {
  await input.database.insert(partyRepresentationClaims).values({
    id: input.claim.id,
    organizationId: input.actor.organizationId,
    representedPartyId: input.claim.representedPartyId,
    representativePartyId: input.claim.representativePartyId,
    claimState: input.claim.claimState,
    reviewState: input.claim.reviewState,
    ...privacyValues(input.claim.privacy),
    effectiveFrom: input.claim.effectiveFrom ?? null,
    effectiveUntil: input.claim.effectiveUntil ?? null,
    recordedAt: input.occurredAt,
    recordedByAccountId: input.actor.accountId,
    supersedesClaimId: input.claim.supersedesClaimId ?? null,
  });
};

export const createPartyIdentityPersistencePort = (
  database: Database,
): PartyIdentityPersistencePort => ({
  async createParty(input) {
    const persistInput: PersistInput<CreateNeutralPartyInput> = {
      ...input,
      action: "party.create",
    };
    return database.transaction(
      async (transaction) => {
        const scopedDatabase = transaction as Database;
        const replay = await existingReplay(scopedDatabase, persistInput);
        if (replay) return replay;

        await scopedDatabase.insert(parties).values({
          id: input.command.partyId,
          organizationId: input.actor.organizationId,
          kind: input.command.kind,
          ...privacyValues(input.command.partyPrivacy),
          createdAt: input.command.occurredAt,
          createdByAccountId: input.actor.accountId,
        });
        await insertNameForm({
          database: scopedDatabase,
          actor: input.actor,
          partyId: input.command.partyId,
          name: input.command.primaryName,
          occurredAt: input.command.occurredAt,
        });
        await insertPrimaryNameAssignment({
          database: scopedDatabase,
          actor: input.actor,
          partyId: input.command.partyId,
          assignment: input.command.primaryNameAssignment,
          occurredAt: input.command.occurredAt,
        });
        if (input.command.initialContact !== undefined) {
          await insertContact({
            database: scopedDatabase,
            actor: input.actor,
            partyId: input.command.partyId,
            contact: input.command.initialContact,
            occurredAt: input.command.occurredAt,
          });
        }
        await writeReceiptAndOutbox(scopedDatabase, persistInput);
        return recorded(input.mutation);
      },
      { isolationLevel: "serializable" },
    );
  },

  async recordName(input) {
    const persistInput: PersistInput<RecordPartyNameInput> = {
      ...input,
      action: "party.record_name",
    };
    return database.transaction(
      async (transaction) => {
        const scopedDatabase = transaction as Database;
        const replay = await existingReplay(scopedDatabase, persistInput);
        if (replay) return replay;
        await assertPartyExists({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          partyId: input.command.partyId,
        });
        await assertNameFormPredecessor({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          partyId: input.command.partyId,
          predecessorId: input.command.name.supersedesNameFormId,
        });
        if (input.command.primaryNameAssignment !== undefined) {
          await assertPrimaryAssignmentPredecessor({
            database: scopedDatabase,
            organizationId: input.actor.organizationId,
            partyId: input.command.partyId,
            predecessorId:
              input.command.primaryNameAssignment.supersedesAssignmentId,
          });
        }
        await insertNameForm({
          database: scopedDatabase,
          actor: input.actor,
          partyId: input.command.partyId,
          name: input.command.name,
          occurredAt: input.command.occurredAt,
        });
        if (input.command.primaryNameAssignment !== undefined) {
          await insertPrimaryNameAssignment({
            database: scopedDatabase,
            actor: input.actor,
            partyId: input.command.partyId,
            assignment: input.command.primaryNameAssignment,
            occurredAt: input.command.occurredAt,
          });
        }
        await writeReceiptAndOutbox(scopedDatabase, persistInput);
        return recorded(input.mutation);
      },
      { isolationLevel: "serializable" },
    );
  },

  async recordContact(input) {
    const persistInput: PersistInput<RecordPartyContactInput> = {
      ...input,
      action: "party.record_contact",
    };
    return database.transaction(
      async (transaction) => {
        const scopedDatabase = transaction as Database;
        const replay = await existingReplay(scopedDatabase, persistInput);
        if (replay) return replay;
        await assertPartyExists({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          partyId: input.command.partyId,
        });
        await assertContactPredecessor({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          partyId: input.command.partyId,
          predecessorId: input.command.contact.supersedesContactId,
        });
        await insertContact({
          database: scopedDatabase,
          actor: input.actor,
          partyId: input.command.partyId,
          contact: input.command.contact,
          occurredAt: input.command.occurredAt,
        });
        await writeReceiptAndOutbox(scopedDatabase, persistInput);
        return recorded(input.mutation);
      },
      { isolationLevel: "serializable" },
    );
  },

  async recordRepresentationClaim(input) {
    const persistInput: PersistInput<RecordRepresentationClaimInput> = {
      ...input,
      action: "party.record_representation",
    };
    return database.transaction(
      async (transaction) => {
        const scopedDatabase = transaction as Database;
        const replay = await existingReplay(scopedDatabase, persistInput);
        if (replay) return replay;
        await assertPartyExists({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          partyId: input.command.claim.representedPartyId,
        });
        await assertPartyExists({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          partyId: input.command.claim.representativePartyId,
        });
        await assertRepresentationPredecessor({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          representedPartyId: input.command.claim.representedPartyId,
          predecessorId: input.command.claim.supersedesClaimId,
        });
        await insertRepresentationClaim({
          database: scopedDatabase,
          actor: input.actor,
          claim: input.command.claim,
          occurredAt: input.command.occurredAt,
        });
        await writeReceiptAndOutbox(scopedDatabase, persistInput);
        return recorded(input.mutation);
      },
      { isolationLevel: "serializable" },
    );
  },

  async flagPossibleDuplicate(input) {
    const persistInput: PersistInput<FlagPossibleDuplicateInput> = {
      ...input,
      action: "party.flag_possible_duplicate",
    };
    return database.transaction(
      async (transaction) => {
        const scopedDatabase = transaction as Database;
        const replay = await existingReplay(scopedDatabase, persistInput);
        if (replay) return replay;
        await assertPartyExists({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          partyId: input.command.duplicate.firstPartyId,
        });
        await assertPartyExists({
          database: scopedDatabase,
          organizationId: input.actor.organizationId,
          partyId: input.command.duplicate.secondPartyId,
        });
        await scopedDatabase.insert(partyPossibleDuplicateFlags).values({
          id: input.command.duplicate.id,
          organizationId: input.actor.organizationId,
          firstPartyId: input.command.duplicate.firstPartyId,
          secondPartyId: input.command.duplicate.secondPartyId,
          reviewState: input.command.duplicate.reviewState,
          matchRationale: input.command.duplicate.matchRationale,
          disposition: input.command.duplicate.disposition ?? null,
          ...privacyValues(input.command.duplicate.privacy),
          recordedAt: input.command.occurredAt,
          recordedByAccountId: input.actor.accountId,
        });
        await writeReceiptAndOutbox(scopedDatabase, persistInput);
        return recorded(input.mutation);
      },
      { isolationLevel: "serializable" },
    );
  },

  async readPartyHistory(input) {
    const [party] = await database
      .select({ id: parties.id, kind: parties.kind })
      .from(parties)
      .where(
        and(
          eq(parties.organizationId, input.organizationId),
          eq(parties.id, input.partyId),
        ),
      );
    if (!party) return null;
    if (party.kind !== "person" && party.kind !== "organization") {
      throw new Error("Party identity record has an invalid kind.");
    }

    const [names, contacts, primaryAssignments] = await Promise.all([
      database
        .select({
          id: partyNameForms.id,
          value: partyNameForms.value,
          formType: partyNameForms.formType,
          languageTag: partyNameForms.languageTag,
          script: partyNameForms.script,
          reviewState: partyNameForms.reviewState,
          source: partyNameForms.source,
          recordedAt: partyNameForms.recordedAt,
        })
        .from(partyNameForms)
        .where(
          and(
            eq(partyNameForms.organizationId, input.organizationId),
            eq(partyNameForms.partyId, input.partyId),
          ),
        )
        .orderBy(asc(partyNameForms.recordedAt)),
      database
        .select({
          id: partyContactAssertions.id,
          contactType: partyContactAssertions.contactType,
          value: partyContactAssertions.value,
          operationalPurpose: partyContactAssertions.operationalPurpose,
          reviewState: partyContactAssertions.reviewState,
          source: partyContactAssertions.source,
          recordedAt: partyContactAssertions.recordedAt,
        })
        .from(partyContactAssertions)
        .where(
          and(
            eq(partyContactAssertions.organizationId, input.organizationId),
            eq(partyContactAssertions.partyId, input.partyId),
          ),
        )
        .orderBy(asc(partyContactAssertions.recordedAt)),
      database
        .select({
          id: partyPrimaryNameAssignments.id,
          nameFormId: partyPrimaryNameAssignments.nameFormId,
          supersedesAssignmentId:
            partyPrimaryNameAssignments.supersedesAssignmentId,
          recordedAt: partyPrimaryNameAssignments.recordedAt,
          recordedByAccountId: partyPrimaryNameAssignments.recordedByAccountId,
        })
        .from(partyPrimaryNameAssignments)
        .where(
          and(
            eq(
              partyPrimaryNameAssignments.organizationId,
              input.organizationId,
            ),
            eq(partyPrimaryNameAssignments.partyId, input.partyId),
          ),
        )
        .orderBy(asc(partyPrimaryNameAssignments.recordedAt)),
    ]);
    const orderedPrimaryAssignments =
      orderPrimaryNameAssignments(primaryAssignments);
    const supersededAssignmentIds = new Set(
      orderedPrimaryAssignments.flatMap((assignment) =>
        assignment.supersedesAssignmentId
          ? [assignment.supersedesAssignmentId]
          : [],
      ),
    );
    const currentAssignment = orderedPrimaryAssignments.find(
      (assignment) => !supersededAssignmentIds.has(assignment.id),
    );
    if (!currentAssignment) {
      throw new Error(
        "Party identity record has no current primary-name assignment.",
      );
    }

    return {
      id: party.id,
      kind: party.kind,
      primaryNameId: currentAssignment.nameFormId,
      names,
      primaryNameAssignments: orderedPrimaryAssignments,
      contacts,
    } satisfies PartyIdentityHistory;
  },
});
