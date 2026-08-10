# Implementation Plan: M0 Controlled Foundation

## Context and requirement coverage

This plan completes the controlled M0 foundation for **ARC-MOD-001**, **ARC-OUT-001**, **INT-ADP-001**, **I18N-RTL-001**, **QLT-TRC-001**, and **QLT-EVD-001**. Its authority is `LG-SRS-001`, the corresponding structured requirement and traceability records, ADR-001/006/007/010, `LG-QA-001`, `LG-DEV-002`, and `LG-BRAND-001`. The release is M0 and activation requires G0 approval by engineering and quality leads.

The reviewed implementation already provides the workspace packages, internal English/Arabic shell, basic Drizzle audit/outbox schema, typed adapter placeholder, localization utility, requirements validator, and browser accessibility smoke tests. It does not yet provide executable dependency/adapter boundary evidence, a transaction-scoped persistence adapter and rollback test for the audit/outbox pair, outbox retry fields, or feature-level verification evidence. These are the planned changes.

Classification is **internal** with synthetic local development fixtures only. The plan does not create users, protected objects, client projections, legal entities or workflows, personal-data collection, uploads, payments, public-service content, provider credentials/callbacks, or AI capabilities. No external provider is selected or activated. ODR-002/003/005/006 remain open; their safe interim behavior is unchanged.

Affected code: `packages/application`, `packages/database`, `packages/domain`, `packages/integrations`, `packages/localization`, `apps/web`, `tests/e2e`, root lint/quality configuration, CI workflow, and the feature artifacts. Existing user-owned `Brand Identity Upgrade Request (1)` files are out of scope and must remain unmodified.

## Bounded design

### Architecture and commands

The modular monolith remains a single web/worker delivery boundary. Domain rules are framework-, database-, queue-, environment-, and provider-SDK-independent. Application coordinates authorization and explicit M0 material-transition recording through an application-owned persistence port. Database implements that port; it never leaks database types into domain or web code. Provider adapters remain typed contracts at the integration boundary, with no concrete provider implementation.

`recordMaterialTransition` remains an explicit application command. Before any persistence it invokes the supplied authorization port. Its persistence port records the immutable audit event and outbox intent atomically. It must not become a generic status update route and must not be exposed as an HTTP endpoint in M0. A future protected-object command must supply authorization at the application boundary; M0 has no protected object surface, so authorization-negative object tests are documented as not applicable rather than omitted.

### Persistence and recovery

The M0 data boundary contains only append-only `audit_events` and controlled `outbox_events` records. A transaction-scoped Drizzle adapter inserts both with one database transaction. A failure in either insert rolls back the other; a duplicate outbox identifier provides a deterministic integration failure path. No legal, client, party, matter, or rule table is added.

The outbox record retains its immutable event identity, type, aggregate identifier, payload, and occurrence time. It also records delivery bookkeeping (`attempts`, `last_attempted_at`, `last_error`, and `published_at`) so a future worker can report failed/retried delivery without changing the original domain fact. Audit records are append-only; a correction would be a new audit event. The M0 worker continues to announce that no provider deliveries are enabled. No retry process is activated, and no provider call is made.

Schema changes are additive. Generate the migration from `src/schema.ts`, inspect the generated SQL and snapshot, and apply it only to local synthetic development data. Rollback for a failed release is application rollback followed by restoring the prior schema only under an approved database-change procedure; no destructive down migration is created. Recovery evidence is the rollback integration test and the retained outbox failure fields.

### Browser and brand boundary

The shell stays a Server Component surface with asynchronous route parameters and request headers, matching Next.js 16 conventions. Locale validation remains at the route boundary, while the root layout emits semantic `lang` and `dir`. The shell uses approved brand tokens and the curated Portal asset rather than a hand-drawn mark, preserves an accessible keyboard focus treatment, and makes only internal-foundation claims. It remains an internal M0 page, not a public marketing route.

### Boundary validation and observability

Repository-level lint configuration will prohibit framework, data, runtime-environment, queue, and provider imports from `packages/domain/**`; the same policy will prohibit known provider SDK imports from `packages/integrations/**` until a provider feature is approved. A deterministic source-level boundary test supplements lint and asserts the policy covers every domain TypeScript source. The integration test emits no sensitive values and uses synthetic UUIDs, actor/resource identifiers, and payloads. Existing structured logger/redaction interfaces remain the observability boundary; no production monitoring provider is introduced.

## Test and evidence design

| Layer                                           | Design and prohibited behavior                                                                                                                                                                                                                                      | Fixture / location                                                                                            | Command                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Static, documentation, type, lint               | Reject malformed requirements/traceability and prohibited dependency imports. No formatter, lint, type, or documentation failure is waived.                                                                                                                         | Synthetic source fixtures where needed; root lint config; `tools/validate-docs.ts`; boundary tests.           | `pnpm verify`                                      |
| Unit/domain and negative behavior               | Prove localization metadata/rejection, derived/deadline safeguards, explicit application authorization ordering, and rejected boundary imports. Do not add legal workflow state.                                                                                    | Existing synthetic unit tests plus application and boundary test files.                                       | `pnpm test`                                        |
| Database/migration/integration                  | Prove audit and outbox records commit together and an outbox insertion failure rolls back the audit write. Prove additive migration applies on clean local PostgreSQL.                                                                                              | Local PostgreSQL only, transaction-isolated synthetic UUIDs in `packages/database/src/*.integration.test.ts`. | `pnpm services:up`, `pnpm db:migrate`, `pnpm test` |
| Authorization/privacy/records/security negative | M0 has no protected object, personal data, or client projection, so object-level authorization/projection testing is **not applicable**. It is required to prove that provider/AI/public-legal paths remain absent and synthetic-only restrictions are documented.  | Source/configuration checks and feature verification review.                                                  | `pnpm verify`                                      |
| Browser/E2E/accessibility/locale/RTL            | Retain English and Arabic semantic attributes, internal-only content, RTL direction, curated mark, automated WCAG A/AA scan, and keyboard focus visibility. Manual keyboard assessment is recorded; screen-reader/inclusive-user review remains a G0 approval item. | `tests/e2e/foundation.spec.ts` with no personal data.                                                         | `pnpm e2e` / `pnpm verify:full`                    |
| Operational/release validation                  | Demonstrate deterministic transaction rollback and clean CI-equivalent build/E2E. Production performance, backup/restore, incident, vendor, and deployment assertions are **blocked**: no approved topology or vendor exists.                                       | Local Docker PostgreSQL; GitHub Actions PostgreSQL service.                                                   | `pnpm verify:full`                                 |

No test is skipped or weakened. Database integration tests require an explicit local `DATABASE_URL` and running PostgreSQL; CI provisions the same service. Automated accessibility evidence complements, rather than replaces, the manual keyboard and required G0 reviewer evidence.

## Delivery and verification

1. Establish executable lint/test boundary rules and source tests before changing persistence behavior.
2. Add the application persistence port and failing positive/negative tests, then implement the transaction-scoped database adapter and additive generated migration.
3. Provision database test prerequisites locally and in CI; run clean migration and integration evidence.
4. Replace the shell’s hand-authored mark with the approved Portal asset; expand browser coverage for keyboard focus and unsupported-locale behavior.
5. Run `pnpm verify`, then `pnpm verify:full`, and record exact results in `verification.md` with requirement/acceptance coverage, non-applicable rationale, manual assessment, G0 approval status, and residual risks.

No feature flag is needed because this is the internal M0 foundation and all changes are additive. Rollout is through the existing CI full gate. The independent G0 review cannot be self-approved: absent engineering-and-quality approval must remain visible as an activation blocker even if all implementation tests pass.

## Project structure

```text
specs/001-m0-foundation/
├── checklists/                 # requirement-quality checks
├── contracts/                  # internal port and shell contracts
├── data-model.md               # M0-only audit/outbox model
├── plan.md                     # this plan
├── quickstart.md               # clean local validation guide
├── research.md                 # resolved technical choices
├── tasks.md                    # dependency-ordered implementation work
└── verification.md             # command and review evidence

apps/
├── web/src/app/                # locale-aware internal shell
└── worker/src/                 # outbox worker boundary, no provider activation

packages/
├── application/src/            # explicit transition command and persistence port
├── database/src/               # schema and Drizzle port implementation
├── domain/src/                 # framework-independent rules
├── integrations/src/           # typed provider contract only
└── localization/src/           # allowed locales and semantic metadata

tests/e2e/                      # browser/RTL/accessibility evidence
tools/                          # documentation validation
```

## Constitution check

| Principle                                         | Status                          | Evidence / control                                                                                                     |
| ------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| I — Professional-state integrity                  | Pass                            | M0 adds only explicit audit/outbox recording; it creates no legal/professional state.                                  |
| II — Confidentiality and contextual authorization | Pass                            | The command retains a server-side authorization port; no protected-object UI or data exists in M0.                     |
| III — Legal and privacy uncertainty               | Pass                            | All later legal/privacy/provider behavior stays inactive; synthetic-only data and ODR safe positions are explicit.     |
| IV — Historical integrity and traceability        | Pass                            | Audit is append-only; outbox identity is stable; verification maps requirements and evidence.                          |
| V — Bilingual, accessible experience              | Pass                            | Semantic locale/direction, RTL, automated accessibility, keyboard assessment, and approved assets are planned.         |
| VI — Enterprise quality evidence                  | Pass with G0 activation blocker | Unit, integration, negative, browser, a11y, and release evidence are selected; independent G0 review remains required. |
| VII — Spec-anchored delivery and test design      | Pass                            | Spec, plan, requirement checklists, tasks, and verification are retained.                                              |
| VIII — Evidence, escalation, reproducibility      | Pass with G0 activation blocker | Exact commands and reviews are recorded; missing external approval blocks activation rather than implementation.       |

No constitution violation or exception is requested.
