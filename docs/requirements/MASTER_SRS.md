# Master Software Requirements Specification

**Document ID:** LG-SRS-001  
**Version:** 1.0.0-draft.2  
**Status:** Controlled implementation baseline for M0; conditionally ready thereafter  
**Classification:** Strictly confidential  
**Owner:** Project Sponsor  
**Primary jurisdiction:** Arab Republic of Egypt  
**Engineering language:** English; Arabic legal source text controls where applicable

## 1. Authority and purpose

Lex Gate is an integrated legal-practice environment for an Egyptian law firm. It covers a future public presence, controlled client intake, legal operations, records, finance, and carefully governed integrations without treating legal work as ordinary CRUD.

This SRS is the canonical implementation specification. It is read with the machine-readable requirement records in this directory and the validation register. Archived documents give source rationale only. A contradiction must be escalated according to `LG-GOV-001`.

## 2. Product boundary

The target platform has these surfaces:

1. Public information and approved legal-service content.
2. Prospective-client intake, triage, and conflict review.
3. Internal client, engagement, matter, proceeding, deadline, task, communication, records, evidence, and finance operations.
4. A secure client portal using dedicated client projections.
5. Privacy, records, audit, security, reporting, and approved-provider controls.
6. Controlled AI assistance only after the AI release gate.

Milestone M0 delivers the repository, shell, design system, localization, data and event foundations, quality gates, and controlled specification system. It expressly excludes active legal workflow, client portal, payments, government integration, and AI functionality.

## 3. System invariants

| ID      | Invariant                                                                                       |
| ------- | ----------------------------------------------------------------------------------------------- |
| INV-001 | Authentication does not equal authorization.                                                    |
| INV-002 | Employment and system administration do not grant firm-wide matter access.                      |
| INV-003 | Prospect, client relationship, engagement, matter, and proceeding are distinct domain concepts. |
| INV-004 | A task, calendar item, or calculated date is not a confirmed legal deadline.                    |
| INV-005 | Submission is not official filing or official acceptance.                                       |
| INV-006 | Upload is not review; draft is not final; final is not client publication.                      |
| INV-007 | Document, file object, derivative, record, and evidence item are distinct concepts.             |
| INV-008 | A hash proves byte integrity, not legal authenticity or substantive truth.                      |
| INV-009 | OCR, translation, and AI output remain derived until appropriate human review.                  |
| INV-010 | Archive is not destruction; legal hold overrides ordinary retention.                            |
| INV-011 | Provider responses cannot alter canonical legal state without domain validation.                |

## 4. Functional requirement groups

### Identity, authority, and access

The platform shall support identity accounts, organization membership, professional authority, contextual matter access, restricted-matter controls, session controls, and audit trails. Access decisions are deny-by-default and server-side. Technical privilege remains separate from professional authority.

### Parties, intake, and engagement

The platform shall distinguish persons, organizations, aliases, representatives, prospects, clients, engagements, and matters. Conflict screening includes applicable Arabic/English variants and requires human assessment. Payment or enquiry status alone never creates representation.

### Matter, proceeding, deadlines, and work

Material state changes are explicit domain commands with authorization, prerequisites, evidence, audit, and idempotency. Legal rules are source-linked, effective-dated, and versioned, and calculations remain provisional until the required reviewer confirms them.

### Documents, evidence, and records

The platform shall preserve immutable file identity, versioned documents, review state, publication state, derivative provenance, evidence custody, retention policy, legal hold, and controlled destruction. Confidential files use private storage, public URLs are prohibited for confidential material.

### Client communication and portal

Client-facing data is built from dedicated projections, never from internal objects filtered in a browser. Communications preserve delivery and acknowledgement evidence and must not represent automated notices as individualized legal advice.

### Finance and integrations

Invoices, payments, allocations, provider callbacks, and external submissions are separate from legal engagement and matter state. Integrations use adapters, verified webhooks, transactional outbox delivery, idempotency, and reconciliation. Provider-specific activation requires its validation gate.

### Privacy, security, and AI

The platform shall use privacy by design, data minimization, purpose and retention records, rights workflows, encrypted transport and storage controls, secret isolation, structured audit, and incident readiness. AI remains unavailable until explicitly enabled and can never autonomously clear conflicts, accept representation, confirm deadlines, publish advice, file documents, or destroy records.

## 5. Architecture requirements

- Use a modular monolith with explicit bounded packages and dependency direction from UI/application into domain; infrastructure implements domain/application ports.
- Use a relational ACID database as canonical state, private object storage for files, and a transactional outbox for side effects.
- Use explicit commands for material state transitions and client projections for the portal.
- Maintain Arabic/RTL as a first-class product requirement, including mixed Arabic/Latin content, accessible focus, and semantic language/direction attributes.
- Default Next.js application routes to the Node runtime. Server Components load internal reads, Server Actions handle internal mutations, and route handlers are reserved for webhooks and HTTP APIs.

## 6. Quality attributes

Every release must be traceable to requirements, contain deterministic tests, use synthetic data, protect privacy/security boundaries, provide actionable observability, and document any manual fallback. Test selection is risk-based and every omitted layer requires a recorded rationale, an implementer who cannot meet the bar must narrow scope or block work rather than lower this standard. P0 controls require negative-path tests and independent review evidence. No test may be deleted or weakened solely to obtain a green pipeline.

## 7. Requirements lifecycle

Canonical requirements are stored in `requirements.yaml`. Each has source, status, owner, release, risk tier, acceptance criteria, and validation requirement. `traceability.yaml` links it to architecture, tests, evidence, and release gates. A requirement with `legal_validation: required` may guide reversible foundation work but cannot be activated in production without recorded reviewer approval.

## 8. Release model

| Milestone | Scope                                                                         | Activation condition     |
| --------- | ----------------------------------------------------------------------------- | ------------------------ |
| M0        | Foundation, design system, localization, database/event/audit scaffolding, CI | G0                       |
| M1        | Identity and authorization                                                    | G1                       |
| M2–M3     | Parties, intake, conflicts, engagement                                        | G2                       |
| M4–M6     | Matters, deadlines, documents, evidence                                       | G3                       |
| M7        | Client portal                                                                 | G4                       |
| M8/M10    | Finance and providers/hardening                                               | G5 plus applicable gates |
| M9        | Privacy and records workflows                                                 | G6                       |
| M11       | Controlled AI                                                                 | G7                       |

## 9. Explicit exclusions for M0

M0 does not include a public legal-service launch, real authentication, matter data, conflict results, procedural calculation, legal opinion, file uploads, client information, invoice generation, provider credentials, court data acquisition, or AI prompts. The point of it is to make later work safe, testable, and reviewable.
