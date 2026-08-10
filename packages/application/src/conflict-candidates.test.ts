import type { ConflictCandidate } from "@lexgate/domain";
import { describe, expect, it, vi } from "vitest";
import type {
  ConflictCandidateAuthorizationPort,
  ConflictCandidateSearchPort,
} from "./conflict-candidates.js";
import {
  candidateRationale,
  searchConflictCandidates,
} from "./conflict-candidates.js";

const actor = {
  accountId: "synthetic-reviewer",
  organizationId: "synthetic-organization",
  correlationId: "synthetic-correlation",
};

const candidate: ConflictCandidate & { partyId: string } = {
  partyId: "synthetic-party",
  tier: "strong",
  rationale: "Every compared part matches.",
  matchedParts: 3,
  comparedParts: 3,
  evidence: [],
  clearsConflict: false,
};

const authorization = (
  allowed: boolean,
): ConflictCandidateAuthorizationPort => ({
  mayReviewCandidates: vi.fn().mockResolvedValue(allowed),
});

const search = (
  candidates: readonly (ConflictCandidate & { partyId: string })[] = [],
): ConflictCandidateSearchPort => ({
  findCandidates: vi.fn().mockResolvedValue(candidates),
});

describe("candidate facts reach only an authorised reviewer", () => {
  it("returns candidates to an authorised reviewer", async () => {
    await expect(
      searchConflictCandidates({
        actor,
        subjectName: "أحمد محمد الشريف",
        authorization: authorization(true),
        search: search([candidate]),
      }),
    ).resolves.toEqual({ outcome: "candidates", candidates: [candidate] });
  });

  it("denies an unauthorised caller without running the search", async () => {
    const port = search([candidate]);

    await expect(
      searchConflictCandidates({
        actor,
        subjectName: "أحمد محمد الشريف",
        authorization: authorization(false),
        search: port,
      }),
    ).resolves.toEqual({ outcome: "denied", reason: "not_authorized" });

    // Denied before the search runs, so nothing can be inferred from timing
    // or from a partial result.
    expect(port.findCandidates).not.toHaveBeenCalled();
  });

  it("gives an identical denial whether or not candidates exist", async () => {
    // The G2 boundary: a denial discloses neither existence nor rationale.
    // Returning "no candidates" in one case and a denial in the other would
    // itself reveal that something was there.
    const withMatches = await searchConflictCandidates({
      actor,
      subjectName: "أحمد محمد الشريف",
      authorization: authorization(false),
      search: search([candidate]),
    });
    const withoutMatches = await searchConflictCandidates({
      actor,
      subjectName: "خالد عمر",
      authorization: authorization(false),
      search: search([]),
    });

    expect(withMatches).toEqual(withoutMatches);
  });
});

describe("an empty result is silence, not clearance (LEG-CFL-004)", () => {
  it("returns an empty candidate list rather than any cleared outcome", async () => {
    const result = await searchConflictCandidates({
      actor,
      subjectName: "خالد عمر",
      authorization: authorization(true),
      search: search([]),
    });

    expect(result).toEqual({ outcome: "candidates", candidates: [] });
    // No shape here can be read as a conflict having been resolved.
    expect(JSON.stringify(result)).not.toContain("cleared");
    expect(JSON.stringify(result)).not.toContain("resolved");
  });
});

describe("stored rationale keeps tiers distinguishable", () => {
  it("prefixes the rationale with its tier", () => {
    // So a reviewer reading the audit trail later can tell a rejected weak
    // cue from a rejected strong one.
    expect(candidateRationale(candidate)).toBe(
      "[strong] Every compared part matches.",
    );
  });
});
