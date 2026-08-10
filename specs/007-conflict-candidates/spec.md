# Feature Specification: Conflict Candidates — Arabic Name Matching

**Requirement IDs:** LEG-CFL-004 (primary, **status: proposed**), LEG-CFL-001 (boundary), DAT-PRT-001 (boundary)
**Risk tier:** P0
**Release / validation gate:** M3 / G2. **No gate is closed.** An M0 foundation built ahead of its gate, following the precedent of feature 004's technical G1 increment.
**Data classification:** Internal; synthetic fixtures only
**Legal/privacy validation:** required, and **blocked** — no practising Egyptian lawyer has been engaged
**Feature owner:** Legal operations
**Status:** draft — proposed for approval

> **Process deviation, recorded rather than hidden.** Implementation preceded this specification. The work was planned and approved in a working plan, then built, and these spec workflow artifacts were written afterwards. That inverts the controlled sequence `CONSTITUTION.md` requires for a material feature. Nothing was concealed and every claim below is backed by a passing test, but the specification did not shape the implementation — the implementation shaped it. Recorded as **D-021**.

## User outcome and scope

An advocate-perspective review traced the codebase and found **no name-matching capability at all**. Normalization was literally `value.trim()`, and `flagPossibleDuplicate` took two party identifiers a human had already decided to link. Nothing in the running system would ever notice that "مريم سالم", "Mariam Salem", and "Mariam Saleem" might be one person — the G2 scenario pack's own example.

It also named a failure mode nobody had written down. **False positives are as dangerous as missed conflicts here.** Egyptian patronymic naming reuses a small pool of given names, so unrelated people sharing a full tripartite name is the normal case rather than the edge case. A matcher that flags constantly trains staff to dismiss without reading — and because a rejected flag records no reasoning, alert fatigue then becomes indistinguishable from analysis in the audit trail.

**The measurable outcome**: a reviewer receives ranked, explained candidates for names that resemble each other across spelling and transliteration variation, with a false-positive rate low enough that the flags stay worth reading — and no candidate ever clears a conflict.

**Actors**: an authorised reviewer searching for candidates; any other caller, who must learn nothing at all.

**In scope** — Arabic orthographic normalization; transliteration equivalence; component-aware comparison over the patronymic chain; tiered candidates carrying written rationale and evidence; measurement of false-positive and false-negative rates against an adversarial corpus; the guarantee that no result clears a conflict.

**Explicit exclusions — this feature must not**

- Clear a conflict, open a matter, activate an engagement, or create authority or access.
- Set a disposition automatically. Every disposition remains a human act.
- Merge parties, or treat a match as identity.
- Disclose candidate facts, or their absence, to an unauthorised caller.
- Close G2 or claim any legal validation.

**Dependencies**: the G2 scenario pack's stated boundaries as the concrete authority. `LEG-CFL-004` is **proposed, not approved**; only its negative guarantee is relied upon, because a restriction cannot become false as the requirement evolves.

## User scenarios and acceptance criteria

### Scenario 1 — Spelling variation does not hide a person (Priority: P1)

1. **Given** a stored name written with an alef variant and a definite article, **when** a reviewer searches the same name written plainly, **then** it is surfaced as a strong candidate.
2. **Given** a name stored in Arabic, **when** a reviewer searches its Latin transliteration, **then** it is surfaced.
3. **Given** two Latin transliterations of one Arabic name, **when** either is searched, **then** the other is surfaced.
4. **Given** a compound theophoric name written spaced, **when** the joined form is searched, **then** it is surfaced.

### Scenario 2 — Coincidence does not flood the reviewer (Priority: P1)

1. **Given** two people sharing only a family name, **when** compared, **then** the candidate is rated weak, not strong.
2. **Given** two people sharing a given name and a father's name but differing at the grandfather, **when** compared, **then** the candidate is not rated strong.
3. **Given** the full corpus of deliberately similar but distinct pairs, **when** each is compared, **then** none is rated strong.

### Scenario 3 — Nothing is ever cleared (Priority: P1)

1. **Given** any pair of names, **when** compared, **then** the result carries no cleared, resolved, or confirmed outcome.
2. **Given** a search returning no candidates, **when** the result is read, **then** it means no stored name resembled the subject and asserts nothing about the parties.
3. **Given** two unrelated people with an identical full name, **when** compared, **then** a strong candidate is raised **and** its rationale states that human disposition is required.
4. **Given** a search that found nothing, **when** the audit trail is inspected, **then** the search itself is recorded, so silence is distinguishable from never having looked.

### Scenario 4 — Candidate facts are protected (Priority: P1)

1. **Given** an unauthorised caller, **when** a search is attempted, **then** it is denied and the search does not run.
2. **Given** an unauthorised caller, **when** the denial is compared between a case with candidates and a case without, **then** the two are identical.

### Edge cases

- A name of two parts compared against one of four.
- A shared part appearing at different positions in the two names.
- A name whose subject has been erased, whose values can no longer be read.
- A name containing only honorifics or punctuation.

## Requirements

- **FR-001**: Alef variants, ta marbuta against ha, alef maksura against ya, diacritics, and tatweel MUST NOT cause two spellings of one name to differ. **Negative case**: any of these producing a missed candidate.
- **FR-002**: The definite article MUST be folded in both scripts, without corrupting words that merely begin with its letters. **Negative case**: `الله` reduced to `له`.
- **FR-003**: Known transliteration variants of a name MUST compare as equivalent, through a curated table rather than a phonetic algorithm. **Rationale**: an algorithm tuned for English phonology produces confident nonsense on Arabic; a table's gaps are visible and correctable.
- **FR-004**: Comparison MUST be component-aware over the patronymic chain, so a shared family name is distinguishable from a shared given–father–grandfather sequence. **Negative case**: whole-string similarity treating the two alike.
- **FR-005**: A shared part appearing at different positions MUST still be detected, and MUST be reported as a weaker signal than the same part in the same position.
- **FR-006**: Every candidate MUST carry a tier, a written rationale naming what matched and how, and the component evidence. **Negative case**: a bare score.
- **FR-007**: No result MUST clear, resolve, or confirm a conflict, and an empty result MUST NOT be readable as a clearance.
- **FR-008**: An identical full name MUST be surfaced as a candidate **and** its rationale MUST state that human disposition is required, because unrelated people share full names.
- **FR-009**: Every search MUST be recorded, including one that found nothing.
- **FR-010**: Candidate facts MUST reach only an authorised reviewer, and a denial MUST be identical whether or not candidates exist.
- **FR-011**: The false-positive and false-negative rates MUST be measured against an adversarial corpus, not asserted.
- **FR-012**: Tier thresholds are engineering defaults. The system MUST NOT act on a tier, and this MUST be stated in the code.
- **FR-013**: A subject whose key has been shredded MUST be absent from matching.

### Key entities

- **Candidate** — a resemblance between two names, carrying tier, rationale, and evidence. Never a finding.
- **Name part** — one element of a patronymic chain, comparable in position and out of it.
- **Adversarial corpus** — labelled synthetic pairs that make accuracy measurable.

## Non-functional and quality profile

| Test / evidence layer                       | Status and rationale                                                                                                                                           | Acceptance evidence                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Static, documentation, type, lint           | **Required**                                                                                                                                                   | `pnpm format:check`, `pnpm docs:validate`, `pnpm lint`, `pnpm typecheck` |
| Unit/domain invariant and negative behavior | **Required** — normalization and the no-clearing guarantee are domain invariants                                                                               | 31 tests across `arabic-names` and `conflict-candidates`                 |
| Measured accuracy                           | **Required** — the whole false-positive argument is empirical                                                                                                  | 7 corpus tests in `packages/testing`                                     |
| Database and integration                    | **Required** — matching runs over encrypted values                                                                                                             | 5 integration tests                                                      |
| Authorization and security-negative         | **Required** — a denial must disclose nothing                                                                                                                  | 5 application tests                                                      |
| Browser/E2E, accessibility, locale, RTL     | **Not applicable** — no user-facing surface is introduced                                                                                                      | Existing shell suites run unchanged                                      |
| Performance, resilience, backup/restore     | **Not applicable to this increment** — no operational surface changes and no performance claim is made. The O(n) scale limit is exposed rather than optimised. | Rationale recorded here                                                  |

**Measurable outcomes**

- **SC-001**: 100% of same-party corpus pairs are surfaced, and all are rated strong.
- **SC-002**: 0% of distinct-party corpus pairs are rated strong. Strong-tier precision is 1.0.
- **SC-003**: Zero results clear, resolve, or confirm a conflict.
- **SC-004**: 100% of searches are recorded, including empty ones.
- **SC-005**: An unauthorised denial is byte-identical whether or not candidates exist.
- **SC-006**: An erased subject appears in zero candidate results.
- **SC-007**: No gate is closed and no legal validation is claimed.

## Risks, decisions, and safe interim behavior

| Risk                                                                                    | Owner        | Gate / decision | Safe interim behavior                                                                          |
| --------------------------------------------------------------------------------------- | ------------ | --------------- | ---------------------------------------------------------------------------------------------- |
| Tier thresholds are engineering defaults with no lawyer behind them.                    | Legal ops    | G2 open         | The system never acts on a tier; it only surfaces for review.                                  |
| The transliteration table is incomplete by construction; its gaps are missed conflicts. | Legal ops    | G2 open         | Gaps are visible and correctable, unlike an algorithm's. Additions are cheap.                  |
| Matching is O(n) per search in a tenant's readable names.                               | Architecture | ODR-005 open    | Suits a pilot firm. The count is exposed so the limit stays observable rather than surprising. |
| An erased subject vanishes from conflict matching.                                      | Records      | G6 open         | Correct — erasure means erasure — but a genuine tension a reviewer must see stated.            |
| `LEG-CFL-004` is proposed, not approved.                                                | Legal ops    | G2 open         | Only its negative guarantee is relied upon.                                                    |
| The specification was written after the implementation.                                 | Engineering  | D-021           | Every claim is test-backed, but the specification did not constrain the build.                 |

## Verification record contract

`specs/007-conflict-candidates/verification.md` must map FR-001–FR-013 and SC-001–SC-007 to implementation, tests, exact commands and results, residual risk, and the recorded process deviation. It must state that G2 remains shut, that no conflict was cleared, and that no legal validation is claimed.
