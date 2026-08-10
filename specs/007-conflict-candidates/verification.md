# Verification Record: Conflict Candidates

**Feature**: [Conflict Candidates](spec.md)
**Date opened**: 2026-08-11
**Requirement IDs**: LEG-CFL-004 (primary, **proposed**), LEG-CFL-001 and DAT-PRT-001 (boundary)
**Release / validation gate**: M3 / G2. **G2 remains shut.**
**Data classification**: Internal; synthetic fixtures only
**Implementation status**: Complete
**Activation status**: The matcher works and is measured. **No conflict may be cleared by it**, and no lawyer has validated its thresholds or scenario coverage.

## Process deviation

**Implementation preceded specification.** The work was planned in a working plan, approved, and built; the specification artifacts were written afterwards. That inverts the controlled sequence `CONSTITUTION.md` requires for a material feature.

It was caught by the pre-completion audit, not noticed during the work. Every claim in the specification is backed by a passing test, so nothing is overstated — but the specification did not shape the implementation, and a reviewer should weigh it accordingly. Recorded as **D-021**.

## Gate and prohibited-scope statement

G2 is shut and stays shut. No conflict was cleared, no matter opened, no engagement activated, no authority created, no parties merged. No disposition is set automatically. No legal validation is claimed, and `LEG-CFL-004` remains `status: proposed`.

## Requirement coverage

| Requirement | Implementation                                                                  | Evidence                                                 | Status   |
| ----------- | ------------------------------------------------------------------------------- | -------------------------------------------------------- | -------- |
| FR-001      | Alef, ta marbuta, alef maksura folding; diacritic and tatweel stripping.        | `arabic-names.test.ts`, one test per rule                | Complete |
| FR-002      | Article folded in both scripts, with an exception list and minimum stem length. | `arabic-names.test.ts`; `الله` preserved                 | Complete |
| FR-003      | Curated transliteration table, not a phonetic algorithm.                        | `arabic-names.test.ts` equivalence groups                | Complete |
| FR-004      | Positional comparison over the patronymic chain.                                | `conflict-candidates.test.ts` tiering tests              | Complete |
| FR-005      | `sharedPartsAcrossPositions`, reported as the weaker signal.                    | Ranking test surfacing a cross-position family name      | Complete |
| FR-006      | Tier, written rationale, and component evidence on every candidate.             | `conflict-candidates.test.ts` evidence test              | Complete |
| FR-007      | No clearing branch; empty result is silence.                                    | Domain and application no-clearing tests                 | Complete |
| FR-008      | Identical names rated strong with "human disposition" in the rationale.         | Identical-but-distinct test                              | Complete |
| FR-009      | Searches recorded, found or not.                                                | Integration test asserting the `searched.none` audit row | Complete |
| FR-010      | Authorisation checked before search; denial identical either way.               | Application test comparing both denials                  | Complete |
| FR-011      | Rates measured against the adversarial corpus.                                  | 7 corpus tests in `packages/testing`                     | Complete |
| FR-012      | Thresholds documented in code as engineering defaults; nothing acts on a tier.  | Module comment; no consumer branches on tier             | Complete |
| FR-013      | An unreadable name cannot match.                                                | Integration test: match, erase, no match                 | Complete |

| Success criterion | Result                                                               |
| ----------------- | -------------------------------------------------------------------- |
| SC-001            | Met. 10 of 10 same-party pairs surfaced, all rated strong.           |
| SC-002            | Met. 0 of 8 distinct pairs rated strong. Strong-tier precision 1.0.  |
| SC-003            | Met. No result clears, resolves, or confirms.                        |
| SC-004            | Met. Empty searches recorded as `conflict_candidates.searched.none`. |
| SC-005            | Met. The two denials compare equal.                                  |
| SC-006            | Met. An erased subject returns zero candidates.                      |
| SC-007            | Met. No gate closed; no legal validation claimed.                    |

## Command evidence

| Date       | Command                                                                           | Result                     | Notes                                                                                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-11 | `pnpm --filter @lexgate/domain exec vitest run src/arabic-names.test.ts`          | Expected fail, then passed | Caught two real bugs: the Arabic article was never stripped, so `الشريف` never matched `شريف`; and stripping it naively corrupts `الله` into `له` and breaks the compound `عبد الله`. |
| 2026-08-11 | `pnpm --filter @lexgate/domain exec vitest run src/conflict-candidates.test.ts`   | Expected fail, then passed | Caught that purely positional comparison misses a family name sitting third in one name and second in another.                                                                        |
| 2026-08-11 | `pnpm --filter @lexgate/testing exec vitest run src/arabic-name-matching.test.ts` | Passed                     | Corpus measurement: recall 10/10, strong-tier precision 1.0.                                                                                                                          |
| 2026-08-11 | `pnpm --filter @lexgate/database exec vitest run --no-file-parallelism`           | Passed                     | 41 PostgreSQL tests including the erasure interaction.                                                                                                                                |
| 2026-08-11 | `pnpm db:migrate` on a fresh database, then the database suite                    | Passed                     | Clean-database path reproducing CI.                                                                                                                                                   |
| 2026-08-11 | `pnpm verify:full`                                                                | Passed                     | Repository gate, production build, 12 browser tests.                                                                                                                                  |

Three diagnostic failures are recorded above rather than hidden. Each was a real defect in the implementation or in a test's scoping, and none was resolved by weakening an assertion.

## Residual risks

1. **Thresholds are engineering defaults.** No practising lawyer has set what constitutes a candidate, or reviewed whether the tiers match how a firm would triage. The system never acts on a tier.
2. **The transliteration table is incomplete by construction.** Its gaps are missed conflicts. That is preferred to a phonetic algorithm, which would be confidently wrong on Arabic in ways nobody could see, but it means coverage grows only as names are added.
3. **Matching is O(n) per search** in a tenant's readable names. Suitable for a pilot firm. A larger corpus would need searchable encryption, which would trade away part of the erasure guarantee.
4. **An erased subject vanishes from conflict matching.** Erasure and conflict-checking are in genuine tension. Both behaviours are correct; the tension is real and belongs in front of a reviewer.
5. **Organisations, not just people.** The corpus includes an organisation pair, but organisational naming — trading names, branches, corporate groups — is not modelled. The advocate review flagged corporate-group conflicts as a missing scenario family entirely.
6. **The specification followed the implementation.** See the process deviation above.

No exception is requested. No reviewer approval is claimed.
