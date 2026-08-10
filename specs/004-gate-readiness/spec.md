# Feature Specification: Gate Readiness Programme

**Feature Branch**: `004-gate-readiness`  
**Created**: 2026-08-10  
**Status**: Draft — proposed for Project Sponsor approval  
**Requirement IDs**: SEC-AUT-001, SEC-MAT-001, DAT-PRT-001, LEG-CFL-001, LEG-CFL-004, LEG-ENG-001, PRV-MIN-001  
**Release / validation gates**: G1, G2, ODR-003, ODR-004  
**Data classification**: Internal; synthetic examples and redacted evidence only  
**Input**: Resolve G1, ODR-003, ODR-004, and G2 lawyer/privacy in a professional, client-centred way, then present a simple approval decision.

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Sponsor approves a controlled path to readiness (Priority: P1)

The project sponsor can approve one bounded programme that assigns an accountable owner, required evidence, and safe interim position to each open gate. The sponsor can see clearly what their approval authorises and what it does not.

**Why this priority**: A law firm should never mistake approval to prepare evidence for approval to process client data, create a legal engagement, or release a security-sensitive feature.

**Independent Test**: A reviewer can inspect the gate register and confirm that every gate has an owner, evidence set, decision authority, and explicit blocked behaviour, and that sponsor approval alone cannot mark a gate as passed.

**Acceptance Scenarios**:

1. **Given** the sponsor approves this programme, **when** a team begins a listed workstream, **then** it may prepare the specified evidence but may not activate a blocked capability.
2. **Given** a reviewer has not provided the required sign-off, **when** someone proposes to treat G1, G2, ODR-003, or ODR-004 as closed, **then** the gate remains blocked and its safe interim position remains in force.

---

### User Story 2 — Security and engineering can earn G1 rather than merely declare it (Priority: P1)

A security or engineering lead can review a complete identity-and-authorisation evidence pack that proves restricted access is granted deliberately, removed promptly, and cannot be inferred from job title, administration, or browser state.

**Why this priority**: The firm needs a reliable answer to the practical question, “When a person changes role or leaves, can they still see a sensitive matter?”

**Independent Test**: With synthetic actors and restricted resources, the evidence proves an exact approved relationship permits access, while a role-only actor, a cross-organisation actor, a suspended or revoked relationship, an expired session, and a browser assertion are denied.

**Acceptance Scenarios**:

1. **Given** a staff member’s approved relationship is revoked or suspended, **when** they attempt a previously allowed restricted action, **then** the action is denied and the prior access history remains reviewable.
2. **Given** an identity, MFA, recovery, session, or offboarding control is not approved and tested, **when** G1 is reviewed, **then** G1 cannot pass.
3. **Given** a security review finds a material unresolved weakness, **when** release readiness is assessed, **then** the weakness has an accountable remediation or the affected release remains blocked.

---

### User Story 3 — Privacy leadership can approve real-data processing deliberately (Priority: P1)

A privacy reviewer can decide whether Lex Gate may process real personal data using a complete, purpose-specific record instead of a generic privacy checkbox or a broad assumption that legal work justifies every collection.

**Why this priority**: Client trust depends on collecting only what is necessary, using it only for a defined purpose, and knowing how it is protected, retained, shared, and handled when a person exercises their rights.

**Independent Test**: A proposed real-data workflow cannot progress unless its processing record identifies the responsible legal entity, purpose, lawful basis, data categories, access boundary, recipients, retention/hold treatment, data-subject route, breach handling, and transfer/processor position.

**Acceptance Scenarios**:

1. **Given** a proposed intake field has no approved purpose, classification, lawful basis, access boundary, or retention treatment, **when** it is reviewed, **then** the field is rejected from a real-data workflow.
2. **Given** a workflow relies on consent, **when** its notice or request is reviewed, **then** the reviewer can distinguish the privacy information from the consent choice and can verify that withdrawal is supported where consent is the lawful basis.
3. **Given** any required privacy, DPO, processor, transfer, or incident decision is unresolved, **when** real personal-data processing is proposed, **then** it remains blocked and synthetic data continues to be used.

---

### User Story 4 — Legal operations and the practising lawyer can validate intake and conflict work (Priority: P1)

The legal-operations lead can define the firm’s pilot operating model, and the lead practising Egyptian lawyer can validate the scenarios that determine how the system supports intake and conflicts without making a legal decision itself.

**Why this priority**: A generic law-firm taxonomy or name-match rule can cause missed conflicts, incorrect engagement assumptions, or a workflow that does not match how the firm actually works.

**Independent Test**: The approved pilot profile covers the firm’s chosen practice areas, terminology, volumes, sources, and migration decision. A synthetic lawyer scenario pack demonstrates that incomplete information, Arabic/English/transliterated name variation, representatives, former relationships, and potential adverse parties are escalated for human disposition rather than auto-cleared.

**Acceptance Scenarios**:

1. **Given** the firm has not approved a source migration, **when** a pilot is prepared, **then** it operates as greenfield with no historical client, matter, document, or contact import.
2. **Given** a candidate conflict is incomplete, ambiguous, or only partially matched, **when** it is assessed, **then** the system records a candidate for authorised human review and does not open a standard matter or clear the conflict automatically.
3. **Given** the practising lawyer has not approved the scenario outcomes and escalation rules, **when** G2 is assessed, **then** G2 remains blocked even if the technical foundation tests pass.

### Edge Cases

- A system administrator, former employee, or staff member with a generic role attempts to see a restricted matter after access should have ended.
- The firm changes identity, cloud, monitoring, or storage provider while the provider and transfer review is still open.
- A prospective client sends sensitive information before the firm has approved a real-data intake channel.
- An Arabic, English, former, or transliterated name is similar to an existing party but is not the same person or organisation.
- A prospective client, consultation, payment, representative claim, or contact point is incorrectly treated as an engagement, authority, or conflict clearance.
- The firm discovers legacy data of uncertain quality after choosing the pilot; no bulk import may begin without a separately approved mapping and verification decision.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The programme MUST maintain one decision record for G1, ODR-003, ODR-004, and G2 that states its scope, accountable owner, required evidence, approval authority, current status, residual risk, and safe interim behaviour.
- **FR-002**: Sponsor approval of this programme MUST authorise only evidence preparation and approved reversible development. It MUST NOT by itself pass any gate, enable real personal-data processing, enable real login, open a client intake channel, create a legal engagement, or clear a conflict.
- **FR-003**: G1 readiness MUST require explicit, reviewable lifecycle evidence for granting, suspending, revoking, reinstating, correcting, expiring, and offboarding access. A historical grant or decision MUST NOT be silently overwritten, and a system role or browser assertion MUST NOT create access. New or expanded access MUST have a recorded requester, a distinct approver, the exact approved scope, approval time, and an approval reference that cannot be reused for a different subject or scope.
- **FR-004**: G1 readiness MUST require a security-and-engineering-approved identity operating model covering MFA, accessible recovery, session termination, user provisioning and offboarding, privileged-access restrictions, and the selected provider’s security review before a real identity flow is activated.
- **FR-005**: G1 readiness MUST require negative authorisation evidence, threat-model review, material-finding disposition, incident and recovery readiness appropriate to the activated scope, and the distinct approvals of the security and engineering leads.
- **FR-006**: ODR-003 readiness MUST require a privacy review record for every proposed real-data workflow. The record MUST identify the responsible entity, processing purpose, lawful basis, data/subject categories, sensitivity, source, access boundary, recipients/processors, transfer position, retention and legal-hold treatment, rights route, breach route, and accountable owner.
- **FR-007**: ODR-003 readiness MUST require the privacy reviewer to determine and record the applicable Egyptian privacy, licensing, DPO appointment/registration, sensitive-data, processor, and transfer obligations from controlling current sources and approved legal interpretation. The programme MUST NOT treat its own wording as legal advice or a substitute for that review.
- **FR-008**: A privacy notice and a consent request MUST be treated as separate decisions. Where consent is chosen as the lawful basis, the proposed experience MUST document a specific affirmative choice, accessible withdrawal path, and evidence of the choice; consent MUST NOT be assumed or preselected.
- **FR-009**: ODR-004 readiness MUST produce an approved pilot operating profile covering selected practice areas, bilingual terminology, matter and service taxonomy, roles and handoffs, expected volumes, existing tools and records, source quality, accessibility and channel needs, and the authoritative system for each activity.
- **FR-010**: The pilot default MUST be greenfield: no historical client, matter, contact, document, financial, or evidentiary records are imported. Any later import MUST have a separately approved source inventory, field mapping, quality assessment, privacy and retention review, reconciliation, rollback, and accountable sign-off.
- **FR-011**: G2 readiness MUST require a lead practising Egyptian lawyer to approve a synthetic intake-and-conflict scenario pack. It MUST cover at least: incomplete intake; Arabic/English/transliterated and former-name variants; individual and organisation links; representatives; existing and former clients; prospective adverse parties; consultation or payment without engagement; and restricted or uncertain cases requiring escalation.
- **FR-012**: The G2 scenario pack and the M3 conflict workflow MUST demonstrate that a name mismatch, name similarity, contact point, payment, consultation, or unreviewed representative claim cannot automatically clear a conflict, establish engagement, create matter access, or create professional authority. Candidate dispositions require the authorised human review defined by the practising lawyer.
- **FR-013**: All evidence used by this programme MUST be synthetic or safely redacted. The repository MUST NOT receive real client, matter, identity-document, national-ID, credential, or production-export data.

### Key Entities

- **Gate decision record**: The controlled statement of a gate’s owner, evidence, approval authority, status, residual risk, and safe interim behaviour.
- **Access lifecycle record**: The reviewable history of a person’s permission to access a restricted resource, including its grant, suspension, revocation, correction, and end of access.
- **Access approval record**: An immutable, organization-scoped approval of one new or expanded access scope, identifying the distinct approver, requester, subject, scope, time, and expiry where applicable.
- **Processing review record**: The privacy reviewer’s purpose-specific assessment of a proposed real-data workflow and its controls.
- **Pilot operating profile**: The firm-approved description of the first operating scope, terminology, roles, volumes, sources, and no-migration or migration decision.
- **Lawyer scenario pack**: Synthetic fact patterns, expected escalation points, and signed reviewer outcomes for intake, conflicts, engagement separation, and authority boundaries.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All four workstreams have a decision record containing 100% of the fields required by FR-001 before the sponsor is asked to consider gate status.
- **SC-002**: G1 evidence demonstrates denial in every defined role-only, cross-organisation, suspended, revoked, expired-session, malformed-input, browser-assertion, self-expansion, stale-revision, incompatible-replay, concurrent-revocation, and unapproved-emergency-access scenario; no synthetic test leaves a partial access change after failure.
- **SC-003**: Every proposed real-data workflow has a complete processing review record before collection begins, and zero real personal-data records enter Lex Gate while ODR-003 remains open.
- **SC-004**: The ODR-004 pilot profile records a decision for every required operating-profile topic and confirms that zero historical records are migrated unless a later, separately approved migration decision exists.
- **SC-005**: The practising lawyer reviews and records an outcome or required escalation for all eight G2 scenario categories, and no automated scenario produces a conflict clearance, engagement, matter opening, or professional-authority outcome.
- **SC-006**: A sponsor can determine, from a one-page approval summary, the work authorised, the blocked capabilities, the accountable reviewers, and the next decision for each workstream without relying on an engineering implementation document.

## Assumptions

- The Project Sponsor may approve this programme and nominate or engage its reviewers, but cannot substitute for the security, engineering, privacy/DPO, legal-operations, or practising-lawyer approval that the corresponding gate requires.
- Lex Gate remains local, synthetic-only, and provider-neutral until the applicable gate and the separate provider decisions are approved.
- The first practical pilot should start greenfield; this is the safest client-protective default while the firm validates its real records and migration quality.
- The privacy reviewer and lead practising Egyptian lawyer will use controlling current Arabic legal sources and their approved interpretation. This specification records engineering safeguards and decision evidence, not legal advice.
- This feature prepares the path to G1 and G2 readiness. It does not replace the future M3 conflict-workflow feature or the later privacy-and-records release work governed by G6.
