# Lex Gate Legal Practice Platform  
## D18 — Requirements Traceability Matrix

**Document ID:** LG-D18  
**Document Title:** Requirements Traceability Matrix  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.1  
**Status:** Initial Master Traceability Baseline — To Be Completed During SRS Consolidation and Implementation  
**Classification:** Strictly Confidential — Controlled Requirements and Assurance Documentation  
**Prepared Date:** 8 August 2026  

**Parent Documents:**

- LG-D01 — Project Charter and Documentation Research Protocol
- LG-D02 — Authoritative Source Register
- LG-D03 — Egyptian Legal and Regulatory Analysis
- LG-D04 — Firm Discovery and Current-State Assessment
- LG-D05 — Product Vision, Scope, Capability Map, and Release Strategy
- LG-D06 — Stakeholder and User Research Report
- LG-D07 — Legal Service Blueprint
- LG-D08 — Matter Lifecycle and Standard Operating Procedures
- LG-D09 — System Context and Architecture
- LG-D10 — Domain and Data Architecture
- LG-D11 — Security Architecture and Threat Model
- LG-D12 — Privacy Engineering Specification
- LG-D13 — API and Integration Specification
- LG-D14 — Records and Document Management Specification
- LG-D15 — DevOps, Reliability, and Operational Specification
- LG-D16 — Master Test Strategy
- LG-D17 — Legal Workflow Validation Plan

---

# 1. Purpose

D18 is the authoritative traceability framework for the Lex Gate Legal Practice Platform.

Its purpose is to make every material product requirement traceable from:

> source and rationale

through:

> business/legal requirement

into:

> workflow, architecture, data, API, implementation, test, validation, and release evidence.

The matrix exists to prevent important controls from becoming disconnected from the reason they exist.

For any critical requirement, Lex Gate should eventually be able to answer:

1. Why is this required?
2. Which legal, business, security, privacy, or operational source supports it?
3. Which workflow implements it?
4. Which component enforces it?
5. Which data entities represent it?
6. Which API or command performs it?
7. Which tests verify it?
8. Which practising lawyer or specialist validated it where required?
9. Which release depends on it?
10. Who owns it?
11. What evidence proves implementation?
12. Is the requirement currently satisfied?

---

# 2. Traceability Principle

No critical requirement shall exist only:

- in a meeting;
- in a lawyer’s memory;
- inside application code;
- in a design mockup;
- in an issue tracker;
- in a test;
- in a policy document.

Each critical requirement must belong to a controlled traceability chain.

---

# 3. Core Traceability Chain

```text
AUTHORITATIVE / BUSINESS SOURCE
             ↓
       REQUIREMENT
             ↓
         SOP / RULE
             ↓
      DOMAIN / DATA
             ↓
       ARCHITECTURE
             ↓
        API / UI
             ↓
      IMPLEMENTATION
             ↓
           TEST
             ↓
     LEGAL VALIDATION
             ↓
      RELEASE EVIDENCE
             ↓
      OPERATIONAL CONTROL
```

Not every requirement uses every layer.

For example:

A visual-design requirement may not require legal validation.

A legal deadline requirement almost certainly does.

---

# 4. Traceability Objectives

## TRC-OBJ-001 — Coverage

Every Q0/Critical requirement shall have a traceability record.

---

## TRC-OBJ-002 — Bidirectional Traceability

The system must support:

- source → requirement;
- requirement → source;
- requirement → test;
- test → requirement;
- implementation → requirement;
- release → requirements.

---

## TRC-OBJ-003 — Change Impact

When a source changes, Lex Gate should be able to identify affected:

- requirements;
- workflows;
- code;
- tests;
- client behavior;
- documentation.

---

## TRC-OBJ-004 — Evidence

A requirement shall eventually identify objective evidence of satisfaction.

---

## TRC-OBJ-005 — No Orphan Controls

No critical implementation control should exist without a documented reason.

---

## TRC-OBJ-006 — No Untested Critical Requirements

Every critical requirement requires an appropriate verification method.

---

# 5. Requirement Classes

The project currently uses the following requirement families.

## BUS — Business

Examples:

- business objectives;
- service model;
- firm operations;
- client experience.

---

## LEG — Legal / Professional

Examples:

- professional authority;
- confidentiality;
- conflicts;
- communications;
- court workflows.

---

## PRV — Privacy

Examples:

- processing inventory;
- consent;
- DSR;
- cross-border transfer;
- retention.

---

## SEC — Security

Examples:

- authentication;
- authorization;
- matter isolation;
- privileged access;
- secrets.

---

## FUN — Functional

Examples:

- create enquiry;
- assign task;
- upload document.

---

## UX — User Experience

Examples:

- bilingual interface;
- accessible workflows;
- clear legal states.

---

## DAT — Data

Examples:

- Party model;
- versioning;
- provenance;
- identifiers.

---

## API — API

Examples:

- object authorization;
- explicit commands;
- idempotency.

---

## INT — Integration

Examples:

- payment;
- ETA;
- email;
- AI.

---

## REC — Records

Examples:

- original preservation;
- legal hold;
- custody;
- destruction.

---

## OPS — Operations

Examples:

- deployment;
- backups;
- observability;
- production access.

---

## TST — Test

Examples:

- authorization matrix;
- Q0 regression.

---

## LGV — Legal Validation

Examples:

- deadline rule lawyer review;
- conflict scenario approval.

---

# 6. Requirement Priority

Use:

```text
P0 — Critical / Release Blocking
P1 — High
P2 — Medium
P3 — Low
```

P0 usually corresponds to D11/D16 Q0 risk.

---

# 7. Requirement Status

Each requirement shall have one controlled status.

```text
PROPOSED
APPROVED
DESIGNED
IMPLEMENTING
IMPLEMENTED
VERIFIED
VALIDATED
RELEASED
DEFERRED
BLOCKED
SUPERSEDED
RETIRED
```

---

# 8. Source Confidence

Reuse D02 evidence hierarchy.

Recommended machine codes:

```text
A1_PRIMARY_EGYPTIAN_AUTHORITY
A2_EGYPTIAN_REGULATOR_OR_MINISTRY
B1_INTERGOVERNMENTAL_REPOSITORY
B2_TECHNICAL_STANDARD
C1_PROFESSIONAL_INTERPRETATION
C2_PEER_REVIEWED_RESEARCH
D1_INTERNAL_VALIDATION
X_UNVERIFIED
```

---

# 9. Verification Method

Possible values:

```text
AUTOMATED_TEST
MANUAL_TEST
CODE_REVIEW
SECURITY_REVIEW
PRIVACY_REVIEW
LEGAL_VALIDATION
ARCHITECTURE_REVIEW
PENETRATION_TEST
OPERATIONAL_EXERCISE
DOCUMENT_INSPECTION
UAT
```

Multiple methods may apply.

---

# 10. Traceability Record Schema

Each row should ultimately contain:

```text
Trace ID
Requirement ID
Title
Description
Priority
Status

Primary Source IDs
Source Confidence
Relevant Provisions
Business Rationale

Parent Capability
SOP IDs
Legal Validation IDs

Domain Context
Data Entities
Architecture Components
API / Command
UI Surface

Security Controls
Privacy Controls
Records Controls
Operational Controls

Test IDs
Verification Method
Acceptance Criteria

Release
Implementation Component
Repository Path
Issue / Work Item
Commit / PR
Build / Release

Owner
Legal Reviewer
Security Reviewer
Privacy Reviewer
QA Reviewer

Evidence Location
Last Review
Next Review
Notes
```

---

# 11. Traceability Identifier

Recommended:

```text
TRC-00001
TRC-00002
...
```

The Trace ID is independent from the Requirement ID.

This allows:

- one requirement with several implementation/test mappings;
- several source provisions supporting one requirement.

---

# 12. Requirement Identifier Stability

Once an approved requirement ID is assigned:

- do not renumber it casually;
- do not reuse it for a different requirement.

If superseded:

```text
LEG-CFL-003
status = SUPERSEDED
superseded_by = LEG-CFL-011
```

---

# 13. Requirement Text Quality

Each requirement should be:

- atomic where practical;
- testable;
- unambiguous;
- implementation-neutral unless architecture specifically requires otherwise;
- linked to source/rationale.

Preferred:

> The system shall deny matter access unless an active authorized matter relationship exists.

Avoid:

> Access should be secure.

---

# 14. Composite Requirements

When a requirement becomes too broad, split it.

Example:

Bad:

> The platform shall securely handle documents.

Split into:

- authentication;
- access authorization;
- original preservation;
- encryption;
- versioning;
- publication;
- retention.

---

# 15. Traceability Ownership

Every requirement must have one accountable owner.

Owners may include:

- Sponsor / Product
- Legal Operations
- Responsible Lawyer
- Security
- Privacy / DPO
- Records
- Finance
- Engineering
- Platform Operations

Multiple reviewers may exist, but one owner remains accountable.

---

# 16. Legal Source Mapping

Examples from D02:

```text
EG-LAW-001  Legal Profession Law
EG-PRV-001  Personal Data Protection Law 151/2020
EG-PRV-002  Executive Regulations Decision 816/2025
EG-CYB-001  Cybercrime Law 175/2018
EG-ESG-001  Electronic Signature Law 15/2004
EG-EVD-001  Evidence Law 25/1968
EG-CRM-001  Current Criminal Procedure regime
EG-CRM-002  New Criminal Procedure Law 174/2025
EG-TAX-004  ETA e-Invoice framework
```

Final article/provision references shall be completed during Master SRS legal consolidation.

---

# 17. Technical Source Mapping

Examples:

```text
STD-OWASP-ASVS
STD-OWASP-TOP10
STD-NIST-CSF
STD-NIST-800-63
STD-WCAG-2.2
STD-ISO-27001
STD-ISO-27701
```

Exact IDs shall be normalized in D02 during consolidation.

---

# 18. Internal Source Mapping

Examples:

```text
LG-D04
LG-D06
LG-D07
LG-D08
LG-D17
```

These may support:

- operational design;
- user needs;
- validated procedures.

They do not supersede governing law.

---

# 19. Master Traceability Matrix — Professional Authority

| Trace | Requirement | Source | SOP/Validation | Component | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00001 | LEG-PROF-001 Verified professional status required for lawyer-only actions | EG-LAW-001 | D17 LV-001 | People/AuthZ | TST professional authority | P0 |
| TRC-00002 | LEG-PROF-002 Technical role does not equal legal authority | EG-LAW-001, D17 | SOP-PEO-001 | Policy Engine | TST-Q0 authority matrix | P0 |
| TRC-00003 | LEG-PROF-003 Trainee restrictions separately enforced | EG-LAW-001 | LV-001 | ProfessionalProfile | TST role matrix | P0 |
| TRC-00004 | LEG-PROF-004 Professional status changes effective-dated | EG-LAW-001 | LV-001 | LawyerProfessionalProfile | TST status expiry | P1 |
| TRC-00005 | LEG-PROF-005 Public lawyer profiles use verified information | EG-LAW-001 | R1 validation | Public Content | TST public profile | P1 |

---

# 20. Master Traceability Matrix — Confidentiality

| Trace | Requirement | Source | Architecture | Data | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00006 | LEG-CONF-001 Deny-by-default matter access | EG-LAW-001 | D09 AuthZ | MatterAccessGrant | TST-Q0-001 | P0 |
| TRC-00007 | LEG-CONF-002 Employment does not imply firm-wide matter access | EG-LAW-001 | D11 | MatterTeamMembership | TST unassigned lawyer | P0 |
| TRC-00008 | LEG-CONF-003 Client visibility requires explicit publication | EG-LAW-001 | Client Projection | ClientPublication | TST-Q0-010 | P0 |
| TRC-00009 | LEG-CONF-004 Technical admin has no automatic substantive access | EG-LAW-001 | Admin separation | PrivilegedAccessGrant | TST-Q0-003 | P0 |
| TRC-00010 | LEG-CONF-005 Restricted matter existence may be hidden | EG-LAW-001 | Search/AuthZ | MatterRestriction | TST-Q0-020 | P0 |
| TRC-00011 | LEG-CONF-006 Views/downloads/exports are auditable | EG-LAW-001 | Audit | AuditEvent | TST audit access | P1 |
| TRC-00012 | LEG-CONF-007 Internal content excluded from client projections | EG-LAW-001 | Client Projection | Read Models | Serialization regression | P0 |

---

# 21. Master Traceability Matrix — Conflict Checking

| Trace | Requirement | Source | SOP | Data/API | Test/Validation | Priority |
|---|---|---|---|---|---|---|
| TRC-00013 | LEG-CFL-001 No ordinary matter activation before conflict approval | EG-LAW-001 | SOP-CFL-001 | ConflictReview/OpenMatter | TST-Q0-004/005 | P0 |
| TRC-00014 | LEG-CFL-002 Search Arabic/English/transliterations/aliases | EG-LAW-001 | SOP-CFL-001 | PartyName/Search | Conflict scenario tests | P0 |
| TRC-00015 | LEG-CFL-003 Conflict search cannot rely on exact match only | EG-LAW-001 | SOP-CFL-001 | ConflictSearch | LV-002 | P0 |
| TRC-00016 | LEG-CFL-004 Human legal decision required | EG-LAW-001 | SOP-CFL-001 | CompleteConflictReview | TST-Q0-004 | P0 |
| TRC-00017 | LEG-CFL-005 Search evidence preserved historically | EG-LAW-001 | SOP-CFL-001 | ConflictSearch snapshot | Audit/history test | P1 |
| TRC-00018 | LEG-CFL-006 Re-screen on relevant changes | EG-LAW-001, D17 | SOP-CFL-001 | Recheck workflow | Re-screen scenario | P1 |
| TRC-00019 | LEG-CFL-007 Conflict data highly restricted | EG-LAW-001 | D11 | Conflict context | Unauthorized search test | P0 |

---

# 22. Master Traceability Matrix — Intake and Engagement

| Trace | Requirement | Source | SOP | Component | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00020 | FUN-INT-001 Public enquiry creates prospect record, not client matter | D07/D08 | SOP-INT-001 | Intake | E2E enquiry | P1 |
| TRC-00021 | LEG-ENG-001 Consultation does not itself establish representation | EG-LAW-001, D17 | SOP-CNS-001 | Consultation | LV-003 | P0 |
| TRC-00022 | LEG-ENG-002 Payment does not itself establish representation | EG-LAW-001 | SOP-ENG-001 | Payment/Engagement boundary | TST-Q0-006 | P0 |
| TRC-00023 | LEG-ENG-003 Active engagement references approved immutable version | EG-LAW-001 | SOP-ENG-002 | EngagementVersion | Old-version-signature test | P0 |
| TRC-00024 | LEG-ENG-004 Represented Parties explicit | EG-LAW-001 | SOP-ENG-002 | EngagementRepresentedParty | multi-client scenario | P0 |
| TRC-00025 | LEG-ENG-005 Scope/exclusions preserved by version | EG-LAW-001 | SOP-ENG-002 | EngagementVersion | versioning tests | P1 |
| TRC-00026 | LEG-ENG-006 Authority of signatory/representative recorded | EG-LAW-001 | SOP-ENG-002 | ClientRepresentative | authority test | P0 |
| TRC-00027 | LEG-ENG-007 No in-kind disputed-right fee option in normal model | EG-LAW-001 | SOP-BIL-001 | FeeArrangement | validation test | P0 |

---

# 23. Master Traceability Matrix — Matter Management

| Trace | Requirement | Source | SOP | Data/Command | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00028 | LEG-MAT-001 Active matter has responsible lawyer | D03/D08/D17 | SOP-MAT-001 | Matter | invariant test | P0 |
| TRC-00029 | LEG-MAT-002 Matter and Case/Proceeding are separate concepts | D08/D10 | SOP-CAS-001 | Matter/Proceeding | domain tests | P1 |
| TRC-00030 | LEG-MAT-003 Related matter does not inherit access automatically | D03/D09 | SOP-ACC-001 | MatterRelationship | auth test | P0 |
| TRC-00031 | LEG-MAT-004 Matter status history preserved | D08 | SOP-MAT-002 | MatterStateTransition | state history | P1 |
| TRC-00032 | LEG-MAT-005 Emergency opening restricted and time-bound | D08/D17 | SOP-MAT-001 | Emergency Matter | emergency scenario | P0 |
| TRC-00033 | DAT-MAT-001 Matter IDs opaque; business reference separate | D09/D10 | — | Matter identifiers | API ID tests | P2 |

---

# 24. Master Traceability Matrix — Legal Deadlines

| Trace | Requirement | Source | SOP | Data/API | Test/Validation | Priority |
|---|---|---|---|---|---|---|
| TRC-00034 | LEG-DLN-001 Every legal rule has source and effective dates | EG procedural sources | SOP-DLN-001 | DeadlineRuleVersion | TST effective-date | P0 |
| TRC-00035 | LEG-DLN-002 Automated deadline remains provisional | EG procedural sources | SOP-DLN-001 | DeadlineCalculation | TST-Q0-007 | P0 |
| TRC-00036 | LEG-DLN-003 Lawyer confirmation required for final deadline | EG procedural sources | SOP-DLN-001 | ConfirmDeadline | LV-007 | P0 |
| TRC-00037 | LEG-DLN-004 Previous confirmed deadline preserved after correction | D03/D08 | SOP-DLN-001 | Deadline history | TST-Q0-008 | P0 |
| TRC-00038 | LEG-DLN-005 Trigger event/source must be recorded | EG procedural sources | SOP-DLN-001 | LegalEvent/Deadline | scenario validation | P0 |
| TRC-00039 | LEG-DLN-006 Deadline changes notify responsible parties | D08 | SOP-DLN-001 | Notification | change test | P1 |
| TRC-00040 | LEG-DLN-007 Task completion does not close deadline | D08 | SOP-TSK-001 | Task/Deadline | domain negative test | P0 |
| TRC-00041 | LEG-DLN-008 Critical deadline unconfirmed state monitored | D15 | SOP-DLN-001 | Operational metrics | alert test | P1 |

---

# 25. Master Traceability Matrix — Procedural Transition

| Trace | Requirement | Source | Validation | Component | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00042 | LEG-CRT-001 Procedural rules are effective-dated | EG-CRM-001/002 | LV-016 | Legal Rule Repository | boundary tests | P0 |
| TRC-00043 | LEG-CRT-002 No global blind switch between old/new regime | EG-CRM-001/002 | D17 | Rule Engine | transition scenario tests | P0 |
| TRC-00044 | LEG-CRT-003 Matters spanning transition enter lawyer review where required | EG-CRM-002 | LV-016 | Review Queue | transition-matter tests | P0 |
| TRC-00045 | LEG-CRT-004 Historical confirmed decisions are not retroactively rewritten | D03/D17 | LV-016 | Deadline/Event versioning | regression | P0 |

---

# 26. Master Traceability Matrix — Hearings and Filings

| Trace | Requirement | Source | SOP | Component | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00046 | LEG-HRG-001 Original hearing remains after postponement | D08 | SOP-HRG-001 | Hearing history | postponement test | P1 |
| TRC-00047 | LEG-HRG-002 Hearing source/verification recorded | D03 | SOP-HRG-001 | Hearing | source test | P1 |
| TRC-00048 | LEG-FIL-001 Submitted ≠ officially accepted/filed | D17 | Filing workflow | FilingPackage | filing status test | P0 |
| TRC-00049 | LEG-FIL-002 Exact filed Document Version preserved | D14 | Filing workflow | FilingPackage | immutable version test | P0 |
| TRC-00050 | LEG-FIL-003 Manual external status records checker/time/source | D03/D13 | — | ExternalManualVerification | manual workflow test | P1 |

---

# 27. Master Traceability Matrix — Client Communication

| Trace | Requirement | Source | SOP | Component | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00051 | LEG-COM-001 Material outcome creates lawyer review/update workflow | EG-LAW-001 | SOP-COM-001 | Communication | E2E material outcome | P0 |
| TRC-00052 | LEG-COM-002 Final legal advice requires authorized lawyer | EG-LAW-001 | SOP-COM-001 | Approval | authority test | P0 |
| TRC-00053 | LEG-COM-003 Failed delivery escalates | EG-LAW-001/D08 | SOP-COM-001 | DeliveryAttempt | provider failure test | P1 |
| TRC-00054 | LEG-COM-004 Delivery and acknowledgement are separate states | D08/D13 | SOP-COM-001 | CommunicationAcknowledgement | state test | P1 |
| TRC-00055 | LEG-COM-005 Client-facing language shall not imply guarantee | EG-LAW-001 | D17 | Templates/UI | legal content review | P0 |

---

# 28. Master Traceability Matrix — Documents and Records

| Trace | Requirement | Source | SOP | Component | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00056 | REC-DOC-001 Document/Version/FileObject separate | D10/D14 | SOP-DOC-001 | Document domain | domain test | P0 |
| TRC-00057 | REC-ORG-001 Original preserved separately from derivative | D14 | SOP-DOC-001 | FileObject/Derivative | TST original/derivative | P0 |
| TRC-00058 | REC-VRS-001 Final/signed/filed versions immutable | D03/D14 | SOP-DOC-002 | DocumentVersion | TST-Q0-011 | P0 |
| TRC-00059 | REC-SHR-001 Client publication references exact version | D03/D14 | SOP-PRT-001 | ClientPublication | publication tests | P0 |
| TRC-00060 | REC-SHR-002 Publication requires authorized recipient | D03/D11 | SOP-PRT-001 | ClientRepresentative | wrong-recipient test | P0 |
| TRC-00061 | REC-OCR-001 OCR is derivative/unverified until reviewed | D14 | SOP-DOC-001 | OCR Artifact | OCR safety test | P1 |
| TRC-00062 | REC-TRN-001 Translation preserves source relationship | D14 | — | TranslationRelationship | translation test | P1 |
| TRC-00063 | REC-RDX-001 Redaction output must actually remove underlying data | D14 | — | Redaction workflow | extraction test | P0 |
| TRC-00064 | REC-HLD-001 Legal hold blocks destruction | D12/D14 | SOP-REC-001 | LegalHold | TST-Q0-012 | P0 |
| TRC-00065 | REC-DST-001 Destruction requires explicit decision/evidence | D12/D14 | SOP-REC-002 | DestructionDecision | destruction test | P0 |

---

# 29. Master Traceability Matrix — Evidence

| Trace | Requirement | Source | SOP | Component | Test | Priority |
|---|---|---|---|---|---|---|
| TRC-00066 | LEG-EVD-001 Preserve digital original | EG-EVD-001 | SOP-EVD-001 | EvidenceItem/FileObject | evidence test | P0 |
| TRC-00067 | LEG-EVD-002 Record cryptographic hash | EG-EVD-001 / engineering | SOP-EVD-001 | FileObject | hash test | P1 |
| TRC-00068 | LEG-EVD-003 Custody history append-only | EG-EVD-001 | SOP-EVD-001 | EvidenceCustodyEvent | chain test | P0 |
| TRC-00069 | LEG-EVD-004 Derivative/working copies linked to source | D14 | SOP-EVD-001 | DocumentRelation | lineage test | P0 |
| TRC-00070 | LEG-EVD-005 System shall not claim admissibility automatically | EG-EVD-001 | D17 | UI/legal state | wording validation | P0 |

---

# 30. Master Traceability Matrix — Privacy Governance

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00071 | PRV-GOV-001 Every processing activity has purpose and owner | EG-PRV-001/002 | ProcessingActivity | privacy registry test | P0 |
| TRC-00072 | PRV-LIC-001 Production processing blocked until applicable authorization resolved | EG-PRV-001/002 | Release Gate | document inspection | P0 |
| TRC-00073 | PRV-COL-001 Public intake minimizes sensitive information | EG-PRV-001/002 | Intake Form | public privacy test | P0 |
| TRC-00074 | PRV-CNS-001 Consent purpose/version/evidence retained where required | EG-PRV-002 | ConsentRecord | consent tests | P0 |
| TRC-00075 | PRV-CNS-002 Marketing consent separate from engagement | EG-PRV-002 | ConsentRecord | suppression test | P0 |
| TRC-00076 | PRV-DSR-001 DSR disclosure requires identity/legal/confidentiality review | EG-PRV-001/002 | DSR Workflow | DSR test | P0 |
| TRC-00077 | PRV-RET-001 Retention not indefinite by default | EG-PRV-002 | RetentionRule | retention test | P0 |
| TRC-00078 | PRV-XBR-001 Unapproved cross-border destination blocked | EG-PRV-001/002 | Transfer Policy | TST-Q0-016 | P0 |
| TRC-00079 | PRV-AI-001 Unapproved AI provider cannot receive client data | EG-PRV-002 | AI Gateway | AI privacy test | P0 |
| TRC-00080 | PRV-BRE-001 Awareness timestamp drives breach workflow | EG-PRV-002 | PrivacyIncident | breach-clock test | P0 |

---

# 31. Master Traceability Matrix — Sensitive Data / Minors

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00081 | PRV-SEN-001 Sensitive data receives enhanced controls | EG-PRV-002 | Classification/AuthZ | sensitive-record test | P0 |
| TRC-00082 | PRV-CHD-001 Child/guardian relationships modeled explicitly | EG-PRV-002 | PartyRelationship | minor scenario test | P0 |
| TRC-00083 | PRV-CHD-002 Guardian access does not automatically expose all records | EG-PRV-002/D03 | Client Portal | authorization test | P0 |
| TRC-00084 | PRV-SEN-002 Sensitive data not defaulted into public intake | EG-PRV-002 | Intake | form test | P0 |

---

# 32. Master Traceability Matrix — Security Authentication

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00085 | SEC-IAM-001 Unique user accounts; no sharing | D11/standards | Identity | account tests | P0 |
| TRC-00086 | SEC-IAM-002 Employee MFA mandatory | D11 | Identity Provider | MFA test | P0 |
| TRC-00087 | SEC-IAM-003 Privileged users use stronger MFA | D11 | Admin IAM | privileged auth test | P0 |
| TRC-00088 | SEC-IAM-004 Recovery cannot arbitrarily bypass authentication | D11 | Recovery | recovery abuse test | P0 |
| TRC-00089 | SEC-IAM-005 Session revocation supported | D11 | Sessions | offboarding/session test | P0 |

---

# 33. Master Traceability Matrix — Security Authorization

| Trace | Requirement | Source | Architecture | Test | Priority |
|---|---|---|---|---|---|
| TRC-00090 | SEC-AUTHZ-001 All protected operations authorized server-side | D11/ASVS | Policy Engine | authorization matrix | P0 |
| TRC-00091 | SEC-AUTHZ-002 Object-level authorization required | D11 | API | ID enumeration test | P0 |
| TRC-00092 | SEC-AUTHZ-003 Client portal uses explicit projections | D09/D11 | Client Projection | serialization regression | P0 |
| TRC-00093 | SEC-AUTHZ-004 Temporary access expires automatically | D11 | Access Grants | expiry test | P0 |
| TRC-00094 | SEC-AUTHZ-005 Break-glass access scoped/time-limited/audited | D11 | PrivilegedAccessGrant | break-glass test | P0 |

---

# 34. Master Traceability Matrix — Document Security

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00095 | SEC-DOC-001 Uploads quarantined | D11 | Upload Pipeline | malware test | P0 |
| TRC-00096 | SEC-DOC-002 Type/content validation before processing | D11 | Upload Pipeline | MIME spoof test | P1 |
| TRC-00097 | SEC-DOC-003 Processing isolated | D11 | Document Worker | sandbox review | P1 |
| TRC-00098 | SEC-DOC-004 Storage private/encrypted | D11 | Object Storage | infrastructure test | P0 |
| TRC-00099 | SEC-DOC-005 Downloads require exact-version authorization | D11/D14 | Download Session | cross-matter test | P0 |

---

# 35. Master Traceability Matrix — Audit

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00100 | SEC-AUD-001 Material audit events append-only/protected | D03/D11 | Audit Store | tamper test | P0 |
| TRC-00101 | SEC-AUD-002 Audit records actor/action/target/time | D03 | AuditEvent | schema test | P0 |
| TRC-00102 | SEC-AUD-003 Audit does not duplicate unnecessary confidential content | D11/D12 | Audit | log inspection | P1 |
| TRC-00103 | SEC-AUD-004 Restricted matters not leaked through audit UI | D11 | Audit Viewer | restricted-audit test | P0 |

---

# 36. Master Traceability Matrix — API

| Trace | Requirement | Source | API | Test | Priority |
|---|---|---|---|---|---|
| TRC-00104 | API-AUTHZ-001 Protected APIs enforce object authorization | D13 | All protected APIs | API auth tests | P0 |
| TRC-00105 | API-CMD-001 Legal state changes use explicit commands | D13 | command endpoints | state mutation tests | P0 |
| TRC-00106 | API-IDM-001 Retry-sensitive operations idempotent | D13 | Payment/Signature/Publish | duplicate request test | P1 |
| TRC-00107 | API-EVT-001 Domain events use transactional outbox | D09/D13 | Outbox | failure/retry test | P1 |
| TRC-00108 | API-WHK-001 Webhooks verify signature/replay | D11/D13 | Webhook Gateway | webhook security test | P0 |
| TRC-00109 | API-ERR-001 Restricted resources avoid existence leakage | D11/D13 | Error layer | restricted ID test | P0 |

---

# 37. Master Traceability Matrix — Integrations

| Trace | Requirement | Source | Integration | Test | Priority |
|---|---|---|---|---|---|
| TRC-00110 | INT-PAY-001 Payment event cannot directly activate engagement | D03/D13 | Payment Adapter | TST-Q0-006 | P0 |
| TRC-00111 | INT-PAY-002 Payment amount/currency/provider verified | D13 | Payment Adapter | webhook validation | P0 |
| TRC-00112 | INT-ETA-001 Internal invoice separated from ETA state | D03/D13 | Tax Adapter | ETA failure test | P0 |
| TRC-00113 | INT-ESIGN-001 Signature callback validates exact document/signatory | D03/D13 | E-sign Adapter | signature test | P0 |
| TRC-00114 | INT-GOV-001 Unsupported government scraping prohibited | D03/D13 | Government Adapter | architecture review | P0 |
| TRC-00115 | INT-CAL-001 External calendar cannot delete legal deadline | D13 | Calendar Adapter | TST calendar deletion | P0 |
| TRC-00116 | INT-AI-001 AI calls pass internal policy gateway | D11–D13 | AI Gateway | AI security test | P0 |

---

# 38. Master Traceability Matrix — AI

| Trace | Requirement | Source | Component | Test/Validation | Priority |
|---|---|---|---|---|---|
| TRC-00117 | AI-GOV-001 AI outputs internally labeled machine-assisted | D03 | AI Records/UI | UI test | P1 |
| TRC-00118 | AI-GOV-002 Client-facing legal AI requires lawyer review | D03/D17 | Approval Workflow | TST-Q0-019 | P0 |
| TRC-00119 | AI-GOV-003 Cross-matter retrieval forbidden | D11/D12 | AI Retrieval | TST-Q0-018 | P0 |
| TRC-00120 | AI-GOV-004 Provider model training on client data prohibited | D03/D12 | Provider Policy | vendor/privacy review | P0 |
| TRC-00121 | AI-GOV-005 Model/provider/version/source/review recorded | D03/D10 | AIExecution | provenance test | P1 |
| TRC-00122 | AI-GOV-006 AI legal citations require verification | D03/D17 | AI Review | benchmark citation test | P0 |
| TRC-00123 | AI-GOV-007 AI failure has non-AI fallback | D09/D15 | Feature/Operations | outage test | P0 |

---

# 39. Master Traceability Matrix — Financial

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00124 | TAX-INV-001 Distinguish quote/pro-forma/invoice/payment/tax record | D03 | Finance model | domain tests | P0 |
| TRC-00125 | TAX-INV-002 PDF does not imply ETA accepted invoice | D03 | Invoice/Tax Submission | ETA test | P0 |
| TRC-00126 | TAX-INV-003 Issued financial records immutable | D03/D14 | Invoice | invoice immutability | P0 |
| TRC-00127 | TAX-INV-004 Payment Allocation supports partial/multi-invoice | D10 | PaymentAllocation | financial invariant test | P1 |
| TRC-00128 | TAX-INV-005 Accountant controls tax configuration | D03 | Finance config | role/config test | P1 |

---

# 40. Master Traceability Matrix — Records Retention

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00129 | REC-RET-001 Retention rules effective-dated/source-linked | D12/D14 | RetentionRuleVersion | version test | P0 |
| TRC-00130 | REC-RET-002 Record assigned to rule/trigger | D14 | RetentionAssignment | eligibility test | P1 |
| TRC-00131 | REC-RET-003 Ordinary deletion does not bypass retention | D14 | Domain/API | negative deletion test | P0 |
| TRC-00132 | REC-RET-004 Backup handling included in disposition design | D12/D15 | Backup/Retention | restore/delete test | P1 |

---

# 41. Master Traceability Matrix — Operations

| Trace | Requirement | Source | Component | Test/Evidence | Priority |
|---|---|---|---|---|---|
| TRC-00133 | OPS-ENV-001 Production isolated from lower environments | D15 | Cloud Accounts | infrastructure inspection | P0 |
| TRC-00134 | OPS-CICD-001 Production artifact equals tested artifact | D15 | CI/CD | provenance evidence | P0 |
| TRC-00135 | OPS-CICD-002 High-risk changes require review | D15 | Branch/Release Policy | release inspection | P0 |
| TRC-00136 | OPS-BKP-001 Automated protected backup | D11/D15 | Backup Service | backup test | P0 |
| TRC-00137 | OPS-BKP-002 Restore must be demonstrated | D15 | Restore Process | TST-Q0-014 | P0 |
| TRC-00138 | OPS-ACC-001 Privileged production access limited/audited | D11/D15 | IAM | access review | P0 |
| TRC-00139 | OPS-OBS-001 Legal-critical failures monitored | D15 | Observability | alert test | P1 |
| TRC-00140 | OPS-CFG-001 Legally sensitive config versioned/approved | D15 | Config Registry | config-change test | P0 |

---

# 42. Master Traceability Matrix — Accessibility and Arabic UX

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00141 | UX-A11Y-001 Critical workflows meet WCAG 2.2 AA target | STD-WCAG-2.2 | UI | accessibility suite | P1 |
| TRC-00142 | UX-RTL-001 Arabic UI properly supports RTL | D05/D06/research | Design System | RTL tests | P1 |
| TRC-00143 | UX-BIDI-001 Mixed Arabic/Latin content rendered correctly | research/D10 | Input Components | BiDi tests | P1 |
| TRC-00144 | UX-LGL-001 Provisional/final legal states visually distinguishable | D06/D17 | UI | usability test | P0 |
| TRC-00145 | UX-LGL-002 Errors do not imply unauthorized resource exists | D11/D13 | UI/API | error test | P0 |

---

# 43. Master Traceability Matrix — Client Portal

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00146 | FUN-PRT-001 Client accesses authorized matters only | D05/D11 | Client Portal | client isolation test | P0 |
| TRC-00147 | FUN-PRT-002 Representative authority effective-dated | D10/D17 | ClientRepresentative | expiry test | P0 |
| TRC-00148 | FUN-PRT-003 Uploaded ≠ reviewed/accepted | D14/D17 | Upload UX | usability/state test | P1 |
| TRC-00149 | FUN-PRT-004 Client sees approved statuses only | D09 | Client Projection | serialization test | P0 |
| TRC-00150 | FUN-PRT-005 Notifications minimize sensitive content | D11/D12 | Notification | preview test | P1 |

---

# 44. Master Traceability Matrix — Employee Lifecycle

| Trace | Requirement | Source | Component | Test | Priority |
|---|---|---|---|---|---|
| TRC-00151 | EMP-LEG-001 Employment state separate from system access | D03 | People/IAM | domain test | P0 |
| TRC-00152 | EMP-LEG-002 Offboarding immediately revokes sessions/access | D03/D11 | IAM | TST-Q0-013 | P0 |
| TRC-00153 | EMP-LEG-003 Matter responsibility reassigned before departure completion | D17 | Matter Assignment | offboarding scenario | P0 |
| TRC-00154 | EMP-LEG-004 Monitoring data not automatically used for discipline | D03/D12 | Analytics policy | privacy review | P1 |
| TRC-00155 | EMP-LEG-005 Professional credential separate from employment | D03/D10 | LawyerProfessionalProfile | authority tests | P0 |

---

# 45. Master Traceability Matrix — Marketing and Public Content

| Trace | Requirement | Source | Component | Test/Review | Priority |
|---|---|---|---|---|---|
| TRC-00156 | LEG-MKT-001 Public legal claims require lawyer approval | EG-LAW-001 | Content Workflow | R1 legal validation | P0 |
| TRC-00157 | LEG-MKT-002 No outcome guarantees/influence claims | EG-LAW-001 | Public Content | legal content review | P0 |
| TRC-00158 | LEG-MKT-003 Client case information requires controlled approval | EG-LAW-001/D12 | Case Study Workflow | publication test | P0 |
| TRC-00159 | PRV-MKT-001 Marketing requires approved privacy mechanism | EG-PRV-002 | Marketing | suppression/consent test | P0 |
| TRC-00160 | LEG-MKT-004 Advertising/tracking pixels prohibited on sensitive app surfaces | D03/D12 | Frontend | dependency/analytics audit | P0 |

---

# 46. Traceability — SOP Mapping

D08 SOPs shall be directly linked.

Examples:

```text
SOP-INT-001 → intake requirements
SOP-CFL-001 → conflict requirements
SOP-ENG-001/002 → representation requirements
SOP-MAT-001/002 → matter requirements
SOP-DLN-001 → deadline requirements
SOP-DOC-001/002 → records requirements
SOP-EVD-001 → evidence requirements
SOP-PRT-001 → client publication requirements
SOP-REC-001/002 → retention/destruction requirements
SOP-INC-001 → incident requirements
```

---

# 47. SOP Coverage Rule

Every approved SOP shall identify at least:

- governing requirement IDs;
- responsible roles;
- relevant tests.

An SOP with no linked requirements should be reviewed as potentially undocumented scope.

---

# 48. Architecture Traceability

D09 architectural decisions shall map to requirements.

Example:

```text
ADR-004 Client Projection Separation
  ← LEG-CONF-003
  ← SEC-AUTHZ-003
  ← FUN-PRT-004
```

---

# 49. ADR Traceability

Every security/legal-sensitive ADR shall identify:

- requirements it supports;
- risks it mitigates;
- tests needed.

---

# 50. Data Entity Traceability

D10 entities should identify requirements requiring their existence.

Example:

```text
ConflictReview
  ← LEG-CFL-001
  ← LEG-CFL-004
  ← LEG-CFL-005
```

```text
DeadlineRuleVersion
  ← LEG-DLN-001
  ← LEG-CRT-001
```

---

# 51. Data Field Traceability

Not every ordinary field requires a matrix entry.

Fields representing legal/compliance controls should.

Example:

```text
Deadline.confirmed_by
  ← LEG-DLN-003
```

```text
PrivacyIncident.awareness_at
  ← PRV-BRE-001
```

---

# 52. API Traceability

Every critical command shall identify:

- requirement;
- permission;
- audit event;
- test.

Example:

```text
ConfirmLegalDeadline
  ← LEG-DLN-003
  ← LGV-DLN-001
  → TST-Q0-007
```

---

# 53. Event Traceability

Material event schemas should identify originating requirements.

Example:

```text
DocumentPublishedToClient
  ← LEG-CONF-003
  ← REC-SHR-001
```

---

# 54. UI Traceability

Critical UI states should link to requirements.

Example:

`UNCONFIRMED DEADLINE` warning:

```text
← LEG-DLN-002
← UX-LGL-001
```

---

# 55. Design-System Traceability

Design components affecting legal meaning shall have controlled behavior.

Examples:

- status badge;
- confirmation dialog;
- confidential-data field;
- destructive-action dialog.

---

# 56. Test Traceability

Every Q0 test must identify one or more requirements.

Example:

```text
TST-Q0-010
Wrong client cannot receive unpublished document

→ LEG-CONF-003
→ REC-SHR-001
→ SEC-PUB-002
```

---

# 57. Orphan Test Review

A test with no requirement may represent:

- valuable implicit requirement;
- obsolete test.

Review and either:

- create requirement;
- link it;
- remove obsolete test.

---

# 58. Requirements Without Tests

The matrix should generate a report:

```text
Critical requirements with no verification method
```

Target:

```text
0
```

before production release.

---

# 59. Legal Validation Traceability

Every Q0 legally substantive requirement shall identify:

- D17 validation ID;
- lawyer reviewer;
- validation status.

---

# 60. Legal Validation Example

```text
LEG-DLN-003
  source: Egyptian procedural rule
  SOP: SOP-DLN-001
  implementation: ConfirmDeadline
  test: TST-Q0-007
  validation: LV-007
```

---

# 61. Release Traceability

Each release shall generate a requirement scope.

Example:

```text
Release 2
  includes:
    LEG-CFL-*
    LEG-ENG-*
    LEG-MAT-*
    LEG-DLN-*
    REC-DOC-*
    SEC-AUTHZ-*
```

---

# 62. Release Readiness Query

The system/documentation should be able to answer:

> Show all P0 Release-2 requirements not yet VERIFIED or VALIDATED.

---

# 63. Release Blocking Rule

A P0 requirement included in a release must be:

- implemented;
- verified;
- legally validated where required;
- accepted;

before release, unless feature remains disabled/unreachable.

---

# 64. Deferred Requirement

A requirement may be deferred only if:

- capability is out of release scope;
- implementation path cannot reach prohibited behavior;
- deferral documented.

---

# 65. Feature Flag Traceability

A high-risk feature flag should map to:

- requirements;
- tests;
- release.

Example:

```text
AI_SUMMARIZATION
  ← AI-GOV-*
```

---

# 66. Kill Switch Traceability

Feature kill switches should map to risk/control requirements.

Example:

```text
AI_PROVIDER_ENABLED
  ← SEC/PRV/AI controls
```

---

# 67. Operational Control Traceability

Certain requirements remain continuously verified after release.

Examples:

```text
SEC-IAM-002 → privileged MFA monitoring
OPS-BKP-001 → daily backup monitor
OPS-OBS-001 → legal-critical alert checks
```

---

# 68. Continuous-Control Status

Possible:

```text
HEALTHY
DEGRADED
FAILED
UNKNOWN
```

Critical control failure should create operational incident.

---

# 69. Change Impact Analysis

Every material change request should identify affected:

- requirements;
- SOPs;
- entities;
- APIs;
- tests;
- legal validations.

---

# 70. Legal Source Change Impact

Example:

A procedural law changes.

Query:

```text
source = EG-CRM-002
```

returns all affected:

- rules;
- workflows;
- code;
- tests;
- release configurations.

---

# 71. Provider Change Impact

Example:

Payment provider replacement.

Trace through:

```text
INT-PAY-*
SEC-PAY-*
PRV processing activity
Payment Adapter
Webhook tests
Reconciliation runbook
```

---

# 72. Data Model Change Impact

Example:

Changing `ClientRepresentative`.

Trace to:

- portal authorization;
- engagement signature;
- DSR;
- client communication;
- representative expiry tests.

---

# 73. Requirement Change Request

Material requirement changes should record:

```text
change_id
requirement_id
old_text
new_text
reason
source_change
impact
approvers
effective_version
```

---

# 74. Requirement Supersession

Do not delete historical requirements used in prior releases.

Use:

```text
status = SUPERSEDED
```

and preserve relationships to old releases/tests.

---

# 75. Source Supersession

When source law changes:

- source marked superseded/effective-to;
- requirement reviewed;
- replacement source linked.

Historical release evidence remains reproducible.

---

# 76. Traceability Granularity

Avoid both extremes:

Too coarse:

> “Security — D11.”

Too fine:

> mapping every CSS property to a legal source.

Trace at the level needed to explain material product behavior and assurance.

---

# 77. Critical Requirement Definition of Done

A P0 requirement is complete only when:

```text
[ ] Text approved
[ ] Source/rationale linked
[ ] Owner assigned
[ ] Architecture mapping exists
[ ] Data mapping exists where relevant
[ ] API/UI mapping exists
[ ] Implementation exists
[ ] Verification exists
[ ] Test passes
[ ] Legal validation exists where applicable
[ ] Evidence archived
[ ] Release linkage exists
```

---

# 78. Requirement Evidence Types

Possible evidence:

- test report;
- screenshot;
- architecture review;
- code review;
- configuration snapshot;
- deployment record;
- legal validation form;
- penetration report;
- restore report.

---

# 79. Evidence Location

Evidence should be referenced rather than embedded into the matrix.

Example:

```text
evidence_uri:
  qa://release-2/tst-q0-007
```

The final implementation/tooling may use:

- Git repository;
- test platform;
- issue tracker;
- document repository.

---

# 80. Evidence Immutability

Evidence associated with a released version should not be silently replaced.

New evidence should supersede or append.

---

# 81. Traceability Quality Checks

Automated validation should eventually check:

- duplicate requirement IDs;
- missing owner;
- missing priority;
- P0 without test;
- P0 legal requirement without source;
- P0 legal requirement without validation;
- released requirement without evidence;
- retired source still used by active rule without review.

---

# 82. Matrix Storage

The matrix should not remain only a giant manually edited Word table.

Recommended source-of-truth form:

```text
/docs/requirements/
  requirements.yaml
  traceability.yaml
  sources.yaml
  releases.yaml
```

or equivalent structured format.

Human-readable reports can be generated from it.

---

# 83. Example Structured Requirement

```yaml
id: LEG-DLN-003
title: Lawyer confirmation required for legal deadline
priority: P0
status: APPROVED

sources:
  - EG-CRM-001
  - EG-CRM-002

sops:
  - SOP-DLN-001

architecture:
  - DeadlineDomain
  - PolicyEngine

entities:
  - Deadline
  - DeadlineRuleVersion
  - DeadlineCalculation

commands:
  - ConfirmLegalDeadline

tests:
  - TST-Q0-007

legal_validations:
  - LV-007

release:
  - R2

owner: Legal Operations
```

---

# 84. Structured Traceability Advantages

This allows tooling and CI to query requirements.

Examples:

```text
show all P0 requirements for DeadlineDomain
```

```text
show all R3 requirements without tests
```

---

# 85. Requirement Manifest

Each implementation package should receive an immutable baseline manifest.

Example:

```text
requirements_baseline:
  version: 1.0
  generated_at: ...
  source_commit: ...
```

---

# 86. Implementation Work Item Traceability

Every implementation work item should include requirement IDs.

Example:

```text
Implement client document publication
Requirements:
- LEG-CONF-003
- REC-SHR-001
- SEC-PUB-001
- SEC-PUB-002
```

---

# 87. Pull Request Traceability

Important PRs should reference:

- issue/work item;
- requirement IDs;
- tests.

This reduces undocumented behavior changes.

---

# 88. Commit Traceability

Not every commit needs direct legal citation.

The PR/change set provides the primary mapping.

---

# 89. Code-Level References

Code comments should not be overloaded with legal text.

Where rule implementation depends on law, reference stable internal rule ID.

Example:

```text
rule: EG-CRM-APPEAL-2026-V2
```

rather than copying legal prose throughout code.

---

# 90. Rule Engine Traceability

Machine-readable legal rules shall include:

- requirement ID;
- legal source;
- review;
- test dataset.

---

# 91. Configuration Traceability

Legally sensitive configuration must include requirement/source metadata.

Example:

```text
retention_rule:
  source_requirement: PRV-RET-001
```

---

# 92. Database Migration Traceability

Migrations affecting critical data should reference requirement/change ID.

Example:

> Introduces `confirmed_by` to satisfy LEG-DLN-003.

---

# 93. Security Finding Traceability

A penetration finding may create:

- new requirement;
- updated requirement;
- new test.

Example:

Cross-client search leakage:

```text
→ SEC-AUTHZ-006
→ TST-Q0-021
```

---

# 94. Incident Traceability

Major production incidents should link to requirements/control failures.

Example:

Wrong document disclosure:

```text
failed control:
REC-SHR-001
SEC-PUB-002
```

Corrective action may create additional requirements.

---

# 95. Complaint Traceability

Client complaints identifying workflow weakness may feed:

- requirement update;
- UX change;
- validation scenario.

---

# 96. UAT Traceability

UAT scenarios should reference:

- capability;
- requirements;
- persona.

Example:

Client uploads requested document:

```text
FUN-PRT-003
REC-DOC-001
UX-LGL-001
```

---

# 97. Accessibility Traceability

Each critical WCAG-related requirement should map to accessibility tests.

Example:

```text
UX-A11Y-001
→ TST-A11Y-LOGIN
→ TST-A11Y-UPLOAD
```

---

# 98. Arabic/RTL Traceability

Requirements for bilingual functionality should map to:

- component tests;
- glossary review;
- visual validation.

---

# 99. Performance Traceability

Performance targets will be formalized once D04/pilot evidence exists.

Example future requirement:

```text
OPS-PERF-001
95% of authorized matter detail reads complete within target latency.
```

Must reference measured SLO.

---

# 100. RPO/RTO Traceability

Once approved:

```text
OPS-BKP-RPO-001
OPS-DR-RTO-001
```

should map to:

- architecture;
- backup;
- DR test evidence.

---

# 101. Vendor Traceability

Every processor/integration shall map to affected requirements.

Example AI vendor:

```text
PRV-XBR-001
PRV-AI-001
SEC-AI-*
INT-AI-001
```

---

# 102. Privacy Processing Traceability

Every Processing Activity should map to product capabilities.

Example:

```text
Client Portal Processing Activity
→ CAP-PRT
→ PRV-* requirements
```

---

# 103. Data Retention Traceability

Every RecordClass should map to:

- retention source;
- requirement;
- destruction tests.

---

# 104. Role Traceability

Every role permission should trace to:

- business need;
- professional authority if relevant;
- security requirement.

No permission should exist only because:

> someone asked for admin access.

---

# 105. Permission Register Example

```text
permission: matter.document.publish
requirements:
  - LEG-CONF-003
  - REC-SHR-001
  - SEC-PUB-001
professional_authority:
  - lawyer-approved
```

---

# 106. Threat Traceability

D11 threats should map to requirements.

Example:

```text
THR-001 Client-to-client leakage
→ SEC-AUTHZ-001
→ SEC-AUTHZ-003
→ TST-Q0-002
```

---

# 107. Risk-to-Test Traceability

Every Critical threat should have:

- preventive control;
- detection where appropriate;
- verification test.

---

# 108. Privacy Risk Traceability

Example:

```text
PRV-RSK-008 AI Data Leakage
→ PRV-AI-001
→ INT-AI-001
→ TST AI cross-border/provider tests
```

---

# 109. Records Risk Traceability

Example:

```text
REC-FLR-002 Wrong Version Sent
→ REC-SHR-001
→ client publication preview
→ wrong-version negative test
```

---

# 110. Operational Incident Traceability

Example:

Backup restore failure:

```text
→ OPS-BKP-002
→ TST-Q0-014
→ DR corrective action
```

---

# 111. Capability Traceability

D05 capability IDs should map to requirements.

Example:

```text
CAP-CFL
  → LEG-CFL-*
  → SEC conflict controls
  → conflict tests
```

---

# 112. Capability Coverage Report

The matrix should be able to show:

> CAP-MAT has 43 requirements: 12 P0, 20 P1, 11 P2.

This supports planning.

---

# 113. Release Capability Coverage

Example:

```text
R2
CAP-CFL
CAP-ENG
CAP-MAT
CAP-DLN
CAP-TSK
CAP-DOC
CAP-SEC
```

---

# 114. Requirement Dependency

Requirements may depend on others.

Example:

```text
FUN-PRT-002
depends_on:
  SEC-IAM client identity
  SEC-AUTHZ portal projection
```

---

# 115. Dependency Types

Possible:

```text
REQUIRES
BLOCKS
SUPERSEDES
CONFLICTS_WITH
DERIVED_FROM
IMPLEMENTS
VERIFIED_BY
VALIDATED_BY
```

---

# 116. Circular Dependency Review

Critical requirement architecture should avoid unresolved circular dependencies.

Example:

Cannot validate client publication if client identity and authorization are undefined.

---

# 117. Traceability Maturity Levels

## TRC-0

Requirement documented only.

## TRC-1

Source and owner linked.

## TRC-2

Architecture/implementation mapped.

## TRC-3

Tests mapped.

## TRC-4

Validation/evidence mapped.

## TRC-5

Continuous operational evidence linked.

Target:

- P0 production requirements: TRC-4 minimum.
- continuous controls: TRC-5 where relevant.

---

# 118. Baseline Freeze

Before implementation begins, the project should establish:

```text
Requirements Baseline 1.0
```

This does not prevent change.

It provides a known starting point.

---

# 119. Baseline Contents

Baseline includes:

- requirement IDs/text;
- priority;
- sources;
- capability;
- initial acceptance criteria.

---

# 120. Baseline Change

Changes after freeze require versioned change record.

---

# 121. Master SRS Relationship

D18 does not replace the Master SRS.

The Master SRS will:

- normalize;
- deduplicate;
- refine;
- consolidate;

the detailed requirements from D01–D18.

D18 will then reference the final SRS requirement IDs.

---

# 122. Pre-SRS Requirement Normalization

Before final SRS:

1. collect all requirements;
2. detect duplicates;
3. detect conflicting wording;
4. split composite requirements;
5. assign canonical IDs;
6. validate sources;
7. assign priorities;
8. assign owners.

---

# 123. Duplicate Example

Potential duplicates:

```text
D03:
Matter access must be deny-by-default.

D11:
Authorization must deny by default.

D13:
Protected APIs must authorize each resource.
```

These may become:

- one canonical requirement;
- several derived implementation requirements.

---

# 124. Conflict Example

If one document says:

> Finance may access all Matter documents.

and D03 says:

> Finance access should be restricted.

The traceability process must flag contradiction before implementation.

---

# 125. Requirements Conflict Status

Use:

```text
CONFLICT_DETECTED
LEGAL_REVIEW_REQUIRED
RESOLVED
```

---

# 126. Canonical Requirement Rule

Once Master SRS exists, implementation references canonical SRS IDs rather than multiple draft-document statements.

D01–D18 remain rationale/evidence documents.

---

# 127. Implementation spec workflow Relationship

Implementation plans shall derive tasks from:

- canonical SRS;
- D18 traceability;
- architecture ADRs;
- tests.

Implementers shall not independently invent legal workflow requirements.

---

# 128. Task Contract

Each implementation task should include:

```text
Task
Requirements
Architecture constraints
Files/modules
Tests
Forbidden shortcuts
Acceptance criteria
```

---

# 129. Task Completion Rule

An implementer shall not declare a task complete merely because:

- code compiles;
- page renders.

It must demonstrate requirement acceptance criteria and tests.

---

# 130. Review Loop

Recommended:

```text
Planner
   ↓
Implementer
   ↓
Automated Tests
   ↓
Reviewer
   ↓
Security/Domain Review where needed
   ↓
Fix
   ↓
Acceptance
```

This will be formalized in the implementation plans.

---

# 131. Traceability CI Gate

Future CI should be able to enforce selected rules.

Examples:

- P0 requirement without test → fail release manifest;
- new legally sensitive rule without source → fail;
- new endpoint marked critical without authorization test → fail.

---

# 132. Generated Documentation

Structured traceability data can generate:

- requirement catalogue;
- release checklist;
- test coverage report;
- source impact report;
- audit evidence list.

---

# 133. Traceability Dashboard

Potential dashboard views:

## By Requirement

Show source → implementation → tests.

## By Release

Show readiness.

## By Source

Show impact of law/standard.

## By Risk

Show controls.

## By Capability

Show implementation coverage.

---

# 134. Release Readiness Status

Suggested:

```text
NOT_STARTED
IN_PROGRESS
AT_RISK
BLOCKED
READY
RELEASED
```

---

# 135. P0 Readiness Formula

A P0 requirement is `READY` only when:

```text
status >= IMPLEMENTED
AND required_tests = PASS
AND required_validation = APPROVED
AND required_evidence exists
```

---

# 136. Partial Implementation

Requirement may be:

```text
PARTIALLY_IMPLEMENTED
```

only internally; it is not release-satisfied.

---

# 137. Manual Control

Some requirements may initially be fulfilled through controlled manual process.

The traceability record must explicitly identify:

```text
implementation_type = MANUAL_CONTROL
```

and evidence.

---

# 138. Manual-Control Example

Government status:

```text
INT-GOV-001
implementation:
  ManualCourtStatusProvider
```

This is valid until an authorized machine interface exists.

---

# 139. Temporary Control

A temporary control requires:

- reason;
- owner;
- expiry;
- target permanent solution.

---

# 140. Requirement Waiver

P0 requirement waiver requires:

- specific scope;
- risk;
- compensating control;
- senior approval;
- expiry.

---

# 141. Legal Requirement Waiver

Engineering or product cannot waive a legal/professional requirement.

Only an authorized legal determination can establish:

- not applicable;
- alternative lawful control.

---

# 142. Not Applicable Status

A requirement may be `NOT_APPLICABLE` only with documented rationale.

Example:

A feature-specific AI requirement may be not applicable before AI release.

---

# 143. Deferred Feature Safety

If feature is deferred, ensure:

- code path unavailable;
- integration disabled;
- UI absent/inaccessible.

“Not intended to be used” is not sufficient if endpoint remains active.

---

# 144. Evidence Review

Release reviewer should sample evidence rather than accepting checkbox status blindly.

---

# 145. Traceability Audit

Periodically review:

- random P0 requirements;
- implemented control;
- tests;
- evidence;
- source currency.

---

# 146. Legal Source Currency Review

High-risk legal requirements should have a review date.

A requirement may enter:

```text
SOURCE_REVIEW_DUE
```

without immediately becoming invalid.

---

# 147. Rule Expiry Alert

Legally sensitive configuration with upcoming effective-to date should alert owners.

---

# 148. Annual Control Review

Even absent known changes, periodically review:

- professional authority;
- privacy;
- security;
- retention;
- procedural rules.

Exact schedule to be approved later.

---

# 149. New Practice Area

Adding a new practice area shall trigger traceability review for:

- matters;
- Parties;
- conflicts;
- deadline rules;
- documents;
- authority;
- templates.

---

# 150. New Jurisdiction

Lex Gate’s current baseline is Egypt.

Supporting another jurisdiction would require a distinct legal requirements set rather than reusing Egyptian rules blindly.

---

# 151. Multi-Jurisdiction Rule

Future legal-rule records must identify jurisdiction explicitly.

---

# 152. Requirement Evidence Confidentiality

Traceability itself may reveal:

- security architecture;
- legal controls;
- confidential workflows.

Access should be internal and controlled.

---

# 153. Public Requirements

Only specifically approved requirements may appear in public security/compliance statements.

---

# 154. Compliance Claims

No marketing or public documentation should claim:

- “fully compliant”;
- “certified”;
- “government integrated”;

unless independently justified.

---

# 155. Traceability Test — Source to Release

Example query:

> What product behavior depends on EG-PRV-002?

Expected result should include:

- consent;
- DSR;
- cross-border;
- breach;
- marketing;
- sensitive-data controls;
- tests/releases.

---

# 156. Traceability Test — Release to Source

Example:

> Why does client publication require explicit approval?

Expected chain:

```text
Release R3
→ REC-SHR-001
→ LEG-CONF-003
→ EG-LAW-001 / confidentiality model
```

---

# 157. Traceability Test — Code to Requirement

Example:

```text
DocumentPublicationService
```

should map to:

- REC-SHR-001
- SEC-PUB-001
- SEC-PUB-002
- LEG-CONF-003

---

# 158. Traceability Test — Test Failure Impact

If:

```text
TST-Q0-010 fails
```

matrix should show affected:

- requirements;
- R3 release;
- client publication capability.

Release becomes blocked.

---

# 159. Traceability Test — Law Change

If procedural source changes:

- list applicable requirement IDs;
- deadline rule versions;
- active matters requiring review;
- tests requiring rerun.

---

# 160. Traceability Test — Vendor Incident

If AI provider becomes prohibited/unapproved:

- identify AI requirements;
- processing activities;
- feature flags;
- affected workflows.

Kill switch should disable provider without core-system failure.

---

# 161. Master Requirement Register — Minimum Metadata

Every canonical requirement shall eventually contain:

```text
id
title
statement
type
priority
status
owner
source
rationale
capability
release
acceptance_criteria
```

---

# 162. Optional Requirement Metadata

As relevant:

```text
sop
architecture
entity
api
event
threat
privacy_activity
test
validation
evidence
review_date
```

---

# 163. Acceptance Criteria Rule

Requirement statements and acceptance criteria are separate.

Requirement:

> Client publication requires an authorized representative.

Acceptance criteria:

- unauthorized representative rejected;
- expired representative rejected;
- approved representative succeeds;
- exact recipient recorded.

---

# 164. Acceptance Criteria Quality

Acceptance criteria should be:

- observable;
- testable;
- specific.

Avoid:

> Works correctly.

---

# 165. Derived Requirements

A technical requirement may derive from a legal one.

Example:

Legal:

```text
LEG-CONF-001
```

Derived technical:

```text
SEC-AUTHZ-001
API-AUTHZ-001
```

The matrix should preserve derivation.

---

# 166. Non-Functional Requirements

Traceability also covers:

- security;
- reliability;
- performance;
- accessibility;
- maintainability.

---

# 167. NFR Testability

Example:

Bad:

> System shall be fast.

Better:

> Matter list p95 latency shall meet approved SLO under representative R2 workload.

Target to be filled after load baseline.

---

# 168. Research-Supported Requirements

Peer-reviewed research supports design principles such as:

- adoption-aware workflow;
- BiDi UX;
- accessibility.

Research sources are not treated as Egyptian legal authority.

---

# 169. Firm Discovery Requirements

D04 findings may create:

```text
BUS-*
FUN-*
UX-*
```

These should indicate evidence:

```text
source = LG-INT-...
```

once discovery is populated.

---

# 170. Assumption-Based Requirements

Where implementation must proceed before discovery confirmation:

```text
source_class = ASSUMPTION
status = PROPOSED
```

They require later validation.

---

# 171. Assumption Expiry

Assumptions should not silently become permanent requirements.

Assign:

- owner;
- validation milestone.

---

# 172. Open Decisions

D05/D09/D10/etc. contain unresolved decisions.

These are not requirements until resolved.

Maintain a separate `Decision Register`.

---

# 173. Decision-to-Requirement Conversion

When decision made:

Example:

> Identity provider selected.

This may generate implementation requirements and ADR.

---

# 174. ADR/Requirement Distinction

Requirement says:

> what must be true.

ADR says:

> how/why a technical approach was selected.

---

# 175. Risk Acceptance Traceability

Accepted residual risk should reference:

- affected requirement;
- control gap;
- owner;
- expiry.

---

# 176. Security Exception Example

Temporary lack of phishing-resistant MFA for clients:

- requirement remains;
- exception identifies temporary alternate control;
- does not rewrite requirement to claim compliance.

---

# 177. Requirement Review Workflow

Suggested:

```text
DRAFT
  ↓
DOMAIN REVIEW
  ↓
LEGAL/SECURITY/PRIVACY REVIEW as applicable
  ↓
APPROVED
  ↓
BASELINED
```

---

# 178. Requirement Modification Workflow

```text
CHANGE PROPOSED
  ↓
IMPACT ANALYSIS
  ↓
REVIEW
  ↓
APPROVAL
  ↓
NEW BASELINE
```

---

# 179. Requirement Deletion

Do not physically delete approved requirements from historical baselines.

Use status:

```text
RETIRED
```

---

# 180. Traceability Repository Proposal

Future repo structure:

```text
/docs/requirements/
  README.md
  requirements.yaml
  traceability.yaml
  capabilities.yaml
  sources.yaml
  decisions.yaml
  releases.yaml
  validations.yaml

/generated/
  requirement-catalogue.md
  traceability-matrix.md
  release-readiness.md
```

---

# 181. Requirement Schema Example

```yaml
id: REC-HLD-001
title: Legal hold blocks destruction
statement: >
  The system shall prevent destruction of any record
  within the scope of an active legal hold.
type: RECORDS
priority: P0
status: APPROVED
owner: Records
sources:
  - LG-D12
  - LG-D14
sops:
  - SOP-REC-001
entities:
  - LegalHold
  - LegalHoldTarget
tests:
  - TST-Q0-012
release:
  - R5
```

---

# 182. Trace Entry Example

```yaml
id: TRC-00129
requirement: REC-HLD-001
architecture:
  - RecordsDomain
commands:
  - ExecuteDestruction
tests:
  - TST-Q0-012
evidence:
  - pending
legal_validation:
  - LV-Records-Retention
```

---

# 183. CI Traceability Validation

Future script:

```text
validate requirements
validate sources
validate test references
validate release coverage
```

CI should fail malformed critical records.

---

# 184. Requirement Consumption

Implementers should load only the relevant subset per task to keep each task focused.

Example task context:

```text
Requirements:
REC-SHR-001
SEC-PUB-001
SEC-PUB-002
API-AUTHZ-001

Relevant docs:
D08
D10
D11
D13
D14
```

---

# 185. Forbidden Implementation Behavior

Implementers shall not:

- reinterpret Egyptian law independently;
- remove a control because tests are inconvenient;
- combine distinct legal states for simpler code;
- replace explicit authorization with UI hiding;
- weaken P0 invariants without change approval.

---

# 186. Requirement Ambiguity Handling

If an implementer discovers ambiguity:

- stop that specific decision;
- mark requirement question;
- propose alternatives;
- preserve safest existing behavior.

Do not silently choose a legally material interpretation.

---

# 187. Traceability and Code Review

Reviewers should ask:

1. Which requirements does this implement?
2. Which invariants are affected?
3. Which tests prove it?
4. Does it create a new undocumented behavior?

---

# 188. Traceability and QA

QA should derive high-risk testing from requirements, not only user stories.

---

# 189. Traceability and Legal Review

Lawyers should review:

- requirement language;
- states;
- acceptance criteria;

without needing to inspect source code.

---

# 190. Traceability and Privacy Review

DPO/privacy reviewer should be able to query:

> Which features send personal data outside Egypt?

through requirement/integration mappings.

---

# 191. Traceability and Security Review

Security reviewer should query:

> Which endpoints permit bulk export and which tests protect them?

---

# 192. Traceability and Records Review

Records reviewer should query:

> Which entities can be destroyed and which retention rules control them?

---

# 193. Traceability and Operations

Operations should query:

> Which P0 requirements depend on provider X?

to plan provider outage.

---

# 194. Traceability and Incident Response

During incident:

identify affected:

- requirement/control;
- client workflow;
- evidence;
- release version.

---

# 195. Requirement Coverage Targets

Before first production release:

- P0 requirements: **100% source/rationale coverage**
- P0 requirements: **100% owner coverage**
- P0 requirements: **100% verification coverage**
- legally substantive P0: **100% required legal validation**
- released P0: **100% evidence linkage**

---

# 196. P1 Coverage Target

Before relevant release:

- all P1 requirements documented;
- verification method identified;
- critical dependencies resolved.

---

# 197. P2/P3 Requirements

May have lighter evidence depending on risk.

They still require ownership and release scope.

---

# 198. Traceability Health Metrics

Candidate metrics:

- P0 without test;
- P0 without owner;
- P0 without source;
- P0 legal without lawyer validation;
- implemented requirement without evidence;
- test without requirement;
- stale source reviews;
- unresolved requirement conflicts.

---

# 199. Desired Critical Metric Values

Before production:

```text
P0_without_source = 0
P0_without_owner = 0
P0_without_test = 0
P0_legal_without_validation = 0
P0_failed_tests = 0
unresolved_P0_conflicts = 0
```

---

# 200. Requirement Churn Metric

Track requirement changes after baseline.

High churn in a legal-critical module may indicate discovery/validation incomplete.

---

# 201. Traceability Review Gate A

Research baseline:

- sources linked;
- assumptions identified.

---

# 202. Traceability Review Gate B

Product/legal model:

- D03/D05/D07/D08 requirements normalized.

---

# 203. Traceability Review Gate C

Architecture:

- requirements mapped to D09–D15.

---

# 204. Traceability Review Gate D

Implementation:

- requirements mapped to code/tests/evidence.

---

# 205. First Implementation Baseline

Before implementation begins, create:

```text
LG Requirements Baseline 1.0
```

containing:

- final Master SRS requirements;
- D18 mappings;
- ADRs;
- initial tests.

---

# 206. Baseline Checksum

The baseline should have:

- version;
- repository commit;
- generated checksum/hash.

This allows implementers and reviewers to know which specification they implemented.

---

# 207. Release Manifest

Each release should include:

```text
release_id
requirements_baseline
included_requirements
deferred_requirements
test_report
legal_validation_report
security_report
privacy_report
known_issues
```

---

# 208. Production Release Evidence

At minimum for critical releases:

- release manifest;
- test report;
- migration report;
- security status;
- legal approvals where needed;
- deployment record;
- post-deployment verification.

---

# 209. Traceability Matrix Acceptance Test

Select any random P0 requirement and verify that a reviewer can reconstruct:

- why it exists;
- who owns it;
- where implemented;
- how verified;
- whether safe to release.

If not, traceability is incomplete.

---

# 210. Initial Traceability Gaps

At D18 v0.1 the following are intentionally incomplete:

1. Exact Legal Profession Law article mapping for every canonical requirement.
2. Exact current procedural provisions for each practice-area deadline.
3. D04 firm-specific evidence.
4. Final practice-area taxonomies.
5. Final canonical requirement IDs after SRS deduplication.
6. Actual source-code module locations.
7. Actual API OpenAPI operation IDs.
8. Actual test IDs beyond baseline catalogue.
9. Actual CI evidence.
10. Actual legal validation workshop records.
11. Actual production release evidence.
12. Final RPO/RTO/SLO requirements.
13. Provider-specific integrations.
14. Final privacy authorizations.
15. Final retention durations.

These gaps do not invalidate D18.

They define the work required during consolidation and implementation.

---

# 211. Immediate Next Traceability Actions

After D18 approval:

1. Consolidate D01–D18 into Master SRS.
2. Normalize canonical requirement IDs.
3. Remove duplicate requirements.
4. Resolve contradictory requirements.
5. Create structured requirements source files.
6. Generate first complete matrix.
7. Assign owners.
8. Assign release scope.
9. Convert P0 requirements into acceptance tests.
10. Create implementation plans.

---

# 212. D18 Provisional Completion Criteria

D18 may receive provisional approval when:

- traceability model is accepted;
- canonical metadata is accepted;
- source linking is mandatory;
- requirement ownership is mandatory;
- P0 verification is mandatory;
- legal validation mapping is mandatory where applicable;
- release linkage is mandatory;
- historical requirements are preserved;
- structured machine-readable storage is approved;
- implementers will consume canonical requirements rather than inventing behavior.

---

# 213. D18 Final Completion Criteria

D18 receives final approval only after:

- Master SRS is complete;
- canonical requirements are normalized;
- every P0 requirement has source/rationale;
- every P0 requirement has owner;
- every P0 requirement has verification;
- legal P0 requirements have appropriate lawyer validation;
- Release 1–6 mappings are complete;
- actual code/API/data mappings are populated during implementation;
- test evidence is attached;
- production releases generate traceability manifests.

---

# 214. Approval Record

## Requirements / Business Analysis Lead

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Lead Practising Egyptian Lawyer

Name: ______________________________  
Professional Status: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Engineering / Architecture Lead

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Security Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Privacy Reviewer / DPO

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## QA / Test Lead

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Records Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Product / Legal Operations Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Project Sponsor

Name: Ahmed Elshazlly  
Role: Project Sponsor / Lex Gate Owner  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

---

# Appendix A — Canonical Requirement Record

```text
Requirement ID:
Title:
Statement:
Type:
Priority:
Status:

Primary sources:
Relevant provisions:
Source confidence:

Rationale:
Capability:
Release:
Owner:

SOP:
Architecture:
Domain:
Data entities:
API/Command:
Events:
UI:

Security:
Privacy:
Records:
Operations:

Acceptance criteria:
Tests:
Verification method:
Legal validation:

Implementation:
Repository:
Issue:
PR:
Release:

Evidence:
Last review:
Next review:
Notes:
```

---

# Appendix B — Traceability Record

```text
Trace ID:
Requirement:
Derived from:
Depends on:

Source:
SOP:
ADR:
Entity:
API:
Event:
UI:

Threat:
Privacy activity:
Retention rule:

Test:
Validation:
Release:

Implementation:
Evidence:
Owner:
Status:
```

---

# Appendix C — Requirement Change Record

```text
Change ID:
Requirement:
Current version:
Proposed version:

Reason:
Source change:
Incident:
Business change:
Legal change:

Old text:
New text:

Affected SOPs:
Affected architecture:
Affected data:
Affected APIs:
Affected tests:
Affected validation:
Affected releases:

Risk:
Approvals:
Effective version:
```

---

# Appendix D — Release Traceability Report

```text
Release:
Requirements baseline:
Build:
Date:

P0 total:
P0 implemented:
P0 verified:
P0 validated:
P0 failed:
P0 blocked:

P1 total:
P1 verified:

Open defects:
Open legal questions:
Open security risks:
Open privacy risks:

Test report:
Legal validation:
Security approval:
Privacy approval:
Operations approval:

Decision:
```

---

# Appendix E — Source Impact Report

```text
Source ID:
Source version:
Effective date:
Change detected:

Affected requirements:
Affected workflows:
Affected legal rules:
Affected entities:
Affected APIs:
Affected tests:
Affected releases:
Affected active matters:

Legal reviewer:
Required action:
Deployment deadline:
Status:
```

---

# Appendix F — Traceability Quality Rules

**INV-TRC-001**

No released P0 requirement exists without a source or documented internal rationale.

**INV-TRC-002**

No released P0 requirement exists without an accountable owner.

**INV-TRC-003**

No released P0 requirement exists without a verification method.

**INV-TRC-004**

No legally substantive P0 requirement is considered validated without appropriate legal review.

**INV-TRC-005**

No failed P0 test may be hidden by marking its requirement complete.

**INV-TRC-006**

No historical released requirement is silently deleted from the baseline.

**INV-TRC-007**

No legal-source change automatically alters production behavior without impact analysis and approval.

**INV-TRC-008**

No implementer may redefine legal requirements merely to simplify implementation.

**INV-TRC-009**

No production release is considered fully controlled if its applicable P0 requirement set cannot be reconstructed.

**INV-TRC-010**

No traceability status may substitute for actual test, validation, or operational evidence.

---

# Appendix G — Master Traceability Rule

The Requirements Traceability Matrix is not an administrative spreadsheet created after implementation.

For Lex Gate it is the mechanism that connects:

> law to requirement, requirement to workflow, workflow to architecture, architecture to code, code to tests, tests to professional validation, and validation to the production decision.

A requirement is therefore not truly complete merely because it has been implemented.

It is complete when the project can demonstrate:

> why the requirement exists, how it is enforced, how its failure is prevented or detected, who validated its legal or operational meaning, which evidence proves its operation, and which released version of Lex Gate relies upon it.