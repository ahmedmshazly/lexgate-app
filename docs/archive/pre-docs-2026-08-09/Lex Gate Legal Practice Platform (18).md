# Lex Gate Legal Practice Platform  
# Master Software Requirements Specification

**Document ID:** LG-SRS-001  
**Document Title:** Master Software Requirements Specification  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Primary Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.9  
**Status:** Consolidated Implementation Baseline — Subject to Explicit Legal, Firm-Discovery, and Provider Gates  
**Classification:** Strictly Confidential — Master Product, Legal, Security, and Engineering Specification  
**Prepared Date:** 8 August 2026  

---

# 1. Document Authority

This Master SRS consolidates and normalizes:

- LG-D01 through LG-D18;
- legal and regulatory requirements;
- product requirements;
- architecture requirements;
- data requirements;
- security and privacy controls;
- records controls;
- operational requirements;
- testing and validation requirements.

For implementation purposes:

> **LG-SRS-001 is the canonical product specification.**

D01–D18 remain authoritative supporting records for:

- rationale;
- research;
- legal sourcing;
- architectural analysis;
- detailed threat modeling;
- workflow explanation;
- traceability.

Where implementation wording in D01–D18 appears duplicative or conflicts with this consolidated SRS, the issue shall be handled as follows:

1. controlling Egyptian law or authoritative legal source;
2. approved legal interpretation;
3. this Master SRS;
4. approved ADR/SOP;
5. implementation documentation.

No engineer may resolve a legally material conflict by silently choosing the easiest implementation.

---

# 2. Purpose

Lex Gate shall provide an integrated digital legal-practice environment designed specifically for an Egyptian law firm.

The platform shall combine:

1. public legal-services website;
2. prospective-client intake;
3. conflict screening;
4. client and Party management;
5. engagement management;
6. matter and proceeding management;
7. deadlines and hearings;
8. tasks and workflows;
9. documents and evidence;
10. legal communications;
11. secure client portal;
12. billing and payments;
13. people and professional-authority management;
14. privacy and records governance;
15. security and audit;
16. reporting;
17. approved external integrations;
18. controlled AI assistance.

The system shall enable Lex Gate to digitize legal operations without collapsing professional distinctions into ordinary software CRUD operations.

---

# 3. Product Vision

> Lex Gate shall provide a trusted digital legal-service environment in which clients can engage the firm clearly and securely, lawyers can manage legal work with reliable control and context, and the firm can grow without compromising professional responsibility, confidentiality, legal deadlines, evidentiary integrity, privacy, or service quality.

---

# 4. Product Mission

The platform shall:

- create a coherent client journey from enquiry through closure;
- centralize institutional legal records;
- prevent unmanaged matter silos;
- improve deadline reliability;
- strengthen conflict control;
- enforce professional and matter-level authority;
- enable secure client collaboration;
- improve document provenance and versioning;
- provide auditable operational history;
- improve billing visibility;
- support Egyptian privacy requirements;
- enable safe future automation without delegating substantive legal judgment to software.

---

# 5. Fundamental System Invariants

The following are system-wide invariants.

## INV-001 — Authentication Does Not Equal Authorization

A logged-in user is not automatically entitled to any Matter.

---

## INV-002 — Employment Does Not Equal Firm-Wide Access

Being employed by Lex Gate shall not grant unrestricted client-file access.

---

## INV-003 — Technical Privilege Does Not Equal Professional Authority

A system administrator shall not acquire lawyer authority through infrastructure permissions.

---

## INV-004 — Prospect Does Not Equal Client

An enquiry or consultation does not automatically create a client relationship.

---

## INV-005 — Payment Does Not Equal Engagement

Receipt of money alone shall not establish representation.

---

## INV-006 — Engagement Does Not Equal Matter

An Engagement and Matter are separate legal/business entities.

---

## INV-007 — Matter Does Not Equal Proceeding

A Matter may contain zero, one, or several Proceedings.

---

## INV-008 — Task Does Not Equal Deadline

Completing a task shall not automatically satisfy a legal deadline.

---

## INV-009 — Calculated Deadline Does Not Equal Confirmed Deadline

Machine calculation is provisional until required lawyer confirmation.

---

## INV-010 — Submission Does Not Equal Official Acceptance

Sending a document to an authority shall not automatically mark it officially filed or accepted.

---

## INV-011 — Upload Does Not Equal Legal Acceptance

A client upload may be successfully received while still awaiting lawyer review.

---

## INV-012 — Draft Does Not Equal Final

Draft status must remain visibly and technically separate from final legal status.

---

## INV-013 — Final Does Not Equal Client Visible

A finalized internal document remains internal unless explicitly published.

---

## INV-014 — Document Does Not Equal Evidence

Evidence status requires separate classification.

---

## INV-015 — Hash Does Not Equal Authenticity

A cryptographic hash establishes byte integrity, not substantive truth or legal authenticity.

---

## INV-016 — OCR Does Not Equal Verified Data

OCR-derived information shall remain derived until appropriate review.

---

## INV-017 — Translation Does Not Equal Certified Translation

Machine or ordinary translation shall not be represented as official or certified without proper review.

---

## INV-018 — AI Output Does Not Equal Lawyer Decision

AI-generated content is machine-assisted draft information unless an authorized lawyer approves it.

---

## INV-019 — Deletion Does Not Equal Legal Destruction

Records subject to retention or legal hold cannot be destroyed through generic deletion.

---

## INV-020 — External Provider State Does Not Equal Internal Legal State

Payment, signature, court, calendar, AI, or other provider results must pass Lex Gate domain rules before altering canonical legal state.

---

# 6. Jurisdiction and Legal Design

The initial product is designed for:

> **Egyptian legal practice.**

The system shall not assume that workflows or procedural logic from:

- the United States;
- United Kingdom;
- European Union;
- another Arab jurisdiction;

apply to Egyptian legal operations.

Where a requirement derives from Egyptian law, it shall be:

- source-linked;
- versioned;
- effective-dated where relevant;
- reviewable by authorized legal personnel.

---

# 7. Legal Baseline

The controlled legal baseline includes, subject to final official-text review where required:

- Legal Profession Law No. 17/1983;
- Personal Data Protection Law No. 151/2020;
- Executive Regulations issued through MCIT Decision No. 816/2025;
- Anti-Information Technology Crimes Law No. 175/2018;
- Electronic Signature Law No. 15/2004;
- Evidence Law No. 25/1968;
- applicable civil/commercial procedural law;
- current criminal-procedure regime;
- Criminal Procedure Law No. 174/2025 and its effective transition;
- relevant Egyptian tax and ETA frameworks;
- applicable employment, consumer, telecommunications, and related rules.

The platform shall not advertise itself as legally compliant merely because these requirements have been modeled.

Final production compliance requires applicable professional review.

---

# 8. Source Precedence

When legal interpretation affects system behavior:

1. current controlling Arabic Egyptian legal text;
2. official Egyptian Gazette;
3. relevant regulator/ministry authority;
4. professionally validated legal interpretation;
5. secondary material;
6. internal project assumption.

Machine-readable legal rules shall never be created solely from an unverified summary where the controlling source is available.

---

# 9. Product Surfaces

The system shall contain four primary surfaces.

## SUR-01 — Public Experience

Includes:

- homepage;
- firm profile;
- practice areas;
- lawyer profiles;
- educational content;
- contact;
- enquiry;
- consultation request.

---

## SUR-02 — Client Portal

Includes controlled access to:

- client Matters;
- approved updates;
- published documents;
- document requests;
- secure uploads;
- invoices;
- payments;
- approved communications;
- account/security functions.

---

## SUR-03 — Practice Operations

Internal environment for:

- intake;
- conflicts;
- client management;
- engagements;
- Matters;
- Proceedings;
- deadlines;
- tasks;
- documents;
- evidence;
- communications;
- billing;
- reporting.

---

## SUR-04 — Administration and Compliance

Includes:

- users;
- roles;
- professional status;
- reference data;
- privacy;
- records;
- audit;
- integrations;
- system configuration;
- security;
- operations.

Administration shall not automatically expose substantive Matter content.

---

# 10. User Categories

The initial model shall support at least:

- prospective client;
- individual client;
- organizational client representative;
- managing lawyer;
- responsible lawyer;
- lawyer;
- junior lawyer;
- trainee;
- legal assistant;
- intake/admin personnel;
- finance personnel;
- records personnel;
- privacy/DPO function;
- system administrator;
- external lawyer;
- expert/translator;
- executive/management user.

System roles and professional legal authority shall remain separate.

---

# 11. Capability Model

Canonical capability groups:

```text
CAP-PUB  Public Experience
CAP-IDN  Identity and Access
CAP-CRM  Prospect and Client
CAP-CFL  Conflict Management
CAP-ENG  Engagement
CAP-MAT  Matter Management
CAP-PRC  Proceedings
CAP-DLN  Deadlines and Hearings
CAP-TSK  Tasks and Workflow
CAP-DOC  Documents
CAP-EVD  Evidence
CAP-COM  Communications
CAP-PRT  Client Portal
CAP-BIL  Billing and Payments
CAP-PEO  People and Professional Authority
CAP-KNW  Knowledge and Templates
CAP-RPT  Reporting and Analytics
CAP-PRV  Privacy
CAP-SEC  Security and Audit
CAP-REC  Records and Retention
CAP-INT  Integrations
CAP-AI   Controlled AI
CAP-OPS  Platform Operations
```

---

# 12. Release Model

## R0 — Foundation and Compliance Readiness

No real client data required.

Includes:

- architecture;
- identity foundation;
- authorization;
- database;
- document storage;
- audit;
- CI/CD;
- security baseline;
- privacy registry;
- design system.

---

## R1 — Public Website and Controlled Enquiry

Includes:

- public website;
- firm/lawyer content;
- enquiry;
- consultation request;
- public privacy notices;
- protected intake storage.

---

## R2 — Core Practice Operations

Includes:

- Parties;
- clients;
- conflicts;
- engagement;
- Matters;
- Proceedings;
- deadlines;
- hearings;
- tasks;
- documents;
- internal communications;
- audit.

---

## R3 — Client Portal

Includes:

- client authentication;
- client projections;
- Matter access;
- document requests;
- uploads;
- approved publications;
- communications.

---

## R4 — Billing, Payments, and Tax

Includes:

- fee arrangements;
- expenses;
- invoices;
- payments;
- reconciliation;
- applicable ETA integration.

---

## R5 — Advanced Records and Knowledge

Includes:

- legal holds;
- retention;
- destruction;
- physical archives;
- evidence enhancements;
- knowledge artifacts;
- advanced exports.

---

## R6 — Controlled Automation and AI

Includes selected approved:

- summarization;
- extraction;
- translation;
- transcription;
- drafting;
- internal knowledge retrieval.

No autonomous substantive legal decision-making.

---

# 13. Canonical Domain Architecture

Primary bounded contexts:

- Identity
- Organization
- Parties
- People
- Intake
- Conflicts
- Clients
- Engagements
- Matters
- Proceedings
- Deadlines
- Work
- Documents
- Evidence
- Communications
- Finance
- Knowledge
- Privacy
- Records
- Security
- Audit
- Integrations

---

# 14. Canonical Aggregate Roots

Core aggregate roots:

- Party
- UserAccount
- Enquiry
- ConflictReview
- ClientRelationship
- Engagement
- Matter
- Proceeding
- Deadline
- Task
- Document
- EvidenceItem
- Communication
- Invoice
- Payment
- ProcessingActivity
- DataSubjectRequest
- LegalHold
- SecurityIncident

No giant Matter aggregate shall contain every task, document, communication, invoice, and Proceeding.

---

# 15. Party Requirements

## DAT-PTY-001 — P0

A canonical Party shall represent a natural person or organization independently from their role as:

- client;
- prospective client;
- adverse party;
- witness;
- employee.

---

## DAT-PTY-002 — P0

The system shall preserve multiple names including:

- Arabic;
- Latin;
- legal;
- trade;
- former;
- alias;
- transliteration.

---

## DAT-PTY-003 — P0

Normalized/search variants shall never overwrite canonical legal names.

---

## DAT-PTY-004 — P1

Party relationships shall support:

- corporate;
- family;
- guardian;
- representative;
- other legally relevant relationships.

---

## DAT-PTY-005 — P0

Sensitive official identifiers shall:

- be encrypted;
- be masked by default;
- be excluded from URLs and logs.

Where indexed lookup is necessary, use a protected keyed lookup mechanism rather than an ordinary unsalted hash.

---

# 16. Identity and Account Requirements

## SEC-IAM-001 — P0

Every user shall have an individual account.

Shared user accounts are prohibited.

---

## SEC-IAM-002 — P0

Internal Lex Gate users shall use MFA.

---

## SEC-IAM-003 — P0

Privileged identities shall use stronger authentication where supported, preferring phishing-resistant methods.

---

## SEC-IAM-004 — P0

UserAccount shall remain distinct from:

- Party;
- employee record;
- lawyer qualification;
- client relationship.

---

## SEC-IAM-005 — P0

Session revocation shall occur after:

- account suspension;
- compromise;
- offboarding;
- security reset.

---

## SEC-IAM-006 — P0

Account recovery shall not provide a weak path around MFA.

---

## SEC-IAM-007 — P1

Sensitive operations may require step-up authentication.

Candidate operations:

- credential reset;
- restricted access grant;
- bulk export;
- record destruction;
- high-risk financial changes.

---

# 17. Professional Authority Requirements

## LEG-PROF-001 — P0

The system shall represent professional legal status separately from software role.

---

## LEG-PROF-002 — P0

Technical permissions shall not grant a user authority to perform an act they are not legally/professionally authorized to perform.

---

## LEG-PROF-003 — P0

Professional qualifications shall support effective dates and verification state.

---

## LEG-PROF-004 — P0

Actions that may require lawyer authority include, as configured and legally validated:

- conflict decision;
- legal deadline confirmation;
- final advice approval;
- certain filings;
- engagement approval;
- legal-client communications.

---

## LEG-PROF-005 — P1

Public lawyer profiles shall display only approved verified professional information.

---

# 18. Authorization Architecture

Lex Gate shall use:

> RBAC + relationship-based authorization + contextual policy.

A role alone is insufficient for substantive Matter access.

---

# 19. Matter Authorization Requirements

## SEC-AUTHZ-001 — P0

All protected operations shall be authorized server-side.

---

## SEC-AUTHZ-002 — P0

Every object retrieval shall verify access to that specific object.

---

## SEC-AUTHZ-003 — P0

Matter access shall consider:

- account state;
- organizational relationship;
- Matter assignment;
- professional status;
- classification;
- Matter restriction;
- temporary access;
- requested action.

---

## SEC-AUTHZ-004 — P0

Related Matters shall not inherit access automatically.

---

## SEC-AUTHZ-005 — P0

Technical administrators shall not receive default substantive Matter access.

---

## SEC-AUTHZ-006 — P0

Temporary access shall:

- require scope;
- record reason;
- have approval;
- expire automatically;
- be audited.

---

# 20. Restricted Matter Requirements

## SEC-RST-001 — P0

The platform shall support restricted Matters.

---

## SEC-RST-002 — P0

A high-security Matter may hide even its existence from unauthorized users.

---

## SEC-RST-003 — P0

Existence restriction shall apply to:

- search;
- autocomplete;
- dashboards;
- counts;
- notifications;
- audit viewer;
- reports.

---

## SEC-RST-004 — P0

The platform shall avoid differentiated external errors that reveal the existence of existence-hidden resources.

---

# 21. Intake Requirements

## FUN-INT-001 — P1

Public enquiry shall create an Enquiry, not automatically a Client or Matter.

---

## FUN-INT-002 — P0

Public intake shall minimize sensitive information.

---

## FUN-INT-003 — P1

Enquiries shall support:

- source;
- contact;
- summary;
- potential Parties;
- urgency;
- assigned reviewer;
- status.

---

## FUN-INT-004 — P0

An urgent enquiry may create an escalation without bypassing conflict or professional controls.

---

## FUN-INT-005 — P1

Client-facing messaging shall clearly state where no representation has yet been created.

---

# 22. Conflict Requirements

## LEG-CFL-001 — P0

Ordinary active Matter opening shall require appropriate conflict clearance.

---

## LEG-CFL-002 — P0

Conflict search shall support:

- Arabic names;
- English names;
- transliteration;
- aliases;
- former names;
- related Parties.

---

## LEG-CFL-003 — P0

Conflict search shall not rely solely on exact matching.

---

## LEG-CFL-004 — P0

Potential match detection shall not automatically determine legal conflict.

---

## LEG-CFL-005 — P0

Final conflict decision requires authorized human legal review.

---

## LEG-CFL-006 — P0

Conflict records and searches shall be highly restricted.

---

## LEG-CFL-007 — P1

Conflict-search evidence shall preserve:

- search terms;
- candidate matches;
- decision;
- decision-maker;
- date.

---

## LEG-CFL-008 — P1

Re-screening shall be supported for events such as:

- new Party;
- expanded Matter scope;
- new lawyer;
- organizational restructuring.

---

## LEG-CFL-009 — P0

The system shall not assume that an ethical wall or waiver resolves every conflict.

---

# 23. Consultation Requirements

## LEG-CNS-001 — P0

A consultation shall not automatically establish engagement.

---

## FUN-CNS-001 — P1

The system shall support:

- scheduling;
- participants;
- notes;
- outcome;
- follow-up.

---

## LEG-CNS-002 — P1

Consultation status shall be clearly distinguishable from active representation.

---

# 24. Engagement Requirements

## LEG-ENG-001 — P0

Engagement activation shall be explicit.

---

## LEG-ENG-002 — P0

An Engagement shall identify:

- represented Party/Parties;
- applicable version;
- scope;
- exclusions;
- responsible firm/lawyer context;
- fee arrangement;
- effective date;
- acceptance method.

---

## LEG-ENG-003 — P0

Accepted engagement versions shall be immutable.

---

## LEG-ENG-004 — P0

A later Engagement version shall not silently replace the version actually accepted by a client.

---

## LEG-ENG-005 — P0

Authorized representative authority shall be verified separately from mere portal access.

---

## LEG-ENG-006 — P0

Payment shall not itself activate an Engagement.

---

## LEG-ENG-007 — P1

Scope amendments shall be versioned.

---

## LEG-ENG-008 — P0

The product shall not expose prohibited in-kind fee options involving disputed rights where the legal baseline prohibits them.

---

# 25. Client Relationship Requirements

## FUN-CLI-001 — P0

ClientRelationship shall represent a relationship between Lex Gate and a Party.

---

## FUN-CLI-002 — P0

The system shall not duplicate Party records solely because the same person transitions from prospect to client.

---

## FUN-CLI-003 — P0

Client representatives shall have:

- authority scope;
- evidence;
- effective dates;
- portal permissions.

---

## FUN-CLI-004 — P0

Organization-client status shall not imply all employees may view every Matter.

---

# 26. Matter Requirements

## LEG-MAT-001 — P0

Every ordinary active Matter shall have an accountable responsible lawyer.

---

## LEG-MAT-002 — P0

Matter activation shall require validated prerequisites.

---

## LEG-MAT-003 — P0

Emergency provisional Matter opening may be supported only as an approved, restricted, time-limited workflow.

---

## LEG-MAT-004 — P1

Matter shall support:

- client;
- Engagement;
- type;
- practice area;
- internal/client titles;
- confidentiality;
- responsible lawyer;
- supervising lawyer;
- opening/closing dates.

---

## LEG-MAT-005 — P1

Matter state transitions shall be historically preserved.

---

## LEG-MAT-006 — P0

A Matter shall not close through inactivity or task completion alone.

---

# 27. Matter States

Canonical baseline:

```text
OPENING
ACTIVE
ON_HOLD
CLOSING
CLOSED
ARCHIVED
```

Additional legally justified states may be introduced through controlled configuration.

---

# 28. Matter Parties

The system shall support structured roles including:

- client;
- adverse party;
- claimant;
- defendant;
- appellant;
- respondent;
- accused;
- witness;
- expert;
- guardian;
- prosecutor/public authority;
- other controlled roles.

Roles shall be configurable and bilingual.

---

# 29. Proceeding Requirements

## LEG-PRC-001 — P0

Proceeding shall be separate from Matter.

---

## LEG-PRC-002 — P1

A Matter may contain multiple Proceedings.

---

## LEG-PRC-003 — P1

Proceeding may record:

- court/authority;
- official number;
- year;
- stage;
- jurisdiction;
- verification state.

---

## LEG-PRC-004 — P0

External status shall distinguish:

- user reported;
- staff observed;
- official/verified;
- unverified.

---

# 30. Legal Rule Versioning

## LEG-RUL-001 — P0

Machine-readable legal rules shall identify:

- jurisdiction;
- legal source;
- source provision;
- effective-from date;
- effective-to date;
- reviewer;
- version.

---

## LEG-RUL-002 — P0

Historical rule applications shall remain reconstructable after the rule changes.

---

## LEG-RUL-003 — P0

A law change shall create review and deployment workflow, not automatically alter production legal state.

---

# 31. Deadline Requirements

## LEG-DLN-001 — P0

Every material legal deadline shall identify its triggering event.

---

## LEG-DLN-002 — P0

Deadline calculations shall identify the applicable rule version.

---

## LEG-DLN-003 — P0

Automatically calculated deadlines shall remain provisional until required authorized lawyer confirmation.

---

## LEG-DLN-004 — P0

Confirmed deadlines shall identify:

- confirming lawyer;
- confirmation time;
- source;
- rule/calculation;
- final confirmed date.

---

## LEG-DLN-005 — P0

Correction shall preserve the prior confirmed deadline.

---

## LEG-DLN-006 — P0

Confirmed deadline history shall not be deleted.

---

## LEG-DLN-007 — P0

Deadline confirmation shall be a distinct domain command.

---

## LEG-DLN-008 — P0

Critical deadline changes shall notify appropriate users.

---

## LEG-DLN-009 — P1

Unconfirmed critical deadlines shall be operationally monitored.

---

## LEG-DLN-010 — P0

Completing a related Task shall not automatically mark a legal deadline satisfied.

---

# 32. Procedural Transition Requirements

## LEG-TRN-001 — P0

Effective-dated procedural rules shall support coexistence of multiple regimes where required.

---

## LEG-TRN-002 — P0

The implementation shall not use a global:

> date passed → all Matters use new law

switch unless legally validated.

---

## LEG-TRN-003 — P0

Potentially affected active Matters shall support transition review.

---

## LEG-TRN-004 — P0

Historical confirmed dates/decisions shall not be retroactively overwritten by a new rule version.

---

# 33. Hearing Requirements

## LEG-HRG-001 — P1

Hearing shall record:

- Proceeding;
- date/time;
- source;
- verification;
- responsible lawyer;
- outcome.

---

## LEG-HRG-002 — P0

Postponement shall create new history and not overwrite the original hearing event.

---

## LEG-HRG-003 — P1

Hearing outcome may trigger:

- client update;
- new task;
- new deadline;
- document workflow.

---

# 34. Filing Requirements

## LEG-FIL-001 — P0

Filing state shall distinguish at minimum:

```text
PREPARED
APPROVED
SUBMITTED
AWAITING_CONFIRMATION
CONFIRMED_FILED
REJECTED
```

where relevant.

---

## LEG-FIL-002 — P0

The exact document version submitted shall remain preserved.

---

## LEG-FIL-003 — P0

Submission attempt shall not automatically become official filing confirmation.

---

## LEG-FIL-004 — P1

Manual government/court checks shall record:

- source;
- checker;
- time;
- observed result;
- supporting evidence where applicable.

---

# 35. Task Requirements

## FUN-TSK-001 — P1

Tasks shall support:

- assignee;
- owner;
- due date;
- status;
- dependencies;
- Matter;
- review requirement.

---

## FUN-TSK-002 — P1

Task completion and task review shall be separate where required.

---

## FUN-TSK-003 — P1

Reusable checklists shall be versioned.

---

# 36. Document Model Requirements

## REC-DOC-001 — P0

The system shall separately model:

- Document;
- DocumentVersion;
- FileObject.

---

## REC-DOC-002 — P0

FileObject bytes shall be stored in private encrypted object storage rather than ordinary database blobs.

---

## REC-DOC-003 — P0

Storage keys shall be opaque and shall not contain confidential client information.

---

## REC-DOC-004 — P1

Documents shall support separate:

- internal title;
- client title.

---

# 37. Document Upload Requirements

## SEC-DOC-001 — P0

Uploads shall enter quarantine.

---

## SEC-DOC-002 — P0

Upload validation shall consider:

- size;
- detected type;
- extension mismatch;
- magic bytes;
- archive behavior;
- malware.

---

## SEC-DOC-003 — P1

Document conversion/OCR shall run in restricted isolated workers.

---

## SEC-DOC-004 — P0

Password-protected or unsupported files shall not be silently discarded.

---

# 38. Version Requirements

## REC-VRS-001 — P0

A version that has become:

- final;
- signed;
- filed;
- issued;

shall not be modified in place.

---

## REC-VRS-002 — P0

A correction shall create a new version or corrective record.

---

## REC-VRS-003 — P1

Superseded versions shall remain accessible to appropriately authorized users and visibly marked superseded.

---

# 39. Original and Derivative Requirements

## REC-ORG-001 — P0

The original received bytes shall remain distinct from generated derivatives.

---

## REC-ORG-002 — P0

The system shall support derivatives including:

- preview;
- OCR;
- translation;
- redaction;
- thumbnail;
- conversion;
- transcription.

---

## REC-ORG-003 — P0

Derivative lineage shall identify the source version.

---

# 40. OCR Requirements

## REC-OCR-001 — P1

OCR output shall be represented as derived data.

---

## REC-OCR-002 — P0

OCR shall not overwrite verified canonical legal facts automatically.

---

## REC-OCR-003 — P1

Arabic and bilingual OCR shall receive dedicated quality testing.

---

# 41. Translation Requirements

## REC-TRN-001 — P1

Translation shall identify:

- source;
- source language;
- target language;
- method;
- reviewer.

---

## REC-TRN-002 — P0

Machine translation shall not be labeled official or certified automatically.

---

# 42. Redaction Requirements

## REC-RDX-001 — P0

Redaction shall generate a separate derivative.

---

## REC-RDX-002 — P0

Approved redacted output shall remove underlying recoverable content, not merely obscure it visually.

---

# 43. Document Finalization

## REC-FIN-001 — P0

Finalization shall record the exact version finalized.

---

## REC-FIN-002 — P1

Finalization workflow shall consider removal of inappropriate:

- comments;
- tracked changes;
- hidden metadata.

---

## REC-FIN-003 — P0

Document approval and signature shall remain separate concepts.

---

# 44. Client Publication Requirements

## REC-SHR-001 — P0

Client publication shall be an explicit operation.

---

## REC-SHR-002 — P0

Publication shall reference an exact immutable DocumentVersion.

---

## REC-SHR-003 — P0

Publication shall verify the recipient’s current authority.

---

## REC-SHR-004 — P0

Client-visible data shall be produced through a dedicated client projection, not by sending internal objects and hiding fields in the browser.

---

## REC-SHR-005 — P1

Publication shall record:

- publisher;
- approver where required;
- recipient;
- time;
- version;
- expiry/revocation.

---

## REC-SHR-006 — P0

Anonymous public links to confidential Matter documents are prohibited.

---

# 45. Evidence Requirements

## LEG-EVD-001 — P0

Digital evidence shall preserve original bytes where available.

---

## LEG-EVD-002 — P1

Digital evidence shall record a cryptographic hash.

---

## LEG-EVD-003 — P0

Evidence custody history shall be append-only through ordinary workflow.

---

## LEG-EVD-004 — P1

Evidence shall identify:

- source;
- receiver;
- reception time;
- current custodian;
- current location/state.

---

## LEG-EVD-005 — P0

A system integrity indicator shall not be represented as a legal determination of authenticity or admissibility.

---

# 46. Physical Record Requirements

## REC-PHY-001 — P1

Where Lex Gate retains physical originals, the system shall support:

- physical identifier;
- location;
- container;
- checkout;
- return;
- custodian.

---

## REC-PHY-002 — P0

A physical original shall not be marked returned without an attributable return record.

---

## REC-PHY-003 — P0

Scanning a physical record shall not automatically authorize destruction of the original.

---

# 47. Communications Requirements

## LEG-COM-001 — P0

Material client communications shall be linked to an authorized Matter/client relationship.

---

## LEG-COM-002 — P0

Final legal advice shall require authorized lawyer approval.

---

## LEG-COM-003 — P1

Communication shall distinguish:

- drafted;
- approved;
- sent;
- delivered;
- delivery failed;
- acknowledged.

---

## LEG-COM-004 — P0

Delivery and acknowledgment shall not be conflated.

---

## LEG-COM-005 — P0

Material delivery failure shall create appropriate escalation.

---

## LEG-COM-006 — P0

Client-facing communications shall not state unapproved guarantees or certainty.

---

# 48. Notification Requirements

## FUN-NTF-001 — P1

Notification rules shall be event driven.

---

## FUN-NTF-002 — P1

External notification previews shall minimize sensitive content.

---

## FUN-NTF-003 — P0

Failure of a communication provider shall not silently mark a message delivered.

---

# 49. Client Portal Requirements

## FUN-PRT-001 — P0

Client portal access shall derive through:

```text
UserAccount
→ Party
→ ClientRelationship / ClientRepresentative
→ PortalPermission
→ Client Projection
```

Matching an email address alone is insufficient.

---

## FUN-PRT-002 — P0

Clients shall access only explicitly authorized Matters.

---

## FUN-PRT-003 — P0

Clients shall access only published/approved Matter information.

---

## FUN-PRT-004 — P1

Portal upload status shall distinguish:

- upload successful;
- under review;
- accepted;
- incomplete/rejected.

---

## FUN-PRT-005 — P1

Client representative permissions shall expire/revoke independently from the ClientRelationship itself.

---

# 50. Billing Requirements

## BIL-FEE-001 — P0

Fee arrangements shall be versioned.

---

## BIL-FEE-002 — P1

The system shall support approved fee models determined during firm discovery.

---

## BIL-INV-001 — P0

The platform shall distinguish:

- quote;
- pro forma;
- internal billing record;
- invoice;
- tax/e-invoice state;
- receipt;
- payment confirmation.

---

## BIL-INV-002 — P0

An issued invoice shall not be silently rewritten.

---

## BIL-INV-003 — P0

Corrections shall follow approved replacement/credit/cancellation workflows.

---

## BIL-PAY-001 — P0

Payments shall be separate from invoices.

---

## BIL-PAY-002 — P1

Payment allocations shall support:

- partial payments;
- multiple allocations;
- reconciliation.

---

# 51. Payment Integration Requirements

## INT-PAY-001 — P0

Inbound payment provider events shall be authenticated.

---

## INT-PAY-002 — P0

Replay and duplicate provider events shall not create duplicate Payments.

---

## INT-PAY-003 — P0

Provider amount, currency, account, and internal reference shall be validated before reconciliation.

---

## INT-PAY-004 — P0

Payment events shall not directly activate Engagement or Matter.

---

# 52. ETA/Tax Requirements

## INT-ETA-001 — P0

Internal Invoice state and external ETA submission state shall be separate.

---

## INT-ETA-002 — P0

A PDF generated by Lex Gate shall not be represented as an accepted ETA document solely because it exists.

---

## INT-ETA-003 — P0

ETA submission evidence shall preserve provider/reference/status.

---

## INT-ETA-004 — P1

Integration shall be idempotent where duplicate submission could have financial effect.

---

## INT-ETA-005 — P0

Production tax integration shall not launch before accountant/tax review confirms required operational behavior.

---

# 53. Electronic Signature Requirements

## INT-SIG-001 — P0

The system shall support multiple acceptance/signature classes rather than a single `signed=true`.

---

## INT-SIG-002 — P0

Electronic signature requests shall reference the exact DocumentVersion.

---

## INT-SIG-003 — P0

Signer identity and representative authority shall be validated as required.

---

## INT-SIG-004 — P0

Internal approval shall not be represented as regulated electronic signature.

---

## INT-SIG-005 — P0

Provider callback alone shall not activate an Engagement unless all other requirements are satisfied.

---

# 54. Government/Court Integration Requirements

## INT-GOV-001 — P0

Existence of an online government service shall not be interpreted as permission to automate it.

---

## INT-GOV-002 — P0

Government integration modes shall be classified:

```text
OFFICIAL_API
AUTHORIZED_PROVIDER
HUMAN_ASSISTED_PORTAL
FILE_IMPORT_EXPORT
UNSUPPORTED
```

---

## INT-GOV-003 — P0

Unsupported:

- scraping;
- CAPTCHA bypass;
- credential automation;
- undocumented private API use;

shall not be introduced into production.

---

## INT-GOV-004 — P1

Manual government verification shall preserve attribution and source evidence.

---

# 55. Search Requirements

## FUN-SRC-001 — P0

Search shall be authorization-aware.

---

## FUN-SRC-002 — P0

Search result counts, snippets, and autocomplete shall not leak restricted Matter existence.

---

## FUN-SRC-003 — P1

Conflict search shall have stricter permissions than ordinary search.

---

## FUN-SRC-004 — P1

Arabic search shall support controlled normalization and aliases without modifying canonical data.

---

## FUN-SRC-005 — P0

Search is derived/noncanonical and shall be rebuildable from canonical sources.

---

# 56. Audit Requirements

## SEC-AUD-001 — P0

Audit shall be first-class and logically append-only.

---

## SEC-AUD-002 — P0

Mandatory events shall include, as applicable:

- authentication;
- role changes;
- Matter access;
- access grants;
- conflict decisions;
- engagement activation;
- deadline confirmation;
- client publication;
- financial issuance;
- signature;
- record hold/destruction;
- privacy incident;
- AI use;
- privileged access.

---

## SEC-AUD-003 — P0

Ordinary users shall not delete audit events.

---

## SEC-AUD-004 — P1

Audit shall record enough context to explain an action without duplicating unnecessary confidential content.

---

## SEC-AUD-005 — P0

Restricted Matter metadata shall remain access controlled in audit interfaces.

---

# 57. Privacy Processing Register

## PRV-GOV-001 — P0

Every material personal-data processing activity shall have:

- purpose;
- owner;
- data categories;
- subject categories;
- systems;
- processors;
- countries;
- retention;
- approved processing authority.

---

## PRV-GOV-002 — P0

A new feature processing materially new data shall trigger privacy review.

---

# 58. Regulatory Authorization

## PRV-LIC-001 — P0

Production processing shall not begin until applicable Egyptian privacy licence/permit obligations are formally resolved.

---

## PRV-LIC-002 — P0

Required DPO arrangements shall be resolved before applicable production processing.

---

## PRV-LIC-003 — P0

Sensitive-data, cross-border, and direct-marketing authorization requirements shall be separately assessed.

---

# 59. Privacy Notice Requirements

## PRV-NOT-001 — P1

Privacy notices shall be versioned.

---

## PRV-NOT-002 — P1

Arabic and English notices shall be treated as coordinated legal versions.

---

## PRV-NOT-003 — P1

Where evidence of notice is relevant, the system shall record:

- version;
- language;
- delivery method;
- time.

---

# 60. Consent Requirements

## PRV-CNS-001 — P0

Consent shall not be represented as a context-free boolean.

---

## PRV-CNS-002 — P0

Consent evidence shall identify:

- Party;
- purpose;
- scope;
- notice/consent version;
- language;
- method;
- time;
- withdrawal where applicable.

---

## PRV-CNS-003 — P0

Marketing, testimonials, public case studies, AI, and other optional purposes shall not automatically inherit legal-service consent.

---

## PRV-CNS-004 — P0

Consent withdrawal shall not automatically destroy records subject to independent legal/professional retention.

---

# 61. Data-Subject Request Requirements

## PRV-DSR-001 — P0

The system shall support controlled requests for applicable:

- access;
- correction;
- withdrawal;
- restriction;
- objection;
- erasure.

---

## PRV-DSR-002 — P0

Identity/representative authority shall be verified before high-risk disclosure or deletion action.

---

## PRV-DSR-003 — P0

DSR disclosure shall consider:

- professional secrecy;
- privilege/protection;
- other clients;
- third parties;
- court/investigation restrictions.

---

## PRV-DSR-004 — P0

No one-click unrestricted “export all user data” shall bypass legal review.

---

## PRV-DSR-005 — P0

Erasure shall be a reviewed workflow, not generic deletion.

---

# 62. Sensitive Data Requirements

## PRV-SEN-001 — P0

Sensitive personal data shall support stronger:

- classification;
- authorization;
- auditing;
- export restrictions;
- AI restrictions.

---

## PRV-SEN-002 — P0

Sensitive information shall not be requested in ordinary public intake unless necessary and approved.

---

# 63. Children/Guardian Requirements

## PRV-CHD-001 — P0

The system shall explicitly model guardian relationships where needed.

---

## PRV-CHD-002 — P0

Age-related consent/authority rules shall be configurable based on legally approved workflows.

---

## PRV-CHD-003 — P0

Guardian relationship shall not automatically grant unrestricted portal access.

---

# 64. Cross-Border Requirements

## PRV-XBR-001 — P0

International processing shall be explicitly registered.

---

## PRV-XBR-002 — P0

Transfer analysis shall include:

- primary region;
- backups;
- replication;
- support access;
- AI;
- monitoring/logs;
- subprocessors.

---

## PRV-XBR-003 — P0

Unapproved destination countries shall be blocked from intentional production processing.

---

## PRV-XBR-004 — P0

Provider/region changes shall trigger privacy review.

---

# 65. Direct Marketing Requirements

## PRV-MKT-001 — P0

Electronic direct marketing shall remain disabled until its:

- privacy authorization;
- consent;
- professional advertising;

requirements are approved.

---

## PRV-MKT-002 — P0

Marketing consent shall be separate from Engagement.

---

## PRV-MKT-003 — P0

Withdrawal shall create a durable suppression state.

---

## PRV-MKT-004 — P0

Re-importing a contact shall not silently override suppression.

---

# 66. Public Content Requirements

## LEG-MKT-001 — P0

Public legal-service claims shall receive appropriate lawyer review.

---

## LEG-MKT-002 — P0

Public content shall prohibit unsupported:

- guaranteed results;
- implication of influence;
- false superiority/rank claims.

---

## LEG-MKT-003 — P0

Client/case information shall not be publicly disclosed without approved confidentiality/legal workflow.

---

## LEG-MKT-004 — P0

Tracking/advertising pixels shall not operate on sensitive legal application surfaces.

---

# 67. Retention Requirements

## REC-RET-001 — P0

Every significant record class shall have an approved retention rule or an explicitly unresolved status preventing uncontrolled destruction.

---

## REC-RET-002 — P0

Retention rules shall be versioned/effective-dated.

---

## REC-RET-003 — P0

“No expiry” shall not be the generic default.

---

## REC-RET-004 — P0

Record disposition shall consider:

- Matter;
- legal obligations;
- privacy;
- tax;
- dispute;
- legal hold;
- professional responsibilities.

---

# 68. Legal Hold Requirements

## REC-HLD-001 — P0

LegalHold shall block automatic and ordinary destruction.

---

## REC-HLD-002 — P0

Hold application/release shall be attributable and audited.

---

## REC-HLD-003 — P0

Hold scope may include:

- Matter;
- Party;
- Document;
- evidence;
- communication class.

---

# 69. Destruction Requirements

## REC-DST-001 — P0

Destruction shall require a controlled DestructionDecision.

---

## REC-DST-002 — P0

Destruction shall evaluate:

- canonical records;
- FileObjects;
- derivatives;
- search;
- exports;
- caches;
- processor copies;
- backup lifecycle.

---

## REC-DST-003 — P0

The system may preserve minimal evidence that destruction occurred without preserving the destroyed substantive content unnecessarily.

---

# 70. Security Architecture

The production architecture shall use layered controls.

Trust zones:

```text
Public Internet
Public Edge
Authenticated Client Zone
Internal User Zone
Application Zone
Sensitive Data Zone
Administrative Security Zone
External Integration Zone
```

Network placement alone shall never confer substantive authorization.

---

# 71. Application Security Requirements

## SEC-APP-001 — P0

All input is untrusted.

---

## SEC-APP-002 — P0

Database access shall use parameterized/safe query interfaces.

---

## SEC-APP-003 — P0

Untrusted content shall receive output encoding/sanitization appropriate to context.

---

## SEC-APP-004 — P0

Cookie/session architecture shall use appropriate CSRF protection.

---

## SEC-APP-005 — P0

Features fetching arbitrary URLs shall defend against SSRF.

---

## SEC-APP-006 — P0

Mass assignment shall be prevented through explicit request DTOs/commands.

---

## SEC-APP-007 — P1

Errors shall not expose:

- stack traces;
- database queries;
- internal paths;
- secrets.

---

# 72. Secrets and Cryptography

## SEC-CRY-001 — P0

Secrets shall reside in approved secret-management infrastructure.

---

## SEC-CRY-002 — P0

Secrets shall not be committed to source control.

---

## SEC-CRY-003 — P0

Production secrets shall be environment-specific.

---

## SEC-CRY-004 — P0

Data in transit shall use modern encrypted transport.

---

## SEC-CRY-005 — P0

Sensitive production data and backups shall use encryption at rest.

---

## SEC-CRY-006 — P1

Key management shall use managed/dedicated KMS architecture.

---

# 73. Endpoint and Device Security

Operational policy shall support:

- full-disk encryption;
- automatic lock;
- supported OS versions;
- patching;
- endpoint protection;
- managed device inventory where applicable.

Highly sensitive data should not be permanently synchronized to unmanaged endpoints by default.

---

# 74. API Architecture

The platform shall distinguish:

- Presentation API;
- Application API;
- Domain commands;
- Integration adapters;
- Domain events.

---

# 75. API Requirements

## API-AUTHZ-001 — P0

Protected API operations shall perform object-level authorization.

---

## API-CMD-001 — P0

Legally significant state transitions shall use explicit commands rather than generic patching.

Examples:

```text
CompleteConflictReview
ActivateEngagement
OpenMatter
ConfirmLegalDeadline
PublishDocumentToClient
IssueInvoice
CloseMatter
ApproveRecordDestruction
```

---

## API-IDM-001 — P0

Operations at material risk of duplicate effect shall be idempotent.

---

## API-CON-001 — P1

Material concurrent editing shall use optimistic concurrency or equivalent protection.

---

## API-ERR-001 — P0

Error responses shall not reveal restricted resource existence.

---

# 76. Event Requirements

## API-EVT-001 — P1

Material domain changes shall emit versioned domain events.

---

## API-EVT-002 — P1

Events shall be persisted using transactional outbox or equivalent atomic pattern.

---

## API-EVT-003 — P1

Consumers shall tolerate duplicate event delivery.

---

## API-EVT-004 — P1

Sensitive event payloads shall use references rather than duplicating complete confidential content.

---

# 77. Integration Architecture

All external providers shall be behind canonical interfaces.

Examples:

- `EmailProvider`
- `SmsProvider`
- `PaymentProvider`
- `TaxInvoiceProvider`
- `ElectronicSignatureProvider`
- `CalendarProvider`
- `AIProvider`

The core domain shall not depend directly on provider SDK semantics.

---

# 78. Integration Reliability

## INT-REL-001 — P0

External integration failure shall not corrupt canonical legal state.

---

## INT-REL-002 — P1

Every external call shall define timeout behavior.

---

## INT-REL-003 — P1

Retry policies shall distinguish transient and permanent errors.

---

## INT-REL-004 — P0

External callbacks shall be authenticated and replay-protected where supported.

---

## INT-REL-005 — P1

Critical failed integrations shall enter visible reconciliation workflow rather than disappear.

---

# 79. AI Governance

AI is optional and shall remain disabled until R6 controls pass.

---

# 80. Permitted Initial AI Categories

Potential approved uses:

- internal summarization;
- document classification;
- entity extraction;
- date extraction;
- transcription;
- translation;
- suggested Tasks;
- duplicate analysis;
- internal drafting;
- controlled knowledge retrieval.

Each use case requires approval.

---

# 81. Prohibited AI Behavior

The system shall not permit AI to autonomously:

- give final legal advice;
- clear conflicts;
- confirm final legal deadlines;
- accept clients;
- determine representation;
- file with authorities;
- make final professional opinions;
- publish legal work externally;
- determine employee discipline;
- destroy legal records.

---

# 82. AI Security Requirements

## AI-GOV-001 — P0

All AI processing shall pass through Lex Gate’s internal AI Gateway.

---

## AI-GOV-002 — P0

AI authorization shall use ordinary Matter authorization.

---

## AI-GOV-003 — P0

A Matter may prohibit AI use entirely.

---

## AI-GOV-004 — P0

Provider/region/data-category eligibility shall be checked before sending content.

---

## AI-GOV-005 — P0

Client data shall not train provider general-purpose models.

---

## AI-GOV-006 — P0

Uploaded documents and retrieved web content shall be treated as untrusted instructions for prompt-injection purposes.

---

## AI-GOV-007 — P0

AI tool calls shall be subject to normal domain authorization and required human approval.

---

## AI-GOV-008 — P0

Cross-Matter AI retrieval shall be prevented.

---

## AI-GOV-009 — P1

AI processing shall retain appropriate provenance:

- provider;
- model/version;
- source data;
- user;
- time;
- review status.

---

## AI-GOV-010 — P0

The platform shall continue core operations when AI is unavailable.

---

# 83. AI Output States

Canonical baseline:

```text
MACHINE_GENERATED
UNREVIEWED
REVIEWED
APPROVED
REJECTED
```

Client-facing legal output requires appropriate approved state.

---

# 84. AI Citation Requirements

Where AI proposes legal authority:

- source existence must be verified;
- cited proposition must be checked;
- effective legal version must be considered;
- fabricated citations must be rejected.

---

# 85. Architecture Style

Initial architecture shall be:

> **Modular monolith with explicit domain boundaries, asynchronous workers, provider adapters, relational transactional storage, and independently scalable supporting infrastructure.**

Microservices shall not be introduced merely for fashion or theoretical future scale.

---

# 86. Dependency Direction

Preferred logical dependency direction:

```text
UI
 ↓
Application
 ↓
Domain

Infrastructure adapters → inward interfaces
```

Core domain shall not depend on web framework or provider SDK details.

---

# 87. Data Storage

Initial persistence architecture shall use:

- ACID relational database for canonical structured data;
- encrypted private object storage for document bytes;
- queue/background processing;
- cache only where safe;
- derived search index;
- protected audit storage.

Exact products remain a technology-selection decision.

---

# 88. Database Requirements

## DAT-DB-001 — P0

Core legal relationships shall use referential integrity where practical.

---

## DAT-DB-002 — P0

Material financial/legal history shall not rely on silent destructive overwrites.

---

## DAT-DB-003 — P1

JSON fields shall be limited to genuinely variable metadata rather than replacing relational modeling.

---

## DAT-DB-004 — P0

Money shall use exact decimal representation.

---

## DAT-DB-005 — P0

Legal date-only values shall not be stored as arbitrary UTC-midnight timestamps.

---

# 89. Provenance

Material data derived from:

- user entry;
- document;
- OCR;
- external service;
- AI;
- import;

shall preserve provenance where meaningful.

---

# 90. Assertion Model

The system shall support distinguishing:

- allegation;
- reported statement;
- disputed statement;
- corroborated information;
- official confirmation;
- lawyer conclusion.

Particularly important in legal disputes.

---

# 91. Bilingual and RTL Requirements

## UX-I18N-001 — P0

Arabic and English shall be first-class product languages.

---

## UX-I18N-002 — P0

Arabic shall not be treated merely as translated English screens.

---

## UX-RTL-001 — P0

The UI shall correctly support RTL layouts.

---

## UX-BIDI-001 — P0

Mixed-direction fields shall correctly handle combinations such as:

- Arabic + English names;
- Arabic + email;
- Arabic + case number;
- Arabic + URL;
- Arabic + currency.

---

## UX-I18N-003 — P1

Translations shall be externalized into controlled resources.

---

## UX-I18N-004 — P0

Legally significant terminology shall use approved bilingual glossary.

---

# 92. Accessibility Requirements

## UX-A11Y-001 — P1

The target shall be WCAG 2.2 AA for user-facing functionality.

---

## UX-A11Y-002 — P0

Critical workflows shall be keyboard operable.

---

## UX-A11Y-003 — P1

Errors shall not rely on color alone.

---

## UX-A11Y-004 — P1

Focus order and modal behavior shall be accessible.

---

## UX-A11Y-005 — P1

Security timeout flows shall provide accessible warning/continuation where safe.

---

# 93. Design and Visual Identity

Lex Gate’s digital identity shall be:

- restrained;
- authoritative;
- contemporary;
- calm;
- editorial rather than flashy;
- appropriate for legal services.

The design system shall avoid:

- aggressive sales aesthetics;
- gratuitous animation;
- overly decorative legal clichés;
- dark patterns.

---

# 94. Motion

Motion shall support:

- orientation;
- feedback;
- transition clarity.

It shall not:

- delay legal-critical actions;
- obscure state;
- become necessary to understand an interface.

Reduced-motion preferences shall be supported.

---

# 95. High-Risk UX States

The system shall clearly distinguish:

- prospect/client;
- engagement pending/active;
- unconfirmed/confirmed deadline;
- internal/official external state;
- draft/final;
- internal/client-visible;
- submitted/accepted;
- sent/delivered/acknowledged;
- machine-generated/lawyer-approved.

---

# 96. Observability Requirements

The platform shall monitor both technical and legal-operational health.

---

# 97. Technical Metrics

Include:

- request availability;
- latency;
- error rate;
- database;
- queue;
- storage;
- provider status.

---

# 98. Legal-Operational Metrics

Include appropriate alerts for:

- critical deadline without confirmation;
- active Matter without responsible lawyer;
- legal-critical delivery failure;
- document processing stuck;
- external reconciliation backlog.

---

# 99. Logging Requirements

## OPS-LOG-001 — P0

Logs shall not intentionally include:

- passwords;
- tokens;
- private keys;
- full national IDs;
- complete legal-document contents.

---

## OPS-LOG-002 — P1

Structured logs shall support request/correlation IDs.

---

## OPS-LOG-003 — P0

Audit and ordinary operational logs shall remain conceptually separate.

---

# 100. Environment Requirements

Environments:

```text
LOCAL
DEVELOPMENT
TEST
STAGING
PRODUCTION
```

Production shall be appropriately isolated.

Production secrets/data shall not be routinely copied into lower environments.

---

# 101. CI/CD Requirements

## OPS-CICD-001 — P0

Production code shall be deployed from a tested build artifact.

---

## OPS-CICD-002 — P0

Protected branches shall require relevant checks/review.

---

## OPS-CICD-003 — P0

Source/dependency/security scans shall run during CI.

---

## OPS-CICD-004 — P0

Secrets scanning shall be enabled.

---

## OPS-CICD-005 — P0

AI-generated code receives the same reviews and tests as human-generated code.

---

# 102. Infrastructure as Code

## OPS-IAC-001 — P0

Material production infrastructure shall be represented as code where practical.

---

## OPS-IAC-002 — P1

Manual emergency changes shall be reconciled back into infrastructure code.

---

## OPS-IAC-003 — P0

Policy scanning shall detect high-risk infrastructure such as:

- public Matter storage;
- public database;
- excessive IAM.

---

# 103. Backup Requirements

## OPS-BKP-001 — P0

Tier-0 data shall have automated backup.

---

## OPS-BKP-002 — P0

Backups shall be encrypted.

---

## OPS-BKP-003 — P0

At least one recovery path shall be isolated from ordinary application deletion privileges.

---

## OPS-BKP-004 — P0

Backup failure shall be monitored.

---

## OPS-BKP-005 — P0

Restore testing shall occur before first production release and periodically thereafter.

---

# 104. Recovery Requirements

## OPS-DR-001 — P0

Documented disaster recovery shall cover:

- database loss;
- document-storage loss;
- credential compromise;
- ransomware;
- destructive deployment;
- regional/provider failure as appropriate.

---

## OPS-DR-002 — P0

Recovery shall preserve:

- authorization;
- legal holds;
- audit relationships;
- document versions;
- deadline history.

---

## OPS-DR-003 — P0

External integrations shall be reconciled after recovery.

---

# 105. RPO/RTO

Final RPO/RTO require D04 operational validation.

They shall be defined separately for:

- Tier 0 legal-critical data;
- client operations;
- supporting services.

No arbitrary “five nines” target shall be selected without business/legal justification.

---

# 106. Resilience Requirements

The system shall degrade gracefully.

Examples:

- AI down → manual legal work remains;
- SMS down → portal remains;
- search down → known Matter access remains;
- ETA down → internal finance state remains;
- payment provider down → Matter management remains.

---

# 107. Production Access

## OPS-ACC-001 — P0

Production privileged access shall be:

- named;
- MFA-protected;
- least privilege;
- auditable.

---

## OPS-ACC-002 — P0

Developers shall not automatically receive permanent production database access.

---

## OPS-ACC-003 — P0

Break-glass access shall be temporary and reviewed.

---

# 108. Vulnerability Management

The project shall operate:

- dependency scanning;
- static security analysis;
- dynamic testing where appropriate;
- infrastructure scanning;
- secret scanning;
- vulnerability triage.

Severity shall incorporate legal/confidentiality impact and not depend solely on generic CVSS.

---

# 109. Penetration Testing

Before sensitive client portal production use, penetration testing shall cover at minimum:

- authentication;
- recovery;
- authorization;
- cross-client isolation;
- upload;
- download;
- export;
- APIs;
- privileged functions.

Critical unresolved findings block launch.

---

# 110. Testing Model

Testing shall include:

- static analysis;
- unit;
- domain;
- API;
- authorization;
- integration;
- E2E;
- security;
- privacy;
- Arabic/RTL;
- accessibility;
- migration;
- performance;
- resilience;
- backup/restore;
- lawyer validation.

---

# 111. Q0 Test Principle

The following failures are release blocking:

- cross-client leakage;
- restricted Matter leakage;
- automatic conflict clearance;
- unauthorized professional action;
- deadline corruption;
- wrong client publication;
- legal-hold destruction;
- invoice corruption;
- invalid payment callback;
- unsafe AI cross-Matter retrieval;
- failed backup recovery.

---

# 112. Negative Testing

For every P0 permitted workflow, include prohibited-path tests.

Example:

If assigned lawyer can confirm deadline, test that:

- trainee cannot if unauthorized;
- finance cannot;
- client cannot;
- administrator cannot through technical role alone.

---

# 113. Synthetic Test Data

Production client data shall not be the default test source.

Synthetic datasets shall include representative:

- Arabic names;
- English names;
- organizations;
- adverse Parties;
- documents;
- minors;
- complex Matter structures.

---

# 114. Arabic Test Requirements

Dedicated tests shall cover:

- Arabic naming variants;
- mixed scripts;
- RTL;
- BiDi;
- OCR;
- Arabic legal labels;
- PDF rendering;
- emails.

---

# 115. Legal Workflow Validation

P0 legally substantive workflows require practising-lawyer validation.

Includes:

- professional authority;
- conflicts;
- Engagement;
- Matter opening;
- deadline;
- hearing;
- filing;
- material client communication;
- closure;
- emergency workflow;
- procedural-law transitions;
- AI substantive assistance.

---

# 116. Automation Maturity

Legal workflows may be classified:

```text
LA-0 Manual record
LA-1 Assisted
LA-2 Automated proposal requiring human approval
LA-3 Controlled low-risk automation
LA-4 Autonomous substantive legal decision
```

LA-4 substantive legal judgment is prohibited under the current baseline.

---

# 117. Manual Fallback

Legally material automation shall define safe manual fallback.

Particularly:

- deadlines;
- government status;
- payments;
- ETA;
- signature;
- AI.

---

# 118. Canonical P0 Release Gates

No relevant production feature may launch unless its applicable P0 requirements satisfy:

```text
IMPLEMENTED
+ TESTED
+ SECURITY/PRIVACY REVIEWED
+ LEGALLY VALIDATED where required
+ OPERATIONALLY READY
```

---

# 119. Public Release Gate

R1 requires:

- public security review;
- privacy notice;
- minimal intake;
- lawyer-approved public content;
- bilingual/RTL validation;
- accessibility;
- no uncontrolled sensitive upload.

---

# 120. Core Operations Gate

R2 requires:

- MFA;
- Matter authorization;
- restricted Matter tests;
- conflict workflow;
- Engagement;
- deadline safeguards;
- document repository;
- audit;
- backup restoration.

---

# 121. Client Portal Gate

R3 requires:

- client authentication;
- client projection;
- cross-client isolation test;
- representative expiry;
- secure upload;
- publication controls;
- penetration testing.

---

# 122. Finance Gate

R4 requires:

- finance role controls;
- invoice immutability;
- payment idempotency/security;
- ETA/accounting approval;
- reconciliation.

---

# 123. Records Gate

R5 requires:

- approved retention;
- legal hold;
- destruction;
- archive;
- evidence;
- physical record workflows where used.

---

# 124. AI Gate

R6 requires:

- AI Gateway;
- provider approval;
- privacy/cross-border review;
- no-training control;
- Matter policy;
- prompt-injection defenses;
- authorization;
- benchmark evaluation;
- human review;
- non-AI fallback.

---

# 125. Prohibited Implementation Shortcuts

The implementation shall not use:

1. UI-only authorization.
2. Shared administrator accounts.
3. Global staff Matter access.
4. Public object storage for Matter documents.
5. Generic `status` patching for legally significant transitions.
6. Raw database CRUD as primary business workflow.
7. Client-side filtering of internal fields.
8. Payment callback → Engagement activation.
9. Calendar deletion → legal deadline deletion.
10. AI output → final legal advice.
11. Search index authorization as sole access control.
12. Generic `deleted_at` as complete records-retention solution.
13. One generic `signed=true` representation.
14. One generic `date` field for all legal date meanings.
15. Filename-based security or classification.
16. Production client data routinely copied into dev.
17. Unsupported government scraping.
18. Secrets in code/repository.
19. Destructive legal-history overwrite.
20. Automatic “new law applies everywhere” switches.

---

# 126. Initial Repository Architecture

Conceptual target:

```text
/apps
  /web
  /workers

/packages
  /domain
    /identity
    /parties
    /intake
    /conflicts
    /clients
    /engagements
    /matters
    /proceedings
    /deadlines
    /tasks
    /documents
    /evidence
    /communications
    /finance
    /privacy
    /records
    /security
  /application
  /database
  /auth
  /integrations
  /observability
  /localization
  /ui
  /testing

/infrastructure

/docs
  /requirements
  /architecture
  /legal
  /operations
  /api
```

Final names may change, but domain separation shall remain.

---

# 127. Required Structured Specification Files

Before implementation scaling, create machine-readable:

```text
/docs/requirements/requirements.yaml
/docs/requirements/traceability.yaml
/docs/requirements/capabilities.yaml
/docs/requirements/releases.yaml
/docs/requirements/validations.yaml
```

---

# 128. ADR Baseline

Initial approved architectural directions:

- ADR-001 — Modular monolith
- ADR-002 — Relational ACID canonical database
- ADR-003 — Object storage for documents
- ADR-004 — Dedicated client projections
- ADR-005 — Centralized server-side authorization
- ADR-006 — Transactional outbox
- ADR-007 — External integration adapters
- ADR-008 — Internal AI Gateway
- ADR-009 — Admin privilege does not imply Matter access
- ADR-010 — Immutable/versioned legal and financial records

---

# 129. Open Business Decisions

Still requiring firm discovery:

- exact practice-area set;
- Matter taxonomy;
- document taxonomy;
- office/team structure;
- client volumes;
- Matter volumes;
- billing arrangements;
- current tools;
- migration sources;
- physical records;
- communications channels;
- portal rollout priorities.

These shall not be guessed permanently.

---

# 130. Open Legal Decisions

Require specialist Egyptian review:

- final professional-authority matrix;
- current Bar/public marketing interpretation;
- privacy licence/permit scope;
- DPO registration;
- sensitive-data authorizations;
- cross-border cloud rules;
- legal-service processing grounds;
- adverse-party privacy treatment;
- retention schedules;
- minor/guardian workflows;
- signature class by document;
- exact procedural deadline rules;
- transition rules;
- tax/ETA requirements;
- AML applicability where relevant;
- call-recording rules.

---

# 131. Open Technology Decisions

Remain intentionally unresolved:

- cloud provider;
- region;
- runtime/framework;
- relational database product;
- identity provider;
- object-storage provider;
- search engine;
- queue;
- cache;
- monitoring;
- CI/CD;
- WAF;
- email;
- SMS;
- payment;
- ETA integration path;
- electronic-signature provider;
- AI providers;
- feature-flag platform.

Technology selection shall follow requirements, not precede them.

---

# 132. Technology Selection Criteria

Every significant technology shall be evaluated against:

1. security;
2. privacy/data location;
3. reliability;
4. engineering maturity;
5. operational burden;
6. performance;
7. cost;
8. vendor lock-in;
9. exportability;
10. integration compatibility;
11. team maintainability.

---

# 133. Build vs Buy Principle

Build Lex Gate-specific legal logic.

Prefer mature external services where appropriate for commodity capabilities such as:

- email;
- SMS;
- payments;
- e-signature;
- cloud identity;
- monitoring.

Vendor use requires security/privacy/legal review.

---

# 134. Migration Requirements

Legacy migration shall:

- inventory source systems;
- stage data;
- scan files;
- preserve hashes;
- map entities;
- identify duplicates;
- preserve unknowns;
- reconcile counts/files;
- maintain LegacyIdentifierMap.

Missing information shall not be invented.

---

# 135. Duplicate Entity Management

Party duplicate resolution shall be a controlled workflow.

The system shall support:

- candidate detection;
- review;
- merge;
- split/correction;
- provenance retention.

Names are not unique IDs.

---

# 136. Import Requirements

Bulk imports shall follow:

```text
upload
→ validate
→ map
→ preview
→ approve
→ commit
→ reconcile
```

No arbitrary spreadsheet should directly mutate production tables.

---

# 137. Export Requirements

Bulk export shall:

- require authorization;
- define scope;
- be audited;
- generate temporary protected artifact;
- expire.

High-risk exports may require additional approval.

---

# 138. Management Reporting

Reporting shall use authorization-aware projections.

Managers may receive:

- aggregate workload;
- risks;
- deadlines;
- financial summaries;

without automatically receiving substantive restricted Matter content.

---

# 139. Finance Projection

Finance users shall access financial information required for their role without unrestricted legal strategy/documents.

---

# 140. Knowledge Requirements

Client Matter documents shall not automatically become global precedents.

Reusable KnowledgeArtifact creation shall require:

- selection;
- confidentiality review;
- sanitization;
- approval.

---

# 141. Analytics Requirements

Analytics shall minimize substantive Matter content.

Third-party analytics shall not receive:

- legal documents;
- full client identities;
- sensitive Matter titles;
- confidential legal narrative.

---

# 142. Operational Cost Requirements

Cost monitoring shall cover:

- compute;
- database;
- storage;
- backups;
- network;
- monitoring;
- OCR;
- notifications;
- AI.

Budget controls shall not automatically shut down Tier-0 legal-critical systems.

---

# 143. Tier Classification

## Tier 0 — Legal Critical

- canonical Matter data;
- deadlines;
- documents;
- authorization;
- audit.

## Tier 1 — Operational High

- client portal;
- communications;
- billing.

## Tier 2 — Supporting

- reporting;
- search where direct navigation remains;
- knowledge.

## Tier 3 — Optional

- AI assistance.

---

# 144. Product Success Measures

Candidate future metrics:

- enquiry response time;
- conflict-review time;
- matter-opening time;
- percentage of critical deadlines confirmed;
- failed communication follow-up;
- client document-request completion;
- Matter closure completeness;
- backup restore success;
- portal adoption;
- billing reconciliation.

Metrics shall not encourage unsafe shortcuts.

---

# 145. Product Anti-Metrics

Do not optimize for:

- number of matters opened;
- fastest conflict clearance;
- maximum client data collected;
- maximum AI usage;
- maximum document sharing;
- employee monitoring volume.

Without context these may reward risky behavior.

---

# 146. Requirements Traceability

All P0 requirements must eventually have:

- source/rationale;
- owner;
- implementation mapping;
- test;
- validation where applicable;
- release evidence.

Target before release:

```text
P0_without_source = 0
P0_without_owner = 0
P0_without_test = 0
P0_legal_without_validation = 0
P0_failed_tests = 0
```

---

# 147. Implementation Requirement Contract

Every coding task derived from this SRS shall include:

```text
Task
Canonical requirement IDs
Relevant domain
Architecture constraints
Acceptance criteria
Tests required
Forbidden shortcuts
```

---

# 148. Implementation Rules

No implementer shall:

- invent new legal states;
- remove requirements to simplify code;
- merge distinct domain concepts;
- weaken authorization;
- bypass tests;
- infer Egyptian law not supplied by approved specification;
- create government automation from unsupported interfaces;
- expose provider secrets;
- treat AI output as final legal judgment.

---

# 149. Ambiguity Protocol for Implementers

When an implementation ambiguity is legally/security/privacy material:

1. preserve safest existing behavior;
2. mark ambiguity;
3. identify affected requirement;
4. propose technical alternatives;
5. do not silently select a weaker interpretation.

---

# 150. Code Review Questions

Material PRs shall answer:

1. Which requirement IDs are implemented?
2. Which invariants are affected?
3. Which tests prove behavior?
4. Does this change client visibility?
5. Does it change professional authority?
6. Does it introduce new processing/vendor/country?
7. Does it change legal state or history?

---

# 151. Master Definition of Done

A feature is complete only when:

- canonical requirements satisfied;
- architecture respected;
- authorization implemented;
- data model correct;
- tests pass;
- accessibility/i18n considered;
- security/privacy controls pass;
- audit exists where required;
- operational monitoring exists;
- documentation updated;
- legal validation exists where required.

---

# 152. First Implementation Milestones

## Milestone M0 — Repository/Foundation

Deliver:

- monorepo/application skeleton;
- CI;
- local environment;
- design system;
- localization;
- database baseline;
- identity interfaces;
- audit framework;
- structured requirements files.

---

## Milestone M1 — Identity and Authorization

Deliver:

- UserAccount;
- organization/employee structure;
- MFA-ready identity integration;
- role system;
- policy engine;
- Matter access abstractions;
- restricted Matter tests.

---

## Milestone M2 — Parties and Intake

Deliver:

- Party;
- names/aliases;
- organizations;
- contact points;
- enquiry;
- triage.

---

## Milestone M3 — Conflicts and Engagement

Deliver:

- ConflictReview;
- conflict index;
- decisions;
- ClientRelationship;
- Engagement/versioning;
- representative authority.

---

## Milestone M4 — Matters and Proceedings

Deliver:

- Matter;
- Matter Party;
- team;
- restrictions;
- Proceeding;
- state transitions.

---

## Milestone M5 — Deadlines and Work

Deliver:

- Deadline;
- rule versions;
- calculation;
- confirmation;
- Hearing;
- Task;
- checklist;
- notification triggers.

---

## Milestone M6 — Documents and Evidence

Deliver:

- secure upload;
- quarantine;
- FileObject;
- Document/Version;
- derivatives;
- search;
- publication;
- EvidenceItem/custody.

---

## Milestone M7 — Client Portal

Deliver:

- client auth;
- client projection;
- document request;
- upload;
- publication;
- approved updates.

---

## Milestone M8 — Finance

Deliver:

- fees;
- expenses;
- Invoice;
- Payment;
- reconciliation;
- adapter foundation.

---

## Milestone M9 — Privacy and Records

Deliver:

- ProcessingActivity;
- ConsentRecord;
- DSR;
- Retention;
- LegalHold;
- destruction workflow.

---

## Milestone M10 — Integrations and Hardening

Deliver:

- providers;
- observability;
- DR;
- security testing;
- migration tools;
- accessibility hardening.

---

## Milestone M11 — Controlled AI

Only after AI gates pass.

---

# 153. Implementation Sequencing Rule

Client Portal shall not be implemented before the internal authorization and client-projection model is mature.

AI shall not be implemented before:

- Matter authorization;
- document security;
- privacy policy;
- audit;

are mature.

---

# 154. Master Release Blocking Conditions

Real client production use is blocked if any of the following remains unresolved for the relevant release:

- cross-Matter authorization failure;
- client isolation failure;
- missing employee MFA;
- public document storage;
- untested backups;
- conflict workflow can be bypassed;
- final legal deadline can be auto-confirmed;
- wrong document version can be published;
- legal hold can be destroyed;
- privacy licence/cross-border launch issue unresolved;
- critical penetration finding;
- unsupported government automation active.

---

# 155. Assumptions Still Requiring D04 Validation

Current consolidated SRS assumes:

- Lex Gate practices Egyptian law;
- Arabic/English operation is required;
- legal/client data is confidential;
- client portal is desirable;
- internal operations benefit from centralized Matter management;
- no verified government API exists until proven otherwise;
- AI is future controlled assistance, not autonomous legal practice.

All quantitative workload assumptions remain provisional.

---

# 156. Requirements Baseline Status

This SRS establishes:

> **LG Requirements Baseline 0.9**

It is implementation-ready for architectural/foundation work.

It is **conditionally implementation-ready** for legally sensitive workflows.

Before those workflows become production-active, relevant unresolved legal/firm decisions must pass their specified gates.

---

# 157. Promotion to Baseline 1.0

LG-SRS-001 may become Version 1.0 when:

1. D04 firm discovery is populated sufficiently for R1/R2.
2. canonical requirement files are generated.
3. P0 duplicate/conflict sweep is complete.
4. final legal source references are normalized.
5. lawyer authority matrix is approved.
6. core conflict workflow is legally validated.
7. core deadline workflows are validated.
8. privacy launch position is confirmed.
9. initial technology stack is selected.
10. initial implementation plan is approved.

---

# 158. Approval Record

## Project Sponsor

Name: Ahmed Elshazlly  
Role: Project Sponsor / Lex Gate Owner  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Comments: ______________________________

---

## Lead Practising Egyptian Lawyer

Name: ______________________________  
Professional Status: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Comments: ______________________________

---

## Product / Legal Operations Lead

Name: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Comments: ______________________________

---

## Architecture / Engineering Lead

Name: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Comments: ______________________________

---

## Security Lead

Name: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Comments: ______________________________

---

## Privacy / DPO Reviewer

Name: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Comments: ______________________________

---

## QA / Validation Lead

Name: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Comments: ______________________________

---

# Appendix A — Canonical Requirement Metadata

Every canonical requirement shall ultimately use:

```text
Requirement ID:
Title:
Statement:
Priority:
Status:
Owner:

Sources:
Rationale:

Capability:
Release:

SOP:
ADR:
Domain:
Entities:
API:
Events:
UI:

Security:
Privacy:
Records:
Operations:

Acceptance criteria:
Tests:
Legal validation:

Implementation location:
Evidence:
Review date:
```

---

# Appendix B — Canonical State Distinctions

The following pairs shall never be collapsed without explicit approved redesign:

```text
Prospect               ≠ Client
Consultation           ≠ Engagement
Payment                ≠ Engagement
Engagement             ≠ Matter
Matter                 ≠ Proceeding
Task                   ≠ Deadline
Calculated Deadline    ≠ Confirmed Deadline
Submitted              ≠ Officially Filed
Uploaded               ≠ Reviewed
Draft                  ≠ Final
Final                  ≠ Client Published
Document               ≠ Evidence
OCR Text               ≠ Source Document
Translation            ≠ Original
Approval               ≠ Signature
Delivery               ≠ Acknowledgement
Account Disabled       ≠ Employment Terminated
Archive                ≠ Destruction
System Administrator   ≠ Lawyer Authority
AI Output              ≠ Legal Decision
```

---

# Appendix C — Architectural Non-Negotiables

1. Server-side authorization.
2. Deny-by-default Matter access.
3. Dedicated client projections.
4. Private document storage.
5. Explicit high-risk domain commands.
6. Relational canonical state.
7. Immutable/versioned legal and financial history.
8. Transactional outbox.
9. Provider adapters.
10. Audit as first-class subsystem.
11. Legal rules effective-dated.
12. AI behind internal gateway.
13. Production environment isolation.
14. Tested backup restoration.
15. Synthetic lower-environment data by default.

---

# Appendix D — Critical Security Scenarios

Before production, demonstrate:

- stolen client identifier cannot reveal another client;
- unassigned lawyer cannot access restricted Matter;
- technical administrator lacks ordinary Matter content permission;
- malicious document remains quarantined;
- signed URL expiry works;
- bulk export requires authorization;
- invalid webhook rejected;
- former employee session revoked;
- backup can be restored;
- AI cannot retrieve cross-Matter context.

---

# Appendix E — Critical Legal Scenarios

Before production, demonstrate:

- conflict cannot auto-clear;
- consultation does not create engagement;
- payment does not create representation;
- wrong Engagement version cannot silently become accepted;
- machine deadline cannot auto-confirm;
- corrected deadline preserves prior history;
- postponed hearing preserves original event;
- filing attempt remains distinct from confirmation;
- wrong client cannot receive unpublished document;
- Matter cannot close with unresolved legal-critical obligations.

---

# Appendix F — Master System Rule

Lex Gate is not intended to be ordinary case-management software with legal labels attached.

Its architecture must encode the fact that legal practice contains:

- professional authority;
- confidentiality relationships;
- conflicts;
- procedural rules;
- legal uncertainty;
- immutable historical evidence;
- client rights;
- external authorities;
- professional judgment.

Accordingly:

> the system shall automate administration aggressively where safe, assist legal judgment where valuable, and deliberately stop automation at the point where legal authority, client rights, professional responsibility, evidentiary integrity, confidentiality, or material legal uncertainty requires an accountable human decision.