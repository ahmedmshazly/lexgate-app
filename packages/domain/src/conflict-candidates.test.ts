import { describe, expect, it } from "vitest";
import {
  compareNames,
  evaluateNameCandidate,
  findConflictCandidates,
  namesAreCanonicallyIdentical,
} from "./conflict-candidates.js";

describe("candidate tiering", () => {
  it("treats a fully matching multi-part name as strong", () => {
    const candidate = evaluateNameCandidate(
      "أحمد محمد الشريف",
      "احمد محمد شريف",
    );

    expect(candidate?.tier).toBe("strong");
    expect(candidate?.rationale).toContain("Every compared part matches");
  });

  it("treats a single shared part as weak", () => {
    // A shared given name or family name is the normal case in patronymic
    // naming. Rating it strongly is what floods reviewers.
    const candidate = evaluateNameCandidate("محمد الشريف", "يوسف الشريف");

    expect(candidate?.tier).toBe("weak");
    expect(candidate?.matchedParts).toBe(1);
  });

  it("treats two of three shared parts as moderate", () => {
    const candidate = evaluateNameCandidate(
      "Ahmed Hassan Ibrahim",
      "Ahmed Hassan Mahmoud",
    );

    expect(candidate?.tier).toBe("moderate");
  });

  it("returns nothing when no part corresponds", () => {
    expect(evaluateNameCandidate("محمد علي", "سعيد إبراهيم")).toBeNull();
  });

  it("carries evidence a reviewer can check rather than trust", () => {
    const candidate = evaluateNameCandidate("Mariam Salem", "Maryam Saleem");

    expect(candidate?.evidence).toHaveLength(2);
    expect(candidate?.evidence[0]).toMatchObject({
      position: 0,
      match: "transliteration",
    });
    expect(candidate?.rationale).toContain("by transliteration");
  });

  it("distinguishes an exact part match from a transliterated one", () => {
    const evidence = compareNames("محمد حسن", "Mohammed Hassan");

    expect(evidence.every((part) => part.match === "transliteration")).toBe(
      true,
    );
  });
});

describe("no candidate ever clears a conflict (LEG-CFL-004)", () => {
  it("marks every candidate as non-clearing", () => {
    const candidate = evaluateNameCandidate("محمد أحمد", "محمد أحمد");

    expect(candidate?.clearsConflict).toBe(false);
  });

  it("offers no outcome that resolves or confirms anything", () => {
    const candidate = evaluateNameCandidate("محمد أحمد", "محمد أحمد");

    // The shape itself must not admit a clearing result.
    expect(Object.keys(candidate ?? {})).not.toContain("cleared");
    expect(Object.keys(candidate ?? {})).not.toContain("resolved");
    expect(Object.keys(candidate ?? {})).not.toContain("confirmed");
  });

  it("treats an empty candidate set as silence, not clearance", () => {
    const candidates = findConflictCandidates({
      subject: "محمد علي",
      knownNames: [{ partyId: "p1", value: "سعيد إبراهيم" }],
    });

    // Nothing resembled the subject. That is a fact about strings, and the
    // absence of a candidate carries no assertion about the parties at all.
    expect(candidates).toEqual([]);
  });

  it("surfaces an identical tripartite name rather than treating it as identity", () => {
    const candidate = evaluateNameCandidate(
      "محمد أحمد محمود",
      "محمد أحمد محمود",
    );

    expect(candidate?.tier).toBe("strong");
    expect(candidate?.clearsConflict).toBe(false);
    // Identical names are held by unrelated people; the rationale must say so
    // rather than imply the match settles anything.
    expect(candidate?.rationale).toContain("human disposition");
    expect(
      namesAreCanonicallyIdentical("محمد أحمد محمود", "محمد أحمد محمود"),
    ).toBe(true);
  });
});

describe("candidate ranking", () => {
  it("orders strongest first so triage starts where it matters", () => {
    const candidates = findConflictCandidates({
      subject: "أحمد محمد الشريف",
      knownNames: [
        { partyId: "weak", value: "يوسف الشريف" },
        { partyId: "strong", value: "احمد محمد شريف" },
        { partyId: "none", value: "سعيد إبراهيم" },
      ],
    });

    expect(candidates.map((candidate) => candidate.partyId)).toEqual([
      "strong",
      "weak",
    ]);
  });

  it("never returns the subject as its own candidate", () => {
    const candidates = findConflictCandidates({
      subject: "أحمد محمد الشريف",
      knownNames: [{ partyId: "self", value: "أحمد محمد الشريف" }],
      excludePartyId: "self",
    });

    expect(candidates).toEqual([]);
  });
});
