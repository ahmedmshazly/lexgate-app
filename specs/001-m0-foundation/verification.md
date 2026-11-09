# Verification Record: M0 Controlled Foundation

**Feature:** [M0 Controlled Foundation](spec.md)  
**Date opened:** 2026-08-10  
**Release / gate:** M0 / G0 Foundation  
**Data classification:** Internal; synthetic local development data only  
**Implementation status:** Technical implementation and reproducible evidence complete  
**Activation status:** Deferred by repository sponsor pending manual screen-reader assessment and inclusive-user review; not activated for release

## Requirement and acceptance coverage

| Requirement  | Delivered implementation                                                                                                                             | Positive and prohibited behavior evidence                                                                                                                                                             | Status                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| ARC-MOD-001  | Root restricted-import policy; deterministic source scan in `packages/testing`; domain remains framework/provider-free.                              | `foundation-boundaries.test.ts` rejects domain framework/database/provider/runtime imports; lint enforces the policy.                                                                                 | Complete — final gate passed. |
| ARC-OUT-001  | Explicit application persistence port; Drizzle transaction adapter; additive outbox delivery bookkeeping migration.                                  | Application test proves authorization precedes persistence; PostgreSQL test proves paired audit/outbox commit and duplicate-event rollback. No legal aggregate table or provider delivery is created. | Complete — final gate passed. |
| INT-ADP-001  | Provider-neutral integration contract, blocked SDK imports, and typed inactive worker delivery mode.                                                 | Source scan/lint rejects prohibited SDK imports; worker test proves no provider is registered and only inactive mode is logged.                                                                       | Complete — final gate passed. |
| I18N-RTL-001 | Semantic locale metadata, RTL shell, approved Portal asset, visible keyboard focus, and configurable Playwright base URL for isolated local testing. | Browser suite covers `/en`, `/ar`, unsupported locale rejection, automated WCAG A/AA, approved asset, and keyboard focus. No public/legal-service call to action is present.                          | Complete — final gate passed. |
| QLT-TRC-001  | Refactored documentation validator with testable root input.                                                                                         | Synthetic malformed P0 fixture deterministically reports missing owner, release, legal validation, and traceability. Canonical documentation validation passes.                                       | Complete — final gate passed. |
| QLT-EVD-001  | Complete specification artifacts, executable quality checks, and this verification record.                                                           | Every test layer is classified below; missing review evidence is visible as blocked, not passing.                                                                                                     | Complete — final gate passed. |

## Test-layer applicability and evidence

| Layer                                                                 | Status                                 | Evidence / rationale                                                                                                                                                                                                                  |
| --------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static, documentation, type, lint                                     | Required                               | `pnpm docs:validate`, package/root lint, and `pnpm typecheck` passed within the final full gate.                                                                                                                                      |
| Unit/domain and negative behavior                                     | Required                               | Domain/localization foundations, application authorization-negative test, worker inactive-mode test, and source-boundary tests use only synthetic data.                                                                               |
| Database, migration, integration, contract, provider                  | Required                               | Generated additive migration plus synthetic PostgreSQL commit/rollback test. Provider activation is not applicable and remains prohibited.                                                                                            |
| Authorization, privacy, records, security-negative                    | Required with object-authorization N/A | No protected object, authentication, client projection, personal data, or record workflow exists in M0; object-level authorization/projection test is not applicable. Source-boundary/no-activation checks are required and selected. |
| Browser/E2E, accessibility, locale, RTL                               | Required                               | Playwright includes automated WCAG A/AA, semantic locale/direction, RTL, approved asset, focus, and safe unsupported-locale behavior.                                                                                                 |
| Performance, resilience, backup/restore, incident, release validation | Required / partially blocked           | Transaction rollback and CI-equivalent production browser execution are required. Production performance, backup/restore, incident exercise, topology, vendor, and deployment claims are blocked by ODR-005/006.                      |

## Command evidence

| Date       | Command                                                                                                   | Result                                       | Notes                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-09 | `pnpm install`                                                                                            | Pass                                         | Workspace links refreshed; no external package download.                                                                             |
| 2026-08-09 | `pnpm --filter @lexgate/testing test` and focused lint/docs checks                                        | Pass                                         | Boundary regression coverage passes.                                                                                                 |
| 2026-08-09 | `pnpm --filter @lexgate/application test` before port refactor                                            | Expected fail                                | Demonstrated old independent transaction port could not satisfy the new persistence contract.                                        |
| 2026-08-09 | `pnpm --filter @lexgate/application test`, typecheck, database typecheck                                  | Pass after workspace-link refresh            | First database typecheck exposed missing declared workspace links; `pnpm install` resolved the declared local dependencies.          |
| 2026-08-09 | `POSTGRES_PORT=55432 pnpm services:up`                                                                    | Pass                                         | Ports 5432 and 5433 were occupied; documented local fallback was extended to an unused synthetic port. No external database used.    |
| 2026-08-09 | `DATABASE_URL=…:55432 pnpm db:generate` and `pnpm db:migrate`                                             | Pass                                         | Generated and applied additive `0001_closed_blade` migration.                                                                        |
| 2026-08-09 | `DATABASE_URL=…:55432 pnpm --filter @lexgate/database test`                                               | Pass                                         | Two PostgreSQL integration tests: paired commit and duplicate-event rollback.                                                        |
| 2026-08-09 | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 pnpm e2e`                                                      | Pass                                         | Four browser tests passed on a dedicated Next dev server; port 3000 was left untouched because it hosted a pre-existing process.     |
| 2026-08-10 | `pnpm exec vitest run tools/validate-docs.test.ts`, `pnpm docs:validate`, `pnpm typecheck`                | Pass after one strict-nullability correction | The prior typecheck failure was fixed in the new scanner; no test was weakened.                                                      |
| 2026-08-10 | `pnpm --filter @lexgate/database test` without `DATABASE_URL`                                             | Expected environment failure                 | Strict integration test correctly rejects absent database configuration; it is not skipped. Final gate uses the synthetic 55432 URL. |
| 2026-08-10 | `CI=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 DATABASE_URL=<synthetic-local-postgres> pnpm verify:full` | Pass                                         | `pnpm verify`, production build, PostgreSQL integration coverage, validator regression, and all four Chromium journeys passed.       |

## Manual browser and accessibility assessment

- Browser screenshot on 2026-08-09 of `/ar` at 1440×900 confirmed meaningful rendered content, `lang="ar-EG"`, `dir="rtl"`, no Next error overlay, approved Portal asset, and legible mixed Arabic/Latin M0 wording.
- Keyboard navigation is covered by the browser test and its visible focus assertion. This is automated evidence supplemented by a manual browser review; it does **not** substitute for accountable human screen-reader or inclusive-user review.
- Playwright Chromium was installed and used for deterministic browser and screenshot evidence. The missing optional visual CLI did not cause a test to be skipped.

## Migration, rollout, recovery, and observability

- Migration is additive: it adds only outbox delivery bookkeeping fields; no destructive migration or legal/client table exists.
- A duplicate outbox event ID forces a database failure and proves the transaction rolls back the paired audit insert.
- Worker delivery is explicitly inactive. It logs only structured startup context and a typed inactive-delivery message; no provider, callback, credential, or delivery is activated.
- Rollout remains the existing CI full gate. Rollback is application rollback plus the approved database-change process; no unsupported destructive down migration is claimed.

## Convergence review

- Convergence completed on 2026-08-10 against `spec.md`, `plan.md`, `tasks.md`, the generated migration, traceability, and the delivered source/tests.
- All 26 planned tasks are complete. No implementation gap was found, so no follow-up task was appended.
- The accountable human accessibility reviews are release-activation controls, not unimplemented code. They remain blocked below and are not misclassified as passed.

## Required review, residual risk, and blocked items

| Item                                                   | Owner                                               | Status / safe interim behavior                                                                                                                          |
| ------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G0 engineering and quality approval                    | Repository sponsor acting for Engineering + Quality | **Approved 2026-08-10** — explicit workspace approval received: “I approve G0 for the M0 foundation and accept the recorded accessibility review plan.” |
| Manual screen-reader assessment                        | Accessibility / quality reviewer                    | **Deferred 2026-08-10 by repository sponsor** — no release activation; automated accessibility remains supplemental only.                               |
| Inclusive-user review                                  | Product + quality reviewer                          | **Deferred 2026-08-10 by repository sponsor** — no release activation; internal M0 shell only.                                                          |
| Production topology, backup/restore, incident, vendors | Architecture + security leads / ODR-005/006         | **Blocked** — local Docker and typed interfaces only; no production claim or provider activation.                                                       |
| Legal, privacy, public-content decisions               | Assigned ODR owners                                 | **Blocked / not in M0** — no personal data, public launch, legal workflow, payment, or AI capability is activated.                                      |

No exception has been requested or approved. Technical completion and the recorded G0 approval do not activate the M0 release: the listed accountable human accessibility reviews remain required and visible.
