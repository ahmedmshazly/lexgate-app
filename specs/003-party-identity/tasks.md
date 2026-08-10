# Tasks: M2 Party Identity Foundation

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [party-identity contract](contracts/party-identity.md), and [quickstart.md](quickstart.md)

**Authority**: DAT-PRT-001 is approved only for this synthetic, internal, reversible foundation. ODR-003, ODR-004, M1/G1 access-lifecycle validation, and G2 Egyptian-lawyer scenario validation remain activation blockers.

**Tests**: Tests are mandatory. The feature changes domain, application, database, audit/outbox, and authorization behavior. All fixtures are synthetic and use Arabic/English test values. No browser route is created, so browser/a11y/RTL tests are not applicable to this slice; their exclusion must remain in `verification.md`.

**Organization**: Tasks are grouped by the specification’s three P1 user stories. User Story 1 establishes the neutral party slice; User Stories 2 and 3 build on its party persistence while preserving independently testable acceptance behavior.

## Phase 1: Setup and feature guardrails

**Purpose**: Establish synthetic fixtures and prohibited-scope checks shared by all M2 work.

- [x] T001 [P] Create reusable synthetic party/actor/privacy-metadata fixtures with Arabic, English, transliterated, and opaque-ID examples in `packages/testing/src/party-identity-fixtures.ts`.
- [x] T002 [P] Add a no-public-party/intake/client/conflict/merge route and no-provider-import boundary test for DAT-PRT-001 in `packages/testing/src/party-identity-boundaries.test.ts`.
- [x] T003 Export the M2 fixture and boundary-test public helpers from `packages/testing/src/index.ts`.

**Checkpoint**: Shared fixtures express the approved synthetic-only boundary and prohibited surface before domain or database work begins.

---

## Phase 2: Foundational domain, ports, and immutable persistence

**Purpose**: Create prerequisites required by every M2 user story.

**⚠️ CRITICAL**: Complete this phase before the user-story implementation tasks. It establishes the only permitted privacy, authorization, audit, and persistence boundary.

- [x] T004 Define framework-free party kinds, assertion review states, minimal representation states, required synthetic privacy-handling metadata, validation errors, and common ID/time validation in `packages/domain/src/party-identity.ts`.
- [x] T005 Export the approved M2 domain contracts from `packages/domain/src/index.ts` without importing database, framework, provider, or Node runtime modules.
- [x] T006 Define typed party-identity persistence/read ports, command outcomes, generic errors, and trusted-actor command helpers in `packages/application/src/party-identity.ts`.
- [x] T007 Export the M2 application commands and ports from `packages/application/src/index.ts` without adding a route, server action, or browser authority input.
- [x] T008 Define organization-scoped party, assertion, primary-name-assignment, representation, possible-duplicate, and party-audit/command-receipt tables with composite foreign keys and uniqueness constraints in `packages/database/src/schema.ts`.
- [x] T009 Generate and inspect the additive M2 Drizzle schema migration in `packages/database/drizzle/` and its metadata snapshot in `packages/database/drizzle/`.
- [x] T010 Add reviewed PostgreSQL append-only triggers for every M2 party, assertion, assignment, duplicate, and audit/command-receipt table in `packages/database/drizzle/0006_party-identity-immutability.sql`.
- [x] T011 Create the database adapter module/export seam for M2 commands and reads in `packages/database/src/party-identity.ts` and `packages/database/src/index.ts`.

**Checkpoint**: The schema is additive, organization-scoped, and immutable by database enforcement; no web/API surface exists.

---

## Phase 3: User Story 1 — Record a prospective party accurately (Priority: P1) 🎯 MVP

**Goal**: An explicitly authorized internal actor can create a neutral synthetic person or organization with a primary name and purpose-limited contact without creating a client, engagement, matter, authority, or public intake surface.

**Independent Test**: With synthetic values, the focused domain/application/database tests create each party kind with complete privacy metadata, primary-name history, contact assertion, immutable organization-scoped audit receipt, and minimal outbox event. Role-only, browser-supplied, cross-organization, malformed, or failed-transaction input persists nothing.

### Tests for User Story 1

- [x] T012 [P] [US1] Write positive and prohibited neutral-party, primary-name, contact-purpose, and privacy-metadata tests in `packages/domain/src/party-identity.test.ts`.
- [x] T013 [P] [US1] Write trusted-actor, registry/party authorization-negative, generic-denial, and non-persistence tests for create/read commands in `packages/application/src/party-identity.test.ts`.
- [x] T014 [P] [US1] Write clean-migration PostgreSQL tests for person/organization creation, contact provenance, composite organization scope, audit/outbox atomicity, direct mutation rejection, and failure rollback in `packages/database/src/party-identity.integration.test.ts`.

### Implementation for User Story 1

- [x] T015 [US1] Implement pure validation and immutable command/event construction for neutral party creation, primary-name selection, and contact assertions in `packages/domain/src/party-identity.ts`.
- [x] T016 [US1] Implement `createNeutralParty` and `readPartyIdentityHistory` with M1 registry/exact-party authorization and privacy-safe logging in `packages/application/src/party-identity.ts`.
- [x] T017 [US1] Implement transactional party/name/primary/contact creation, internal read projection, minimal outbox event, and organization-scoped audit/command receipt persistence in `packages/database/src/party-identity.ts`.
- [x] T018 [US1] Add a privacy-safe party command log context with no name/contact/source values in `packages/observability/src/index.ts` and assert it through `packages/application/src/party-identity.test.ts`.

**Checkpoint**: User Story 1 is independently functional through internal ports and database tests only; it exposes no UI/API and no client/matter/legal state.

---

## Phase 4: User Story 2 — Preserve Arabic and English identity variants (Priority: P1)

**Goal**: An explicitly authorized internal actor can record Arabic, English, transliterated, former, trading, abbreviated, and alternate synthetic name forms with provenance and correction history, without equating names or merging parties.

**Independent Test**: A party retains a primary Arabic or English name plus later variants. A primary correction creates a new assignment lineage; a prior name stays visible. Bad source/language/privacy metadata, invalid lineage, branch conflict, cross-organization reference, direct update/delete, and duplicate command misuse fail safely.

### Tests for User Story 2

- [x] T019 [P] [US2] Add domain tests for bilingual/transliterated variants, mandatory provenance/privacy metadata, primary-name replacement lineage, and prohibited legal-equivalence/merge states in `packages/domain/src/party-identity.test.ts`.
- [x] T020 [P] [US2] Add application tests proving `recordPartyName` uses exact-party authorization, ignores browser authority assertions, and returns generic denial without an overwrite path in `packages/application/src/party-identity.test.ts`.
- [x] T021 [P] [US2] Add PostgreSQL tests for composite lineage FKs, serializable primary assignment conflicts, append-only name/assignment rows, replay/incompatible command IDs, and no partial audit/outbox rows in `packages/database/src/party-identity.integration.test.ts`.

### Implementation for User Story 2

- [x] T022 [US2] Implement name-form and primary-assignment correction validation, deterministic current-primary projection, and no-merge/no-equivalence invariants in `packages/domain/src/party-identity.ts`.
- [x] T023 [US2] Implement the explicit `recordPartyName` application command and privacy-safe outcome/logging behavior in `packages/application/src/party-identity.ts`.
- [x] T024 [US2] Implement serializable name-form/primary-assignment persistence and replay-safe audit/outbox receipt handling in `packages/database/src/party-identity.ts`.

**Checkpoint**: User Stories 1 and 2 preserve bilingual identity history without silently replacing names, auto-merging parties, or creating a conflict decision.

---

## Phase 5: User Story 3 — Record representation without creating legal authority (Priority: P1)

**Goal**: An explicitly authorized internal actor can record a sourced synthetic representation claim and possible-duplicate cue while both remain non-authoritative, organization-scoped, and reviewable.

**Independent Test**: A representation claim between two synthetic parties and a duplicate cue between an ordered distinct pair persist with complete privacy metadata only when the trusted actor has an exact grant to both parties. They grant no M1 access, client status, engagement, matter, legal authority, canonical identity, merge, or conflict clearance. Missing either grant, cross-organization/self/reversed-pair, and update/delete attempts fail generically.

### Tests for User Story 3

- [x] T025 [P] [US3] Add domain tests for claim states, effective-date validity, complete privacy metadata, distinct ordered duplicate pairs, and prohibited authority/engagement/merge/conflict results in `packages/domain/src/party-identity.test.ts`.
- [x] T026 [P] [US3] Add application tests requiring exact-party authorization for both parties in representation/duplicate commands and proving their outcomes cannot create M1 access grants or legal-authority states in `packages/application/src/party-identity.test.ts`.
- [x] T027 [P] [US3] Add PostgreSQL tests for two-party composite organization FKs, self/reversed duplicate rejection, append-only claim/cue/audit receipt behavior, and transactional rollback in `packages/database/src/party-identity.integration.test.ts`.

### Implementation for User Story 3

- [x] T028 [US3] Implement pure representation-claim and possible-duplicate validation/events with explicit non-authoritative and no-merge invariants in `packages/domain/src/party-identity.ts`.
- [x] T029 [US3] Implement `recordRepresentationClaim` and `flagPossibleDuplicate` with M1 exact-party authorization for both linked parties in `packages/application/src/party-identity.ts`.
- [x] T030 [US3] Implement transactional representation/duplicate persistence, scoped internal read projection, audit receipt, and minimal outbox events in `packages/database/src/party-identity.ts`.

**Checkpoint**: All M2 user stories are independently demonstrable using synthetic internal ports only. No G2 legal workflow has been activated.

---

## Phase 6: Cross-cutting evidence, traceability, and technical handoff

**Purpose**: Complete the required evidence without converting technical success into legal/privacy activation.

- [x] T031 Update DAT-PRT-001 implementation/evidence mappings for domain, application, database, testing, and M2 artifacts in `docs/requirements/requirements.yaml` and `docs/requirements/traceability.yaml`.
- [x] T032 Update M2 scope, completed test layers, exact migration/command results, residual risk, M1/G1 dependency, ODR-003/ODR-004, and G2 blockers in `specs/003-party-identity/verification.md`.
- [x] T033 Run the focused synthetic database migration/test, `pnpm verify`, and `pnpm verify:full` from `specs/003-party-identity/quickstart.md`, then record results in `specs/003-party-identity/verification.md`.
- [x] T034 Run the convergence review against the implemented M2 artifacts and append any remaining taskable gap to `specs/003-party-identity/tasks.md` before technical handoff.

**Checkpoint**: Technical foundation evidence is complete. G2 activation remains blocked until accountable privacy/legal-operations/lawyer approvals are independently recorded.

---

## Dependencies and execution order

### Phase dependencies

- **Phase 1** has no dependencies and establishes fixtures/guardrails.
- **Phase 2** depends on Phase 1 and blocks all user-story work.
- **User Story 1** depends on Phase 2 and provides the neutral party persistence used by later stories.
- **User Story 2** depends on User Story 1’s party persistence; it is independently testable as name-history behavior.
- **User Story 3** depends on User Story 1’s party persistence; it is independently testable as non-authoritative relationship behavior and can proceed in parallel with User Story 2 after US1.
- **Phase 6** depends on all selected stories.

### Parallel opportunities

- T001 and T002 can run in parallel.
- T012–T014, T019–T021, and T025–T027 are test-first parallel groups when their phase’s foundational code compiles.
- After US1, US2 (T019–T024) and US3 (T025–T030) can be assigned to separate developers, but they must coordinate edits to the shared `party-identity.ts` files.
- T031 and the preparatory portions of T032 can run in parallel after implementation; T033 must follow all code/docs changes.

## Implementation strategy

### MVP first

1. Complete Phases 1 and 2.
2. Complete US1 through T018 and run its focused tests.
3. Validate that the resulting feature is a neutral internal identity record only—no web route, client, matter, authority, or real personal data.

### Incremental delivery

1. US1 adds accurate neutral person/organization capture with safe contact handling.
2. US2 adds bilingual and historical name fidelity without accidental equivalence or merge.
3. US3 adds practical representative and duplicate cues without legal authority or conflict clearance.
4. Phase 6 records technical evidence and leaves G2 visibly blocked.

### Format validation

All 34 tasks use the required checkbox, sequential ID, optional parallel marker, user-story label where applicable, and exact file path format.

---

## Phase 7: Convergence

- [x] T035 Expose append-only primary-name assignment lineage (including predecessor links) through the typed internal party-history projection and add correction-history coverage per FR-003 and `contracts/party-identity.md` (partial).

---

## Phase 8: Convergence

- [x] T036 Normalize accepted identity, contact, and privacy-metadata text before persistence and add database coverage for the trimmed M2 storage contract per FR-002, FR-004, FR-007, and `data-model.md` (partial).

---

## Phase 9: Convergence

- [x] T037 Add organization-scoped self-referential foreign keys for name, contact, and representation correction predecessors, plus database rejection coverage for malformed predecessor lineage per FR-003, FR-005, FR-007, and `data-model.md` (partial).

---

## Phase 10: Convergence

- [x] T038 Add synthetic integration coverage for a contact-free unreviewed party and Arabic-plus-English-transliterated name history per US1/AC3 and US2/AC1 (partial).
