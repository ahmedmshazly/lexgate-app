# Tasks: M1 Authorization Policy Foundation

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), and [contracts/](contracts/)  
**Prerequisites**: Approved canonical M1 requirements; feature is reversible/local-only and does not pass G1  
**Tests**: Required by the P0 security profile. Write focused failing tests before the implementation they protect.

## Format: `[ID] [P?] [Story] Description`

- **[P]** denotes a task that can proceed independently after its stated prerequisite.
- **[US1]** covers relationship-based allow, **[US2]** covers deny-by-default, and **[US3]** covers immutable, reviewable evidence.

## Phase 1: Setup and controlled evidence

**Purpose**: Create feature evidence and enforce the provider-neutral, non-activated M1 boundary before policy behavior is added.

- [x] T001 [P] Create the M1 requirement, test-layer, G1-blocker, and deferred-M0-review evidence record in specs/002-authorization-policy/verification.md
- [x] T002 [P] Extend provider/framework boundary regression coverage for the M1 authorization surfaces in packages/testing/src/foundation-boundaries.test.ts

**Checkpoint**: M1 authorization work is visible as internal synthetic foundation work; no route, provider, credential, or G1 activation path can be introduced unnoticed.

## Phase 2: Shared policy and persistence foundations

**Purpose**: Establish the reusable typed policy, application port, and additive storage model before user-story behavior.

- [x] T003 [P] Add failing domain invariant coverage for validated policy input and non-enumerating authorization outcomes in packages/domain/src/authorization.test.ts
- [x] T004 [P] Add failing application command coverage for trusted server-side policy input and decision-record orchestration in packages/application/src/authorization.test.ts
- [x] T005 [P] Add failing synthetic PostgreSQL integration coverage for authorization decision persistence in packages/database/src/authorization.integration.test.ts
- [x] T006 Implement framework-independent authorization value types, typed denial outcomes, and exact relationship matching in packages/domain/src/authorization.ts and packages/domain/src/index.ts
- [x] T007 Add the application-owned restricted-resource authorization port and explicit `evaluateRestrictedResourceAccess` command in packages/application/src/authorization.ts and packages/application/src/index.ts
- [x] T008 Add organization membership, explicit resource-grant, and minimal decision-evidence schema definitions in packages/database/src/schema.ts
- [x] T009 Add the transaction-scoped authorization policy adapter and database exports in packages/database/src/authorization.ts and packages/database/src/index.ts
- [x] T010 Generate, inspect, and commit the additive Drizzle schema migration/snapshot for the authorization foundation in packages/database/drizzle/

**Checkpoint**: Domain policy remains provider/framework-free and the database can support synthetic, organization-scoped relationship evaluation without any login or protected-object route.

## Phase 3: User Story 1 — Enforce relationship-based allow (Priority: P1) 🎯 MVP

**Goal**: Permit only a synthetic actor with active organization membership and an exact explicit relationship to perform its approved restricted-resource operation.

**Independent test**: A matching synthetic membership/grant allows exactly its operation and produces minimal decision evidence; a different resource or operation is not accidentally allowed.

- [x] T011 [US1] Extend focused domain and application tests for matching membership/grant allow behavior in packages/domain/src/authorization.test.ts and packages/application/src/authorization.test.ts
- [x] T012 [US1] Extend PostgreSQL integration coverage for matching-organization, exact-resource, exact-operation allow behavior and minimal decision evidence in packages/database/src/authorization.integration.test.ts
- [x] T013 [US1] Refine the domain policy, application command, and database adapter to satisfy exact relationship-based allow behavior in packages/domain/src/authorization.ts, packages/application/src/authorization.ts, and packages/database/src/authorization.ts

**Checkpoint**: A synthetic relationship, not a job/system role or browser claim, is the only allow path.

## Phase 4: User Story 2 — Deny role- and browser-derived authority (Priority: P1)

**Goal**: Fail closed for role-only, browser-asserted, malformed, missing-membership, missing-grant, cross-organization, different-resource, and unavailable-break-glass requests without resource enumeration.

**Independent test**: Every prohibited path returns the generic denial outcome; no denied decision creates a grant, alters existing relationship state, or exposes target existence.

- [x] T014 [US2] Add authorization-negative domain and application tests for each prohibited authority path in packages/domain/src/authorization.test.ts and packages/application/src/authorization.test.ts
- [x] T015 [US2] Add PostgreSQL cross-organization, role-only, missing/mismatched grant, browser-assertion, and unavailable-break-glass regression coverage in packages/database/src/authorization.integration.test.ts
- [x] T016 [US2] Refine deny-by-default policy, generic error semantics, and boundary enforcement in packages/domain/src/authorization.ts, packages/application/src/authorization.ts, packages/database/src/authorization.ts, and packages/testing/src/foundation-boundaries.test.ts

**Checkpoint**: Technical administration, employment, UI state, and client-provided claims never grant substantive restricted-resource access.

## Phase 5: User Story 3 — Preserve immutable decision evidence (Priority: P1)

**Goal**: Make synthetic authorization decisions reviewable, atomic, idempotent, and unable to be silently overwritten.

**Independent test**: Allow and deny decisions retain minimal evidence; duplicate decision IDs do not create contradictory records; attempted update/delete of decision evidence fails; a persistence failure leaves no partial grant or evidence record.

- [x] T017 [US3] Add failing duplicate-decision, update/delete immutability, and rollback tests in packages/database/src/authorization.integration.test.ts
- [x] T018 [US3] Add and document the explicit database immutability guard required for authorization-decision evidence in packages/database/drizzle/ and specs/002-authorization-policy/plan.md
- [x] T019 [US3] Refine transactional decision recording, idempotency handling, and structured non-sensitive observability in packages/application/src/authorization.ts, packages/database/src/authorization.ts, and packages/observability/src/index.ts

**Checkpoint**: Authorization evidence is append-only, correction-by-new-record only, and no failure can elevate privilege or leave contradictory state.

## Phase 6: Polish, traceability, and release evidence

**Purpose**: Validate the complete technical foundation and retain G1 activation blockers accurately.

- [x] T020 [P] Reconcile SEC-AUT-001 and SEC-MAT-001 implementation/test evidence in docs/requirements/traceability.yaml and specs/002-authorization-policy/verification.md
- [x] T021 [P] Run documentation, focused domain/application/boundary/database checks with synthetic PostgreSQL and record first-run results in specs/002-authorization-policy/verification.md
- [x] T022 Run pnpm verify and pnpm verify:full with a clean synthetic PostgreSQL migration; record exact results and diagnostics in specs/002-authorization-policy/verification.md
- [x] T023 Record G1 Security/Engineering, legal-validation, and MFA/provider-review requirements as activation blockers—not approvals—in specs/002-authorization-policy/verification.md
- [x] T024 Run the convergence review; append, implement, and re-converge any gap in specs/002-authorization-policy/tasks.md and specs/002-authorization-policy/verification.md

## Dependencies and execution order

- Phase 1 starts immediately. T001 and T002 may proceed independently.
- Phase 2 depends on T002. T003–T005 are test-first and may start in parallel. T006 precedes T007 and the policy refinements. T008 precedes T009/T010.
- User Stories 1–3 all depend on Phase 2. Execute sequentially because they refine the same policy and adapter files: US1 → US2 → US3.
- Phase 6 begins only after all user stories are complete. T022 requires T020–T021; T024 is last.

## Parallel opportunities

- T001/T002 can run in parallel.
- T003, T004, and T005 can be written in parallel before their corresponding implementation.
- T020 and T021 can start together once user-story implementation is stable.

## Implementation strategy

1. Establish the explicit boundary and evidence record.
2. Create fail-first policy, command, and database integration coverage.
3. Deliver the matching explicit-relationship allow path, then prove all prohibited paths deny.
4. Add append-only decision-evidence guards and recovery coverage.
5. Run all required gates and spec workflow convergence; retain G1 review/activation controls as blockers.

## Phase 7: Convergence

- [x] T025 Add and verify append-only guards for synthetic membership and explicit-grant relationship history per US3/AC2 and data-model relationship rules (partial).

## Phase 8: Convergence

- [x] T026 Add persistence-level denial coverage for a valid relationship used with a different resource or operation per US1/AC2 and plan database test design (partial).
