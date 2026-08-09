# Quality Engineering and Evidence Standard

**Document ID:** LG-DEV-002  
**Version:** 1.0.0  
**Status:** Approved for M0  
**Classification:** Internal  
**Owner:** Engineering and quality leads  
**Effective date:** 2026-08-09  
**Review date:** 2026-11-09  
**Authoritative dependencies:** LG-SRS-001, LG-QA-001, LG-GOV-003, Lex Gate Constitution

## Purpose

Lex Gate requires professional, auditable engineering quality regardless of who does the work. Quality is established through clear requirements, deliberate architecture, deterministic evidence, and appropriate independent review; it is never inferred from confident prose, test volume, or a green command alone.

## Non-negotiable operating rules

1. A smaller or less experienced team never receives a lower quality threshold. It must make a smaller vertical slice, use the canonical artifacts, collect tool evidence, ask a targeted question, or block the affected work.
2. An implementer must not invent legal, architectural, operational, test, or validation evidence. Unknowns are recorded in `OPEN_DECISIONS.md` or the feature verification record with a safe interim position.
3. A feature is spec-anchored: `spec.md`, `plan.md`, `tasks.md`, and `verification.md` are retained with the feature and updated when scope or evidence changes.
4. A retry produces diagnostic evidence only. Focused, skipped, disabled, flaky, or weakened tests do not satisfy their original acceptance obligation without a documented approved exception and equivalent control.
5. Test fixtures, screenshots, logs, browser state, exports, and evidence remain synthetic and classified. Real client, matter, credential, national-ID, or production information is prohibited.

## Risk-based evidence matrix

| Change profile                                            | Required evidence                                                                                                                  | Additional release evidence when applicable                        |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Documentation, requirements, or workflow                  | Formatting, canonical link/schema/traceability validation, workflow status                                                           | Owner review for policy or gate changes                            |
| Domain rule or state transition                           | Unit/domain positive and negative cases, invariant coverage, deterministic clocks/fixtures                                         | Legal workflow scenario approval                                   |
| Database, migration, outbox, storage, or provider adapter | Integration tests, clean migration evidence, idempotency/failure handling, recovery behavior                                       | Backup/restore, vendor, reconciliation, and security review        |
| HTTP/API, identity, authorization, projection, or webhook | Contract and integration tests, server-side positive and negative authorization cases, privacy-safe logs                           | Threat model, penetration, and provider validation                 |
| Web/UI, locale, or design-system behavior                 | Unit/component coverage where behavior is isolated, browser/E2E user journeys, English/Arabic/RTL checks, automated WCAG A/AA scan | Manual keyboard/screen-reader review and inclusive user assessment |
| Reliability, performance, incident, or production claim   | Measurable scenario, observability, failure/rollback path, documented threshold and outcome                                        | Load, fault, restoration, incident, and release-gate evidence      |

Every material feature plan declares each matrix row as **required**, **not applicable with rationale**, or **blocked**. P0, security, privacy, records, legal-rule, provider, and AI changes require the applicable negative-path tests and independent review described by the validation register.

## Feature verification record

Before handoff, create or update `specs/<feature>/verification.md` with:

- Requirement and acceptance-criterion coverage, including prohibited behavior.
- Test-layer applicability and rationale; exact commands, environment, date, and pass/fail outcome.
- Migration, rollout, rollback, observability, audit, and data-classification evidence where relevant.
- Required reviewer, validation gate, approval status, residual risks, and blocked items.

`verification.md` is evidence, not a waiver. A missing required result or approval blocks completion and must be plainly reported.

## Required quality gates

`pnpm verify` is the minimum repository gate. `pnpm verify:full` is required for material runtime, dependency, database, UI, delivery, or CI changes and runs production build plus browser validation. Pull requests execute the full gate in CI. Automated accessibility checks find machine-detectable defects; they do not replace manual accessibility assessment.

## Execution method

For material work, follow the sequence specify → clarify → plan → checklist → tasks → analyze → implement → converge. Resolve analysis findings at their source, and repeat implementation/convergence until no taskable gaps remain.

## Exceptions

An exception must identify the affected requirement, omitted evidence, risk, safe interim behavior, accountable owner, compensating control, expiry/review date, and approval. It cannot activate a legal, security, privacy, records, provider, or AI capability before the applicable validation gate passes.
