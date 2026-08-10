# Verification Record: M2 Party Identity Foundation

**Feature:** [M2 Party Identity Foundation](spec.md)  
**Date opened:** 2026-08-10  
**Release / gate:** M2 / G2 Legal intake and conflicts  
**Data classification:** Internal; specification and synthetic examples only  
**Implementation status:** Technical implementation verified and converged  
**Activation status:** Blocked pending ODR-003/ODR-004 validation and G2 lawyer scenario validation

## Decision-ready scope

The approved client-centred boundary is a neutral party registry: persons, organizations, bilingual names and aliases with provenance, purpose-limited contact points, reviewable representative claims, and required synthetic privacy-handling metadata. It prevents the common failures of treating an enquiry as a client, a contact as authority, a name match as a cleared conflict, or a synthetic foundation field as production-ready personal-data processing.

## Required approvals and safe interim behavior

| Item                                                    | Accountable owner                | Status / safe interim behavior                                                                                                                                                                            |
| ------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DAT-PRT-001 product approval                            | Product owner                    | **Approved 2026-08-10** — synthetic, reversible foundation work is authorized; this does not activate G2.                                                                                                 |
| ODR-004 taxonomy, volumes, tools, and migration profile | Product + legal-operations leads | **Pending** — the [Pilot Operating Profile](../004-gate-readiness/evidence/odr-004-pilot-operating-profile.md) is ready for completion; no irreversible taxonomy, import, or source-migration assumption. |
| ODR-003 personal-data processing                        | Privacy reviewer                 | **Blocked** — the controlled processing/DPO packet is ready for review; synthetic data only; no real contact, identity, document, or client information.                                                  |
| G2 intake/conflict scenario validation                  | Lead practising Egyptian lawyer  | **Blocked** — [nine synthetic scenarios](../004-gate-readiness/evidence/g2-lawyer-scenario-pack.md) await lawyer outcomes; no conflict clearance, engagement, matter, or legal-representation workflow.   |
| Representation and identity semantics                   | Lead practising Egyptian lawyer  | **Blocked** — all representative and identity assertions remain unverified, non-authoritative information.                                                                                                |

## Test-layer applicability and outcome

| Layer                                   | Status               | Evidence / rationale                                                                                                                                                                                                                                                                                                            |
| --------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation and traceability          | Passed               | `pnpm docs:validate` validates canonical links plus DAT-PRT-001 requirement/traceability evidence alignment.                                                                                                                                                                                                                    |
| Domain                                  | Passed               | Synthetic person/organization, bilingual/transliterated names, privacy metadata, purpose-limited contacts, non-authoritative representation, and deterministic duplicate validation are covered by `packages/domain/src/party-identity.test.ts`.                                                                                |
| Application / authorization-negative    | Passed               | `packages/application/src/party-identity.test.ts` proves trusted actor use, registry/exact-party grants, generic denials, no persistence on denial, and authorization of both linked parties.                                                                                                                                   |
| Database integration / migration        | Passed               | `packages/database/src/party-identity.integration.test.ts` covers atomic party/assertion/audit/outbox writes, idempotent replay, cross-organization denial, append-only triggers, correction history, and failed-transaction rollback. Additive migrations applied successfully to the disposable synthetic PostgreSQL service. |
| Internal contract                       | Passed               | Typed domain, application, and persistence ports compile under `pnpm typecheck`; `contracts/party-identity.md` records the internal-only boundary. No HTTP, public API, server action, or browser command contract exists in M2.                                                                                                |
| Browser, accessibility, locale, RTL     | Not applicable to M2 | M2 creates no route or visual surface. The mandatory repository full gate still passed its existing English, Arabic/RTL, keyboard-focus, and automated axe browser checks; manual accessibility review remains an M0 release obligation, not evidence for M2.                                                                   |
| Privacy / records / operational release | Blocked              | Synthetic-only metadata and no-raw-value log/outbox tests pass. Real personal-data processing, retention schedules, backup/restore, incident readiness, and production release are outside this approved foundation and require their stated gates.                                                                             |
| Legal workflow                          | Blocked              | No client, engagement, matter, conflict clearance, legal authority, or legal conclusion can be created by this feature. G2 review is required before those workflows exist or activate.                                                                                                                                         |

## Command evidence

| Date       | Command                                                                             | Result | Notes                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-10 | `DATABASE_URL=postgresql://…:55432/lexgate pnpm db:generate`                        | Passed | Generated and inspected additive M2 migrations; the final schema re-run reported no drift.                                                        |
| 2026-08-10 | `DATABASE_URL=postgresql://…:55432/lexgate pnpm db:migrate`                         | Passed | Additive M2 migrations, including correction-lineage constraints, applied successfully against the disposable local synthetic PostgreSQL service. |
| 2026-08-10 | `DATABASE_URL=postgresql://…:55432/lexgate pnpm --filter @lexgate/domain test`      | Passed | 7 tests passed; includes DAT-PRT-001 domain coverage.                                                                                             |
| 2026-08-10 | `DATABASE_URL=postgresql://…:55432/lexgate pnpm --filter @lexgate/application test` | Passed | 11 tests passed; includes server-side authorization-negative coverage.                                                                            |
| 2026-08-10 | `DATABASE_URL=postgresql://…:55432/lexgate pnpm --filter @lexgate/database test`    | Passed | 11 PostgreSQL integration tests passed, including M2 transactions, immutability, dual-party facts, and partial/bilingual party acceptance.        |
| 2026-08-10 | `DATABASE_URL=postgresql://…:55432/lexgate pnpm --filter @lexgate/testing test`     | Passed | 5 boundary tests passed; M2 creates no prohibited web route or provider integration.                                                              |
| 2026-08-10 | `pnpm format:check && pnpm docs:validate && pnpm lint && pnpm typecheck`            | Passed | Repository formatting, controlled-document validation, linting, and types passed.                                                                 |
| 2026-08-10 | `DATABASE_URL=postgresql://…:55432/lexgate pnpm verify`                             | Passed | Required repository verification passed, including all synthetic package and validation tests.                                                    |
| 2026-08-10 | `DATABASE_URL=postgresql://…:55432/lexgate pnpm verify:full`                        | Passed | Required full verification passed: repository verification, production build, and 4 Chromium browser checks (including automated axe coverage).   |

## Migration, recovery, audit, and privacy evidence

- M2 uses additive tables and immutable, organization-scoped audit receipts. The application receives a replay only when the immutable command receipt exactly matches the actor, correlation, action, resource, assertion, and command fingerprint; incompatible reuse fails.
- Party facts, primary-name assignments, representation claims, duplicate cues, and command receipts reject direct update and delete operations through PostgreSQL triggers. Corrections append a new assertion/assignment rather than overwriting history.
- The generated correction-lineage migration was inspected before application. Drizzle emitted composite foreign keys before their required target unique keys, so its generated SQL was reordered with an in-file review note; the schema intent was unchanged. A follow-up reviewed migration adds self-predecessor checks. Database tests now reject dangling predecessors for name, primary-name assignment, contact, and representation history.
- The outbox carries only opaque party/assertion identifiers and assertion category; focused database tests assert that raw name and contact values do not enter that payload. Application log context is limited to correlation ID, action, and outcome, and focused application coverage asserts a name value is absent from its recorded log context.
- Database rollback behavior is intentionally conservative: no destructive down migration is supplied. A code rollback leaves additive synthetic records intact and feature access disabled. Any physical schema/data reversal requires an independently approved, recovery-tested migration; it is not authorized by this feature.

## Residual risks and blocked activation

- **M1 / G1:** The explicit-grant boundary now has a synthetic lifecycle ledger/projection foundation in [Gate Readiness](../004-gate-readiness/spec.md), but Security/Engineering, provider/MFA, SEC-MAT, and production approval remain open. M2 must not claim a production-ready authorization lifecycle.
- **ODR-003:** A privacy reviewer must approve real personal-data processing, retention, transfer, and rights handling. Until then, only synthetic development examples are permitted.
- **ODR-004:** Product and legal-operations leads must validate taxonomy, volumes, current tools, and any source/migration profile. No import or irreversible taxonomy decision is included here.
- **G2:** A lead practising Egyptian lawyer must validate intake, representation, and conflict scenarios before any legal workflow is created or activated.
- **Accessibility:** M2 has no UI; automated repository checks complement but do not replace the still-required manual keyboard/screen-reader and inclusive-user review for a future M2-or-later interface.

No exception is requested. The product decision authorizes only the verified, reversible, synthetic M2 foundation. It does not activate any party intake, client, conflict, engagement, matter, legal authority, or real personal-data capability.
