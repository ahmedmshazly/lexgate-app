# Verification Record: Records Lifecycle

**Feature**: [Records Lifecycle](spec.md)
**Date opened**: 2026-08-10
**Requirement IDs**: REC-HLD-001 (primary, approved), PRV-MIN-001 (boundary)
**Release / validation gate**: M9 / G6. **G6 remains shut.** No gate is closed.
**Data classification**: Internal; synthetic fixtures only
**Implementation status**: Complete
**Activation status**: The mechanism works and is tested. **Authorisation to erase real personal data remains blocked** — G6's Privacy/DPO reviewer has not been engaged, and `REC-HLD-001` carries `legal_validation: required`.

## Gate and prohibited-scope statement

G6 is shut and stays shut. No record was destroyed. No append-only guard was dropped. No retention schedule was activated. No erasure right is offered to anyone. No real personal data exists anywhere in this repository.

`evaluateRecordDestruction` has no successful branch, and a test asserts that no combination of its inputs permits destruction.

## Requirement coverage

| Requirement | Implementation                                                                                | Evidence                                                      | Status   |
| ----------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------- |
| FR-001      | Operator, reason, time, and covered resource required on every hold event.                    | `records-lifecycle.test.ts` unattributed-hold refusal         | Complete |
| FR-002      | Release is a successor event; migration `0015` adds an append-only trigger.                   | Integration test attempts to edit a placement and is rejected | Complete |
| FR-003      | Erasure refused while an active hold covers the subject.                                      | The decisive integration test                                 | Complete |
| FR-004      | `evaluateSubjectErasure` takes no operator, role, or authority as input.                      | `records-lifecycle.test.ts` arity and behaviour assertions    | Complete |
| FR-005      | Destruction refused in every case with a stated reason; hold reported ahead of the shut gate. | Exhaustive input-combination test                             | Complete |
| FR-006      | Erasure shreds the subject key; the record is untouched.                                      | `subject-keys.test.ts`, erasure integration test              | Complete |
| FR-007      | Stored value contains no plaintext; key material nulled.                                      | End-to-end erasure test inspects the stored row               | Complete |
| FR-008      | Hold ledger and audit events survive erasure in full.                                         | Decisive test asserts both events remain after erasure        | Complete |
| FR-009      | An erased value reads as a marker, not an error.                                              | `subject-keys.test.ts`, end-to-end read after erasure         | Complete |
| FR-010      | No scheduler, job, or time-based transition exists.                                           | No such code path; every erasure is an explicit command       | Complete |
| FR-011      | `assertSyntheticValue` runs on plaintext before encryption.                                   | Domain guard unchanged; encryption sits at persistence        | Complete |
| FR-012      | No retention schedule; refusal cites its absence.                                             | `no_approved_retention_schedule` branch and its test          | Complete |
| FR-013      | Repeat erasure resolves as `already_erased` with one audit row.                               | Repeated-erasure integration test                             | Complete |

| Success criterion | Result                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- |
| SC-001            | Met. Every destruction evaluation refuses, proven across all input combinations.          |
| SC-002            | Met. Zero held subjects erasable; authority is structurally not an input to the decision. |
| SC-003            | Met. Stored rows contain no plaintext; key material is null after erasure.                |
| SC-004            | Met. Hold ledger and erasure audit survive erasure intact.                                |
| SC-005            | Met. Operator and reason required on holds, releases, erasures, and rebuilds.             |
| SC-006            | Met. Zero records destroyed, zero guards removed, zero gates closed.                      |
| SC-007            | Met. Hold projection rebuilt from its ledger and verified.                                |
| SC-008            | Met. Synthetic values only, enforced by the existing content control.                     |

## Test-layer applicability

| Layer                                              | Status             | Evidence                                                                                                                                                                                      |
| -------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static, documentation, type, lint                  | Required           | `pnpm format:check`, `pnpm docs:validate`, `pnpm lint`, `pnpm typecheck`                                                                                                                      |
| Domain invariant and negative behaviour            | Required           | 15 tests in `packages/domain/src/records-lifecycle.test.ts`                                                                                                                                   |
| Database, migration, integration                   | Required           | 6 records tests plus 7 encryption tests; 36 database tests overall                                                                                                                            |
| Authorization, privacy, records, security-negative | Required           | Hold-cannot-be-overridden; stored data unreadable after erasure                                                                                                                               |
| Browser/E2E, accessibility, locale, RTL            | **Not applicable** | No route, view, or user-facing surface is introduced. Existing shell suites run unchanged.                                                                                                    |
| Performance, resilience, backup/restore, incident  | **Not applicable** | No runtime service or operational surface changes; no performance claim made. Backup inertness is a design consequence, argued in the specification, not an operational claim evidenced here. |

## Command evidence

| Date       | Command                                                                       | Result | Notes                                                                                |
| ---------- | ----------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| 2026-08-10 | `pnpm --filter @lexgate/domain exec vitest run src/records-lifecycle.test.ts` | Passed | 15 domain tests: transitions, refusals, and the authority-is-not-an-input guarantee. |
| 2026-08-10 | `pnpm --filter @lexgate/database exec vitest run src/subject-keys.test.ts`    | Passed | 7 tests: round trip, distinct ciphertext, tamper detection, erased marker.           |
| 2026-08-10 | `pnpm --filter @lexgate/database exec vitest run --no-file-parallelism`       | Passed | 36 PostgreSQL tests across 6 files.                                                  |
| 2026-08-10 | `pnpm db:migrate` on a fresh database, then the full database suite           | Passed | Clean-database path reproducing CI. 36 tests.                                        |
| 2026-08-10 | `pnpm verify:full`                                                            | Passed | Repository gate, production build, and 12 browser tests.                             |

One diagnostic failure occurred and is recorded rather than hidden: an existing party test asserted plaintext in the database row and failed once values became encrypted. It was corrected by decrypting and comparing, which preserves what the assertion protected and adds two guarantees it could not previously make. No assertion was weakened.

## Residual risks

1. **Keys are stored in the same database as the ciphertext.** Anyone with database access holds both halves. This is an **erasure** mechanism, not a confidentiality control, and must not be described as encryption at rest. A separate managed key store is required before any real personal data exists, and depends on `ODR-005`, which is open.
2. **Encrypted values cannot be matched.** The G2 analysis identified Arabic name variation as the sharpest conflict-detection risk. Ciphertext cannot be fuzzy-matched, so the future M3 matching engine must decrypt in memory. Recorded now, before that work is designed against an assumption of readable stored values.
3. **The legal question is untouched.** Whether Egyptian law exempts privileged material from a data subject's erasure right is unanswered. The mechanism exists; _when_ it may be invoked for a real subject stays blocked.
4. **No retention schedule exists.** Nothing expires. Every erasure is an explicit, attributable command, and destruction refusal cites the absent schedule so the gap stays visible.
5. **An erased subject cannot receive new personal data.** Attempting to record a name or contact for an erased subject raises a conflict. This is deliberate — re-populating an erased subject would defeat the erasure — but it is a behaviour a future intake flow must handle rather than discover.

No exception is requested. No reviewer approval is claimed, and `REC-HLD-001`'s `legal_validation: required` remains unsatisfied.
