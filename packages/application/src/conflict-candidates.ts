import type { ConflictCandidate } from "@lexgate/domain";

/**
 * Trusted orchestration for conflict candidate search.
 *
 * The guarantee this layer adds, which nothing below it provides: the G2
 * boundary requires that candidate facts are visible only to an exact
 * authorised reviewer, and that a denial "discloses neither existence nor
 * match rationale".
 *
 * So an unauthorised caller receives a generic denial that is byte-identical
 * whether or not candidates exist. Returning "no candidates" to an
 * unauthorised caller and a denial to another would itself leak that
 * something was there.
 */

export type ConflictCandidateActor = Readonly<{
  accountId: string;
  organizationId: string;
  correlationId: string;
}>;

export interface ConflictCandidateAuthorizationPort {
  /** Whether this actor may see candidate facts for this organization. */
  mayReviewCandidates(input: {
    accountId: string;
    organizationId: string;
  }): Promise<boolean>;
}

export interface ConflictCandidateSearchPort {
  findCandidates(input: {
    organizationId: string;
    subjectName: string;
    excludePartyId?: string;
    actor: { accountId: string; correlationId: string };
  }): Promise<readonly (ConflictCandidate & { partyId: string })[]>;
}

export type ConflictCandidateOutcome =
  | Readonly<{
      outcome: "candidates";
      candidates: readonly (ConflictCandidate & { partyId: string })[];
    }>
  | Readonly<{ outcome: "denied"; reason: "not_authorized" }>;

/**
 * Searches for candidates a reviewer may act on.
 *
 * Note what this never returns: a cleared, resolved, or confirmed outcome.
 * An empty `candidates` array means no stored name resembled the subject —
 * a fact about strings, not about people, and never a conflict clearance
 * (LEG-CFL-004).
 */
export const searchConflictCandidates = async (input: {
  actor: ConflictCandidateActor;
  subjectName: string;
  excludePartyId?: string;
  authorization: ConflictCandidateAuthorizationPort;
  search: ConflictCandidateSearchPort;
}): Promise<ConflictCandidateOutcome> => {
  const { actor, authorization, search } = input;

  const allowed = await authorization.mayReviewCandidates({
    accountId: actor.accountId,
    organizationId: actor.organizationId,
  });

  // Denied before the search runs, so an unauthorised caller cannot learn
  // anything from timing or from a partial result either.
  if (!allowed) return { outcome: "denied", reason: "not_authorized" };

  const candidates = await search.findCandidates({
    organizationId: actor.organizationId,
    subjectName: input.subjectName,
    ...(input.excludePartyId === undefined
      ? {}
      : { excludePartyId: input.excludePartyId }),
    actor: { accountId: actor.accountId, correlationId: actor.correlationId },
  });

  return { outcome: "candidates", candidates };
};

/**
 * The rationale stored against a flagged pair.
 *
 * Prefixed with its tier so a reviewer reading the audit trail later can tell
 * a rejected weak cue from a rejected strong one — which is what makes alert
 * fatigue distinguishable from analysis.
 */
export const candidateRationale = (candidate: ConflictCandidate): string =>
  `[${candidate.tier}] ${candidate.rationale}`;
