# Lex Gate Legal Practice Platform  
## D12 — Privacy Engineering Specification

**Document ID:** LG-D12  
**Document Title:** Privacy Engineering Specification  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.1  
**Status:** Proposed Privacy Engineering Baseline — Egyptian Legal and Regulatory Validation Required  
**Classification:** Strictly Confidential — Privacy, Legal, and Security Architecture  
**Prepared Date:** 7 August 2026  

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

---

# 1. Purpose

This document translates Lex Gate’s Egyptian privacy obligations into engineering, operational, governance, data-model, and testing requirements.

It defines:

- privacy governance;
- controller and processor responsibilities;
- regulatory licence and permit dependencies;
- Personal Data Protection Officer governance;
- personal-data inventory;
- processing-purpose records;
- collection and minimization;
- transparency;
- consent;
- sensitive personal data;
- children’s data;
- client and prospective-client data;
- employee data;
- third-party and adverse-party data;
- data-subject rights;
- correction;
- restriction;
- objection;
- withdrawal;
- erasure and destruction;
- legal holds;
- retention;
- processors;
- subprocessors;
- cross-border processing;
- direct electronic marketing;
- AI processing;
- analytics;
- breach response;
- data lineage;
- migration;
- privacy acceptance tests.

D12 does not replace legal advice.

It defines the controls that the product must be capable of enforcing once Lex Gate’s applicable regulatory position is formally confirmed.

---

# 2. Current Egyptian Privacy Baseline

Egypt’s Personal Data Protection Law No. 151 of 2020 applies to personal data processed electronically, wholly or partly, subject to the Law’s scope and exemptions. The Egyptian State Information Service records the enactment and publication of Law 151/2020.

The Executive Regulations were issued through Minister of Communications and Information Technology Decision No. 816 of 2025, published on 1 November 2025 and stated in the available text to take effect on 2 November 2025.

Current professional commentary reports a one-year period for regulated entities to regularize their position following issuance of the Regulations, placing the relevant compliance milestone around **1 November 2026**. Because Lex Gate’s production launch may approach that date, licence, permit, DPO, and transfer questions are treated as launch-critical and must be confirmed against the controlling Arabic text and regulator practice before production.

---

# 3. Controlling-Language Rule

For final legal interpretation:

1. controlling Egyptian Arabic legal text;
2. official Gazette publication;
3. official regulator decisions and guidance;

take precedence over:

- translations;
- law-firm summaries;
- academic commentary;
- internal project interpretation.

Any conflict shall be recorded in D02 and escalated for Egyptian legal review.

---

# 4. Privacy Engineering Objective

The platform shall make it possible for Lex Gate to answer, for every material processing activity:

> Whose information are we processing, what information is involved, why are we processing it, where did it come from, who can access it, which systems and vendors receive it, where is it processed, how long is it retained, what authority permits the processing, and how can Lex Gate demonstrate compliance?

If the system cannot answer these questions, the processing is not considered privacy-engineered.

---

# 5. Privacy Principles

## PRV-PRN-001 — Purpose Specificity

Personal data shall be associated with a defined and legitimate purpose.

---

## PRV-PRN-002 — Data Minimization

Collect only information necessary for the approved purpose.

---

## PRV-PRN-003 — Purpose Limitation

Data collected for one purpose shall not silently become available for unrelated purposes.

---

## PRV-PRN-004 — Accuracy

The system shall support identifying:

- original source;
- verification state;
- corrections;
- disputed data.

---

## PRV-PRN-005 — Retention Limitation

Personal data shall not be retained indefinitely merely because storage is inexpensive.

---

## PRV-PRN-006 — Security

Privacy depends on confidentiality, integrity, recoverability, and appropriate access controls established in D11.

---

## PRV-PRN-007 — Transparency

Where legally required, the data subject shall receive understandable information concerning processing.

---

## PRV-PRN-008 — Demonstrability

Lex Gate shall preserve evidence of important privacy decisions.

---

## PRV-PRN-009 — Human Review

Requests involving:

- disclosure;
- erasure;
- conflicting rights;
- professional secrecy;
- court obligations;
- legal holds;

shall not be decided solely by automation.

---

## PRV-PRN-010 — Confidentiality Overlay

Privacy authorization does not override professional confidentiality.

A person may have a privacy right concerning their data without thereby receiving an unrestricted right to an entire legal matter file.

---

# 6. Controller and Processor Model

The system shall model whether Lex Gate acts as:

- controller;
- processor;
- joint or shared processing participant where legally established;
- recipient;
- data subject;
- client of another processor.

This classification shall be made per processing activity, not globally assumed for every relationship.

---

# 7. Lex Gate Controller Register

Where Lex Gate determines purposes and means of processing, the corresponding processing activity shall identify Lex Gate as controller.

Each record should identify:

- processing owner;
- systems;
- purposes;
- data subjects;
- data categories;
- processors;
- recipients;
- cross-border locations;
- retention;
- consent or other approved processing authority;
- regulatory licence/permit dependency.

---

# 8. Processor Register

When another organization processes personal data for Lex Gate, maintain:

`ProcessorVendor`

including:

- legal entity;
- service;
- contract;
- controller/processor relationship;
- personal-data categories;
- data-subject categories;
- processing purposes;
- countries;
- storage locations;
- subprocessors;
- retention;
- deletion procedure;
- security assessment;
- privacy assessment;
- breach-notification obligations;
- termination arrangements.

The Regulations require processor records to include processing information, controller relationship information, retention periods, security procedures, and cross-border information where applicable.

---

# 9. Processor Contract Requirement

No production vendor receiving confidential personal data shall be enabled without an approved contractual assessment.

The contract review shall consider:

- processing scope;
- instructions;
- confidentiality;
- security;
- subprocessors;
- incident notification;
- data return;
- deletion;
- cross-border locations;
- regulator cooperation;
- termination.

---

# 10. Licensing and Permit Governance

Decision 816/2025 creates operational licence and permit structures for controllers and processors and requires applicants to document, among other things:

- nature and volume of data;
- sensitive-data involvement;
- retention;
- security mechanisms;
- consent mechanisms;
- infrastructure;
- processing records.

Accordingly:

**PRV-LIC-001 — Launch Blocking**

Lex Gate shall not process production personal data until an Egyptian privacy lawyer has confirmed:

- Lex Gate’s required controller/processor licence or permit category;
- application status;
- required DPO arrangements;
- any sensitive-data permit;
- any cross-border permit;
- any direct-marketing licence;
- any additional activity-specific licence.

---

# 11. Regulatory Configuration Registry

Store:

```text id="regpriv"
regulatory_authorization_id
authorization_type
regulator
reference_number
scope
data_categories
approved_countries
effective_from
expires_at
status
document_reference
conditions
owner
```

Regulatory authorization shall be treated as effective-dated configuration.

---

# 12. Licence Scope Monitoring

The available Regulations indicate that changes in data volume or categories may require modification of the relevant licence or permit.

Therefore the platform should monitor:

- approximate number of personal-data records;
- newly introduced sensitive categories;
- newly introduced processing purposes;
- new countries;
- new major processors.

A threshold change shall generate a privacy-review task rather than automatically changing regulatory status.

---

# 13. Personal Data Protection Officer

Decision 816/2025 defines registration procedures and qualifications for Personal Data Protection Officers and requires relevant controller/processor arrangements to support their role and independence.

Lex Gate shall therefore maintain:

`DataProtectionOfficerAssignment`

with:

- Party;
- DPO code where applicable;
- registration evidence;
- appointment start;
- appointment end;
- controller/processor relationship;
- permitted scope;
- contact method;
- independence confirmation;
- replacement arrangements.

---

# 14. DPO Access

The DPO shall receive access necessary to perform privacy duties.

This does **not** mean unrestricted substantive legal access.

Where privacy review requires protected matter content:

- access shall be purpose limited;
- logged;
- limited to necessary information;
- subject to professional secrecy.

---

# 15. DPO Change Control

Replacement or termination of the DPO arrangement shall trigger:

- regulatory review;
- replacement workflow;
- access review;
- privacy contact update;
- incident escalation continuity review.

No DPO account shall simply be disabled without ensuring required regulatory continuity.

---

# 16. Processing Activity Register

The platform shall maintain a structured `ProcessingActivity` registry.

Required fields:

```text id="procreg"
processing_activity_id
name_ar
name_en
owner
purpose
data_subject_categories
personal_data_categories
sensitive_data_categories
source
systems
controller
processors
recipients
processing_countries
storage_countries
backup_countries
retention_rule
consent_required
processing_authority
regulatory_authorization
security_class
ai_usage
marketing_usage
status
effective_from
effective_to
review_date
```

---

# 17. Example Processing Activities

Candidate entries include:

- public enquiry;
- conflict screening;
- consultation;
- client onboarding;
- identity verification;
- matter management;
- document storage;
- litigation evidence management;
- client portal;
- billing;
- payment reconciliation;
- legal communications;
- employment administration;
- security monitoring;
- audit logging;
- marketing;
- website analytics;
- AI document processing.

Each is assessed separately.

---

# 18. Privacy Change Control

A new feature shall not process new personal data until its Processing Activity record is reviewed.

Triggers include:

- new field;
- new vendor;
- new analytics platform;
- new integration;
- new AI capability;
- new country;
- new user group;
- new data source;
- new retention use.

---

# 19. Processing Purpose Model

Purpose shall be stored as structured controlled data.

Examples:

- respond to legal-service enquiry;
- conflict screening;
- provide legal representation;
- court/procedural administration;
- client communication;
- billing;
- legal-record retention;
- information security;
- regulatory compliance;
- recruitment;
- marketing.

Avoid vague purposes such as:

- “business needs”;
- “improve services”;
- “future use”.

---

# 20. Processing Authority

The engineering model shall contain an approved `ProcessingAuthority` field.

Possible authority classifications shall be established by Egyptian counsel.

The system must not simply copy GDPR lawful-basis terminology and assume the same legal effect under Egyptian law.

Potential categories may include:

- explicit consent;
- legal authorization;
- legal/professional obligation;
- contract/service necessity where confirmed;
- other specific authorized ground.

Every category requires a source reference in D02.

---

# 21. Purpose Compatibility

Before personal data is reused for a new purpose:

1. identify original purpose;
2. identify proposed purpose;
3. determine whether new legal authority is needed;
4. determine whether new notice is needed;
5. determine whether consent is needed;
6. assess confidentiality;
7. assess retention;
8. record approval.

---

# 22. Collection Inventory

For every collection point record:

- field;
- data category;
- purpose;
- required/optional;
- source;
- validation;
- sensitivity;
- retention;
- downstream users;
- external processors.

---

# 23. Public Enquiry Minimization

The public website should initially request only information necessary to:

- identify the person;
- contact them;
- route the enquiry;
- identify conflict-screening parties;
- recognize apparent urgency.

The public enquiry should not ordinarily request:

- complete national ID;
- passport scan;
- extensive health data;
- complete criminal file;
- highly sensitive evidence;
- complete financial records.

Such information should transition to a secure channel where necessary.

---

# 24. Required vs Optional Fields

Every personal-data field shall state:

- required;
- conditionally required;
- optional.

An optional field must not be disguised as mandatory through interface design.

---

# 25. Data Source

Every material personal-data element should support provenance:

- data subject;
- authorized representative;
- lawyer;
- employee;
- court;
- public authority;
- opposing party;
- witness;
- document extraction;
- migrated system;
- AI-derived suggestion.

---

# 26. Notice Architecture

Privacy notices shall be versioned.

Candidate notice audiences:

- public website visitors;
- prospective clients;
- clients;
- client representatives;
- applicants;
- employees;
- external professionals;
- marketing contacts.

---

# 27. Privacy Notice Version

Store:

```text id="noticev"
notice_version_id
audience
language
version
effective_from
effective_to
approved_by
document
status
```

---

# 28. Bilingual Notices

Where both Arabic and English notices exist, store them as coordinated versions.

They must be legally reviewed for equivalence rather than treated as unrelated translations.

---

# 29. Notice Evidence

Where proof of notice matters, record:

- notice version;
- date/time;
- delivery surface;
- language;
- Party/account;
- acknowledgement where required.

---

# 30. Consent Architecture

Consent shall never be stored as:

```text id="badconsent"
consent = true
```

without context.

The available Executive Regulations expressly contemplate records describing consent, including timing, form, data categories, and scope.

---

# 31. Consent Record

`ConsentRecord` shall include:

```text id="consentrecord"
party
purpose
data_categories
notice_version
consent_text_version
language
method
channel
granted_at
effective_from
effective_to
withdrawn_at
withdrawal_method
guardian_if_applicable
evidence
```

---

# 32. Consent Separation

Separate consent shall be maintained for distinct purposes such as:

- legal-service processing where consent is applicable;
- marketing;
- testimonials;
- publication of case studies;
- cross-border transfers where required;
- sensitive-data processing;
- AI use where separately approved.

Acceptance of engagement terms shall not automatically constitute consent for every unrelated purpose.

---

# 33. Bundled Consent Prohibition

The user shall not be forced to accept optional:

- marketing;
- testimonial use;
- public case-study use;
- AI training;

as a condition of receiving ordinary legal service unless Egyptian counsel confirms a lawful and necessary basis.

---

# 34. Consent Withdrawal

The platform shall support:

- request;
- verification;
- effective date;
- affected purposes;
- downstream propagation;
- review of continuing legal grounds;
- confirmation.

Withdrawal must not mechanically destroy records that must lawfully remain.

---

# 35. Data-Subject Rights Interface

The Regulations require controllers to establish mechanisms through which data subjects can seek access, withdraw consent, correct or modify data, restrict processing, and object.

Lex Gate shall therefore support a controlled `DataSubjectRequest` workflow.

---

# 36. Data-Subject Request Types

At minimum the model shall support:

- know/access;
- correction;
- modification;
- withdrawal of consent;
- restriction;
- objection;
- erasure/deletion where applicable;
- other regulator-defined request.

---

# 37. Request Intake Channels

Possible channels:

- authenticated portal;
- privacy email;
- physical request;
- authorized representative;
- DPO-assisted request.

No channel should require a client to expose unnecessary sensitive information.

---

# 38. Request Identity Verification

Before disclosure or destructive action:

- verify requester;
- verify representative authority;
- determine affected Party;
- determine scope.

Identity verification must be proportionate.

Do not require excessive identity documents for a low-risk request.

---

# 39. Data-Subject Request State Machine

Suggested states:

```text id="dsrstate"
RECEIVED
IDENTITY_VERIFICATION
SCOPE_CLARIFICATION
SEARCHING
LEGAL_REVIEW
PRIVACY_REVIEW
THIRD_PARTY_REVIEW
DECISION
RESPONSE_PREPARATION
DELIVERED
CLOSED
APPEALED_OR_ESCALATED
```

---

# 40. DSR Search Scope

A privacy search may need to cover:

- Party records;
- enquiries;
- conflict records;
- client records;
- matter-party records;
- documents;
- communications;
- invoices;
- payments;
- employment records;
- audit records;
- processors.

Structured Party relationships alone may not identify every occurrence in unstructured legal documents.

---

# 41. Disclosure Review

Before data is disclosed to a requester, evaluate:

- professional secrecy;
- other clients;
- adverse parties;
- witnesses;
- legal privilege/protection;
- court restrictions;
- security information;
- investigation records;
- third-party rights.

The system must not offer a one-click unrestricted “export everything” privacy response.

---

# 42. Access Package

An approved access package shall record:

- request;
- records searched;
- included records;
- withheld/redacted records;
- reason;
- reviewer;
- export version;
- delivery;
- expiry.

---

# 43. Correction Requests

Correction shall distinguish:

- objective identity/contact correction;
- disputed allegation;
- lawyer analysis;
- historical legal document;
- court record;
- user-entered statement.

Not every disagreement permits overwriting historical content.

---

# 44. Correction History

Material corrections shall preserve:

- previous value;
- corrected value;
- requester;
- source;
- reason;
- reviewer;
- effective date.

---

# 45. Disputed Information

Where Lex Gate cannot simply replace information, the platform may mark:

- disputed;
- reported;
- not verified;
- officially confirmed.

This is particularly important in legal disputes.

---

# 46. Restriction of Processing

The system should support restricting processing without destroying the record.

Possible effects:

- block optional processing;
- block marketing;
- block AI;
- prevent external transfer;
- restrict internal access;
- preserve for legal obligations only.

---

# 47. Objection Workflow

An objection shall identify:

- processing activity;
- objected purpose;
- requester;
- legal review;
- outcome;
- continuing authorization where applicable;
- communication.

---

# 48. Erasure Is Not Simple Deletion

An erasure request must not directly execute database deletion.

Instead:

```text id="eraseflow"
Erasure Request
      ↓
Identity Verification
      ↓
Record Discovery
      ↓
Retention / Legal Hold Review
      ↓
Professional Secrecy Review
      ↓
Financial / Tax Review
      ↓
Third-Party Rights Review
      ↓
Decision
      ↓
Approved Destruction / Restriction / Rejection
```

---

# 49. Retention Architecture

Every important record category shall have an approved retention rule.

Examples:

- enquiry;
- rejected prospect;
- conflict review;
- client identity;
- engagement;
- matter;
- evidence;
- communication;
- billing;
- audit;
- employee;
- security incident;
- consent;
- privacy request.

---

# 50. Retention Rule Content

Each rule should state:

```text id="retentionrule"
record_class
trigger
retention_duration
legal_source
professional_reason
exceptions
legal_hold_behavior
backup_behavior
destruction_method
reviewer
effective_from
effective_to
```

---

# 51. Retention Purpose

Decision 816/2025 requires retention periods to be related to processing purpose and contemplates erasure after the purpose or required processing concludes, subject to lawful reasons for continued retention.

Therefore:

**PRV-RET-001**

“No expiry” shall not be an ordinary default.

---

# 52. Legal Reasons for Continued Retention

Where information remains because of:

- professional responsibility;
- evidentiary requirement;
- tax requirement;
- dispute;
- court process;
- security investigation;
- legal hold;

the system shall record the applicable reason.

---

# 53. Reduced-Identification Retention

The Regulations contemplate rendering retained personal data unreadable/unidentifiable to unauthorized persons where retained for continuing legal reasons.

Accordingly, where full active accessibility is no longer needed:

- archive;
- reduce access;
- tokenize or pseudonymize where appropriate;
- avoid normal search exposure.

---

# 54. Legal Hold

A Legal Hold shall override scheduled destruction.

No ordinary DSR, retention job, or administrator action may destroy held records.

---

# 55. Destruction Workflow

Approved destruction requires:

- retention eligibility;
- no active legal hold;
- professional review;
- privacy review where necessary;
- identification of derivatives;
- identification of backups;
- approval;
- execution;
- destruction evidence.

---

# 56. Backups and Privacy

A record’s privacy obligations extend to backups.

The destruction architecture must document:

- when backups expire;
- whether individual deletion from immutable backups is technically possible;
- whether restored data is re-subjected to deletion controls.

---

# 57. Sensitive Personal Data

Decision 816/2025 requires enhanced controls for sensitive personal data, including the relevant licence/permit and explicit written consent where applicable, together with appropriate security measures.

Lex Gate should assume many legal matters may contain sensitive personal information.

---

# 58. Sensitive Data Examples for Discovery

Potential categories to review include:

- health;
- biometric identifiers;
- criminal allegations/proceedings;
- family circumstances;
- children’s information;
- financial circumstances;
- other legally defined sensitive categories.

The final statutory mapping shall be recorded in D02/D12 after Arabic-text review.

---

# 59. Sensitive-Data Controls

Sensitive data shall support:

- higher classification;
- narrower access;
- encryption;
- stronger export restrictions;
- enhanced audit;
- restricted AI processing;
- restricted search;
- processor restrictions;
- explicit consent evidence where required.

---

# 60. Sensitive Public Forms

The public website shall not be the default collection point for highly sensitive legal evidence.

After initial intake, the system should transition users to:

- secure portal;
- controlled office process;
- other approved secure mechanism.

---

# 61. Children Under 15

The available translation of Article 15 of the Executive Regulations states that processing data of children under 15 requires explicit written guardian consent before collection, with the consent covering its temporal scope.

The data model shall therefore support:

- child Party;
- age/age-band where legitimately required;
- guardian Party;
- guardian authority;
- consent version;
- consent period;
- withdrawal.

---

# 62. Ages 15–18

The Regulations contain a separate mechanism for children aged 15–18 and contemplate involvement of the child or guardian according to the applicable regulatory mechanism.

No production workflow for minors shall be finalized without Egyptian legal review of this distinction.

---

# 63. Guardian Access Is Not Automatic

A guardian relationship shall not automatically grant unrestricted portal access to all child-related information.

The system must consider:

- authority scope;
- conflicts;
- court restrictions;
- professional duties;
- safety concerns.

---

# 64. Child Data Minimization

For child-related workflows:

- collect only necessary data;
- restrict behavioral analytics;
- avoid profiling;
- prohibit marketing by default;
- restrict AI use.

---

# 65. Prospective Clients

Prospective-client information is privacy-sensitive even when no engagement occurs.

The system shall retain:

- limited contact information;
- conflict-relevant information;
- appropriate rejection records;

only according to approved purposes and retention rules.

---

# 66. Rejected Prospects and Conflicts

Conflict prevention may justify keeping limited information concerning a rejected prospect.

The system shall distinguish:

- minimum conflict identity;
- full discarded enquiry narrative;
- unnecessary documents.

Not all originally submitted content must remain merely because the Party needs to remain searchable for conflicts.

---

# 67. Third-Party Data

Legal matters routinely contain data concerning people who did not directly provide it.

Examples:

- adverse parties;
- witnesses;
- family members;
- employees of clients;
- experts.

The system shall record source and purpose and restrict inappropriate reuse.

---

# 68. Publicly Available Data

Public availability does not automatically make information:

- unrestricted;
- appropriate for indefinite retention;
- appropriate for marketing;
- appropriate for AI training.

Public-source enrichment must have an approved legal and professional purpose.

---

# 69. Employee Privacy

Employee records shall be segregated from client matter records where possible.

Employee monitoring must be:

- necessary;
- proportionate;
- transparent;
- approved.

Do not design the platform as a covert surveillance system.

---

# 70. Security Logging and Employee Privacy

Security logs may record:

- authentication;
- matter access;
- downloads;
- privilege changes.

These logs exist for security and accountability.

They should not automatically become:

- productivity rankings;
- disciplinary scoring;
- performance evaluation.

---

# 71. Processor Security

A processor shall not receive data merely because it is technically convenient.

Each transmission must be traceable to an approved Processing Activity.

---

# 72. Subprocessors

Maintain:

- provider;
- subprocessor;
- service;
- country;
- data;
- approval status.

Material subprocessor changes should generate privacy review where contract or risk warrants.

---

# 73. Processor Termination

Before terminating a vendor:

- export necessary data;
- verify migration;
- revoke credentials;
- request deletion;
- obtain deletion evidence where contractually available;
- update processing registry;
- update transfer registry.

---

# 74. Cross-Border Transfer Architecture

Decision 816/2025 establishes licence/permit controls for transferring, storing, sharing, processing, or making personal data available outside Egypt and requires destination, data categories, purpose, retention, storage, and security information. The available text also requires data-subject consent for such transfers.

Therefore cross-border processing shall be modeled explicitly.

---

# 75. Transfer Register

`InternationalDataTransfer` shall include:

```text id="transferreg"
processing_activity
controller
processor
source_country
destination_country
temporary_storage_country
backup_country
support_access_country
data_categories
sensitive_data
purpose
volume
retention
security_measures
data_subject_consent
regulatory_authorization
effective_from
effective_to
status
```

---

# 76. Cloud Is a Transfer Question

For privacy analysis, “where is the server?” is insufficient.

Assess:

- primary region;
- replication;
- backups;
- CDN;
- logging;
- support;
- subprocessors;
- AI;
- email;
- monitoring.

A service nominally configured in one region may still create international processing paths.

---

# 77. Cross-Border Deny by Default

A vendor receiving Lex Gate personal data outside the approved country list shall not be enabled until:

- regulatory authorization is confirmed;
- consent requirement is met where applicable;
- security review is complete;
- processing register is updated.

---

# 78. Country Change Control

Adding a new destination country shall be treated as a legally sensitive configuration change.

The Executive Regulations state that the licence/permit must reflect the relevant foreign country or countries and be updated where additional countries are added.

---

# 79. Data Residency Metadata

Infrastructure resources shall expose machine-readable deployment location where practical.

This enables automated comparison against the approved transfer register.

---

# 80. Direct Electronic Marketing

The Executive Regulations establish a dedicated licensing/permit framework for direct electronic marketing and require explicit consent and mechanisms allowing refusal or withdrawal.

Therefore:

**PRV-MKT-001 — Launch Blocking for Marketing**

Electronic marketing remains disabled until:

- professional advertising rules are reviewed;
- privacy licence/permit requirements are confirmed;
- recipient consent is recorded;
- opt-out works;
- source is preserved.

---

# 81. Marketing Consent

Marketing consent must be separate from:

- client engagement;
- portal use;
- contact-information processing;
- legal-service communications.

---

# 82. Marketing Suppression

Withdrawal shall place the Party in a suppression state so that future imports do not accidentally re-subscribe them.

---

# 83. Marketing Records

Maintain:

- recipient;
- purpose;
- consent;
- source;
- campaign;
- sends;
- withdrawal;
- deletion/modification request.

The Regulations expressly contemplate electronic records for marketing consent and related deletion/modification requests.

---

# 84. Service vs Marketing Communications

Classify every outbound communication as:

- service;
- legal;
- security;
- billing;
- marketing.

A client cannot be denied necessary case communication because they opted out of marketing.

---

# 85. Website Analytics

Public analytics should collect the minimum information necessary.

Prefer:

- aggregated usage;
- short retention;
- first-party or privacy-preserving architecture where feasible.

Do not place advertising or behavioral-tracking technology on:

- client portal;
- document uploads;
- consultation details;
- matter pages;
- billing;
- authentication.

---

# 86. Cookies and Similar Technologies

Maintain a registry of:

- cookie/storage key;
- provider;
- purpose;
- duration;
- data transmitted;
- country;
- necessity;
- consent requirement.

Final Egyptian consent rules require legal review.

---

# 87. Session Replay

Session-replay tools are prohibited on authenticated legal surfaces by default.

They risk capturing:

- matter names;
- messages;
- documents;
- personal identifiers;
- legal strategy.

---

# 88. AI Processing

Decision 816/2025 expressly addresses processors using personal data in AI training and emerging technologies, requiring compliance with recognized principles and avoidance of harm to data subjects.

Lex Gate shall apply controls stricter than the minimum where client confidentiality is implicated.

---

# 89. AI Training Prohibition

Lex Gate client or matter information shall not be used to train a provider’s general-purpose models.

Vendor contractual and technical configuration must support this rule.

---

# 90. Lex Gate Model Training

Any future proposal to train or fine-tune Lex Gate-specific models using client data requires a separate:

- legal assessment;
- confidentiality assessment;
- Processing Activity;
- data minimization assessment;
- rights analysis;
- transfer analysis;
- retention plan;
- security assessment;
- approval.

It is not covered by ordinary AI assistance approval.

---

# 91. AI Processing Record

For an AI operation involving personal data, preserve:

```text id="aipriv"
user
matter
purpose
data_categories
document_references
provider
provider_region
model
model_version
processing_time
retention_policy
output_reference
human_reviewer
```

Do not necessarily store full prompt bodies in ordinary operational logs.

---

# 92. AI Minimization

Before sending information to AI:

- retrieve only authorized matter;
- select only necessary documents;
- prefer excerpts where sufficient;
- remove unnecessary identifiers where possible;
- block prohibited data categories.

---

# 93. AI Purpose Limitation

An AI summary requested for a matter shall not make the matter content available for:

- marketing;
- global organization training;
- unrelated analytics;
- other matters.

---

# 94. Privacy Impact Assessment

Lex Gate shall adopt an internal Privacy Impact Assessment process for high-risk changes even where the precise form is an organizational control rather than a confirmed statutory DPIA requirement.

---

# 95. PIA Triggers

Conduct enhanced privacy review for:

- sensitive data;
- children;
- large-scale processing;
- new international transfer;
- AI;
- surveillance;
- biometric processing;
- novel tracking;
- bulk enrichment;
- significant new processor;
- merging large legacy datasets.

---

# 96. PIA Record

```text id="pia"
change
purpose
data subjects
data categories
necessity
alternatives
risks
legal authority
notice
consent
processors
transfers
retention
security
rights
residual risk
approvers
```

---

# 97. Data Breach Timing

The available Executive Regulations state that controllers/processors must notify the Personal Data Protection Center within **72 hours of becoming aware** of a breach or violation. The notification record includes awareness time, nature, consequences, corrective actions, and DPO information.

Therefore breach timing must be modeled from:

> awareness time

not simply:

> incident creation time.

---

# 98. Regulatory Breach Clock

`PrivacyIncident` shall store:

```text id="breachclock"
event_time_if_known
detected_at
awareness_at
privacy_classification_at
center_notification_due
center_notified_at
subject_notification_due
subject_notified_at
```

No one may modify `awareness_at` after regulatory classification without an auditable correction.

---

# 99. Data-Subject Breach Notice

The available text states that the data subject is to be notified within **three business days of notification to the Center**, including information about the breach/violation and security measures taken, through the agreed communication method.

This timing shall be implemented as a configurable legally sensitive rule pending final Arabic-text confirmation.

---

# 100. Breach Workflow

```text id="breachflow"
Security Event
     ↓
Containment
     ↓
Personal Data Assessment
     ↓
Awareness Time Confirmed
     ↓
72-hour Regulatory Clock
     ↓
Legal + DPO Review
     ↓
Center Notification
     ↓
Data Subject Notification Workflow
     ↓
Corrective Action
     ↓
Post-Incident Review
```

---

# 101. Incident Register

The privacy incident record shall contain:

- affected systems;
- categories;
- approximate records;
- affected people;
- sensitive-data involvement;
- affected matters;
- processors;
- countries;
- potential harm;
- containment;
- corrective action;
- notifications;
- evidence.

---

# 102. Processor Breach Escalation

Vendor contracts must allow Lex Gate sufficient time to comply with its own legal notification deadlines.

A provider whose notification SLA makes 72-hour compliance impossible shall require escalation or rejection.

---

# 103. Incident Notification Templates

Templates should be pre-approved but must allow incident-specific legal review.

Do not wait until an incident occurs to design:

- regulator notice;
- client/data-subject notice;
- processor escalation.

---

# 104. Data Accuracy

The platform shall distinguish:

- entered;
- verified;
- official;
- disputed;
- derived.

Information extracted automatically from documents must not silently become verified data.

---

# 105. Data Lineage

For important personal data, the system should reconstruct:

```text id="lineage"
Source Document
     ↓
OCR
     ↓
Extracted Candidate
     ↓
Human Review
     ↓
Canonical Party Record
```

---

# 106. Imports

Bulk data import requires privacy review.

Before import:

- identify purpose;
- identify source;
- validate collection authority;
- map categories;
- remove unnecessary fields;
- map retention;
- identify transfers.

---

# 107. Legacy Migration

Historical data shall not automatically inherit unlimited retention.

Each migrated source shall receive:

- record-class mapping;
- legal basis/purpose review;
- retention rule;
- confidentiality classification;
- data-quality state.

---

# 108. Data Deduplication

Deduplication shall not combine two people merely because their:

- names;
- phone;
- email;

appear similar.

Incorrect merging creates both legal and privacy risk.

---

# 109. Party Merge Privacy Control

A Party merge requires:

- confidence;
- reviewer;
- provenance preservation;
- conflict impact analysis;
- portal-access analysis.

---

# 110. Exports

Personal-data exports shall:

- apply authorization;
- apply privacy scope;
- minimize data;
- record purpose;
- expire;
- be encrypted where appropriate.

---

# 111. DSR Export vs Operational Export

Privacy-response exports are different from ordinary matter exports.

They require:

- subject scope;
- third-party redaction;
- legal review;
- response evidence.

---

# 112. Public Search Engines

Pages containing:

- client data;
- portal information;
- intake submissions;
- private lawyer profiles where not approved;

must not be indexed.

Authenticated surfaces shall use appropriate anti-indexing and access controls.

---

# 113. URL Privacy

URLs shall not contain:

- national ID;
- passport number;
- client name where avoidable;
- legal allegation;
- sensitive case title.

Use opaque identifiers.

---

# 114. Notification Privacy

External notification text shall reveal only what is necessary.

Preferred:

> A new update is available in your Lex Gate portal.

rather than displaying sensitive legal information on a lock screen.

---

# 115. Email Privacy

Before emailing sensitive material:

- verify recipient;
- verify authority;
- classify content;
- use secure portal delivery instead where warranted.

---

# 116. Messaging Applications

Any WhatsApp or similar integration requires:

- Processing Activity;
- processor assessment;
- transfer assessment;
- retention design;
- business-account ownership;
- approved confidentiality use.

Personal staff accounts shall not be the target future-state architecture.

---

# 117. Access Logging as Personal Data

Audit records themselves can be personal data concerning employees and clients.

They require:

- purpose;
- access limitation;
- retention;
- security.

---

# 118. Privacy-Preserving Audit

Audit events should store:

- who;
- what;
- when;
- target ID;
- decision;

without unnecessarily duplicating full document or message content.

---

# 119. Pseudonymization

Where direct identity is unnecessary:

- analytics;
- testing;
- research;
- selected AI workflows;

should prefer pseudonymous identifiers.

---

# 120. Anonymization

Data shall be described as anonymous only where re-identification is no longer reasonably possible under the approved legal/technical standard.

Simply removing a client name does not necessarily anonymize a legal case.

---

# 121. Synthetic Data

Development, automated testing, and demonstrations should use synthetic data.

Production legal records must not be the default test dataset.

---

# 122. Support Engineering

Developer/support access to production information shall follow:

- approved purpose;
- minimum scope;
- time-limited access;
- logging;
- sanitized diagnostics where possible.

---

# 123. Screenshots

Support screenshots can contain personal data.

The support process shall encourage:

- redaction;
- secure transfer;
- restricted storage;
- prompt deletion when no longer needed.

---

# 124. Bug Reports

Issue trackers shall not contain unredacted:

- client names;
- national IDs;
- case documents;
- sensitive screenshots.

Use synthetic reproduction whenever possible.

---

# 125. Monitoring Vendors

Error-tracking and observability providers must be treated as processors if they receive personal data.

Before enabling:

- scrub request bodies;
- scrub headers;
- scrub user-generated content;
- evaluate region;
- evaluate retention.

---

# 126. Analytics Events

Good:

```text id="goodanalytics"
portal_document_upload_completed
matter_dashboard_loaded
```

Avoid:

```text id="badanalytics"
criminal_case_of_ahmed_x_viewed
```

Analytics event names and attributes shall avoid substantive legal content.

---

# 127. Privacy by Default

Default product settings shall prefer:

- no marketing;
- no public sharing;
- no AI;
- restricted matter access;
- minimal analytics;
- minimal notification previews.

Additional uses require explicit activation.

---

# 128. Privacy Configuration

Legally sensitive privacy configuration includes:

- retention durations;
- transfer countries;
- consent purposes;
- sensitive-data classes;
- DSR workflow;
- breach deadlines;
- AI eligibility.

Changes require:

- approval;
- audit;
- effective date.

---

# 129. Regulatory Rule Versioning

Example:

```text id="privacyrule"
rule_id
rule_type
jurisdiction
legal_source
provision
effective_from
effective_to
configuration
reviewer
approval
```

This prevents privacy rules from being hard-coded permanently.

---

# 130. Data Classification Registry

Each core entity shall map to:

- confidentiality class;
- privacy categories;
- sensitive-data possibility;
- retention class;
- transfer eligibility;
- AI eligibility.

---

# 131. Example Privacy Classification

| Record | Privacy sensitivity | Default confidentiality | AI default | Export |
|---|---|---|---|---|
| Public article | Low | Public | Allowed | Ordinary |
| Enquiry | High | Prospect confidential | Blocked | Restricted |
| Conflict review | Very high | Highly restricted | Prohibited | Enhanced approval |
| Matter document | High/variable | Matter confidential | Blocked | Matter controlled |
| Evidence | Very high | Restricted | Prohibited | Enhanced |
| Invoice | High financial | Client confidential | Blocked | Finance controlled |
| Audit log | High | Security restricted | Prohibited | Compliance only |

---

# 132. Client Portal Privacy

The portal shall expose only approved projections.

A client must not receive:

- internal conflict records;
- lawyer strategy;
- employee notes;
- other clients’ records;
- unapproved drafts;
- security logs.

---

# 133. Organization Client Privacy

A company being the client does not mean every employee of that company may access every matter.

Representative access shall be:

- verified;
- scoped;
- effective dated;
- revocable.

---

# 134. Portal Representative Removal

When a representative leaves:

- revoke portal access;
- terminate sessions;
- preserve historical actions;
- do not delete matter history.

---

# 135. Client Account Closure

Closing a portal account shall not erase the client’s legal records.

Account lifecycle and record retention are separate.

---

# 136. Public Case Studies

A case study or testimonial may only be considered after:

- professional advertising review;
- confidentiality review;
- client authorization where required;
- privacy approval;
- pending-case review;
- redaction.

---

# 137. Testimonials

A client’s agreement to legal representation shall not automatically authorize publication of their:

- name;
- image;
- quotation;
- case outcome.

---

# 138. Privacy Incident vs Security Incident

A security event becomes a privacy incident when personal data may have been:

- accessed;
- altered;
- lost;
- destroyed;
- disclosed;
- made unavailable;
- otherwise improperly processed.

D11 and D12 incident records must cross-reference each other.

---

# 139. Business Continuity and Privacy

Emergency operation must continue privacy controls.

An outage does not authorize:

- downloading all client records to personal laptops;
- using public file-sharing services;
- sharing credentials.

---

# 140. Manual Fallback

Approved manual fallback shall specify:

- data collected;
- temporary storage;
- access;
- migration back to system;
- deletion of temporary copies.

---

# 141. Privacy Acceptance Tests — Public Site

Test that:

- unnecessary sensitive fields are absent;
- notice is available;
- marketing is not preselected;
- analytics contain no enquiry content;
- submitted information is not indexed;
- HTTPS is required.

---

# 142. Privacy Acceptance Tests — Intake

Test that:

- enquiry access is restricted;
- rejected prospects follow retention rules;
- conflict-relevant data can be retained separately from unnecessary narrative;
- consent evidence is versioned where used.

---

# 143. Privacy Acceptance Tests — Portal

Test:

- wrong client cannot access record;
- representative expiry removes access;
- notification previews are minimized;
- portal closure does not delete legal records;
- DSR route is available.

---

# 144. Privacy Acceptance Tests — Documents

Test:

- source and provenance;
- sensitive classification;
- access;
- transfer;
- retention;
- derivative linkage;
- legal hold;
- destruction block.

---

# 145. Privacy Acceptance Tests — Marketing

Test:

- no send without required consent;
- withdrawal stops future sends;
- imported contacts respect suppression;
- consent source is recorded;
- service messages remain possible where appropriate.

---

# 146. Privacy Acceptance Tests — International Transfer

Test:

- unapproved country blocked;
- approved-country configuration effective dated;
- processor country change triggers review;
- AI provider cannot bypass transfer policy;
- backup country appears in inventory.

---

# 147. Privacy Acceptance Tests — DSR

Test:

- requester verification;
- scope;
- third-party review;
- restriction;
- correction history;
- erasure blocked by hold;
- response package audit.

---

# 148. Privacy Acceptance Tests — Breach

Simulate:

- breach discovery;
- awareness-time recording;
- 72-hour timer;
- escalation;
- regulator package;
- three-business-day subject-notice timer after Center notification;
- processor notification;
- evidence preservation.

---

# 149. Privacy Acceptance Tests — AI

Test:

- prohibited matter blocked;
- unapproved provider blocked;
- unapproved country blocked;
- unnecessary documents excluded;
- cross-matter retrieval blocked;
- output records provenance.

---

# 150. Privacy Acceptance Tests — Retention

Test:

- automatic eligibility calculation;
- legal hold override;
- destruction approval;
- backup treatment;
- destruction certificate;
- reduced archive access.

---

# 151. Privacy Metrics

Candidate metrics include:

- processing activities reviewed;
- vendors with current assessments;
- unapproved countries detected;
- DSR age;
- retention exceptions;
- unresolved deletion candidates;
- breach-response time;
- marketing-withdrawal completion;
- DPO review backlog;
- data inventory completeness.

---

# 152. Privacy Anti-Metrics

Do not optimize solely for:

- maximum data collected;
- longest retention;
- greatest analytics coverage;
- most enriched profiles;
- largest AI context.

Such measures conflict with minimization and confidentiality.

---

# 153. Privacy Risk Register

## PRV-RSK-001 — Excessive Intake Collection

Potential harm:

- unnecessary exposure of highly sensitive legal information.

Control:

- staged intake;
- secure transition.

---

## PRV-RSK-002 — Unlicensed Processing

Potential harm:

- regulatory non-compliance.

Control:

- launch gate;
- regulatory authorization registry.

---

## PRV-RSK-003 — Unapproved Foreign Cloud Processing

Potential harm:

- unlawful transfer;
- confidentiality exposure.

Control:

- country inventory;
- transfer block;
- regulatory review.

---

## PRV-RSK-004 — Client Data Used for Marketing

Potential harm:

- unlawful or professionally inappropriate secondary use.

Control:

- purpose segregation;
- marketing consent;
- marketing licence review.

---

## PRV-RSK-005 — Excessive Retention

Potential harm:

- unnecessary breach exposure;
- rights conflict.

Control:

- record classes;
- retention schedule;
- destruction.

---

## PRV-RSK-006 — Incorrect Automated Erasure

Potential harm:

- loss of evidence;
- missed professional obligation.

Control:

- human legal review;
- hold checks.

---

## PRV-RSK-007 — Processor Retains Data After Termination

Control:

- contract;
- deletion request;
- evidence;
- credential revocation.

---

## PRV-RSK-008 — AI Data Leakage

Control:

- AI gateway;
- provider policy;
- no training;
- minimization.

---

## PRV-RSK-009 — Privacy Request Exposes Another Client

Control:

- legal/confidentiality review;
- redaction.

---

## PRV-RSK-010 — Breach Clock Starts Too Late

Control:

- explicit `awareness_at`;
- DPO escalation;
- immutable correction history.

---

# 154. Launch-Blocking Privacy Conditions

Real client data shall not enter production until:

1. Lex Gate’s controller/processor role is legally confirmed.
2. Required licence/permit route is confirmed.
3. DPO requirement and registration are addressed.
4. processing inventory exists.
5. privacy notices exist.
6. consent mechanisms required at launch exist.
7. sensitive-data processing is approved.
8. hosting and backup countries are known.
9. cross-border authorization is addressed.
10. processors are assessed.
11. data-subject workflow exists.
12. retention baseline exists.
13. legal-hold process exists.
14. breach workflow exists.
15. 72-hour escalation capability exists.
16. access controls from D11 are operational.
17. marketing remains disabled unless separately approved.
18. AI remains disabled on client data unless separately approved.

---

# 155. Release 1 Privacy Gate

Public website:

- public privacy notice;
- minimal enquiry;
- controlled analytics;
- no sensitive arbitrary uploads;
- consent evidence where applicable;
- secure enquiry storage;
- marketing separate.

---

# 156. Release 2 Privacy Gate

Internal legal operations:

- Processing Activity register;
- matter classifications;
- data categories;
- processor register;
- rights workflow;
- retention;
- DPO process;
- confidential access.

---

# 157. Release 3 Privacy Gate

Client portal:

- identity/representative controls;
- client projections;
- privacy preferences;
- secure DSR intake;
- notification privacy;
- portal processor assessment.

---

# 158. Release 4 Privacy Gate

Finance:

- billing data purpose;
- ETA processing map;
- payment-provider assessment;
- financial retention;
- cross-border assessment where relevant.

---

# 159. Release 6 Privacy Gate

AI:

- AI Processing Activity;
- approved provider;
- no-training assurance;
- transfer authorization;
- data minimization;
- sensitive-data policy;
- human review;
- DPO/legal approval.

---

# 160. Privacy Documentation Repository

Maintain:

```text id="privacydocs"
/docs/privacy
  /processing-register
  /notices
  /consents
  /processors
  /transfers
  /dpo
  /licenses
  /privacy-impact-assessments
  /data-subject-requests
  /breaches
  /retention
  /marketing
  /ai
```

Highly sensitive operational records should reside in controlled systems rather than ordinary Git when they contain personal data.

---

# 161. Requirements Traceability

Privacy requirements shall use identifiers such as:

- `PRV-GOV-*`
- `PRV-LIC-*`
- `PRV-INV-*`
- `PRV-COL-*`
- `PRV-CNS-*`
- `PRV-DSR-*`
- `PRV-RET-*`
- `PRV-SEN-*`
- `PRV-CHD-*`
- `PRV-PRO-*`
- `PRV-XBR-*`
- `PRV-BRE-*`
- `PRV-MKT-*`
- `PRV-AI-*`

Each requirement shall connect to:

- source;
- architecture;
- implementation;
- test;
- owner;
- release.

---

# 162. Priority Privacy Requirements

## PRV-GOV-001 — S0

Every personal-data processing activity shall have a defined owner and purpose.

## PRV-LIC-001 — S0

Production processing shall not begin before applicable licence/permit requirements are legally resolved.

## PRV-COL-001 — S0

Public intake shall not request unnecessary highly sensitive data.

## PRV-CNS-001 — S0

Consent, where required, shall be purpose-specific and evidenced.

## PRV-DSR-001 — S0

No automated DSR disclosure may bypass legal/confidentiality review.

## PRV-RET-001 — S0

No material legal record shall be destroyed without retention and hold review.

## PRV-SEN-001 — S0

Sensitive personal data shall receive enhanced access and security controls.

## PRV-XBR-001 — S0

Personal data shall not be intentionally transferred to an unapproved country.

## PRV-BRE-001 — S0

The system shall record breach-awareness time and support the applicable 72-hour regulatory notification workflow.

## PRV-MKT-001 — S0

Direct electronic marketing shall remain disabled until consent, licensing, and professional-marketing requirements are approved.

## PRV-AI-001 — S0

Client data shall not be transmitted to unapproved AI processing.

---

# 163. Open Legal Questions

The following require specialist resolution:

1. Exact controller/processor licence category for Lex Gate.
2. Exact timing and procedural position of the one-year regularization period.
3. Personal Data Protection Center operational application process.
4. DPO appointment and registration requirements for Lex Gate.
5. Sensitive-data permit requirements.
6. Treatment of criminal and litigation information under sensitive-data provisions.
7. Exact permissible grounds for non-consensual legal-service processing.
8. Handling of adverse-party data without direct consent.
9. Conflict-screening retention.
10. Legal-file retention.
11. Lawyer confidentiality interaction with DSR access.
12. Lawyer confidentiality interaction with DSR erasure.
13. Cross-border cloud requirements.
14. Foreign support access.
15. Client consent mechanics for international processing.
16. Marketing licence requirements for Lex Gate.
17. Cookies/analytics consent.
18. AI-processing authorization.
19. Minor/guardian access rules.
20. Professional case-study/testimonial processing.

---

# 164. Architecture Consequences

D12 requires D09–D10 architecture to support:

- Processing Activity registry;
- provenance;
- consent versions;
- rights workflow;
- effective-dated retention;
- legal holds;
- country-level processing map;
- processor register;
- DPO assignments;
- licence records;
- breach clocks;
- sensitive-data policy;
- AI policy;
- marketing suppression;
- client projections.

Privacy cannot be satisfied purely through a policy document.

---

# 165. Engineering Definition of Done

A feature processing personal data is not complete until:

- purpose is documented;
- fields are inventoried;
- access is defined;
- source is defined;
- processors are identified;
- countries are identified;
- notice/consent decision is made;
- retention is assigned;
- export behavior is defined;
- DSR behavior is defined;
- security controls exist;
- privacy tests pass.

---

# 166. D12 Completion Criteria

D12 may receive provisional approval when:

- current legal baseline is accepted;
- controller/processor inventory model is accepted;
- licence/permit gating is accepted;
- DPO model is accepted;
- Processing Activity registry is mandatory;
- consent is versioned;
- DSR workflow is approved;
- erasure requires legal review;
- sensitive data is separately controlled;
- children’s data is separately controlled;
- international transfers are explicit;
- marketing is separately controlled;
- AI is separately controlled;
- breach clocks are implemented as legal rules;
- retention and legal holds are integrated.

D12 receives final approval only after:

- controlling Arabic sources are reviewed;
- Lex Gate’s regulatory licence position is established;
- DPO position is established;
- processor/vendor inventory is complete;
- hosting architecture is selected;
- cross-border approvals are established;
- retention schedule receives legal approval;
- public and client notices are approved;
- DSR exercises are tested;
- breach simulation succeeds;
- Egyptian privacy lawyer approves the specification.

---

# 167. Approval Record

## Privacy Lead / DPO

Name: ______________________________  
Registration/Code: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Egyptian Privacy Counsel

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Security Architect

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Legal Operations Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Engineering Lead

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

# Appendix A — Processing Activity Template

```text id="patemplate"
Processing Activity ID:
Name:
Owner:
Purpose:
Data subjects:
Data categories:
Sensitive data:
Children's data:
Sources:
Controller:
Processors:
Recipients:
Processing countries:
Storage countries:
Backup countries:
Support countries:
Processing authority:
Consent:
Notice:
Regulatory licence/permit:
Security class:
Retention:
Rights handling:
AI processing:
Marketing:
Effective date:
Review date:
Approvals:
```

---

# Appendix B — Processor Assessment Template

```text id="processortemplate"
Processor ID:
Legal entity:
Service:
Contract:
Purpose:
Data categories:
Sensitive data:
Data subjects:
Primary region:
Backup region:
Support access countries:
Subprocessors:
Encryption:
Access controls:
Retention:
Deletion:
AI training:
Incident notification:
Cross-border authorization:
Security assessment:
Privacy assessment:
Exit plan:
Owner:
Approval:
```

---

# Appendix C — Data-Subject Request Record

```text id="dsrtemplate"
Request ID:
Requester:
Represented data subject:
Authority:
Request type:
Received:
Identity verified:
Scope:
Systems searched:
Records identified:
Third-party data:
Professional secrecy considerations:
Legal hold:
Retention:
Decision:
Included data:
Withheld data:
Redactions:
Response:
Delivered:
Reviewer:
DPO:
Closure:
```

---

# Appendix D — Privacy Incident Record

```text id="incidentprivacy"
Incident ID:
Security incident ID:
Occurred at:
Detected at:
Awareness at:
Affected processing activities:
Affected systems:
Affected processors:
Countries:
Data categories:
Sensitive data:
Children:
Approximate subjects:
Approximate records:
Potential consequences:
Containment:
Corrective actions:
DPO:
Center notification due:
Center notified:
Data-subject notification due:
Data subjects notified:
Legal reviewer:
Evidence:
Root cause:
Corrective programme:
Closure:
```

---

# Appendix E — Consent Record

```text id="consenttemplate"
Consent ID:
Party:
Purpose:
Personal-data categories:
Notice version:
Consent text version:
Language:
Method:
Granted:
Temporal scope:
Guardian:
Evidence:
Withdrawal:
Withdrawal method:
Downstream systems updated:
Status:
```

---

# Appendix F — Cross-Border Transfer Record

```text id="xbrtemplate"
Transfer ID:
Processing activity:
Controller:
Processor:
Purpose:
Data categories:
Sensitive data:
Source country:
Destination:
Temporary storage:
Final storage:
Backup:
Support access:
Volume:
Retention:
Security controls:
Consent:
License/permit:
Effective period:
Review:
Status:
```

---

# Appendix G — Privacy Invariants

**INV-PRV-001**

No production personal-data processing occurs without a registered purpose.

**INV-PRV-002**

No consent-based processing occurs without identifiable consent evidence.

**INV-PRV-003**

No withdrawal request silently deletes records that remain subject to a legal or professional retention requirement.

**INV-PRV-004**

No client account closure automatically destroys legal matter records.

**INV-PRV-005**

No legal hold target is destroyed by an ordinary retention process.

**INV-PRV-006**

No unapproved foreign region receives client personal data.

**INV-PRV-007**

No marketing consent is inferred solely from legal engagement.

**INV-PRV-008**

No client personal data is used to train a provider’s general-purpose AI model.

**INV-PRV-009**

No privacy access response is generated without reviewing third-party and professional-confidentiality implications.

**INV-PRV-010**

No privacy breach workflow may discard or obscure the actual awareness timestamp.

---

# Appendix H — Privacy Engineering Rule

A privacy policy is not sufficient evidence that a system protects privacy.

For Lex Gate, privacy is correctly engineered only when:

> every processing purpose is known, unnecessary collection is prevented, access is limited, consent and notices are evidenced where required, vendors and countries are controlled, rights can be exercised safely, retention is enforceable, breaches can be reported on time, and professional confidentiality remains intact.