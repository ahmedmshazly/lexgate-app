import type { NamePartMatch } from "./arabic-names.js";
import {
  canonicalNameParts,
  compareNameParts,
  splitNameParts,
} from "./arabic-names.js";

/**
 * Conflict candidate detection.
 *
 * This module surfaces *candidates for human review*. It has no branch that
 * clears, resolves, or confirms anything, mirroring `evaluateRecordDestruction`
 * in the records lifecycle, which has no successful branch.
 *
 * `LEG-CFL-004`: a conflict result is never cleared because an exact string
 * match is absent. Absence of a candidate here is not a clearance and must
 * never be read as one — it means only that these two names did not resemble
 * each other, which is a fact about strings, not about people.
 *
 * The tier thresholds below are **engineering defaults, not legal ones**. No
 * practising lawyer has set them. Nothing in the system acts on a tier; it
 * exists so a reviewer can triage, and so a rejected weak cue stays
 * distinguishable from a rejected strong one in the audit trail.
 */

export type CandidateTier = "strong" | "moderate" | "weak";

export type NamePartEvidence = Readonly<{
  position: number;
  left: string;
  right: string;
  match: NamePartMatch;
}>;

export type ConflictCandidate = Readonly<{
  tier: CandidateTier;
  /** Human-readable, and stored so a reviewer sees the reasoning. */
  rationale: string;
  matchedParts: number;
  comparedParts: number;
  evidence: readonly NamePartEvidence[];
  /** Restated on every candidate so it cannot be lost in transit. */
  clearsConflict: false;
}>;

const describeMatch = (match: NamePartMatch): string =>
  match === "exact" ? "exactly" : "by transliteration";

/**
 * Compares two names part by part, in position.
 *
 * Position matters because Egyptian naming runs given → father → grandfather
 * → family. Comparing whole strings cannot distinguish "shares a family name"
 * — a weak signal held by thousands of unrelated people — from "shares given,
 * father, and grandfather", which is a strong one. That distinction is the
 * entire basis of the false-positive control.
 */
export const compareNames = (
  left: string,
  right: string,
): readonly NamePartEvidence[] => {
  const leftParts = splitNameParts(left);
  const rightParts = splitNameParts(right);
  const compared = Math.min(leftParts.length, rightParts.length);

  const evidence: NamePartEvidence[] = [];
  for (let position = 0; position < compared; position += 1) {
    const leftPart = leftParts[position] as string;
    const rightPart = rightParts[position] as string;
    evidence.push({
      position,
      left: leftPart,
      right: rightPart,
      match: compareNameParts(leftPart, rightPart),
    });
  }

  return evidence;
};

/**
 * Produces a candidate, or nothing.
 *
 * Nothing means "these names did not resemble each other". It does not mean
 * the parties are distinct, and it never clears a conflict.
 */
/**
 * Parts shared at *different* positions.
 *
 * Positional comparison alone misses a family name that sits third in one
 * name and second in another, which happens constantly because names run to
 * two, three, or four parts. That is a missed-conflict path, so shared parts
 * are also detected without regard to position — but reported as a weaker
 * signal, because a shared part in an unknown role says much less than the
 * same part in the same role.
 */
export const sharedPartsAcrossPositions = (
  left: string,
  right: string,
): readonly string[] => {
  const leftParts = canonicalNameParts(left);
  const rightSet = new Set(canonicalNameParts(right));

  return [...new Set(leftParts.filter((part) => rightSet.has(part)))];
};

/**
 * Produces a candidate, or nothing.
 *
 * Nothing means "these names did not resemble each other". It does not mean
 * the parties are distinct, and it never clears a conflict.
 */
export const evaluateNameCandidate = (
  left: string,
  right: string,
): ConflictCandidate | null => {
  const evidence = compareNames(left, right);
  const comparedParts = evidence.length;
  if (comparedParts === 0) return null;

  const matched = evidence.filter((part) => part.match !== "none");
  const matchedParts = matched.length;
  const shared = sharedPartsAcrossPositions(left, right);

  // No correspondence at all, in position or out of it.
  if (matchedParts === 0 && shared.length === 0) return null;

  const leftLength = splitNameParts(left).length;
  const rightLength = splitNameParts(right).length;
  const allPartsMatch =
    matchedParts === comparedParts && leftLength === rightLength;

  // A single shared part is almost always coincidence. Given-name and
  // family-name collisions are the normal case in a patronymic naming system,
  // so treating one shared part as a real signal is what floods reviewers.
  let tier: CandidateTier;
  if (allPartsMatch && comparedParts >= 2) {
    tier = "strong";
  } else if (matchedParts >= 2) {
    tier = "moderate";
  } else {
    tier = "weak";
  }

  const positions = matched
    .map(
      (part) =>
        `part ${part.position + 1} (${part.left} / ${part.right}) ${describeMatch(part.match)}`,
    )
    .join("; ");

  let rationale: string;
  if (allPartsMatch) {
    rationale = `Every compared part matches: ${positions}. Identical names are held by unrelated people in patronymic naming, so this requires human disposition.`;
  } else if (matchedParts > 0) {
    rationale = `${matchedParts} of ${comparedParts} compared parts match: ${positions}.`;
  } else {
    rationale = `No part matches in position, but ${shared.length} part(s) appear in both names at different positions: ${shared.join(", ")}. A shared part in an unknown role is a weak signal.`;
  }

  return {
    tier,
    rationale,
    matchedParts,
    comparedParts,
    evidence,
    clearsConflict: false,
  };
};

/**
 * Finds candidates for one name against a set of known names.
 *
 * Returns candidates ordered strongest first. An empty result is not a
 * clearance — see the module note.
 */
export const findConflictCandidates = (input: {
  subject: string;
  knownNames: readonly { partyId: string; value: string }[];
  /** Excluded so a party never becomes its own candidate. */
  excludePartyId?: string;
}): readonly (ConflictCandidate & { partyId: string })[] => {
  const tierRank: Record<CandidateTier, number> = {
    strong: 0,
    moderate: 1,
    weak: 2,
  };

  return input.knownNames
    .filter((known) => known.partyId !== input.excludePartyId)
    .map((known) => {
      const candidate = evaluateNameCandidate(input.subject, known.value);
      return candidate ? { ...candidate, partyId: known.partyId } : null;
    })
    .filter(
      (candidate): candidate is ConflictCandidate & { partyId: string } =>
        candidate !== null,
    )
    .sort(
      (a, b) =>
        tierRank[a.tier] - tierRank[b.tier] || b.matchedParts - a.matchedParts,
    );
};

/**
 * Whether two names are canonically identical after normalization.
 *
 * Exposed for evidence and reporting only. It answers a question about
 * strings, never about people: two unrelated people commonly share a full
 * tripartite name, so an identical result is a reason to look, not a finding.
 */
export const namesAreCanonicallyIdentical = (
  left: string,
  right: string,
): boolean => {
  const leftParts = canonicalNameParts(left);
  const rightParts = canonicalNameParts(right);

  return (
    leftParts.length > 0 &&
    leftParts.length === rightParts.length &&
    leftParts.every((part, index) => part === rightParts[index])
  );
};
