# Feature Specification: M0 Controlled Foundation

**Requirement IDs:** ARC-MOD-001, ARC-OUT-001, INT-ADP-001, I18N-RTL-001, QLT-TRC-001, QLT-EVD-001  
**Risk tier:** P0  
**Release / validation gate:** M0 / G0 Foundation  
**Data classification:** internal; synthetic local development data only  
**Legal/privacy validation:** not required for the M0 foundation; later capabilities remain separately gated  
**Feature owner:** Architecture, design, and quality leads  
**Status:** draft

## User outcome and scope

Engineering and quality contributors can develop subsequent Lex Gate capabilities on a controlled, bilingual, and auditable foundation without activating legal workflows or collecting real client data. The foundation provides a clearly internal application shell in English and Arabic, preserves clean package boundaries, records external side-effect intent durably with domain state, keeps integrations behind non-provider-specific contracts, and validates controlled requirement traceability.

In scope: M0 repository foundations; the English and Arabic/RTL internal shell; synthetic-only conventions; database, audit, outbox, and provider-interface foundations; controlled requirements, traceability, quality gates, and a durable feature verification record.

Out of scope and prohibited: public legal-service launch; real authentication; authorization-protected matter access; client, prospect, matter, conflict, engagement, deadline, document, evidence, financial, or court data; file uploads; payment or government-provider credentials; external provider activation; legal advice or conclusions; procedural calculation; and AI prompts, credentials, or user interface paths. This foundation must not represent any placeholder content as legal advice, service availability, client access, or a production readiness claim.

Dependencies: approved M0 architecture and brand records, the local-only development environment, and the G0 review process. Arabic is a first-class product language; mixed Arabic/Latin content and semantic language/direction are required for the shell.

## User scenarios and acceptance criteria

### Scenario 1 — Navigate the controlled bilingual foundation (P1)

**Preconditions:** A contributor starts the local application with only synthetic configuration and data.  
**Outcome:** The visitor can reach the internal foundation shell in English or Arabic and is never led into an unavailable legal workflow.

1. **Given** the English foundation route, **when** it renders, **then** the document language is English, direction is left-to-right, content clearly identifies the M0 internal foundation, and no client or legal-workflow call to action exists.
2. **Given** the Arabic foundation route, **when** it renders, **then** the document language is Arabic, direction is right-to-left, content is Arabic-localized, and mixed Arabic/Latin text remains legible.
3. **Given** either locale route, **when** a keyboard-only visitor navigates it, **then** all available interactive controls are reachable with a visible focus indicator and the page has no automated WCAG A/AA violations detectable by the configured scan.
4. **Given** an unsupported locale, **when** it is requested, **then** the application safely rejects it or redirects to a supported locale without exposing undefined localized content.

### Scenario 2 — Preserve bounded foundation behavior (P1)

**Preconditions:** A developer adds or changes an M0 domain/application capability.  
**Outcome:** The change retains framework/provider independence in the domain and records external side-effect intent as a recoverable foundation concern.

1. **Given** a domain package source file, **when** dependency-boundary validation runs, **then** it has no web-framework, database, queue, environment, or provider-SDK import.
2. **Given** an externally delivered side effect is planned, **when** the authoritative state change is persisted through the foundation, **then** a corresponding delivery record is committed in the same transaction and can be processed by the worker without rewriting domain facts.
3. **Given** a provider boundary is introduced, **when** application or worker code communicates across it, **then** it uses a typed adapter contract and domain code remains independent of the provider implementation.
4. **Given** a delivery attempt fails, **when** retry handling occurs, **then** the failure and retry state remain observable and the original domain fact is not silently overwritten.

### Scenario 3 — Maintain controlled requirements and quality evidence (P1)

**Preconditions:** A contributor changes M0 documentation, implementation, or tests.  
**Outcome:** Quality checks detect incomplete P0 requirements and the feature retains evidence sufficient for review.

1. **Given** a P0 requirement record lacks required source, owner, release, acceptance evidence, or validation state, **when** documentation validation runs, **then** validation fails with an actionable error.
2. **Given** a material M0 change, **when** it is prepared for handoff, **then** its feature record maps each requirement and acceptance criterion to applicable tests, exact command outcomes, risks, and required G0 review evidence.
3. **Given** an applicable test layer is not run, **when** verification evidence is reviewed, **then** it is shown as blocked or not applicable with a concrete rationale; it is not silently treated as passing.

## Requirements

### FR-001 — Modular monolith boundary (ARC-MOD-001)

The foundation shall keep domain rules independent from framework and provider code. Dependency-boundary validation shall reject disallowed domain imports. The domain source is internal engineering material and contains no protected object or client projection. Evidence: architecture dependency-boundary test and G0 traceability entry. Arabic/English impact: none beyond maintaining language-neutral domain behavior.

### FR-002 — Transactional outbox foundation (ARC-OUT-001)

The foundation shall persist a side-effect delivery record atomically with any modeled foundation state change, retain delivery/retry evidence, and let worker processing avoid destructive rewrites of domain facts. Failure to commit either state or delivery intent shall fail the operation. The foundation uses synthetic development records only; no provider is activated. Evidence: deterministic outbox atomicity integration coverage.

### FR-003 — Provider adapter boundary (INT-ADP-001)

The foundation shall expose typed integration contracts while isolating provider-specific behavior outside domain packages. A provider callback, idempotency, reconciliation, or credential path is not activated in M0; attempts to introduce one without its ADR and validation gate are prohibited. Evidence: adapter-boundary validation and source inspection.

### FR-004 — Arabic and RTL foundation (I18N-RTL-001)

The application shell shall provide English and Arabic routes with semantic language and direction, correct RTL layout, understandable mixed-script rendering, and equivalent internal-foundation meaning. Unsupported locales shall fail safely. No localized shell text may make an unapproved legal or service claim. Evidence: browser route, RTL, and accessibility coverage with synthetic content.

### FR-005 — Requirement traceability (QLT-TRC-001)

Every material M0 requirement shall identify its source, owner, release, acceptance evidence, and validation state, with traceability to architecture, implementation, and G0. Incomplete P0 records shall be rejected by the documentation validator. Evidence: deterministic documentation schema validation.

### FR-006 — Consistent quality evidence (QLT-EVD-001)

Every material delivery shall retain specification, plan, task, and verification records; map requirements to executed evidence; state the rationale for every non-applicable layer; and block handoff where required evidence or review is unavailable. No test may be weakened, skipped, or silently reclassified to obtain a passing result. Evidence: feature verification record, repository validation, and independent G0 review status.

## Non-functional and quality profile

| Test / evidence layer                                                    | Status and rationale                                                                                                                               | Acceptance evidence                                                                                        |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Static, documentation, type, and lint                                    | Required — P0 M0 controls require reproducible quality gates.                                                                                      | `pnpm verify` including format, documentation validation, lint, typecheck, and tests.                      |
| Unit/domain invariant and negative behavior                              | Required — package boundaries and no-activation guardrails need deterministic negative coverage.                                                   | Focused domain/localization tests plus dependency-boundary checks.                                         |
| Database, migration, integration, contract, or provider                  | Required — ARC-OUT-001 requires atomic outbox evidence. Provider activation is not applicable because M0 prohibits it.                             | Clean local migration check and outbox atomicity integration coverage; adapter-boundary check.             |
| Authorization, privacy, records, and security-negative                   | Required for M0 exclusion controls; protected-object authorization is not applicable because M0 has no protected objects or authentication.        | Tests/source checks establish no provider/AI/public legal workflow path and synthetic-only configuration.  |
| Browser/E2E, accessibility, locale, and RTL                              | Required — I18N-RTL-001 and G0 require production-equivalent shell checks.                                                                         | `pnpm e2e` runs English/Arabic/RTL and automated accessibility checks; manual keyboard review is recorded. |
| Performance, resilience, backup/restore, incident, or release validation | Required for G0 release validation; production performance, backup/restore, and incident claims are blocked because no production topology exists. | Clean bootstrap, build, full CI-equivalent command outcome, delivery retry evidence, G0 review status.     |

Measurable outcomes: both localized shell routes render deterministically in browser acceptance tests; each route has no configured automated accessibility violations; all workspace checks and the production-equivalent browser suite pass; and invalid P0 requirement records are deterministically rejected. The shell must keep visible keyboard focus and use semantic locale/direction attributes.

## Risks, decisions, and safe interim behavior

| Risk or decision                                                                                | Owner / gate                                                | Safe interim behavior                                                                           |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Cloud, region, identity, storage, queue, monitoring, and WAF providers are undecided (ODR-005). | Architecture + security leads / before production           | Local PostgreSQL/MinIO and typed interfaces only; no production endpoints or credentials.       |
| Payment, messaging, signature, and court integrations are undecided (ODR-006).                  | Finance, legal, architecture owners / provider feature gate | No provider activation, callbacks, credentials, or user-facing integration claims.              |
| Legal authority, practice claims, and marketing interpretation are undecided (ODR-002).         | Lead practising Egyptian lawyer / before public launch      | Internal foundation wording only; no public launch or legal outcome claims.                     |
| Privacy position, transfers, and sensitive-data processing are undecided (ODR-003).             | Privacy reviewer / before production processing             | Synthetic local development data only; no client/personal data collection or transfer.          |
| G0 requires engineering and quality lead approval.                                              | Engineering + quality leads / G0                            | Implementation may be verified, but release activation remains blocked until recorded approval. |

## Verification record contract

`specs/001-m0-foundation/verification.md` must map every requirement and acceptance criterion to implementation, tests, exact commands/results, G0 review/gate evidence, residual risk, and any approved exception. Missing required evidence or a missing G0 approval blocks release completion.
