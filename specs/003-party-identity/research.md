# Research: M2 Party Identity Foundation

## Decision 1 — Build a neutral, organization-scoped party aggregate

**Decision:** Represent a party as exactly one of `person` or `organization`, scoped to the internal organization context and independent of client, engagement, matter, proceeding, authorization, or legal verification state.

**Rationale:** `LG-SRS-001` and `LG-DOM-001` require these concepts to remain separate. M1 already defines organization-scoped trusted actors and exact-resource authorization, making organization scope the smallest compatible boundary. It permits safe synthetic work without choosing a firm taxonomy or a cross-firm identity model.

**Alternatives considered:** A prospect/client field was rejected because it collapses controlled later relationships. A global identity registry was rejected because tenancy, migration, and privacy posture are unresolved under ODR-003/004. A matter-owned contact model was rejected because party identity must precede a matter.

## Decision 2 — Preserve assertions and corrections instead of overwriting fields

**Decision:** Store immutable name, contact, representation, and possible-duplicate assertions. Corrections create a new row that references its predecessor; primary-name selection is an append-only assignment chain.

**Rationale:** ADR-010 and the Constitution require correction and supersession rather than destructive or silent history changes. A separate primary-name assignment avoids changing an earlier name merely to choose a later preferred name.

**Alternatives considered:** Mutable `primary_name`, `email`, or `representative` columns were rejected because they lose provenance. Soft deletion was rejected because it hides historical facts and encourages status-patch workflows. A generic JSON assertions table was rejected because it cannot provide type/constraint/test evidence for the required fields.

## Decision 3 — Record synthetic privacy-handling metadata on every assertion

**Decision:** Every party identity assertion records purpose, classification, subject category, source, retention candidate, access boundary, and validation requirement. The M2 values are deliberately limited to a synthetic-development posture.

**Rationale:** `LG-PRV-001` requires these fields for every new personal-data field. Names, contact values, representation facts, and duplicate cues can all be personal data or derived personal-data context. The metadata makes the safe interim posture inspectable without claiming that real-data processing is approved.

**Alternatives considered:** Contact-only metadata was rejected because the same privacy requirements apply to identity names and relationship assertions. A real retention/consent taxonomy was rejected because ODR-003 is unresolved. Omitting metadata because fixtures are synthetic was rejected because it would make the schema unsafe to evolve.

## Decision 4 — Treat review as non-authoritative workflow metadata

**Decision:** Use `unreviewed`, `reviewed`, and `rejected` assertion review states, plus explicit non-authoritative representation claim states. Do not create a `verified`, `cleared`, `engaged`, or `authorized` identity state.

**Rationale:** The feature must let a reviewer distinguish a recorded assertion from one reviewed in the internal process, while G2 reserves legal scenarios for a practising Egyptian lawyer. The terminology prevents a technical review flag from becoming a legal conclusion.

**Alternatives considered:** Omitting review state fails DAT-PRT-001. Calling a value `verified` would overstate the legal and privacy posture. Implementing a legal identity/KYC workflow is outside the approved M2 boundary.

## Decision 5 — Reuse M1 authorization, including a registry resource for creation

**Decision:** Application commands invoke the existing M1 authorization port with the actor organization. Creation targets the organization’s `party-registry`; ordinary changes and reads target the exact party ID; relationship/duplicate commands require exact authorization to both linked party IDs. There is no browser permission input.

**Rationale:** The Constitution requires server-side, deny-by-default authorization for protected objects. M1 already implements exact organization/resource/operation grants and generic denial. This avoids inventing a second authorization system or treating employment/role as authority.

**Alternatives considered:** Allowing all internal staff was rejected. A UI-only visibility check was rejected. Creating a separate M2 role model was rejected because it would duplicate M1 and pre-judge later professional authority decisions.

## Decision 6 — Use additive PostgreSQL tables, constraints, and append-only triggers

**Decision:** Add typed Drizzle tables with organization scope on every M2 row, composite foreign keys, indexes, and a reviewed custom migration that prevents `UPDATE`/`DELETE` on all M2 party identity/audit-receipt tables. Use serializable transactions for lineage-changing mutations.

**Rationale:** ADR-002 selects PostgreSQL as canonical relational state; ADR-010 requires immutable/versioned material history. The current M1 implementation already proves the generated-migration plus custom-immutability-trigger pattern. Installed Drizzle/Postgres support transaction configuration, so serializable transaction behavior can be covered by integration tests.

**Alternatives considered:** Application-only immutability was rejected because direct database mutation would remain possible. A full event-sourcing framework was rejected as disproportionate and would add unnecessary architecture. NoSQL/document storage was rejected by ADR-002.

## Decision 7 — Use a dedicated append-only party audit/command receipt and minimal outbox payloads

**Decision:** Each successful mutation atomically writes an organization-scoped, append-only party audit/command receipt and an outbox event with opaque IDs, event type, and assertion category, never the name or contact value.

**Rationale:** M0 provides audit/outbox infrastructure and ADR-006 requires atomic state/side-effect intent, but the generic audit table is neither organization-scoped nor protected by an immutability trigger. Identity/contact values are privacy-sensitive even when synthetic in development, so they do not belong in operational payloads or logs.

**Alternatives considered:** No audit/outbox evidence was rejected because material identity history needs traceability. Full assertion payloads in events/logs were rejected because they enlarge data exposure and complicate future privacy controls. External event delivery is rejected until provider gates are approved.

## Decision 8 — Deliver no UI or external API in this milestone slice

**Decision:** Expose only typed internal application ports and a written internal contract. Do not add a page, server action, route handler, webhook, client projection, or public intake form.

**Rationale:** DAT-PRT-001 can be verified through domain/application/database evidence. A UI would introduce English/Arabic/RTL/accessibility and personal-data collection obligations before ODR-003/G2 approval.

**Alternatives considered:** A synthetic web form was rejected because it risks becoming an unapproved intake path. A public API was rejected because it creates an external attack/enumeration surface without an approved client projection or rate-limit/privacy plan.

## Decision 9 — Keep vocabulary deliberately narrow and reversible

**Decision:** Use a small typed vocabulary for party kind, name form type, review state, contact type, representation claim state, and duplicate cue. Record source as required provenance text, but do not encode practice-area, migration-source, legal identity, or retention taxonomy.

**Rationale:** The feature needs deterministic validation while ODR-004 expressly leaves detailed taxonomy and source migrations unresolved. The chosen vocabulary supports a small foundation and can be extended through a future approved migration.

**Alternatives considered:** Unbounded free text for every field was rejected because it undermines validation and testability. A complete legal/firm taxonomy was rejected because it would fabricate discovery evidence. Import adapters were rejected because source data and privacy approval are absent.

## Resolved planning questions

No technical clarification remains unresolved for the approved synthetic foundation. The following are intentionally not technical unknowns and remain blocked activation decisions: real-data processing/retention/rights (ODR-003), practice/migration taxonomy and source systems (ODR-004), Egyptian legal intake/conflict/representation scenarios (G2), and production-ready M1 access-lifecycle/revocation validation (G1).
