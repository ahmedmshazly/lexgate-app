# Implementation Plan: M1 Authorization Policy Foundation

## Context and requirement coverage

This plan delivers the reversible, internal M1 foundation for **SEC-AUT-001** and **SEC-MAT-001**. Its authority is `LG-SRS-001`, structured requirements and traceability records, ADR-001/002/005/006/009/010, `LG-QA-001`, `LG-DEV-002`, the security threat model, and the M1 G1 gate. The feature has P0 security risk. All fixtures are synthetic, local, and internal.

Current implementation review: `packages/auth` contains a provider-neutral authenticated-principal contract, `packages/application` has an explicit authorization port used by M0 transition recording, `packages/domain` is framework-independent, and the database currently has only audit/outbox M0 tables. No existing protected-resource command, user-facing login route, provider, credential, membership, or access-grant table exists.

Affected packages: `packages/domain`, `packages/application`, `packages/auth`, `packages/database`, `packages/testing`, root quality configuration, CI, traceability, and `specs/002-authorization-policy`. No web route or browser UI changes are planned.

Explicit exclusions: real identity sessions, external identity/MFA provider, real credentials or personal data, public login, client projection, real matter/engagement/proceeding records, legal workflow, break-glass approval, provider callbacks, and G1 activation. `SEC-MAT-001` may guide this reversible synthetic foundation but cannot be activated until its legal validation and G1 evidence are completed. The deferred M0 human accessibility reviews remain in `specs/001-m0-foundation/verification.md`; they do not become passing evidence through this feature.

## Bounded design

### Boundaries and commands

- **Domain:** Define language-neutral policy inputs, explicit relationship grants, allowed/denied decision outcomes, a non-enumerating denial reason, and invariant errors. The domain accepts only validated, complete inputs and never imports framework, database, environment, or provider code.
- **Application:** Provide one explicit `evaluateRestrictedResourceAccess` command. It validates trusted actor context, delegates policy evaluation to an application-owned port, and records minimal decision evidence. It never accepts a browser permission assertion and never exposes a generic status update route.
- **Authentication boundary:** Reuse the existing provider-neutral principal shape only as a trusted-input contract. No identity-provider implementation or credential path is selected.
- **Database:** Add additive, organization-scoped synthetic membership, explicit access-grant, and append-only decision-evidence records. A database adapter resolves only the target organization/resource relationship and atomically persists the decision evidence. Tables use opaque synthetic identifiers and store no name, email, client, matter, or legal-workflow field.
- **UI / API:** No route, endpoint, or client projection is created. Future protected commands must invoke the application command server-side; browser field hiding remains irrelevant to authorization.

### Policy, data integrity, and failure behavior

The policy requires all of: active membership in the requested organization, exact resource type/id match, an active explicit grant for the requested operation, and organization equality across actor, grant, and resource. It returns a generic `not_authorized` outcome for unknown resource, cross-organization, missing grant, role-only, malformed, and unapproved break-glass requests so callers cannot enumerate existence. Administrative and employment roles may be carried as context but have no allow path.

Authorization evaluation creates decision evidence but never creates, modifies, or revokes a relationship grant. Grant administration and break-glass are deferred to separate approved commands. Membership and explicit-grant relationship history are append-only, as is decision evidence: the schema/migrations prevent update or deletion; a future approved change or revocation requires a separately modeled record. Any policy-evaluation or evidence-write failure returns failure, commits no partial record, and grants no access. The adapter uses a transaction for evaluation evidence and relies on unique opaque decision IDs for idempotency; retrying the same decision ID neither elevates access nor creates contradictory records.

No outbox delivery is needed because this feature introduces no external side effect. Existing M0 audit/outbox behavior remains unchanged. Structured logs may include correlation ID, operation, outcome, and generic denial reason but never extra resource data, credentials, or grant contents.

Arabic/RTL impact is not applicable because no user-facing surface is introduced. A future UI needs its own English, Arabic, RTL, browser, keyboard, and accessibility acceptance tests.

## Test and evidence design

| Layer                                | Target and prohibited behavior                                                                                                                                                                           | Fixture / location                                                                                                                                       | Command                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Static, docs, type, lint             | Domain and policy code remain provider/framework-free; docs retain required fields.                                                                                                                      | `packages/testing/src/foundation-boundaries.test.ts`, `tools/validate-docs.test.ts`, root configuration.                                                 | `pnpm docs:validate`, `pnpm lint`, `pnpm typecheck`                                                                   |
| Unit/domain                          | Exact matching grant allows; malformed input denies/throws intentionally; roles never allow by themselves.                                                                                               | Synthetic opaque IDs in `packages/domain/src/authorization.test.ts`.                                                                                     | `pnpm --filter @lexgate/domain test`                                                                                  |
| Application / authorization-negative | Command evaluates server-side, persists decision evidence, ignores browser assertion, and creates no grant on deny/failure.                                                                              | Fakes in `packages/application/src/authorization.test.ts`.                                                                                               | `pnpm --filter @lexgate/application test`                                                                             |
| Database / migration / integration   | Correct-org explicit grant allows; resource mismatch, organization mismatch, role-only, missing membership/grant, unapproved break-glass, duplicate decision ID, and evidence mutation deny/fail safely. | Clean synthetic PostgreSQL in `packages/database/src/authorization.integration.test.ts`; generated additive migration plus inspected immutability guard. | `DATABASE_URL=<synthetic-local-postgres> pnpm db:generate && pnpm db:migrate && pnpm --filter @lexgate/database test` |
| Contract                             | The application-port command has explicit trusted inputs and generic outcome; it exposes neither browser authority nor resource-existence detail.                                                        | `contracts/authorization-policy.md` plus application tests.                                                                                              | `pnpm --filter @lexgate/application test`                                                                             |
| Browser/E2E, a11y, locale, RTL       | Not applicable: no user-facing route, login, or client interaction is introduced.                                                                                                                        | Verification record names the exclusion.                                                                                                                 | N/A                                                                                                                   |
| Resilience / release                 | Duplicate decision ID and database failure leave no new grant or mutable evidence. G1, MFA/provider review, production performance/backup/incident evidence remain blocked.                              | Synthetic database test and verification record.                                                                                                         | `pnpm verify` and `pnpm verify:full` with synthetic PostgreSQL                                                        |

Every test uses synthetic opaque references and must assert both an allowed condition and a prohibited condition. The first failure is recorded as diagnostic evidence; retry is permitted only after a specific correction and never substitutes for coverage.

## Delivery and verification

1. Establish testable policy types and boundary checks before adding persistence.
2. Add failing domain, application, and database tests for allow and negative decision paths.
3. Implement domain/application policy boundaries and the additive database adapter/schema/migration.
4. Enforce append-only decision evidence; inspect the migration and test duplicate/failure recovery.
5. Update traceability and the feature verification record; run focused checks, then `pnpm verify` and production-equivalent `pnpm verify:full` with synthetic PostgreSQL.
6. Run the convergence review. Any gap is appended to `tasks.md`, implemented, and re-converged before technical handoff.

No feature flag or rollout is needed because the feature remains internal and no route is exposed. Database changes are additive. There is no destructive down migration; rollback is application rollback plus the approved database-change process, retaining append-only evidence. The schema migration is generated from `schema.ts`; a separate Drizzle-generated custom migration adds the append-only trigger. It is clearly documented, inspected, and tested rather than silently editing the generated schema migration.

`verification.md` must map SEC-AUT-001 and SEC-MAT-001 to tests and exact command results; list every non-applicable test layer with rationale; record review evidence, residual risks, migration recovery, and all G1 blockers. Technical completion does not pass G1: Security and Engineering lead approval, legal validation of matter-equivalent access, and MFA/provider review remain required before activation.
