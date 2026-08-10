# Research: M0 Controlled Foundation

## Decision: Keep the approved modular-monolith baseline

**Rationale:** ADR-001 and `LG-ARC-001` prescribe a modular monolith with application/domain boundaries and database/integration adapters. The existing workspace already implements that layout, so adding services or provider infrastructure would expand scope and violate M0 exclusions.

**Alternatives considered:** A separate outbox service or queue broker was rejected because it introduces a microservice/provider without an ADR or validation gate. A generic CRUD status endpoint was rejected because material transitions must be explicit commands.

## Decision: Use a transaction-owned application persistence port

**Rationale:** The existing independent audit, outbox, and transaction ports cannot guarantee a shared transaction safely because their callback does not expose transaction-scoped dependencies. A single application-owned material-transition persistence port lets the database adapter write the audit record and outbox intent in one Drizzle transaction, preserving `ARC-OUT-001` without leaking database types into application/domain code.

**Alternatives considered:** Global mutable transaction state was rejected as unsafe under concurrent requests. Treating audit as an unrelated after-the-fact side effect was rejected because a failed outbox write could leave unpaired history. Introducing legal aggregate tables was rejected by the M0 data boundary.

## Decision: Test atomicity against local PostgreSQL and provision it in CI

**Rationale:** An in-memory mock can only demonstrate call order; it cannot prove database rollback. A duplicate outbox event UUID causes a deterministic database constraint failure after the audit insert attempt, making it possible to assert that the audit row was rolled back. Local Docker PostgreSQL and an equivalent CI service are already part of the M0 baseline.

**Alternatives considered:** Skipping the test when `DATABASE_URL` is unavailable was rejected because missing integration evidence is a blocker. A third-party hosted database was rejected by ODR-005.

## Decision: Enforce boundaries with lint plus deterministic source checks

**Rationale:** Lint provides immediate developer feedback and source-level tests prove the rule applies across all domain source files. Both checks use repository source only and require no new architecture tool/provider.

**Alternatives considered:** Adding a dependency-analysis product was rejected because the focused rule is small and the current ESLint/Vitest baseline already covers it. Code-review-only enforcement was rejected because it does not meet the executable evidence acceptance criterion.

## Decision: Use the approved Portal asset for the internal shell

**Rationale:** `LG-BRAND-001` identifies Portal as the primary digital mark and requires curated production-safe assets. Using the curated asset makes provenance traceable and avoids maintaining a hand-drawn variation.

**Alternatives considered:** Retaining an inline recreation was rejected because its provenance and visual equivalence are not demonstrated. Introducing a new mark or external asset was rejected by the brand controls.

## Decision: Keep all provider behavior inactive

**Rationale:** ADR-007 requires typed provider boundaries, while M0 and ODR-006 prohibit selecting or activating a provider. The integration package therefore remains contract-only and the worker does not deliver events.

**Alternatives considered:** A mock SaaS provider was rejected because it would imply an unapproved activation path. Removing the adapter contract was rejected because it weakens the intended boundary.
