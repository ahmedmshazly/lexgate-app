# Tasks: Gate Readiness Programme

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [access lifecycle contract](contracts/access-lifecycle.md), and [quickstart.md](quickstart.md)  
**Prerequisites**: Sponsor-approved controlled implementation; all reviewer gates remain open and synthetic-only  
**Tests**: Mandatory. This is P0 authorization work plus privacy, legal, operational, migration, and evidence controls. Write focused tests before the implementation they protect.  
**Authority**: G1, ODR-003, ODR-004, and G2 remain blocked until their named reviewers record actual approval. No task may create real data processing, a provider, a login route, an intake route, conflict clearance, engagement, matter, break-glass, or migration.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after its stated prerequisite because it changes independent files.
- **[US#]**: The user story the task advances.
- All fixtures, review scenarios, logs, and evidence are synthetic or safely redacted.

## Phase 1: Controlled setup and shared evidence

**Purpose**: Make the newly approved work auditable before it touches G1 or any review packet.

- [x] T001 Create the requirement, test-layer, reviewer, gate-status, residual-risk, and blocked-activation record in `specs/004-gate-readiness/verification.md`.
- [x] T002 [P] Add gate-readiness prohibited-scope regression coverage in `packages/testing/src/gate-readiness-boundaries.test.ts` for real data, provider, login, public intake, conflict clearance, engagement, matter, break-glass, and migration activation.
- [x] T003 [P] Add reusable opaque/synthetic access-lifecycle actors, approval references, Arabic/English scenario labels, and timestamps in `packages/testing/src/access-lifecycle-fixtures.ts` and export them from `packages/testing/src/index.ts`.
- [x] T004 [P] Create the controlled gate decision register in `specs/004-gate-readiness/evidence/gate-decision-register.md` with one unapproved entry for G1, ODR-003, ODR-004, and G2.
- [x] T005 Reconcile this feature’s approved scope and continuing G1 blocker with `specs/002-authorization-policy/spec.md` and `specs/002-authorization-policy/verification.md` without changing any gate status.

**Checkpoint**: The programme has a truthful evidence record and executable prohibited-scope boundary before lifecycle or reviewer-package implementation begins.

---

## Phase 2: Foundational access-lifecycle contracts

**Purpose**: Establish the provider-neutral command, aggregate, and persistence boundaries required by all G1 implementation work.

**⚠️ CRITICAL**: Complete this phase before implementing any lifecycle command or swapping the authorization reader to effective access.

- [x] T006 Define only framework-free lifecycle value types, event discriminants, approval-record shapes, and command/result/error payloads in `packages/domain/src/access-lifecycle.ts`; defer transition validation and behavior until after the failing US2 tests.
- [x] T007 Export the framework-free access-lifecycle domain contract from `packages/domain/src/index.ts` and retain the existing M1 authorization contract in `packages/domain/src/authorization.ts`.
- [x] T008 Define only trusted lifecycle command, authorization/admin approval, idempotent-outcome, session-invalidation, and privacy-safe logging port interfaces in `packages/application/src/access-lifecycle.ts`; defer command orchestration until after the failing US2 tests.
- [x] T009 Export application lifecycle commands/ports from `packages/application/src/index.ts` without adding a route, server action, provider SDK, or browser authority input.
- [x] T010 Define provider-neutral verified-principal/session-strength/expiry/invalidation interfaces in `packages/auth/src/index.ts` without selecting or invoking an identity provider.
- [x] T011 Reconcile the frozen legacy M1 rows, lifecycle ledger/projection ownership, backfill rules, and authorization-decision revision references in `specs/004-gate-readiness/data-model.md` before persistence implementation.

**Checkpoint**: Every G1 lifecycle fact, command, approval, projection, legacy mapping, and provider-neutral session boundary has a typed, framework-independent contract before database behavior is added.

---

## Phase 3: User Story 1 — Sponsor approves a controlled path to readiness (Priority: P1)

**Goal**: A sponsor and reviewer can distinguish authorized preparation from activation and can inspect a complete, non-self-approving decision register.

**Independent Test**: A static evidence review shows every gate has owner, required evidence, approval authority, residual risk, safe interim behavior, and an explicit “blocked” status; the boundary test rejects an activation path.

### Tests for User Story 1

- [x] T012 [P] [US1] Add static evidence assertions for the decision register’s required fields and the no-self-approval rule in `packages/testing/src/gate-readiness-packets.test.ts`.
- [x] T013 [P] [US1] Add documentation/traceability tests for the G1/ODR-003/ODR-004/G2 packet links in `tools/validate-docs.test.ts`.

### Implementation for User Story 1

- [x] T014 [US1] Create the one-page sponsor approval summary and complete the G1 decision-register entry/security-engineering review checklist in `specs/004-gate-readiness/evidence/sponsor-approval-summary.md`, `specs/004-gate-readiness/evidence/gate-decision-register.md`, and `specs/004-gate-readiness/evidence/g1-security-engineering-review.md` with every approval field left unapproved.
- [x] T015 [US1] Add a reviewer-ready status/owner/evidence matrix and non-activation statement to `specs/004-gate-readiness/verification.md`.
- [x] T016 [US1] Update controlled references, without closing decisions, in `docs/governance/OPEN_DECISIONS.md` and `docs/requirements/traceability.yaml`.

**Checkpoint**: Sponsor-approved preparation is traceable and cannot be confused with a passed gate.

---

## Phase 4: User Story 2 — Security and engineering can earn G1 rather than merely declare it (Priority: P1)

**Goal**: Exact access can be granted, suspended, reinstated, corrected, revoked, expired, and offboarded through append-only, attributable commands; authorization reads only effective access and fails closed.

**Independent Test**: With synthetic principals and restricted resources, exact active effective access allows only its exact operation. Role-only, cross-organization, stale, self-expansion, suspended, revoked, expired, offboarded, browser-asserted, incompatible-replay, concurrent-revocation, and emergency cases deny without a partial state.

### Tests for User Story 2

- [x] T017 [P] [US2] Write failing deterministic lifecycle transition and invariant tests in `packages/domain/src/access-lifecycle.test.ts` for grant, suspend, reinstate, revoke, correction, expiry, offboarding, requester/approver separation, and invalid predecessor states.
- [x] T018 [P] [US2] Write failing application tests in `packages/application/src/access-lifecycle.test.ts` for trusted operators, exact administrator authority, self-expansion denial, approval-scope/expiry validation, stale revisions, generic denial, idempotent replay, and session-invalidation intent.
- [x] T019 [P] [US2] Write failing PostgreSQL integration tests in `packages/database/src/access-lifecycle.integration.test.ts` for append-only ledger/receipt/approval guards, effective projection rebuild, legacy backfill, atomic lifecycle/audit/outbox writes, rollback, and two-connection revoke-versus-authorize serialization.
- [x] T020 [P] [US2] Extend negative authorization and regression coverage in `packages/domain/src/authorization.test.ts`, `packages/application/src/authorization.test.ts`, `packages/database/src/authorization.integration.test.ts`, and `packages/application/src/party-identity.test.ts` for effective state, revision evidence, and M2’s exact-party boundary.

### Implementation for User Story 2

- [x] T021 [US2] Implement domain lifecycle transition validation and immutable approval/receipt semantics in `packages/domain/src/access-lifecycle.ts`.
- [x] T022 [US2] Implement trusted server-side lifecycle command orchestration, administrator/approval checks, generic failure semantics, and privacy-safe log context in `packages/application/src/access-lifecycle.ts`.
- [x] T023 [US2] Add the additive schema migration for ledgers, approvals, receipts, projections, decision revision references, immutable database guards, and legacy synthetic backfill in `packages/database/src/schema.ts` and `packages/database/drizzle/`.
- [x] T024 [US2] Implement the serializable database lifecycle adapter, projection writer/rebuilder, command replay handling, atomic audit/outbox intent, and safe legacy compatibility reader in `packages/database/src/access-lifecycle.ts`.
- [x] T025 [US2] Change `packages/database/src/authorization.ts` to evaluate the effective membership/grant projections and persist the effective revisions used by each decision without changing generic denial behavior.
- [x] T026 [US2] Update synthetic relationship setup in `packages/database/src/authorization.integration.test.ts`, `packages/database/src/party-identity.integration.test.ts`, and `packages/testing/src/party-identity-fixtures.ts` so no new test writes legacy M1 relationship rows directly.
- [x] T027 [US2] Implement the provider-neutral session invalidation intent and boundary tests in `packages/auth/src/index.ts`, `packages/auth/src/index.test.ts`, and `packages/testing/src/gate-readiness-boundaries.test.ts` without adding a provider integration.
- [x] T028 [US2] Run the focused domain, application, database, authorization-negative, migration, concurrency, log/outbox-minimization, and M2 regression suites; record first-run failures and final results in `specs/004-gate-readiness/verification.md`.

**Checkpoint**: The technical G1 foundation is complete and testable with synthetic data, but G1 itself remains blocked pending provider/MFA, Security/Engineering, SEC-MAT, privacy, and operational evidence.

---

## Phase 5: User Story 3 — Privacy leadership can approve real-data processing deliberately (Priority: P1)

**Goal**: A Privacy/DPO reviewer receives a precise, synthetic-only review packet that prevents accidental collection or a generic-consent shortcut.

**Independent Test**: The packet has a complete processing-review, DPO determination, lawful-basis/notice/consent separation, sensitive-data guardrail, processor/transfer, rights/retention/hold, and breach-readiness record; no artifact represents a privacy approval or contains real data.

### Tests for User Story 3

- [x] T029 [P] [US3] Add static packet-completeness and prohibited-content tests in `packages/testing/src/gate-readiness-packets.test.ts` for the ODR-003 templates and synthetic-only privacy examples.
- [x] T030 [P] [US3] Add regression coverage in `packages/testing/src/gate-readiness-boundaries.test.ts` that rejects a production-data, real notice/consent capture, DPO appointment claim, processor, or transfer activation path.

### Implementation for User Story 3

- [x] T031 [US3] Create the per-workflow processing-review and privacy-notice/consent-separation template in `specs/004-gate-readiness/evidence/odr-003-processing-review.md`.
- [x] T032 [US3] Create DPO determination, sensitive-data intake guardrail, processor/transfer, rights/retention/hold, and breach-readiness templates in `specs/004-gate-readiness/evidence/odr-003-dpo-and-controls-review.md`.
- [x] T033 [US3] Add current primary-source references, reviewer instructions, controlled legal-source limitations, and unapproved outcome fields to the ODR-003 packet files in `specs/004-gate-readiness/evidence/`.
- [x] T034 [US3] Record the completed-but-unapproved ODR-003 evidence map, applicable G6 dependency, and privacy/DPO reviewer blocker in `specs/004-gate-readiness/verification.md` and `docs/requirements/traceability.yaml`.

**Checkpoint**: The privacy workstream is ready for qualified review, while all real personal-data processing and transfers remain blocked.

---

## Phase 6: User Story 4 — Legal operations and the practising lawyer can validate intake and conflict work (Priority: P1)

**Goal**: Product/legal operations can decide a real pilot without guesswork, and a practising Egyptian lawyer can review synthetic conflict scenarios without the system assuming a legal conclusion.

**Independent Test**: The POP contains every required operational topic and greenfield/no-migration decision. The scenario pack contains nine fictional scenario families, each with a safe system outcome, prohibited automated outcome, escalation, and empty reviewer outcome; no scenario creates an engagement, matter, authority, or clearance.

### Tests for User Story 4

- [x] T035 [P] [US4] Add static POP, discovery, migration-pack, and G2 scenario-pack completeness/non-automation tests in `packages/testing/src/gate-readiness-packets.test.ts`.
- [x] T036 [P] [US4] Add synthetic bilingual G2 scenario fixtures and invariant tests in `packages/testing/src/g2-lawyer-scenario-fixtures.ts` and `packages/testing/src/g2-lawyer-scenario-fixtures.test.ts`.

### Implementation for User Story 4

- [x] T037 [US4] Create the Product/legal-operations Pilot Operating Profile and discovery-evidence register templates in `specs/004-gate-readiness/evidence/odr-004-pilot-operating-profile.md`.
- [x] T038 [US4] Create the separately blocked future migration-decision template in `specs/004-gate-readiness/evidence/odr-004-migration-decision-pack.md` with no source data or migration authorization.
- [x] T039 [US4] Create the nine-case synthetic Egyptian-lawyer review packet in `specs/004-gate-readiness/evidence/g2-lawyer-scenario-pack.md` with legal-source location, safe/prohibited system outcomes, escalation, and unapproved reviewer-result fields.
- [x] T040 [US4] Record the M3 explicit-command boundary, G2 legal-review dependency, no-auto-clearance/engagement/authority/matter-access rules, and outstanding Product/legal-operations/lawyer sign-offs in `specs/004-gate-readiness/verification.md`, `specs/003-party-identity/verification.md`, and `docs/requirements/traceability.yaml`.

**Checkpoint**: ODR-004 and G2 reviewers have robust, controlled packets. ODR-004 remains open until the POP is completed and signed; G2 remains blocked until lawyer outcomes and future M3 conflict evidence exist.

---

## Phase 7: Cross-cutting verification, reviewer handoff, and convergence

**Purpose**: Prove the implementation, record external gate blockers accurately, and avoid handing off a green technical build as a false legal/privacy/security approval.

- [x] T041 [P] Re-run the requirements-quality checklists and update only evidence-backed statuses in `specs/004-gate-readiness/checklists/requirements.md` and `specs/004-gate-readiness/checklists/gate-readiness.md`.
- [x] T042 [P] Run `pnpm db:generate`, a clean disposable `pnpm db:migrate`, focused lifecycle/authorization/packet tests, `pnpm verify`, and `pnpm verify:full`; record exact command, environment, date, test result, migration, and any diagnostic retry in `specs/004-gate-readiness/verification.md`.
- [x] T043 [P] Perform a Security/Engineering evidence review against `specs/004-gate-readiness/evidence/g1-security-engineering-review.md`, retaining absent provider/MFA, penetration, incident, recovery, SEC-MAT, and reviewer evidence as blockers.
- [x] T044 Update `specs/004-gate-readiness/verification.md`, `specs/002-authorization-policy/verification.md`, and `specs/003-party-identity/verification.md` with requirement coverage, exact evidence, migration/recovery posture, residual risks, reviewer status, and no-activation statement.
- [x] T045 Run the convergence review, append each discovered taskable gap to `specs/004-gate-readiness/tasks.md`, implement it, and repeat until the feature converges without misrepresenting any external gate as passed.

## Dependencies and execution order

1. **Phase 1** creates the evidence boundary and may start immediately.
2. **Phase 2** defines lifecycle contracts before any G1 behavior is implemented.
3. **US1** can complete after Phase 1; it does not depend on G1 code and delivers sponsor/reviewer clarity first.
4. **US2** depends on Phases 1–2 and is the technical G1 foundation.
5. **US3** and **US4** depend on Phase 1 and can proceed in parallel with US2 because they create review artifacts and regression coverage only.
6. **Phase 7** requires all desired implementation and packet tasks. It records real reviewer blockers and runs convergence.

## Parallel opportunities

- T002–T004 can run in parallel after the verification record shell exists.
- T012–T013, T017–T020, T029–T030, and T035–T036 are independent test-first tasks in their respective stories.
- T031–T033 and T037–T039 are independent synthetic review-packet work after their corresponding test-first tasks.
- US3 and US4 may be completed in parallel with US2 after Phase 1. Database/schema work in US2 remains sequential after its domain/application contract.

## Implementation strategy

### MVP: truthful gate control

1. Complete Phase 1 and User Story 1.
2. Validate the decision register and prohibited-scope boundary.
3. Hand the packet structure to responsible reviewers without claiming any gate passed.

### Technical G1 increment

1. Complete Phase 2, then write US2 tests before behavior.
2. Add domain/application contracts, additive persistence, projection reader, and migration evidence.
3. Run focused and full checks. Preserve provider/MFA and reviewer items as blockers.

### Review-packet increments

1. Complete US3 and US4 with synthetic-only templates and static validation.
2. Obtain real external reviewer outcomes only through their accountable owners.
3. Begin a separate M3 feature only after the lawyer-approved scenario constraints are available; begin a production-data feature only after ODR-003/ODR-005 requirements are satisfied.

## Notes

- Every task uses a precise path and checklist format.
- Tests fail first where code changes are planned; no test may be weakened to preserve a prior green build.
- Completion of every repository task still leaves G1, ODR-003, ODR-004, and G2 status dependent on real named-reviewer evidence.

---

## Phase 8: Convergence

- [x] T046 Implement and integration-test deterministic rebuilding of effective membership and exact-grant projections from immutable lifecycle ledgers, including a safe no-op/recovery path, per FR-003 and plan: projection decision (partial).
- [x] T047 Implement and unit-test a provider-neutral verified-principal expiry guard, retaining generic deny behaviour and no provider activation, per US2/SC-002 and FR-004 (partial).
