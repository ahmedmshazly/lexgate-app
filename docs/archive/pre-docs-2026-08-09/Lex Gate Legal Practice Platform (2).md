# Lex Gate Legal Practice Platform  
## D03 — Egyptian Legal and Regulatory Analysis

**Document ID:** LG-D03  
**Document Title:** Egyptian Legal and Regulatory Analysis  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Version:** 0.1  
**Status:** Preliminary Legal Requirements Baseline  
**Classification:** Confidential — Attorney Work Product / Internal Project Documentation  
**Effective Date:** 6 August 2026  
**Parent Documents:**

- LG-D01 — Project Charter and Documentation Research Protocol
- LG-D02 — Authoritative Source Register

---

# 1. Purpose

This document translates the Egyptian legal and regulatory sources identified in D02 into preliminary:

- product constraints;
- functional requirements;
- security requirements;
- privacy requirements;
- records requirements;
- prohibited workflows;
- human-review obligations;
- architecture consequences;
- legal questions requiring specialist opinions;
- launch-blocking conditions.

This document is not a final legal opinion.

Final legal conclusions must be issued or approved by qualified Egyptian legal professionals after reviewing:

1. the authoritative Arabic legal texts;
2. all applicable amendments;
3. Lex Gate’s legal structure and registrations;
4. the firm’s actual practice areas;
5. the categories of clients and matters handled;
6. applicable Bar Association rules and decisions;
7. current regulator procedures;
8. Lex Gate’s tax and employment circumstances.

---

# 2. Analysis Status and Reliability

## 2.1 Current Status

The analysis is classified as:

> **Preliminary and suitable for architecture safeguards, but not yet sufficient for production legal sign-off.**

The legal principles in this document should be implemented conservatively. Where the precise legal rule is uncertain, the platform should default to:

- reduced data collection;
- narrower access;
- explicit human approval;
- no external disclosure;
- no automated legal conclusion;
- no irreversible action;
- no unverified government integration.

---

## 2.2 Source Limitation

Some article-level analysis below relies on:

- publicly available reproductions of Egyptian legislation;
- a publicly available English translation of Ministerial Decision No. 816 of 2025;
- official regulator explanations;
- professional legal commentary.

The Arabic text published in the Official Gazette or Egyptian Gazette remains controlling.

The publicly available translation of Decision No. 816 states that it was published on 1 November 2025 and effective from 2 November 2025. Professional commentary reports a one-year statutory regularization period extending approximately to 1 November 2026, but this deadline must be confirmed from the controlling Arabic text and competent authority before it is treated as final.

---

# 3. Governing Legal Posture

Lex Gate should treat the platform as:

1. a legal-practice system processing highly confidential information;
2. a personal-data controller for many processing activities;
3. a possible processor in limited client-directed arrangements;
4. an employer or workplace system operator;
5. an issuer or preparer of financial and tax records;
6. an electronic-records custodian;
7. a public presenter of regulated professional services;
8. a user of external technology processors and cloud providers;
9. a potential handler of sensitive personal data;
10. a system supporting—but not replacing—lawyers’ professional judgment.

The platform must not be designed as an ordinary customer-relationship-management system with legal terminology added afterward.

---

# 4. Legal Entity and Professional Authorization

## 4.1 Confirming Lex Gate’s Legal Identity

The system cannot safely issue:

- engagement documents;
- invoices;
- tax records;
- signatures;
- seals;
- legal notices;
- public representations;
- employment records;

until Lex Gate’s exact legal and professional identity is established.

### Required inputs

- official Arabic name;
- approved English name;
- legal form;
- Bar registration status;
- firm or office registration;
- tax registration;
- commercial registration, if applicable;
- registered office;
- authorized signatories;
- lawyers associated with the office;
- permitted use of the “Lex Gate” trade or professional name;
- ownership of domains and social-media accounts.

---

## 4.2 Lawyer Status and Permitted Work

The working consolidated reproduction of Law No. 17 of 1983 distinguishes among levels of lawyer registration and defines different permissions for trainee, first-instance, appellate, and Court of Cassation lawyers. It also regulates how legal practice may be organized and limits combinations between legal practice and certain other work. These provisions must be verified against the current official consolidated law before the permission model is finalized.

### Preliminary requirements

**LEG-PROF-001**  
Every lawyer account shall record the lawyer’s verified professional-registration level.

**LEG-PROF-002**  
The platform shall not represent a person as a lawyer until their registration has been verified and approved by an authorized Lex Gate administrator.

**LEG-PROF-003**  
The system shall distinguish at minimum:

- trainee lawyer;
- lawyer admitted before first-instance courts;
- lawyer admitted before appellate courts;
- lawyer admitted before the Court of Cassation;
- non-practising lawyer;
- non-lawyer employee;
- external lawyer;
- consultant whose professional capacity has been separately verified.

**LEG-PROF-004**  
A user’s system permissions shall not imply that the user is legally authorized to perform an act.

**LEG-PROF-005**  
Document-signing, court-appearance, formal-opinion, and supervisory permissions shall be separately modeled.

**LEG-PROF-006**  
A trainee shall not be permitted to issue a final legal opinion, approve a final legal document, or be publicly represented as having authority beyond the verified registration level.

**LEG-PROF-007**  
Every public lawyer profile shall display only verified titles, admission levels, qualifications, and practice descriptions.

---

# 5. Professional Secrecy and Client Confidentiality

## 5.1 Legal Foundation

The working reproduction of the Legal Profession Law includes professional-secrecy obligations in the lawyer’s oath and requires lawyers to preserve information disclosed by their clients. It also restricts testimony concerning professionally obtained information, subject to limited circumstances.

Privacy compliance does not replace professional secrecy. A disclosure might be technically permitted under a general privacy rule while remaining prohibited or inappropriate under professional obligations.

---

## 5.2 Confidentiality Classification

Every data object must carry a confidentiality classification.

### Minimum classifications

1. Public
2. Prospective-client confidential
3. Client confidential
4. Matter confidential
5. Restricted matter
6. Lawyer work product
7. Privileged or legally protected
8. Finance restricted
9. Human-resources restricted
10. Security restricted
11. Regulatory or legal-hold material

---

## 5.3 Preliminary Requirements

**LEG-CONF-001**  
Client and matter information shall be inaccessible by default to users who are not assigned to the matter.

**LEG-CONF-002**  
Firm-wide employment shall not automatically grant firm-wide matter access.

**LEG-CONF-003**  
Internal notes shall be stored separately from client-visible updates.

**LEG-CONF-004**  
Client visibility shall require an explicit publication or sharing decision.

**LEG-CONF-005**  
A user sharing a document shall select:

- recipient;
- purpose;
- access period;
- download permission;
- forwarding restriction, where technically supported;
- whether the document is final;
- whether client acknowledgement is required.

**LEG-CONF-006**  
The system shall record every view, download, export, print request, link creation, and external disclosure involving restricted matter information.

**LEG-CONF-007**  
Administrators shall not receive unrestricted substantive access merely because they administer the system.

**LEG-CONF-008**  
Technical support access to production client data shall be time-limited, purpose-limited, approved, logged, and subject to confidentiality obligations.

**LEG-CONF-009**  
Search results, dashboards, notification previews, and activity feeds shall not expose restricted information to unauthorized users.

**LEG-CONF-010**  
Matter names may themselves be confidential and shall not be exposed in calendars, notifications, logs, or reports without authorization.

**LEG-CONF-011**  
The platform shall support especially restricted matters whose existence is visible only to a defined access group.

**LEG-CONF-012**  
No client or matter data shall be disclosed to an AI provider unless the provider, processing purpose, transfer route, contractual basis, and confidentiality controls are approved.

---

# 6. Conflict of Interest

## 6.1 Legal Foundation

The working consolidated reproduction states that a lawyer must not assist an opponent in the same or a connected dispute and generally must not represent conflicting interests. The prohibition extends to partners and lawyers working in the same office.

This creates a strong reason for office-wide conflict screening rather than screening only the lawyer who receives the enquiry.

---

## 6.2 Required Conflict Model

Conflict screening must cover:

- prospective clients;
- current clients;
- former clients;
- adverse parties;
- related companies;
- beneficial owners;
- directors and officers;
- witnesses;
- experts;
- family members where relevant;
- lawyers previously involved;
- related matters;
- affiliates and subsidiaries;
- alternative spellings and Arabic name variants.

---

## 6.3 Preliminary Requirements

**LEG-CFL-001**  
A formal matter shall not be opened until the conflict process has reached an approved state.

**LEG-CFL-002**  
The system shall support an emergency provisional opening with:

- restricted access;
- documented reason;
- approving lawyer;
- expiration deadline;
- mandatory conflict completion.

**LEG-CFL-003**  
Conflict searching shall support Arabic and English names, transliteration, common spelling variants, initials, and organization aliases.

**LEG-CFL-004**  
A conflict result shall not be automatically classified as cleared solely because an exact string match was not found.

**LEG-CFL-005**  
Potential conflicts shall require human legal assessment.

**LEG-CFL-006**  
Conflict decisions shall include:

- decision;
- reviewer;
- reason;
- source records reviewed;
- conditions;
- waivers, if legally permissible;
- approval evidence;
- review date.

**LEG-CFL-007**  
A rejected prospective client record shall be retained only to the extent legally and professionally justified, with restricted access and a defined retention rule.

**LEG-CFL-008**  
The platform shall prevent personnel involved in a conflict review from deleting or altering the underlying search evidence after the decision.

**LEG-CFL-009**  
Matter transfer, lawyer hiring, lawyer departure, merger, or office restructuring shall be capable of triggering renewed conflict analysis.

**LEG-CFL-010**  
“Ethical wall” functionality shall not be represented as curing a conflict unless Egyptian counsel confirms that the proposed arrangement is legally and professionally sufficient.

---

# 7. Client Communication and Matter Updates

## 7.1 Legal Foundation

The working reproduction of the Legal Profession Law requires a lawyer to inform the client about the stages of a case, communicate judgments, advise regarding an adverse judgment, and draw attention to appeal deadlines.

The system should support this duty without implying that an automated notification alone satisfies professional responsibility.

---

## 7.2 Preliminary Requirements

**LEG-COM-001**  
Each matter shall have a designated responsible lawyer.

**LEG-COM-002**  
Each court judgment or material procedural outcome shall create a review task for the responsible lawyer.

**LEG-COM-003**  
Client notification concerning a judgment shall not be generated as final legal advice without lawyer approval.

**LEG-COM-004**  
The platform shall record:

- what was communicated;
- to whom;
- by whom;
- through which channel;
- when it was sent;
- delivery state;
- acknowledgement state;
- related matter event.

**LEG-COM-005**  
Failure of email, SMS, portal, or messaging delivery shall create an escalation rather than silently marking the client as informed.

**LEG-COM-006**  
The system shall distinguish:

- informational update;
- request for information;
- legal advice;
- deadline notice;
- formal legal notice;
- engagement communication;
- billing communication.

**LEG-COM-007**  
Client-facing status labels shall be approved legal-service language and shall not expose internal strategy.

**LEG-COM-008**  
The platform shall not describe a case as “won,” “guaranteed,” “certain,” or equivalent before an authorized lawyer approves that language.

---

# 8. Public Website, Advertising, and Professional Presentation

## 8.1 Legal Foundation

The working consolidated reproduction of the Legal Profession Law states that a lawyer may not use advertising, inducement, intermediaries, or suggestions of real or alleged influence in practising the profession. It also restricts statements about pending matters that could affect proceedings. These provisions require confirmation against the official current law and any Bar decisions addressing websites and social media.

Because modern websites and social-media pages did not exist when the original law was enacted, an Egyptian professional-conduct opinion is essential before finalizing the public marketing strategy.

---

## 8.2 Preliminary Requirements

**LEG-MKT-001**  
Every public legal-service statement shall require approval by an authorized lawyer.

**LEG-MKT-002**  
The website shall not:

- guarantee outcomes;
- imply influence over courts, prosecutors, government bodies, or officials;
- use unverifiable “best lawyer” or “number one” claims;
- create false urgency;
- display invented testimonials;
- disclose client identities without documented authority;
- publish confidential case details;
- present automated information as individualized legal advice.

**LEG-MKT-003**  
Case studies shall require:

- confidentiality review;
- client-authority review;
- anonymization assessment;
- pending-proceeding assessment;
- responsible-lawyer approval.

**LEG-MKT-004**  
The system shall retain an approval history for public legal content.

**LEG-MKT-005**  
Public lawyer profiles shall not display unverified courts of admission, positions, awards, memberships, or specializations.

**LEG-MKT-006**  
Referral, affiliate, commission, or lead-purchase mechanisms involving non-lawyers shall remain prohibited pending specific Egyptian professional-conduct approval.

**LEG-MKT-007**  
Paid advertising and search-engine campaigns shall remain a controlled feature requiring written legal approval.

**LEG-MKT-008**  
Website analytics shall not expose prospective-client enquiry details to advertising platforms.

**LEG-MKT-009**  
No tracking pixel shall be placed on:

- consultation forms;
- client portal pages;
- document-upload pages;
- matter pages;
- billing pages;
- authentication pages.

**LEG-MKT-010**  
General legal information shall display an appropriate statement that it is informational and not a substitute for legal advice.

---

# 9. Engagement, Fees, Expenses, and Client Documents

## 9.1 Legal Foundation

The working reproduction states that lawyer fees are governed by the written agreement with the client, prohibits fees structured as an in-kind share of disputed rights, addresses expenses, and requires the lawyer at the end of an engagement to account for certain sums and return client documents subject to defined rules.

---

## 9.2 Preliminary Requirements

**LEG-ENG-001**  
No client shall be changed from “prospective” to “engaged” without an approved engagement record.

**LEG-ENG-002**  
The engagement record shall identify:

- client;
- represented parties;
- matter scope;
- exclusions;
- responsible lawyer;
- fee arrangement;
- expense handling;
- payment terms;
- communications method;
- authorization status;
- effective date;
- document version.

**LEG-ENG-003**  
Any scope expansion shall create a supplemental engagement approval.

**LEG-ENG-004**  
The system shall preserve every version of the engagement terms.

**LEG-ENG-005**  
Fee structures shall be selected from legally approved templates.

**LEG-ENG-006**  
The product shall not permit an in-kind ownership share in disputed rights as a standard fee option.

**LEG-ENG-007**  
Expenses charged to a client shall support documentary evidence and approval.

**LEG-ENG-008**  
At matter closure, the system shall generate a closing checklist covering:

- final status;
- client communication;
- outstanding deadlines;
- client funds or amounts;
- unpaid fees;
- documents to return;
- documents to retain;
- archive status;
- retention classification.

**LEG-ENG-009**  
Document-retention or lien rights shall not be automatically exercised by software.

**LEG-ENG-010**  
The system shall prevent document retention from causing a known legal deadline to be missed.

**LEG-ENG-011**  
A client document shall retain provenance indicating:

- provider;
- date received;
- original or copy;
- physical or electronic;
- current custodian;
- whether returned;
- return evidence.

---

# 10. Personal Data Protection

## 10.1 Current Regulatory Position

Law No. 151 of 2020 applies to personal data processed electronically within its statutory scope. Its 2025 Executive Regulations provide operational rules concerning licensing, consent, records, data-subject rights, retention, security, breach response, data-protection officers, sensitive data, children’s data, cross-border transfers, direct marketing, and processor obligations.

Lex Gate is likely to hold particularly sensitive data, including information concerning:

- criminal allegations and proceedings;
- family disputes;
- health;
- finances;
- employment;
- children;
- identity documents;
- addresses;
- communications;
- witnesses;
- victims;
- counterparties.

The precise statutory classification of each data type must be confirmed from the official Arabic definitions.

---

## 10.2 Privacy Governance

**PRV-GOV-001**  
Lex Gate shall maintain a data-processing inventory.

**PRV-GOV-002**  
Every processing activity shall record:

- purpose;
- data categories;
- data subjects;
- controller;
- processors;
- recipients;
- collection source;
- legal basis;
- consent status, where applicable;
- retention period;
- storage locations;
- international transfers;
- security classification.

**PRV-GOV-003**  
The production platform shall not launch until Lex Gate’s licensing, permit, registration, and data-protection-officer obligations have been assessed.

**PRV-GOV-004**  
The system shall store relevant regulator licence and permit identifiers with their effective and expiry dates.

**PRV-GOV-005**  
Privacy obligations shall be assigned to a named, authorized individual.

**PRV-GOV-006**  
The system shall support evidence required for annual or regulator-requested privacy reporting.

---

## 10.3 Notice and Consent

The translated regulations require clear notification of collection purposes and secure records concerning consent, its date and form, the categories collected, and the scope of use. They also distinguish service-related submission from use for additional purposes.

**PRV-CNS-001**  
Consent shall not be combined with general terms in a manner that hides an optional processing purpose.

**PRV-CNS-002**  
The system shall record:

- notice version;
- language;
- consent text;
- purpose;
- user;
- date and time;
- channel;
- affirmative action;
- withdrawal state.

**PRV-CNS-003**  
A consent for legal-service intake shall not automatically authorize:

- marketing;
- public testimonials;
- AI training;
- unrelated analytics;
- disclosure to unrelated third parties.

**PRV-CNS-004**  
Withdrawal shall be as operationally accessible as granting consent.

**PRV-CNS-005**  
Withdrawal shall not automatically delete information that Lex Gate must lawfully retain. Instead, the system shall document the applicable retention justification.

---

## 10.4 Data Minimization and Purpose Limitation

**PRV-DAT-001**  
Every form field shall have a documented purpose.

**PRV-DAT-002**  
Optional information shall be visibly distinguished from mandatory information.

**PRV-DAT-003**  
Prospective-client intake shall initially collect only what is needed for:

- basic contact;
- urgency;
- service routing;
- preliminary conflict screening;
- safe follow-up.

**PRV-DAT-004**  
Detailed evidence and identity documents shall not be requested through an unsecured public form.

**PRV-DAT-005**  
Data collected for a matter shall not be reused for marketing, model training, staff assessment, or unrelated research without separate approval.

---

## 10.5 Accuracy

The translated regulations require controllers to verify that collected data is accurate and appropriate to the stated purpose.

**PRV-ACC-001**  
The system shall distinguish:

- client-provided fact;
- staff-entered fact;
- allegation;
- third-party statement;
- lawyer conclusion;
- court-confirmed information;
- system-derived information.

**PRV-ACC-002**  
Correction shall not erase the historical record where preservation is legally or professionally necessary.

**PRV-ACC-003**  
Material corrections shall record the previous value, new value, reason, actor, date, and affected documents.

---

## 10.6 Data-Subject Rights

The translated regulations describe mechanisms for access, consent withdrawal, correction, modification, restriction, objection, and erasure requests.

**PRV-DSR-001**  
The platform shall provide an internal workflow for data-subject requests.

**PRV-DSR-002**  
A request shall record:

- requester identity;
- verification method;
- request type;
- scope;
- received date;
- assigned reviewer;
- legal restrictions;
- response deadline;
- decision;
- response evidence.

**PRV-DSR-003**  
No automated data-subject export shall disclose:

- another person’s data;
- privileged material;
- internal legal analysis;
- protected work product;
- investigation-sensitive information;
- information restricted by law.

**PRV-DSR-004**  
Every request shall receive legal review before substantive disclosure or erasure.

---

## 10.7 Retention and Erasure

The translated regulations require a defined retention period connected to collection purpose and contemplate erasure or de-identification when the purpose or legal reason expires.

**PRV-RET-001**  
Every record class shall have an approved retention rule.

**PRV-RET-002**  
“Keep forever” shall not be available as an ordinary default.

**PRV-RET-003**  
Retention shall account for:

- professional obligations;
- client rights;
- litigation;
- appeals;
- limitation periods;
- tax requirements;
- employment requirements;
- investigations;
- legal holds;
- contractual obligations.

**PRV-RET-004**  
Deletion shall be suspended by an active legal hold.

**PRV-RET-005**  
Deletion shall include production data, derived indexes, caches, previews, and scheduled backup expiry.

**PRV-RET-006**  
The platform shall produce evidence of deletion without retaining deleted substantive content unnecessarily.

---

## 10.8 Controller and Processor Records

The translated regulations require secure electronic records of processing, retention, security measures, processor contracts, cross-border data flow, and erasure or return following processing.

**PRV-PRO-001**  
Every vendor processing personal data shall have a processor record.

**PRV-PRO-002**  
The processor record shall include:

- legal entity;
- service;
- data categories;
- processing purpose;
- countries;
- subprocessors;
- security measures;
- retention;
- deletion;
- breach obligations;
- audit rights;
- contract;
- transfer authorization.

**PRV-PRO-003**  
A processor shall not add a subprocessor without the review mechanism required by Lex Gate’s approved contract.

**PRV-PRO-004**  
Vendor deletion or return of data shall be recorded at contract termination.

---

## 10.9 Data Breach

The translated regulations require notification to the Personal Data Protection Center within 72 hours of awareness and notification to affected data subjects within three business days after notifying the Center. The required breach register includes awareness time, nature, scale, consequences, corrective measures, and data-protection-officer details. These rules must be verified against the controlling Arabic text before incident procedures are finalized.

**PRV-BRE-001**  
The incident system shall record exact awareness time separately from incident occurrence time.

**PRV-BRE-002**  
Privacy incidents shall immediately notify the data-protection and security response roles.

**PRV-BRE-003**  
The 72-hour regulatory workflow shall be available even when investigation remains incomplete.

**PRV-BRE-004**  
Data-subject notification shall require legal approval but shall not be delayed solely for reputational reasons.

**PRV-BRE-005**  
Incident records shall be immutable after submission, with corrections recorded as supplements.

---

## 10.10 Sensitive Personal Data

The translated regulations require a licence or permit, written explicit consent where applicable, necessity, security controls, and special records for sensitive data.

**PRV-SEN-001**  
Sensitive-data fields shall be explicitly classified.

**PRV-SEN-002**  
Sensitive data shall receive:

- narrower access;
- stronger authentication;
- encrypted storage;
- restricted export;
- enhanced audit;
- shorter default retention where possible.

**PRV-SEN-003**  
Bulk export of sensitive data shall require enhanced approval.

**PRV-SEN-004**  
Search results shall suppress sensitive snippets unless the user has substantive matter access.

---

## 10.11 Children’s Data

The translated regulations specify guardian consent for children under 15 and a distinct mechanism for individuals between 15 and 18.

**PRV-CHD-001**  
The system shall record the child’s age or age range only where relevant and lawful.

**PRV-CHD-002**  
The system shall support guardian:

- identity;
- legal relationship;
- authority evidence;
- consent;
- withdrawal;
- restrictions.

**PRV-CHD-003**  
A guardian’s portal access shall not automatically reveal information where the guardian’s interests may conflict with those of the child.

**PRV-CHD-004**  
Family, criminal, guardianship, and abuse-related matters involving children shall require specialized access and disclosure rules.

---

## 10.12 Cross-Border Data Transfers

The translated regulations describe licensing or permitting, data-subject consent, adequacy considerations, specified destination countries, and technical protection for cross-border transfers.

**PRV-XBR-001**  
No production hosting location shall be selected without transfer analysis.

**PRV-XBR-002**  
The platform shall maintain a country-level data-flow map.

**PRV-XBR-003**  
A cloud provider’s contractual location shall not be treated as the only processing location.

**PRV-XBR-004**  
Support, backup, telemetry, content-delivery, email, AI, and logging services shall be included in transfer analysis.

**PRV-XBR-005**  
A new processing country shall require privacy review before activation.

**PRV-XBR-006**  
The production architecture shall support Egyptian or approved-region hosting if required by legal analysis.

---

## 10.13 Direct Electronic Marketing

The translated regulations describe a regulator licence, explicit consent, purpose limitation, sender identification, and withdrawal mechanisms for direct electronic marketing.

**PRV-MKT-001**  
Legal-service communications and marketing communications shall be separate categories.

**PRV-MKT-002**  
A client shall not be subscribed to marketing merely because they engaged Lex Gate.

**PRV-MKT-003**  
Every marketing message shall identify the sender and provide a withdrawal method.

**PRV-MKT-004**  
Marketing must remain disabled until Lex Gate’s licensing and professional-advertising position is approved.

---

# 11. Security and Cybercrime

## 11.1 Legal Context

Law No. 175 of 2018 on combating information-technology crimes is in force. Its application to particular Lex Gate functions, hosting arrangements, administrator roles, and potential service-provider obligations requires review of the law and its executive regulations.

The privacy regulations also require technical and organizational measures supporting confidentiality, restoration, availability, containment, and protection against unauthorized access.

---

## 11.2 Preliminary Requirements

**SEC-LEG-001**  
The system shall implement least privilege and deny-by-default authorization.

**SEC-LEG-002**  
Lawyers, employees, clients, administrators, integrations, and support personnel shall use distinct security roles.

**SEC-LEG-003**  
Multifactor authentication shall be required for:

- all employees;
- lawyers;
- administrators;
- finance personnel;
- external professionals;
- clients accessing highly sensitive matters.

**SEC-LEG-004**  
Sensitive administrative actions shall require step-up authentication.

**SEC-LEG-005**  
Security logs shall record:

- actor;
- action;
- target;
- decision;
- timestamp;
- session;
- device or network context;
- authorization rule;
- override reason.

**SEC-LEG-006**  
Logs shall not unnecessarily contain document contents, passwords, tokens, or complete identity numbers.

**SEC-LEG-007**  
The system shall detect and alert on:

- repeated failed logins;
- unusual exports;
- bulk downloads;
- permission escalation;
- access to unrelated matters;
- disabled-user activity;
- suspicious token use.

**SEC-LEG-008**  
Production data shall be encrypted in transit and at rest.

**SEC-LEG-009**  
Secrets shall not be stored in source code, prompts, issue descriptions, or client-side applications.

**SEC-LEG-010**  
Backups shall be encrypted and restoration-tested.

**SEC-LEG-011**  
A person leaving Lex Gate shall have system access revoked independently from the legal completion of employment procedures.

**SEC-LEG-012**  
The system shall support evidence preservation following a suspected offence without permitting ordinary administrators to alter preserved records.

---

# 12. Electronic Records, Signatures, and Seals

## 12.1 Regulatory Distinction

ITIDA regulates electronic signatures under Law No. 15 of 2004. Its official guidance distinguishes a signature associated with a natural person from an electronic seal associated with a legal person and identifies licensed providers. ITIDA states that electronic signatures receive legal effect comparable to handwritten signatures when the statutory conditions are satisfied.

A typed name, uploaded image, one-time password, or acceptance checkbox is not automatically equivalent to a regulated electronic signature.

---

## 12.2 Signature Classes

The system shall distinguish:

1. acknowledgement;
2. internal approval;
3. basic electronic acceptance;
4. verified electronic acceptance;
5. regulated electronic signature;
6. regulated electronic seal;
7. wet-ink document;
8. notarized or officially authenticated document.

---

## 12.3 Preliminary Requirements

**LEG-SIG-001**  
Every signed or approved record shall identify its signature class.

**LEG-SIG-002**  
The interface shall not label a document “digitally signed” unless the applicable regulated signature process was used.

**LEG-SIG-003**  
Regulated signatures or seals shall use an ITIDA-licensed provider where Egyptian law requires or recognizes that framework.

**LEG-SIG-004**  
The system shall preserve:

- signer identity;
- certificate;
- certificate status;
- provider;
- signature time;
- validation result;
- signed document hash;
- signature policy;
- revocation evidence;
- timestamp evidence, where used.

**LEG-SIG-005**  
The document presented for signature shall be cryptographically identical to the document preserved after signature.

**LEG-SIG-006**  
Modification after signature shall invalidate or clearly supersede the prior signature state.

**LEG-SIG-007**  
Engagement-letter acceptance methods shall be selected only after document-class legal review.

**LEG-SIG-008**  
Internal approval shall never be displayed externally as the client’s signature.

---

# 13. Digital Evidence and Record Integrity

The translated privacy regulations set conditions concerning collection, extraction, preservation, documentation, and integrity of digital evidence derived from personal data. These provisions do not make ordinary application logs automatically admissible evidence, but they reinforce the need for integrity, provenance, and documented handling.

**LEG-EVD-001**  
The system shall preserve original uploaded files.

**LEG-EVD-002**  
Conversion, compression, text extraction, redaction, or preview generation shall create a derivative rather than replace the original.

**LEG-EVD-003**  
Every file shall record:

- cryptographic hash;
- source;
- uploader;
- acquisition date;
- file type;
- size;
- custody state;
- derivative relationships;
- access history.

**LEG-EVD-004**  
Evidence export shall include a manifest.

**LEG-EVD-005**  
The system shall support chain-of-custody records but shall not claim that software-generated custody records alone establish legal admissibility.

**LEG-EVD-006**  
Legal-hold records shall be tamper evident.

**LEG-EVD-007**  
System clocks shall be synchronized and monitored.

**LEG-EVD-008**  
Date and time displays shall include sufficient timezone context for legally significant events.

---

# 14. Tax, Electronic Invoices, and Receipts

## 14.1 Current Position

The Egyptian Tax Authority states that lawyers and other liberal professionals must use the electronic-invoice system for transactions with entities registered with the Tax Authority, while transactions with final consumers are subject to the electronic-receipt system according to applicable rollout phases. The Authority provides separate integration guides, registration materials, coding guidance, and obligation decisions.

Lex Gate’s exact tax obligations depend on its legal form, tax registration, clients, transactions, and inclusion in current electronic-receipt obligation decisions.

---

## 14.2 Preliminary Requirements

**TAX-INV-001**  
The platform shall distinguish:

- quotation;
- engagement fee schedule;
- pro forma document;
- tax invoice;
- electronic invoice;
- receipt;
- electronic receipt;
- credit note;
- payment confirmation.

**TAX-INV-002**  
A PDF created by Lex Gate shall not be described as an ETA electronic invoice unless it has been validly submitted and accepted through the applicable system.

**TAX-INV-003**  
The system shall preserve the official ETA identifiers and response states.

**TAX-INV-004**  
Tax documents shall be immutable after valid issuance. Corrections shall follow an approved credit, cancellation, or replacement workflow.

**TAX-INV-005**  
Tax calculations and service codes shall come from accountant-approved configurations.

**TAX-INV-006**  
The system shall support B2B and B2C classification but shall not infer tax treatment solely from the client’s display name.

**TAX-INV-007**  
Payments shall be reconciled to invoices and receipts without rewriting their issued values.

**TAX-INV-008**  
ETA integration shall be isolated behind a versioned adapter to accommodate specification changes.

**TAX-INV-009**  
Production activation shall require written confirmation from Lex Gate’s Egyptian accountant or tax adviser.

---

# 15. Employment and Workforce Records

## 15.1 Current Position

Egypt’s Ministry of Labour lists Law No. 14 of 2025 as the current Labour Law and publishes related implementation materials. The Ministry has also issued implementation decisions addressing specific processes, including formal approval mechanisms for employee resignations, demonstrating that employment workflows may depend on ministerial procedures as well as the statute.

---

## 15.2 Preliminary Requirements

**EMP-LEG-001**  
The first release shall manage operational staff access and assignments, not full payroll or statutory HR compliance.

**EMP-LEG-002**  
Employment status and system-access status shall be distinct fields.

**EMP-LEG-003**  
Access may be suspended immediately for security reasons without the system representing that employment has legally ended.

**EMP-LEG-004**  
The system shall retain evidence of:

- account creation;
- role approval;
- confidentiality acknowledgement;
- device assignment;
- permission changes;
- suspension;
- revocation;
- return of assets.

**EMP-LEG-005**  
Resignation, dismissal, leave, working-hours, payroll, and disciplinary workflows shall not be automated until reviewed against Law No. 14 of 2025 and applicable decisions.

**EMP-LEG-006**  
Employee monitoring shall be limited, transparent, necessary, and approved.

**EMP-LEG-007**  
Productivity analytics shall not automatically determine discipline, compensation, promotion, or termination.

**EMP-LEG-008**  
A lawyer’s Bar status and employment or office association shall be maintained separately.

---

# 16. Court Procedures, Deadlines, and Government Services

## 16.1 Court Services

The Ministry of Justice’s official portal provides public services such as hearing-roll enquiries, lawsuit enquiries, appeal-status enquiries, and matter-status enquiries. This research did not identify an official public API authorizing automated Lex Gate access, so these services must initially be treated as human-operated external services.

---

## 16.2 Criminal Procedure Transition

The Presidency states that the new Criminal Procedure Law issued in November 2025 will take effect on **1 October 2026**. The platform must therefore support a transition between the current and new procedural regimes.

---

## 16.3 Preliminary Requirements

**LEG-CRT-001**  
Every procedural rule shall have:

- jurisdiction;
- court or authority;
- matter type;
- effective-from date;
- effective-to date;
- legal source;
- reviewer;
- version.

**LEG-CRT-002**  
A deadline shall never be stored only as a date. It shall record:

- legal event;
- triggering event;
- governing rule;
- calculation;
- responsible lawyer;
- review status;
- source;
- timezone;
- exceptions;
- final approved deadline.

**LEG-CRT-003**  
Machine-calculated deadlines shall be labeled provisional until confirmed by an authorized lawyer.

**LEG-CRT-004**  
A changed hearing or filing date shall not overwrite the previous value.

**LEG-CRT-005**  
Critical deadlines shall require redundant reminders and escalation.

**LEG-CRT-006**  
Closing a task shall not automatically close the legal deadline.

**LEG-CRT-007**  
No court integration shall be marked “automatic” until an official interface, permission, authentication mechanism, and terms of use are verified.

**LEG-CRT-008**  
Manual court-status entries shall record:

- source;
- person who checked;
- date and time;
- screenshot or document where appropriate;
- confidence;
- required follow-up.

**LEG-CRT-009**  
The system shall support separate procedural rule versions before and after 1 October 2026.

**LEG-CRT-010**  
Matters spanning the transition shall require lawyer review rather than automatic migration to the new procedural regime.

---

# 17. Consumer Protection

Law No. 181 of 2018 and Prime Ministerial Decree No. 822 of 2019 establish Egypt’s current consumer-protection framework. The extent to which each provision applies to regulated legal services and particular client relationships requires legal analysis.

Pending that analysis, the platform should follow conservative transparency rules.

**LEG-CNS-001**  
Public service descriptions shall be accurate and understandable.

**LEG-CNS-002**  
Fees shall not be hidden behind misleading interface design.

**LEG-CNS-003**  
The platform shall provide a clear complaint route.

**LEG-CNS-004**  
Promotional content shall not include false scarcity, guaranteed results, or fabricated social proof.

**LEG-CNS-005**  
Online engagement shall provide the client with a durable copy of the agreed terms.

**LEG-CNS-006**  
Refund, cancellation, and termination language shall be lawyer- and accountant-approved.

---

# 18. Artificial Intelligence and Automated Assistance

## 18.1 Legal and Professional Position

The translated privacy regulations specifically address processing personal data for AI training and emerging technologies, requiring adherence to recognized principles and avoidance of harm. Professional secrecy, conflict rules, accuracy, data transfers, and lawyer responsibility impose additional constraints.

The platform must distinguish between assisting a lawyer and replacing the lawyer’s professional decision.

---

## 18.2 Permitted Initial AI Categories

Subject to privacy and security approval:

- internal search;
- document classification;
- extraction of dates and entities;
- draft summarization;
- suggested task creation;
- duplicate detection;
- translation assistance;
- transcription;
- internal draft generation;
- retrieval of approved firm knowledge.

---

## 18.3 Prohibited or Blocked AI Categories

Until separately approved:

- autonomous client advice;
- autonomous conflict clearance;
- final legal opinions;
- autonomous filing;
- prediction presented as a reliable case outcome;
- automated acceptance or rejection of clients;
- automatic deadline approval;
- unsupervised final document generation;
- training external models on client data;
- sending complete matter repositories to public AI services;
- automated employee discipline;
- undisclosed AI impersonation of a lawyer.

---

## 18.4 Preliminary Requirements

**AI-GOV-001**  
AI output shall be labeled as machine-generated or machine-assisted internally.

**AI-GOV-002**  
A named lawyer shall approve every client-facing legal output materially generated by AI.

**AI-GOV-003**  
AI output shall not silently overwrite lawyer-authored text.

**AI-GOV-004**  
The system shall preserve:

- model;
- provider;
- version;
- prompt or instruction reference;
- source documents;
- user;
- output;
- review;
- approval;
- final changes.

**AI-GOV-005**  
Client data shall not be used to train or improve a provider’s general models.

**AI-GOV-006**  
AI providers shall undergo processor, transfer, confidentiality, security, and retention review.

**AI-GOV-007**  
AI-generated citations shall be verified against the cited source before use.

**AI-GOV-008**  
The platform shall prevent AI from treating an allegation as an established fact.

**AI-GOV-009**  
High-risk AI features shall have a complete non-AI fallback workflow.

**AI-GOV-010**  
AI functionality may be disabled per client, matter, document, user role, or data class.

---

# 19. Mandatory Audit Events

The following actions must create durable audit events:

- user creation;
- lawyer verification;
- login and failed login;
- multifactor change;
- password or account recovery;
- role change;
- matter-access grant or removal;
- ethical-wall change;
- client portal invitation;
- document view or export;
- document replacement;
- client-visible publication;
- deadline creation or change;
- conflict decision;
- engagement approval;
- fee change;
- invoice issuance;
- payment adjustment;
- signature;
- retention change;
- deletion;
- legal hold;
- privacy request;
- incident;
- AI processing;
- administrator override.

Audit records shall record the event without unnecessarily reproducing the confidential content.

---

# 20. Prohibited Workflows

The following workflows are prohibited in the initial system:

1. creating a matter without a conflict status;
2. giving every lawyer access to every matter;
3. exposing internal notes in the client portal;
4. treating a checkbox as a regulated electronic signature;
5. automatically deleting matter data following a privacy request;
6. using client data for external AI training;
7. publishing case information without approval;
8. promising legal outcomes;
9. automatically submitting court documents;
10. scraping government systems without verified authority;
11. overwriting issued invoices;
12. calculating final legal deadlines without lawyer confirmation;
13. allowing administrators to read all client files by default;
14. sending sensitive information through ordinary public enquiry forms;
15. using advertising pixels inside the client portal;
16. auto-approving conflicts based on name matching;
17. using foreign legal templates without Egyptian review;
18. making employee decisions solely from automated scoring;
19. claiming certification or regulatory compliance not actually obtained;
20. launching production before privacy licensing and transfer obligations are assessed.

---

# 21. Required Specialist Legal Opinions

The following written opinions or approvals are required.

## OP-001 — Lex Gate Legal Structure

Confirm:

- legal form;
- professional registration;
- permitted firm name;
- authorized signatories;
- ownership structure;
- permissible staff and lawyer relationships.

## OP-002 — Public Website and Marketing

Confirm:

- permitted website content;
- lawyer profiles;
- practice-area descriptions;
- testimonials;
- case studies;
- paid advertising;
- social-media conduct;
- referrals and commissions.

## OP-003 — Privacy Applicability

Confirm:

- controller and processor status;
- exemptions;
- licensing and permits;
- data-protection officer;
- sensitive data;
- children;
- breach procedures;
- regulatory deadline.

## OP-004 — Cross-Border Hosting

Confirm:

- permissible countries;
- licences or permits;
- consent requirements;
- cloud-provider structure;
- remote support;
- backups;
- AI processing.

## OP-005 — Engagement and Electronic Acceptance

Confirm which documents may use:

- click acceptance;
- one-time-password verification;
- electronic signature;
- electronic seal;
- wet ink;
- notarization or official authentication.

## OP-006 — Records Retention

Confirm retention and destruction rules for:

- prospective clients;
- rejected enquiries;
- client files;
- court matters;
- criminal matters;
- family matters;
- financial records;
- communications;
- employee records;
- audit logs.

## OP-007 — Conflict Procedures

Confirm:

- office-wide scope;
- former clients;
- prospective clients;
- affiliates;
- waivers;
- ethical walls;
- lawyer transfers.

## OP-008 — Tax and Billing

Confirm:

- B2B invoices;
- B2C receipts;
- VAT;
- withholding;
- retainers;
- deposits;
- instalments;
- expenses;
- refunds;
- ETA integration.

## OP-009 — AI Use

Confirm permitted uses, disclosure requirements, professional review, confidentiality, and provider conditions.

## OP-010 — Court and Deadline Workflows

Confirm procedural classifications, calculation rules, authority sources, transition handling, and acceptable use of government services.

---

# 22. Launch-Blocking Conditions

Production processing of real client data is blocked until:

- Lex Gate’s legal identity is verified;
- the current Legal Profession Law is reviewed;
- privacy licensing and DPO requirements are resolved;
- hosting and cross-border processing are approved;
- security architecture passes review;
- matter-level authorization is implemented;
- conflict screening is operational;
- client-visible publication controls are operational;
- incident response is documented and tested;
- retention rules are approved;
- tax workflows are approved;
- engagement acceptance is approved;
- backup restoration is tested;
- audit logs are verified;
- staff confidentiality and access procedures are approved.

---

# 23. Preliminary Compliance Priority

## Priority 0 — Architecture-Critical

- confidentiality;
- matter-level access;
- conflict screening;
- privacy licensing;
- cross-border hosting;
- sensitive data;
- auditability;
- breach response;
- signature classification;
- effective-dated procedural rules.

## Priority 1 — Required Before Client Portal

- identity verification;
- client visibility;
- secure messaging;
- privacy notices;
- consent evidence;
- data-subject requests;
- document provenance;
- engagement approval;
- accessibility.

## Priority 2 — Required Before Billing

- legal entity data;
- accountant-approved fee model;
- ETA status;
- electronic invoice and receipt workflows;
- payment reconciliation;
- immutable tax records.

## Priority 3 — Required Before AI

- approved providers;
- processor agreements;
- transfer approval;
- data classifications;
- model audit;
- human review;
- matter-level AI controls;
- non-training guarantees.

---

# 24. D03 Approval Criteria

D03 may receive provisional approval when:

- an Egyptian legal reviewer is appointed;
- the current legal-profession rules are confirmed;
- privacy obligations are formally assessed;
- the ten specialist-opinion questions have owners;
- the prohibited workflows are accepted;
- launch-blocking conditions are accepted;
- the preliminary legal requirements are entered into D18;
- disputed interpretations are explicitly marked;
- architecture work adopts the conservative controls in this document.

D03 shall not receive final approval until the appointed reviewers sign the relevant legal domains.

---

# 25. Approval Record

## Prepared By

Name: ______________________________  
Role: ______________________________  
Date: ______________________________

## Egyptian Professional-Conduct Reviewer

Name: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Conditions: ______________________________

## Egyptian Privacy Reviewer

Name: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Conditions: ______________________________

## Egyptian Tax Reviewer

Name: ______________________________  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Conditions: ______________________________

## Project Sponsor

Name: Ahmed Elshazlly  
Role: Project Sponsor / Lex Gate Owner  
Decision: Approved / Conditional / Rejected  
Date: ______________________________  
Comments: ______________________________

---

# Appendix A — Legal Constraint Summary

| Domain | Primary product consequence |
|---|---|
| Professional status | Verify each lawyer and limit actions by admission level |
| Confidentiality | Matter-level, deny-by-default access |
| Conflicts | Office-wide screening before engagement |
| Client communication | Human-approved updates and deadline advice |
| Marketing | Controlled content; no inducement, guarantees, or implied influence |
| Fees | Written approved engagement and accountant-controlled billing |
| Privacy | Processing inventory, licences, DPO, rights, retention, breach controls |
| Sensitive data | Explicit classification and enhanced security |
| Children | Guardian and conflict-sensitive access rules |
| Cross-border | Country-level data-flow approval |
| Signatures | Distinguish acknowledgement from regulated signature and seal |
| Evidence | Preserve originals, provenance, hashes, and custody |
| Tax | ETA-compatible invoice and receipt workflows |
| Employment | Separate employment decisions from system-access security |
| Courts | Human verification and effective-dated procedural rules |
| AI | Lawyer-in-the-loop and no external training on client data |

---

# Appendix B — Governing Design Principle

Where legal uncertainty remains, the platform shall:

> expose the uncertainty to the responsible lawyer, preserve the evidence, require an explicit decision, and prevent automation from converting an assumption into an irreversible legal act.