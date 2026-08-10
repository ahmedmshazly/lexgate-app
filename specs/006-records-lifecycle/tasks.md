# Tasks: Records Lifecycle — Retention, Legal Hold, and Erasure

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [contract](contracts/records-lifecycle.md), [quickstart.md](quickstart.md)
**Prerequisites**: `REC-HLD-001` approved; `ADR-010` controlling. G6 is shut and stays shut.
**Tests**: Mandatory. This is P0 records work. Every behaviour is pinned by a failing test before the code that satisfies it.
**Authority**: No task may close a gate, destroy a record, drop an append-only guard, process real personal data, activate a retention schedule, or offer an erasure right to anyone.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: May run in parallel — touches independent files.
- **[US#]**: The scenario from spec.md that the task advances.

---

## Phase 1: Evidence shell

- [x] T001 Create the requirement-coverage, test-layer, residual-risk, and no-gate-closed record in `specs/006-records-lifecycle/verification.md`, with a row for every FR-001–FR-013 and SC-001–SC-008.
- [x] T002 [P] Add prohibited-scope regression coverage in `packages/testing/src/records-lifecycle-boundaries.test.ts` asserting no destruction path, no dropped append-only trigger, no retention schedule, and no gate status change, per FR-010 and SC-006.

**Checkpoint**: the boundary is executable before any records surface is touched.

---

## Phase 2: Tests before implementation

- [x] T003 [P] [US1] Write failing domain tests in `packages/domain/src/records-lifecycle.test.ts` for hold placement, release as successor, refusal to release an unheld record, and refusal of an unattributed hold, per FR-001, FR-002.
- [x] T004 [P] [US1] Write failing domain tests asserting `evaluateRecordDestruction` never returns an allow and reports a hold ahead of the shut gate, per FR-005 and SC-001.
- [x] T005 [P] [US1] Write failing domain tests asserting `evaluateSubjectErasure` refuses a held subject, and that **no operator identity is an input to the decision** — a hold is not a permission, per FR-003, FR-004, SC-002.
- [x] T006 [P] [US3] Write failing encryption round-trip tests in `packages/database/src/subject-keys.test.ts`: a value encrypts and decrypts to the original, two identical plaintexts produce different ciphertext, and a shredded key yields a redaction marker rather than an error, per FR-006, FR-009.
- [x] T007 [P] [US2] Write the failing decisive integration test in `packages/database/src/records-lifecycle.integration.test.ts`: place a hold, attempt erasure, confirm refusal; release; erase; confirm values unreadable and the event ledger intact, per FR-003, FR-007, FR-008.

**Checkpoint**: every required behaviour fails for the right reason. Record the first-run failures in `verification.md`.

---

## Phase 3: Legal hold ledger (Scenario 1 and 2, P1)

**Goal**: a hold that is placed, released as a successor fact, and answerable in one read.

- [x] T008 [US1] Define framework-free hold states, event types, command and transition shapes, and refusal reasons in `packages/domain/src/records-lifecycle.ts`, mirroring `access-lifecycle.ts`.
- [x] T009 [US1] Implement `deriveLegalHoldTransition` with placement, release-as-successor, stale-revision rejection, and required operator and reason, per FR-001, FR-002.
- [x] T010 [US1] Export the records-lifecycle contract from `packages/domain/src/index.ts`.
- [x] T011 [US1] Add `legal_hold_events`, `effective_legal_holds`, and `subject_encryption_keys` to `packages/database/src/schema.ts` per data-model.
- [x] T012 [US1] Add the additive migration in `packages/database/drizzle/0015_*.sql` with an append-only trigger on `legal_hold_events`, following `0009`. `subject_encryption_keys` deliberately carries **no** append-only trigger — shredding the key in place is the erasure.
- [x] T013 [US1] Implement the serializable persistence adapter and `rebuildEffectiveLegalHolds` in `packages/database/src/records-lifecycle.ts`, requiring an attributable operator and writing an audit row, mirroring `access-lifecycle.ts`.
- [x] T014 [US1] Implement trusted command orchestration and ports for placement and release in `packages/application/src/records-lifecycle.ts`; export from `packages/application/src/index.ts`, with tests in `packages/application/src/records-lifecycle.test.ts` so the layer has real callers rather than sitting unexercised.

**Checkpoint**: T003 passes. Holds are recorded and answerable.

---

## Phase 4: Refuse-only destruction (Scenario 1, P1)

- [x] T015 [US1] Implement `evaluateRecordDestruction` in `packages/domain/src/records-lifecycle.ts` returning `held`, `gate_g6_closed`, or `no_approved_retention_schedule`, with the hold reported first and no successful branch, per FR-005, FR-012.

**Checkpoint**: T004 passes. Destruction is refused with a reason a reader can act on.

---

## Phase 5: Keys and encrypted values (Scenario 3, P1)

- [x] T016 [US3] Implement AES-256-GCM helpers and the key registry in `packages/database/src/subject-keys.ts`: create, fetch, shred, and encrypt/decrypt with a fresh IV per value, per FR-006.
- [x] T017 [US3] Encrypt at the three write sites in `packages/database/src/party-identity.ts` (`createParty`, `recordName`, `recordContact`), after `assertSyntheticValue` has run on the plaintext, per FR-011.
- [x] T018 [US3] Decrypt or return the redaction marker at the two read sites in `readPartyHistory`, never throwing on a shredded key, per FR-009.
- [x] T019 [US3] Update `packages/database/src/party-identity.integration.test.ts`, which asserts plaintext values in the database. Preserve what each assertion was protecting; do not weaken one to accommodate encryption.

**Checkpoint**: T006 passes and the party regression suite is green against encrypted storage.

---

## Phase 6: Erasure (Scenario 3, P1)

- [x] T020 [US3] Implement `evaluateSubjectErasure` in the domain, refusing a held subject, taking no operator identity as an input, per FR-003, FR-004.
- [x] T021 [US3] Implement `eraseSubject` in `packages/application/src/records-lifecycle.ts` and its persistence in `packages/database/src/records-lifecycle.ts`: check the hold via `evaluateRecordDestruction`, shred the key, populate every shred field together, and write an attributable erasure audit row, per FR-006, FR-007.
- [x] T022 [US3] Make a repeated erasure resolve without recording a second removal, per FR-013.

**Checkpoint**: T007 passes. The decisive path holds.

---

## Phase 7: Evidence, review, and convergence

- [x] T023 [P] Record the crypto-shredding decision, its key-storage limitation, and the M3 matching consequence in `docs/assurance/RECORDS_AND_DOCUMENTS.md`.
- [x] T024 [P] Map `REC-HLD-001` to its implementation and evidence in `docs/requirements/traceability.yaml`, without changing any gate status.
- [x] T025 Run `pnpm verify` and `pnpm verify:full` with `DATABASE_URL` exported, plus a clean-database migration reproducing CI; record exact commands, environment, date, and results in `verification.md`.
- [x] T026 Run a cross-artifact analysis and resolve every material cross-artifact finding at its source.
- [x] T027 Run the convergence review, implement each appended task, and repeat until it reports convergence without misrepresenting G6 as passed.
- [x] T028 Update the feature verification record.

---

## Dependencies and execution order

1. **Phase 1** may start immediately.
2. **Phase 2** precedes Phases 3–6; every behaviour is test-first.
3. **Phase 3** blocks Phase 4 — the destruction evaluator reads hold state.
4. **Phase 5** blocks Phase 6 — erasure shreds a key that must first exist.
5. **Phase 4** and **Phase 5** are independent of each other and may proceed in parallel.
6. **Phase 7** requires all preceding phases.

## Parallel opportunities

- T003–T007 are five independent test-first files.
- T015 (refusal) and T016–T018 (encryption) touch disjoint files once Phase 3 lands.
- T023 and T024 touch files no other task writes.

## Implementation strategy

**MVP — the hold that actually stops something**: Phases 1–4. A hold is recorded, and destruction is refused with a reason. This alone satisfies `REC-HLD-001`'s acceptance criterion and is independently valuable even if erasure slipped.

**Erasure increment**: Phases 5–6. Personal data becomes erasable without any record being destroyed.

**Evidence increment**: Phase 7.

## Notes

- Every task names a precise path and traces to a requirement.
- Tests fail first. No test may be weakened to preserve a green build.
- Completing every task closes no gate. G6 remains shut, and authorisation to erase real personal data remains blocked regardless of how well the mechanism works.
