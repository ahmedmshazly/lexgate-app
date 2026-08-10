# Tasks: M0 Controlled Foundation

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), and [contracts/](contracts/)  
**Prerequisites**: Controlled M0 requirements and completed requirement-quality checklists  
**Tests**: Required by the P0 quality profile; write focused tests before their corresponding implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]** denotes independent files with no unmet dependency.
- **[US1]** is the bilingual internal shell, **[US2]** is atomic transition persistence, and **[US3]** is controlled traceability and quality evidence.

## Phase 1: Foundation quality setup

**Purpose**: Establish executable M0 boundary and database-test prerequisites before user-story changes.

- [x] T001 Add enforced domain and provider restricted-import rules for ARC-MOD-001 and INT-ADP-001 in eslint.config.mjs
- [x] T002 [P] Add deterministic domain/integration boundary and M0 no-activation source regression coverage for ARC-MOD-001, INT-ADP-001, and QLT-EVD-001 in packages/testing/src/foundation-boundaries.test.ts
- [x] T003 [P] Provision local-equivalent PostgreSQL service, propagate DATABASE_URL through Turborepo, and add a clean migration step for integration evidence in .github/workflows/ci.yml and turbo.json
- [x] T004 [P] Document database-backed minimum quality-gate prerequisites without exposing credentials in README.md

**Checkpoint**: Boundary violations and database evidence prerequisites are executable without selecting any provider or exposing a production path.

## Phase 2: Foundational transition persistence

**Purpose**: Complete the shared audit/outbox boundary before any story depends on it.

- [x] T005 Add failing positive and authorization-negative command tests for explicit material-transition recording in packages/application/src/index.test.ts
- [x] T006 Add an application-owned material-transition persistence port and refactor recordMaterialTransition to use it in packages/application/src/index.ts
- [x] T007 Add failing ARC-OUT-001 PostgreSQL integration coverage for atomic audit/outbox commit and duplicate-event rollback in packages/database/src/material-transition.integration.test.ts
- [x] T008 Extend M0 outbox delivery bookkeeping fields and immutable audit/outbox schema constraints in packages/database/src/schema.ts
- [x] T009 Implement the transaction-scoped Drizzle material-transition persistence adapter in packages/database/src/material-transition.ts
- [x] T010 Generate, inspect, and commit the additive Drizzle migration and snapshot from packages/database/src/schema.ts in packages/database/drizzle/
- [x] T011 Add database package exports and workspace dependencies required by the application-port adapter in packages/database/package.json

**Checkpoint**: A synthetic material transition is atomically auditable and queued; duplicate-event failure leaves neither newly inserted record committed.

## Phase 3: User Story 1 — Navigate the controlled bilingual foundation (Priority: P1) 🎯 MVP

**Goal**: Deliver an accessible English/Arabic internal foundation shell that has semantic locale/direction and makes no unapproved public or legal claim.

**Independent test**: Run the browser suite against `/en`, `/ar`, and an unsupported locale; verify semantic metadata, approved mark use, visible keyboard focus, internal-only wording, RTL direction, and automated WCAG A/AA results.

- [x] T012 [US1] Extend I18N-RTL-001 browser acceptance coverage for the curated mark, unsupported locale, keyboard focus, internal-only wording, English/Arabic metadata, and RTL in tests/e2e/foundation.spec.ts
- [x] T013 [US1] Add the approved Portal mark deployment asset from the controlled brand package in apps/web/public/brand/portal-gold.svg
- [x] T014 [US1] Replace the hand-authored mark with the approved, decorative Next.js image component in apps/web/src/components/portal-mark.tsx
- [x] T015 [US1] Add visible keyboard focus and any needed logical RTL styling for the approved mark in apps/web/src/app/globals.css

**Checkpoint**: The localized M0 shell is independently browser-verifiable and remains an internal engineering surface.

## Phase 4: User Story 2 — Preserve bounded foundation behavior (Priority: P1)

**Goal**: Ensure explicit material-transition recording is authorized, atomic, observable, and provider-neutral.

**Independent test**: Against synthetic local PostgreSQL, assert a successful transition creates one audit/outbox pair and a duplicate outbox identifier rolls back the audit insert; run boundary lint/tests to reject prohibited imports.

- [x] T016 [US2] Add deterministic outbox delivery-record types and failure-safe retry bookkeeping contracts in packages/events/src/index.ts
- [x] T017 [US2] Add structured worker-boundary tests proving no provider delivery is enabled and failure details are not emitted in apps/worker/src/index.test.ts
- [x] T018 [US2] Refine the M0 worker startup boundary to use the typed outbox contract while retaining no-provider delivery behavior in apps/worker/src/index.ts

**Checkpoint**: The database adapter, application command, source restrictions, and worker boundary prove the M0 outbox design without activating a provider.

## Phase 5: User Story 3 — Maintain controlled requirements and quality evidence (Priority: P1)

**Goal**: Make M0 requirement traceability and evidence reviewable, reproducible, and unable to conceal a missing required result.

**Independent test**: Documentation validation accepts the canonical records; a malformed fixture/record is rejected by the existing validator; verification maps every M0 requirement and test layer to a command or explicitly blocked review.

- [x] T019 [US3] Add a deterministic QLT-TRC-001 malformed-P0-record validation fixture or subprocess test for tools/validate-docs.ts in tools/validate-docs.test.ts
- [x] T020 [US3] Refactor documentation validation for testable input paths and run its regression test through the standard quality gate in tools/validate-docs.ts and package.json
- [x] T021 [US3] Create the M0 requirement-to-evidence, test-layer, risk, and G0 approval record in specs/001-m0-foundation/verification.md

**Checkpoint**: Traceability failures are executable and every material M0 obligation has an evidence location or a visible release blocker.

## Phase 6: Polish and release evidence

**Purpose**: Collect reproducible implementation evidence and retain the G0 activation boundary.

- [x] T022 Format changed workspace and lockfile content with the configured Prettier policy in pnpm-lock.yaml
- [x] T023 Run focused unit, integration, boundary, documentation, and browser checks; record exact commands and first-run outcomes in specs/001-m0-foundation/verification.md
- [x] T024 Run pnpm verify and pnpm verify:full after local services/migration; record exact outcomes and any diagnostics in specs/001-m0-foundation/verification.md
- [x] T025 Perform and record synthetic English/Arabic keyboard-only manual assessment; record screen-reader/inclusive-user review and G0 engineering-and-quality approval as activation blockers pending accountable reviewers in specs/001-m0-foundation/verification.md
- [x] T026 Reconcile requirement traceability and feature artifacts with the delivered implementation in docs/requirements/traceability.yaml and specs/001-m0-foundation/verification.md

## Dependencies and execution order

- Phase 1 can begin immediately. T001/T002 are complementary and T003/T004 have independent files.
- Phase 2 depends on Phase 1. T005 precedes T006; T007 precedes T009; T008 precedes T009/T010; T011 follows the adapter implementation.
- Phase 3 depends on the workspace baseline only and can run in parallel with Phase 2 after T001. T012 precedes T014/T015; T013 precedes T014.
- Phase 4 depends on Phase 2; T016 precedes T018 and T017 can begin independently.
- Phase 5 depends on the test setup and existing validator; T019 precedes T020, and T021 is updated again by Phase 6.
- Phase 6 requires all previous phases. T024 is never considered satisfied by a retry; T025 and G0 approval status are recorded after execution evidence.

## Parallel opportunities

- Phase 1: T002, T003, and T004 can proceed independently after T001’s policy choice is settled.
- After the shared M0 baseline: the browser work in Phase 3 can proceed alongside database implementation in Phase 2.
- T017 worker tests and T019 validator tests use unrelated files and can proceed after their respective foundations.

## Implementation strategy

1. Establish testable boundaries and PostgreSQL CI prerequisites.
2. Implement and prove atomic audit/outbox persistence using only synthetic records.
3. Deliver the independently verifiable bilingual internal shell with the controlled mark.
4. Complete traceability/validator evidence and run the full quality gate.
5. Run the convergence review; any remaining gap is appended and implemented before handoff.
