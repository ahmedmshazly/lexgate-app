import { evaluateNameCandidate } from "@lexgate/domain";
import { describe, expect, it } from "vitest";
import {
  distinctParties,
  identicalButDistinct,
  sameParty,
} from "./arabic-name-corpus.js";

/**
 * Measures the matcher against the adversarial corpus.
 *
 * Both failure modes matter and they pull against each other, so both are
 * counted rather than asserted:
 *
 * - A missed same-party pair is a missed conflict.
 * - A distinct pair rated strong is the false positive that trains staff to
 *   dismiss flags without reading them, which then makes a rejected flag
 *   worthless as evidence that anyone looked.
 *
 * These are numbers that can regress, not claims that cannot.
 */

const describePair = (pair: { left: string; right: string; note: string }) =>
  `${pair.left} / ${pair.right} — ${pair.note}`;

describe("recall: same-party pairs must be found", () => {
  it("misses none of them", () => {
    const missed = sameParty.filter(
      (pair) => evaluateNameCandidate(pair.left, pair.right) === null,
    );

    expect(missed.map(describePair)).toEqual([]);
  });

  it("rates every one of them strong", () => {
    // These are the same person written differently. Anything less than
    // strong means normalization or transliteration equivalence is failing.
    const understated = sameParty.filter(
      (pair) => evaluateNameCandidate(pair.left, pair.right)?.tier !== "strong",
    );

    expect(understated.map(describePair)).toEqual([]);
  });
});

describe("precision: distinct pairs must not be overstated", () => {
  it("rates no distinct pair strong", () => {
    const overstated = distinctParties.filter(
      (pair) => evaluateNameCandidate(pair.left, pair.right)?.tier === "strong",
    );

    expect(overstated.map(describePair)).toEqual([]);
  });

  it("keeps the strong tier perfectly precise across the corpus", () => {
    const strongSame = sameParty.filter(
      (pair) => evaluateNameCandidate(pair.left, pair.right)?.tier === "strong",
    ).length;
    const strongDistinct = distinctParties.filter(
      (pair) => evaluateNameCandidate(pair.left, pair.right)?.tier === "strong",
    ).length;

    const precision = strongSame / (strongSame + strongDistinct || 1);
    expect(precision).toBe(1);
    expect(strongSame).toBe(sameParty.length);
  });

  it("reserves the weak tier for coincidental overlap", () => {
    // A shared family name or a shared given name alone. Surfacing these is
    // correct — a reviewer may still want to look — but rating them above
    // weak is what produces alert fatigue.
    const familyNameOnly = evaluateNameCandidate("محمد الشريف", "يوسف الشريف");
    const givenNameOnly = evaluateNameCandidate("مريم أحمد", "مريم محمود");

    expect(familyNameOnly?.tier).toBe("weak");
    expect(givenNameOnly?.tier).toBe("weak");
  });
});

describe("the case names alone cannot settle", () => {
  it("surfaces an identical tripartite name without treating it as identity", () => {
    // Two unrelated people with the same full name. The matcher must raise it
    // — it looks identical — while saying plainly that a human must decide.
    const pair = identicalButDistinct[0]!;
    const candidate = evaluateNameCandidate(pair.left, pair.right);

    expect(candidate?.tier).toBe("strong");
    expect(candidate?.clearsConflict).toBe(false);
    expect(candidate?.rationale).toContain("human disposition");
  });
});

describe("every candidate carries reviewable reasoning", () => {
  it("states a rationale naming what matched", () => {
    for (const pair of [...sameParty, ...distinctParties]) {
      const candidate = evaluateNameCandidate(pair.left, pair.right);
      if (!candidate) continue;

      expect(candidate.rationale.length, describePair(pair)).toBeGreaterThan(
        20,
      );
      expect(candidate.clearsConflict).toBe(false);
    }
  });
});
