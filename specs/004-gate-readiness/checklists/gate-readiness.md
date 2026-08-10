# Gate Readiness Requirements Checklist: Gate Readiness Programme

**Purpose**: Assess whether the security, privacy, operational-discovery, and lawyer-review requirements are precise enough for accountable review and implementation planning.  
**Created**: 2026-08-10  
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [x] CHK001 Are the required owner, evidence, approval authority, residual-risk, and safe-interim fields defined for each of G1, ODR-003, ODR-004, and G2? [Completeness, Spec §FR-001]
- [x] CHK002 Are the activities expressly authorized by sponsor approval distinguished from every activation it cannot authorize? [Clarity, Spec §FR-002]
- [x] CHK003 Are all lifecycle transitions that can expand, reduce, correct, or end access enumerated, including their required predecessor state? [Completeness, Spec §FR-003]
- [x] CHK004 Are the conditions for distinct requester/approver evidence and immediate safety-preserving removal stated without implying an unapproved break-glass process? [Clarity, Plan §G1]
- [x] CHK005 Are the required privacy-review fields complete for each proposed real-data workflow, including transfers, legal hold, rights, and breach handling? [Completeness, Spec §FR-006]
- [x] CHK006 Are privacy notice, consent request, and consent evidence requirements distinguished clearly enough that a global consent checkbox cannot satisfy them? [Consistency, Spec §FR-008]
- [x] CHK007 Are the required Pilot Operating Profile topics sufficient to describe the firm’s actual pilot without assuming its practice areas, taxonomy, or migration source? [Completeness, Spec §FR-009]
- [x] CHK008 Are the migration-decision prerequisites stated as a separate dependency rather than an implicit consequence of the pilot profile? [Clarity, Spec §FR-010]
- [x] CHK009 Are the lawyer scenario families sufficient to cover incomplete information, identity variation, representation, former/current relationships, and non-engagement boundaries? [Completeness, Spec §FR-011]

## Requirement Clarity and Consistency

- [x] CHK010 Is "effective access" defined consistently as a server-side, exact-scope, active, unexpired relationship throughout the specification, plan, and contract? [Consistency, Spec §FR-003; Plan §G1; Contract]
- [x] CHK011 Is the boundary between access administration and restricted-resource access unambiguous, so technical administration cannot be read as matter authority? [Clarity, Plan §Technical context]
- [x] CHK012 Is the term "approval reference" sufficiently constrained to prevent a self-asserted or unverifiable approval from being treated as authority? [Ambiguity, Plan §G1]
- [x] CHK013 Are "suspended", "revoked", "expired", "offboarded", and "corrected" distinguished with non-overlapping access effects and history rules? [Clarity, Data model §Lifecycle events]
- [x] CHK014 Are the greenfield/no-migration and synthetic-only defaults consistent across the privacy, operational, lawyer, and migration sections? [Consistency, Spec §FR-010 and §FR-013]
- [x] CHK015 Is the distinction between a synthetic lawyer scenario outcome and an approved legal interpretation explicit wherever G2 readiness is described? [Consistency, Spec §FR-011; Plan §G2]

## Acceptance Criteria Quality

- [x] CHK016 Can every listed G1 denial category be objectively assessed, including stale revision, incompatible replay, self-expansion, and concurrent revocation? [Measurability, Spec §SC-002]
- [x] CHK017 Is "complete processing review record" defined by a finite, reviewable field set rather than a subjective privacy standard? [Measurability, Spec §SC-003]
- [x] CHK018 Does the operating-profile success criterion define a decision for each required topic while preserving unknowns as open decisions? [Measurability, Spec §SC-004]
- [x] CHK019 Does the G2 criterion require a human lawyer outcome or escalation for every scenario family without treating an automated match result as a legal disposition? [Measurability, Spec §SC-005]

## Scenario and Edge-Case Coverage

- [x] CHK020 Are requirements present for unauthorized lifecycle administration, self-grant, cross-organization scope, expired access, stale commands, and changed-command replay? [Coverage, Plan §Test and evidence design]
- [x] CHK021 Are requirements present for a prospective client submitting high-risk information before an approved collection channel exists? [Coverage, Spec §Edge Cases]
- [x] CHK022 Are ambiguous Arabic/English/transliterated name variants and similar-but-distinct parties addressed without requiring an automatic merge or conflict clearance? [Coverage, Spec §Edge Cases and §FR-012]
- [x] CHK023 Are requirements present for uncertain legacy data discovered after a greenfield pilot decision, including the prohibition on manual re-keying as a migration shortcut? [Coverage, Plan §ODR-004]
- [x] CHK024 Are recovery and rollback requirements defined for a failed lifecycle migration without restoring previously revoked access? [Coverage, Plan §Delivery and verification]

## Dependencies and Gate Integrity

- [x] CHK025 Are ODR-005 identity/provider decisions, SEC-MAT-001 legal validation, and the future M3/G6 scopes identified as dependencies rather than silently included? [Dependency, Plan §Explicit exclusions]
- [x] CHK026 Are Security/Engineering, Privacy/DPO, Product/legal operations, and practising-lawyer approvals assigned to distinct accountable reviewers? [Traceability, Spec §Assumptions]
- [x] CHK027 Are the conditions that keep each gate blocked documented so a template, test pass, or sponsor approval cannot be mistaken for final authorization? [Gate integrity, Spec §FR-002; Quickstart §Manual gate evidence]

## Notes

- This checklist examines the quality of written requirements. All 27 items are satisfied after clarifying the approval-record scope. It is not a test plan and does not constitute G1, ODR-003, ODR-004, or G2 approval.
