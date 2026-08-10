import type { ConflictCandidate } from "@lexgate/domain";
import { findConflictCandidates } from "@lexgate/domain";
import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import {
  auditEvents,
  partyNameForms,
  subjectEncryptionKeys,
} from "./schema.js";
import { decryptValue } from "./subject-keys.js";

type Database = PostgresJsDatabase;

export type ScoredCandidate = ConflictCandidate &
  Readonly<{ partyId: string; matchedNameFormId: string }>;

/**
 * Conflict candidate detection over encrypted party names.
 *
 * Party values are encrypted under a per-subject key, so matching cannot
 * happen in SQL. A tenant's name forms are loaded, decrypted in memory,
 * matched, and the plaintext discarded.
 *
 * That is a deliberate trade. A blind index would scale better and allow
 * database-side pre-filtering, but it would need an organization-wide key and
 * would therefore survive a subject's key being shredded — silently
 * reintroducing an erased person into matching. Preserving erasure was worth
 * more than the scale.
 *
 * The consequence is recorded rather than designed around: this is O(n) in a
 * tenant's name forms per search, which suits a pilot firm and would not suit
 * a large corpus.
 */

/**
 * An erased subject is genuinely absent from matching: their key is gone, so
 * their names cannot be read, and a name that cannot be read cannot match.
 * That is erasure working correctly, and it is also a real tension with
 * conflict checking, which a reviewer should see stated rather than discover.
 */
const readableNamesForOrganization = async (
  database: Database,
  organizationId: string,
): Promise<{ partyId: string; nameFormId: string; value: string }[]> => {
  const rows = await database
    .select({
      nameFormId: partyNameForms.id,
      partyId: partyNameForms.partyId,
      value: partyNameForms.value,
      keyMaterial: subjectEncryptionKeys.keyMaterial,
    })
    .from(partyNameForms)
    .leftJoin(
      subjectEncryptionKeys,
      eq(subjectEncryptionKeys.subjectId, partyNameForms.partyId),
    )
    .where(eq(partyNameForms.organizationId, organizationId));

  const readable: { partyId: string; nameFormId: string; value: string }[] = [];
  for (const row of rows) {
    if (row.keyMaterial === null) continue;
    readable.push({
      partyId: row.partyId,
      nameFormId: row.nameFormId,
      value: decryptValue(row.value, row.keyMaterial),
    });
  }

  return readable;
};

export const createConflictCandidatePort = (database: Database) => ({
  /**
   * Finds candidates for a name within one organization.
   *
   * An empty result means no stored name resembled this one. It is not a
   * clearance, and nothing in the returned shape can be read as one.
   */
  async findCandidates(input: {
    organizationId: string;
    subjectName: string;
    excludePartyId?: string;
    actor: { accountId: string; correlationId: string };
  }): Promise<readonly ScoredCandidate[]> {
    const names = await readableNamesForOrganization(
      database,
      input.organizationId,
    );

    const candidates = findConflictCandidates({
      subject: input.subjectName,
      knownNames: names.map((name) => ({
        partyId: name.partyId,
        value: name.value,
      })),
      // Included only when set: exactOptionalPropertyTypes distinguishes an
      // absent optional property from one explicitly set to undefined.
      ...(input.excludePartyId === undefined
        ? {}
        : { excludePartyId: input.excludePartyId }),
    });

    // A search that found nothing is recorded too. Otherwise silence is
    // indistinguishable from never having looked, and absence of a candidate
    // starts reading as a clearance nobody granted.
    await database.insert(auditEvents).values({
      id: crypto.randomUUID(),
      actorAccountId: input.actor.accountId,
      action:
        candidates.length > 0
          ? "conflict_candidates.searched.found"
          : "conflict_candidates.searched.none",
      resourceType: "organization",
      resourceId: input.organizationId,
      occurredAt: new Date(),
    });

    const byNameForm = new Map(
      names.map((name) => [name.partyId, name.nameFormId]),
    );

    return candidates.map((candidate) => ({
      ...candidate,
      matchedNameFormId: byNameForm.get(candidate.partyId) ?? "",
    }));
  },

  /** Counts readable names, so the in-memory scale limit stays observable. */
  async readableNameCount(organizationId: string): Promise<number> {
    const names = await readableNamesForOrganization(database, organizationId);
    return names.length;
  },
});

export const conflictCandidateRationale = (
  candidate: ConflictCandidate,
): string => `[${candidate.tier}] ${candidate.rationale}`;
