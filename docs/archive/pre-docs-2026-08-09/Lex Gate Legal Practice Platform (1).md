# Lex Gate Legal Practice Platform  
## D02 — Authoritative Source Register

**Document ID:** LG-D02  
**Document Title:** Authoritative Source Register  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.1  
**Status:** Initial Controlled Register  
**Classification:** Confidential — Internal Project Documentation  
**Effective Date:** 6 August 2026  
**Parent Document:** LG-D01 — Project Charter and Documentation Research Protocol

---

# 1. Purpose

This document establishes the controlled register of legal, regulatory, technical, operational, and research sources that may be used to derive requirements for the Lex Gate Legal Practice Platform.

It is intended to prevent:

- requirements being based on outdated legislation;
- reliance on unofficial translations;
- silent use of foreign legal assumptions;
- confusion between enacted law and professional commentary;
- use of obsolete technical standards;
- unsupported assumptions about courts or government integrations;
- AI-generated legal citations being accepted without verification;
- later implementers changing the project’s legal or technical baseline.

D02 is a living controlled document.

It records sources, but it does not by itself provide the final legal interpretation of those sources. Detailed interpretation and system consequences will be developed in:

- **D03 — Egyptian Legal and Regulatory Analysis**;
- **D08 — Matter Lifecycle and Standard Operating Procedures**;
- **D11 — Security Architecture and Threat Model**;
- **D12 — Privacy Engineering Specification**;
- **D14 — Records and Document Management Specification**.

---

# 2. Source-Control Principles

## 2.1 Arabic Primary Text Controls

Where an Egyptian law, regulation, decision, circular, or official specification was issued in Arabic:

- the Arabic text is controlling;
- an English translation is informational only;
- a translated provision may not be used for a legally material requirement without checking the Arabic text;
- material legal terminology must be added to the bilingual Lex Gate glossary;
- ambiguity must be escalated rather than silently resolved by product or engineering personnel.

---

## 2.2 Official Gazette Priority

The preferred evidence order is:

1. **الجريدة الرسمية — Official Gazette**;
2. **الوقائع المصرية — Egyptian Gazette**;
3. official ministry, regulator, authority, presidency, Parliament, or government repository;
4. recognized intergovernmental legal repository reproducing the Arabic text;
5. professional legal commentary;
6. academic research;
7. general secondary sources.

A secondary reproduction may help discovery but does not replace the gazette text where the matter affects legal obligations or professional liability.

---

## 2.3 No Automatic Reliance on Consolidated Texts

A website may describe legislation as “updated” or “according to the latest amendment.” That statement will not be accepted without:

- identifying every amendment;
- locating the amendment’s publication;
- verifying its effective date;
- confirming whether transitional provisions apply;
- creating a controlled consolidated working copy.

---

## 2.4 Temporal Applicability

Each source must distinguish:

- publication date;
- entry-into-force date;
- repeal date, where applicable;
- transitional period;
- future commencement;
- whether implementing regulations are required;
- whether implementation decisions remain outstanding.

This is particularly important for the new Egyptian Criminal Procedure Law, which was issued in November 2025 but is scheduled to take effect on **1 October 2026**. Until then, the currently applicable procedure regime and the future regime must be modeled separately.

---

# 3. Source Classification

## 3.1 Authority Class

### A1 — Egyptian Primary Authority

Official Gazette, Egyptian Gazette, official government legislation database, or authenticated government publication.

### A2 — Egyptian Regulator or Ministry Authority

Official guidance, technical specification, circular, decision register, service documentation, or regulator publication.

### B1 — Intergovernmental Legal Repository

Arabic legislation reproduced through an organization such as WIPO or the International Labour Organization.

### B2 — Recognized Technical Standard

Standards issued by organizations such as ISO, NIST, W3C, or OWASP.

### C1 — Qualified Professional Interpretation

Material issued by qualified Egyptian counsel, accountants, tax advisers, privacy specialists, or relevant professional organizations.

### C2 — Peer-Reviewed Research

Academic research used for product, organizational, accessibility, or usability decisions.

### D1 — Discovery Material

Firm interviews, existing procedures, screenshots, documents, templates, spreadsheets, messages, and operational observations.

### X — Unverified

A source identified but not yet verified sufficiently for requirement derivation.

---

## 3.2 Verification Status

### Verified

The source and issuing authority have been confirmed.

### Provisionally Verified

The law or source is confirmed, but an official gazette copy, amendment history, or exact article extraction remains outstanding.

### Pending Acquisition

The source is known but has not yet been obtained in an approved form.

### Pending Professional Review

The source has been located, but its application to Lex Gate requires specialist interpretation.

### Superseded

The source must be retained for history or migration but must not be used as the current baseline.

---

# 4. Mandatory Metadata for Every Source

Each D02 record must ultimately contain:

- source ID;
- Arabic title;
- English working title;
- issuing authority;
- jurisdiction;
- source class;
- legislation or decision number;
- publication date;
- effective date;
- gazette issue and page;
- amendment history;
- repeal or supersession status;
- official source location;
- controlled local copy location;
- cryptographic file hash;
- retrieval date;
- Arabic text status;
- English translation status;
- relevant articles or sections;
- legal reviewer;
- interpretation status;
- project areas affected;
- derived requirement IDs;
- next review date;
- notes and unresolved questions.

No legal source will be marked “complete” until these fields are substantially populated.

---

# 5. Core Egyptian Legal Source Register

## EG-CON-001 — Constitution of the Arab Republic of Egypt

**Arabic title:** دستور جمهورية مصر العربية  
**Source class:** A1  
**Authority:** Arab Republic of Egypt  
**Status:** Verified online; controlled PDF and amendment record pending  
**Priority:** Critical

The Presidency and House of Representatives provide official online access to the Constitution. The applicable controlled edition must include the 2019 constitutional amendments.

### Project relevance

The constitutional baseline may affect:

- privacy;
- confidentiality of communications;
- equality and non-discrimination;
- access to justice;
- right of defense;
- due process;
- legal profession guarantees;
- protection of homes and private life;
- judicial independence;
- accessibility and public-service principles.

### Required action

- obtain the official consolidated Arabic PDF;
- record the 2019 amendment instrument;
- extract only articles materially relevant to the platform;
- avoid turning broad constitutional principles into technical rules without legal interpretation.

---

## EG-LAW-001 — Legal Profession Law No. 17 of 1983

**Arabic title:** قانون المحاماة الصادر بالقانون رقم 17 لسنة 1983  
**Source class:** A1  
**Status:** Provisionally verified; official consolidated gazette copy required  
**Priority:** Critical

Available reproductions confirm Law No. 17 of 1983 as the principal law governing legal practice. Existing online consolidated copies indicate that the law has been amended, but the project must independently verify the complete amendment chain and current text.

### Project relevance

Potentially governs:

- who may practise law;
- lawyer registration and status;
- forms of legal practice;
- professional independence;
- lawyer-client relations;
- duties and restrictions;
- fees and engagement arrangements;
- lawyer records;
- confidentiality;
- professional discipline;
- use of titles;
- public presentation of lawyers and services;
- employment or association of lawyers within a firm.

### Required action

- obtain the original Official Gazette issue;
- obtain every amendment through 6 August 2026;
- construct an article-level consolidated working copy;
- obtain written Egyptian legal review;
- identify any Bar Association rules, codes, circulars, or resolutions supplementing the law.

### Restriction

No public website wording, lawyer-role model, fee workflow, or AI legal-service feature may be finalized before this source is reviewed.

---

## EG-PRV-001 — Personal Data Protection Law No. 151 of 2020

**Arabic title:** قانون حماية البيانات الشخصية رقم 151 لسنة 2020  
**Source class:** A1  
**Status:** Verified as enacted; official controlled copy and article extraction pending  
**Priority:** Critical

The law governs personal data processed electronically, wholly or partly, within its statutory scope. The State Information Service records its enactment and publication.

### Project relevance

- client and prospective-client information;
- employees and lawyers;
- counterparties, witnesses, experts, and family members;
- identity documents;
- criminal-case information;
- financial data;
- health-related information;
- minors’ data;
- client portal;
- direct marketing;
- analytics;
- recordings and communications;
- hosting and international transfers;
- breach handling;
- data-subject rights;
- controller and processor governance.

### Required action

- obtain the Official Gazette text;
- extract definitions, scope, exemptions, legal bases, rights, controller duties, processor duties, sensitive-data provisions, cross-border requirements, direct-marketing rules, security provisions, offences, and penalties;
- determine how legal-professional confidentiality interacts with data-subject rights and regulator processes;
- identify whether any Lex Gate processing falls within statutory exemptions.

---

## EG-PRV-002 — Executive Regulations of the Personal Data Protection Law

**Arabic title:** قرار وزير الاتصالات وتكنولوجيا المعلومات رقم 816 لسنة 2025 بإصدار اللائحة التنفيذية لقانون حماية البيانات الشخصية  
**Source class:** A1  
**Status:** Provisionally verified; official Egyptian Gazette copy required  
**Priority:** Critical

The located text identifies Ministerial Decree No. 816 of 2025 as the executive regulations for Law No. 151 of 2020. The text addresses operational requirements including collection, processing, retention, security, licensing or authorization, controller and processor obligations, breach handling, cross-border transfer, sensitive information, children’s information, and direct electronic marketing.

### Required action

- acquire the complete issue of الوقائع المصرية;
- verify publication and effective dates;
- verify transitional and compliance periods directly from the official text;
- verify the status and operation of the Personal Data Protection Center;
- identify current licensing, permit, registration, and data-protection-officer procedures;
- verify current forms, fees, portals, and official guidance;
- obtain specialist Egyptian privacy advice before production processing.

### Critical open question

The project must not rely solely on secondary claims regarding a final compliance deadline. The applicable transition date must be verified from the law, regulations, and competent authority.

---

## EG-CYB-001 — Anti-Cyber and Information Technology Crimes Law No. 175 of 2018

**Arabic title:** قانون رقم 175 لسنة 2018 في شأن مكافحة جرائم تقنية المعلومات  
**Source class:** A1/B1  
**Status:** Primary law verified through recognized repositories; official gazette copy pending  
**Priority:** Critical

The Arabic law is reproduced by WIPO Lex, and the Egyptian Financial Regulatory Authority also lists the legislation.

### Project relevance

- unauthorized system access;
- misuse of accounts;
- interference with data or systems;
- service-provider obligations;
- digital evidence;
- log and data preservation;
- security incidents;
- account impersonation;
- unlawful publication or processing;
- administrator responsibilities;
- criminal liability arising from system misuse.

### Required action

- obtain the Official Gazette version;
- obtain Prime Ministerial Decree No. 1699 of 2020 issuing the executive regulations;
- identify provisions applicable to website administrators, service providers, hosting arrangements, log retention, and evidence preservation;
- map only counsel-approved interpretations to security and operational requirements.

---

## EG-ESG-001 — Electronic Signature Law No. 15 of 2004

**Arabic title:** قانون تنظيم التوقيع الإلكتروني وإنشاء هيئة تنمية صناعة تكنولوجيا المعلومات رقم 15 لسنة 2004  
**Source class:** A1/A2  
**Status:** Law and regulator authority verified; full legal package pending  
**Priority:** Critical

ITIDA states that electronic-signature regulation and oversight fall within its authority under Law No. 15 of 2004. ITIDA distinguishes a digital signature for a natural person from an electronic seal for a legal person.

### Project relevance

- engagement documents;
- lawyer approvals;
- client acknowledgements;
- issued letters;
- invoices;
- formal authorizations;
- legal-person seals;
- evidentiary integrity;
- document validation;
- integration with licensed trust-service providers.

### Required action

- obtain the law and its executive regulations;
- obtain current ITIDA technical rules;
- identify licensed electronic-signature providers;
- distinguish regulated signature, electronic seal, typed acceptance, checkbox acknowledgement, one-time-password confirmation, and internal approval;
- determine which Lex Gate document types require which level of signature.

### Restriction

The product must not use the term “legally signed” merely because a user clicked a button or uploaded a signature image.

---

## EG-EVD-001 — Evidence in Civil and Commercial Matters Law No. 25 of 1968

**Arabic title:** قانون الإثبات في المواد المدنية والتجارية رقم 25 لسنة 1968  
**Source class:** A1/B1  
**Status:** Primary law verified; current consolidated edition required  
**Priority:** Critical

The law is available in Arabic through WIPO Lex and in Egyptian legal reproductions.

### Project relevance

- authenticity and evidentiary weight;
- written evidence;
- electronic documents;
- document copies;
- timestamps;
- correspondence records;
- document alteration;
- audit histories;
- signature evidence;
- export and preservation of system records.

### Required action

- obtain all amendments;
- analyze the relationship between this law and the electronic-signature framework;
- determine evidentiary requirements for exported messages, logs, documents, and client acknowledgements;
- establish a defensible record-authenticity model.

---

## EG-CIV-001 — Civil and Commercial Procedures Law No. 13 of 1968

**Arabic title:** قانون المرافعات المدنية والتجارية رقم 13 لسنة 1968  
**Source class:** A1  
**Status:** Pending acquisition  
**Priority:** Critical

### Project relevance

- court types;
- party and representative records;
- service and notification;
- filing and procedural events;
- hearings;
- judgments;
- appeals;
- execution;
- procedural deadlines;
- court-document classifications.

### Required action

- obtain the current consolidated Arabic text;
- identify every relevant amendment;
- extract procedural event types and deadline-calculation rules;
- validate terminology with practising Egyptian litigators.

---

## EG-CRM-001 — Current Criminal Procedure Law No. 150 of 1950

**Arabic title:** قانون الإجراءات الجنائية رقم 150 لسنة 1950  
**Source class:** A1  
**Status:** Current until superseded; controlled consolidated text pending  
**Priority:** Critical and transitional

### Project relevance

Lex Gate may need to manage criminal matters initiated or processed before the commencement of the new procedure law.

### Required action

- obtain the current consolidated text and applicable amendments;
- identify transition rules under Law No. 174 of 2025;
- maintain a versioned procedural ruleset;
- ensure that matters are associated with the governing procedure regime.

---

## EG-CRM-002 — New Criminal Procedure Law No. 174 of 2025

**Arabic title:** قانون رقم 174 لسنة 2025 بإصدار قانون الإجراءات الجنائية  
**Source class:** A1  
**Status:** Enacted; future effective date  
**Priority:** Critical

Law No. 174 of 2025 was published in Official Gazette Issue 45 bis (د) on 12 November 2025 and is scheduled to take effect on 1 October 2026. It replaces the prior criminal procedure framework subject to its transition provisions.

### Project relevance

- criminal matter workflows;
- investigation events;
- lawyer attendance;
- detention events;
- notices;
- appeals;
- remote or electronic procedures;
- deadline calculations;
- document and evidence handling;
- transition of existing cases.

### Required action

- obtain and archive the official PDF;
- extract all relevant transition provisions;
- compare old and new procedural event models;
- create an effective-dated rules system;
- test matters crossing 1 October 2026;
- verify implementing decisions and operational readiness before activation.

### Mandatory architecture consequence

Procedural rules must not be permanently embedded as unversioned application code.

---

## EG-CPC-001 — Consumer Protection Law No. 181 of 2018

**Arabic title:** قانون حماية المستهلك رقم 181 لسنة 2018  
**Source class:** A1/B1/A2  
**Status:** Verified  
**Priority:** High

The law and its Arabic text are available through WIPO Lex, while the Egyptian Consumer Protection Agency lists it within its legislation resources.

### Project relevance

Subject to legal confirmation of applicability to particular legal-service relationships:

- public service descriptions;
- material service information;
- fees and pricing disclosures;
- online contracting;
- complaint channels;
- advertising accuracy;
- misleading representations;
- client receipts and transaction records;
- distance-service information.

### Required action

- determine the extent to which legal services and particular client categories fall within the law;
- review website and engagement disclosures;
- distinguish professional-conduct requirements from consumer-law requirements.

---

## EG-CPC-002 — Executive Regulations of Consumer Protection Law

**Arabic title:** قرار رئيس مجلس الوزراء رقم 822 لسنة 2019  
**Source class:** A1/B1  
**Status:** Verified through recognized legal repository  
**Priority:** High

Prime Ministerial Decree No. 822 of 2019 issued the executive regulations of Law No. 181 of 2018.

### Required action

- acquire the official publication;
- extract rules relevant to electronic services, disclosures, advertising, contracting, complaints, and records;
- validate applicability to Lex Gate.

---

## EG-LAB-001 — Labour Law No. 14 of 2025

**Arabic title:** قانون العمل رقم 14 لسنة 2025  
**Source class:** A1/A2  
**Status:** Verified through Ministry of Labour  
**Priority:** High

The Ministry of Labour lists Law No. 14 of 2025 among its basic laws and publications. Ministry materials also show that a substantial body of implementing ministerial decisions accompanies the law.

### Project relevance

- employee records;
- lawyer and non-lawyer workforce administration;
- contracts;
- working schedules;
- leave;
- remote work;
- disciplinary records;
- resignation;
- employee documents;
- access termination;
- foreign employees;
- workplace safety;
- retention of employment records.

### Required action

- obtain the law and every implementation decision relevant to Lex Gate;
- confirm whether employed lawyers are subject to any special professional arrangements;
- separate operational staff management from full HR or payroll scope;
- consult an Egyptian employment lawyer.

---

## EG-SOC-001 — Social Insurance and Pensions Law No. 148 of 2019

**Arabic title:** قانون التأمينات الاجتماعية والمعاشات رقم 148 لسنة 2019  
**Source class:** A1  
**Status:** Pending consolidated verification  
**Priority:** Conditional

### Project relevance

Only relevant if the platform later manages:

- employment onboarding;
- insurance identifiers;
- employer records;
- contribution-supporting records;
- employment termination;
- workforce reporting.

### Required action

- obtain the current law and executive regulations;
- check amendments current through deployment;
- keep statutory social-insurance processing outside initial scope unless specifically approved.

---

## EG-TAX-001 — Income Tax Law No. 91 of 2005

**Arabic title:** قانون الضريبة على الدخل رقم 91 لسنة 2005  
**Source class:** A1  
**Status:** Pending current consolidated acquisition  
**Priority:** High

### Project relevance

- professional-fee records;
- withholding;
- income classification;
- invoices;
- expense records;
- tax reporting support.

### Required action

An Egyptian tax adviser must determine the treatment applicable to Lex Gate’s actual legal entity, partners, lawyers, employees, and clients.

---

## EG-TAX-002 — Value Added Tax Law No. 67 of 2016

**Arabic title:** قانون الضريبة على القيمة المضافة رقم 67 لسنة 2016  
**Source class:** A1  
**Status:** Pending current consolidated acquisition  
**Priority:** High

### Project relevance

- invoice calculations;
- service tax treatment;
- tax registration data;
- exemptions;
- credit notes;
- reporting.

### Restriction

The platform must not determine VAT treatment merely from a configurable percentage. Taxability, exemptions, effective dates, and documentary requirements require validated rules.

---

## EG-TAX-003 — Unified Tax Procedures Law No. 206 of 2020

**Arabic title:** قانون الإجراءات الضريبية الموحد رقم 206 لسنة 2020  
**Source class:** A1  
**Status:** Pending consolidated acquisition  
**Priority:** High

### Project relevance

- invoice and receipt obligations;
- electronic tax processes;
- retention;
- taxpayer records;
- submissions;
- authentication;
- penalties;
- audit support.

---

## EG-TAX-004 — Egyptian Electronic Invoice System

**Arabic title:** منظومة الفاتورة الإلكترونية  
**Source class:** A2  
**Authority:** Egyptian Tax Authority  
**Status:** Verified as operational regulatory guidance  
**Priority:** Critical for billing

The Egyptian Tax Authority has stated that lawyers and other liberal professions are included in electronic-invoice obligations. For dealings with registered business entities, the electronic-invoice system applies; dealings with final consumers are handled through the electronic-receipt framework according to applicable rollout decisions.

### Project relevance

- B2B legal-service invoices;
- taxpayer registration;
- electronic seals or signatures;
- service coding;
- invoice schema;
- cancellation and correction;
- integration;
- archived submission responses.

### Required action

- determine Lex Gate’s current registration and obligation status;
- obtain the latest ETA taxpayer guides;
- obtain current technical SDK and schemas;
- identify service codes applicable to legal services;
- verify whether direct integration, certified service provider, or accounting-system integration will be used;
- validate all workflows with Lex Gate’s accountant.

---

## EG-TAX-005 — Egyptian Electronic Receipt System

**Arabic title:** منظومة الإيصال الإلكتروني  
**Source class:** A2  
**Authority:** Egyptian Tax Authority  
**Status:** Verified; Lex Gate applicability pending  
**Priority:** Critical if B2C collection is in scope

The ETA describes the electronic-receipt system as the B2C component of its digital tax architecture and publishes technical integration material and phased obligation decisions.

### Required action

- verify whether Lex Gate is named in or covered by an applicable obligation phase;
- verify current point-of-sale and integration requirements;
- determine treatment of bank transfer, card payment, cash, online payment, deposits, and instalments;
- preserve ETA response identifiers and immutable transaction records.

---

## EG-TEL-001 — Telecommunications Regulation Law No. 10 of 2003

**Arabic title:** قانون تنظيم الاتصالات رقم 10 لسنة 2003  
**Source class:** A1/A2  
**Status:** Pending authoritative acquisition and applicability analysis  
**Priority:** Conditional

### Potential relevance

- SMS delivery;
- telephone systems;
- communication records;
- service providers;
- sender identification;
- telecom confidentiality;
- mass messaging;
- automated notifications.

### Required action

Obtain relevant NTRA rules before implementing bulk SMS, call recording, automated calls, or telecom integrations.

---

## EG-IPR-001 — Intellectual Property Rights Protection Law No. 82 of 2002

**Arabic title:** قانون حماية حقوق الملكية الفكرية رقم 82 لسنة 2002  
**Source class:** A1  
**Status:** Pending controlled acquisition  
**Priority:** High

### Project relevance

- Lex Gate branding;
- logos and visual assets;
- publications;
- legal templates;
- licensed databases;
- software;
- uploaded client materials;
- third-party photographs;
- website content;
- AI-generated and AI-assisted materials.

### Required action

- record ownership and licensing for every brand and content asset;
- prohibit unauthorized copying of court databases, legal publications, photographs, fonts, templates, and commercial legal content;
- establish content provenance records.

---

## EG-AML-001 — Anti-Money Laundering Law No. 80 of 2002

**Arabic title:** قانون مكافحة غسل الأموال رقم 80 لسنة 2002  
**Source class:** A1  
**Status:** Candidate source; applicability requires specialist review  
**Priority:** Conditional but potentially critical

### Potential relevance

Depending on Lex Gate’s activities and the applicable statutory definitions:

- client identification;
- beneficial ownership;
- source-of-funds information;
- risk assessment;
- suspicious activity;
- restricted disclosure;
- retention;
- high-risk engagements.

### Required action

A qualified Egyptian AML adviser must determine whether, when, and to what extent Lex Gate or its lawyers have statutory obligations. No generic foreign “KYC workflow” may be imported without this analysis.

---

## EG-CIV-002 — Egyptian Civil Code No. 131 of 1948

**Arabic title:** القانون المدني رقم 131 لسنة 1948  
**Source class:** A1  
**Status:** Pending consolidated acquisition  
**Priority:** High

### Project relevance

- contracts;
- agency;
- obligations;
- liability;
- payment;
- termination;
- damages;
- notice;
- representation;
- client engagement terms.

---

## EG-COM-001 — Commercial Law No. 17 of 1999

**Arabic title:** قانون التجارة رقم 17 لسنة 1999  
**Source class:** A1  
**Status:** Pending consolidated acquisition  
**Priority:** Conditional

### Project relevance

- commercial clients;
- commercial records;
- merchant information;
- business transactions;
- payment instruments;
- corporate matters.

---

## EG-ENT-001 — Lex Gate Legal-Entity Formation Documents

**Source class:** D1/A1  
**Status:** Not supplied  
**Priority:** Critical

### Required documents

- commercial registry, if applicable;
- tax card;
- Bar or professional registration documents;
- partnership or company documents;
- office licences;
- authorized signatory documents;
- branch registrations;
- official Arabic and English names;
- registered addresses;
- tax registrations;
- bank-account ownership records.

### Reason

The product cannot accurately generate contracts, invoices, receipts, legal notices, signatures, seals, or website disclosures without confirming the firm’s legal identity.

---

# 6. Courts and Government Service Register

## EG-MOJ-001 — Ministry of Justice Electronic Services

**Source class:** A2  
**Status:** Official services identified; integration authority not established  
**Priority:** High

The Ministry of Justice provides electronic services relating to matters such as hearing schedules, lawsuit status, appeals, and other justice services. Public availability of a service does not establish the existence of a public API or permission for automated extraction.

### Required action

For every proposed government integration, record:

- service owner;
- official terms;
- authentication method;
- public API availability;
- permitted use;
- rate limits;
- data classifications;
- reliability;
- support channel;
- legal authority;
- manual fallback;
- audit evidence.

### Default classification

Until formally verified, Ministry and court services are:

> **Human-operated external services, not confirmed machine integrations.**

---

## EG-GAZ-001 — Official Gazette and Egyptian Gazette Repository

**Arabic titles:**

- الجريدة الرسمية
- الوقائع المصرية

**Source class:** A1  
**Status:** Required central evidence source  
**Priority:** Critical

### Required action

Create a controlled source archive with:

- original PDF or scan;
- source metadata;
- retrieval record;
- SHA-256 hash;
- extracted Arabic text;
- manual verification status;
- amendment links;
- supersession status;
- relevant article markers.

The system must preserve the original document even when searchable text is produced.

---

# 7. Technical and Security Standards Register

These standards do not replace Egyptian law. They provide engineering baselines where Egyptian law states an outcome but does not prescribe every technical control.

---

## STD-SEC-001 — ISO/IEC 27001:2022

**Title:** Information Security Management Systems — Requirements  
**Source class:** B2  
**Status:** Current published edition  
**Priority:** Critical

ISO identifies ISO/IEC 27001:2022 as the third edition of the information-security-management-system requirements standard.

### Intended use

- security governance;
- risk management;
- asset control;
- policies;
- supplier governance;
- incident management;
- business continuity;
- continual improvement.

### Constraint

The project may align with ISO/IEC 27001 without claiming certification.

---

## STD-PRV-001 — ISO/IEC 27701:2025

**Title:** Privacy Information Management Systems — Requirements and Guidance  
**Source class:** B2  
**Status:** Current second edition  
**Priority:** High

ISO/IEC 27701:2025 defines requirements and guidance for privacy information management by PII controllers and processors.

### Intended use

- privacy governance;
- controller and processor responsibilities;
- privacy risk;
- processing records;
- rights handling;
- vendor controls;
- accountability evidence.

---

## STD-SEC-002 — NIST Cybersecurity Framework 2.0

**Source class:** B2  
**Status:** Current  
**Priority:** High

NIST CSF 2.0 provides organization-wide cybersecurity risk outcomes for organizations of different sizes and sectors.

### Intended use

Lex Gate’s security program will organize governance and maturity work through:

- Govern;
- Identify;
- Protect;
- Detect;
- Respond;
- Recover.

---

## STD-IAM-001 — NIST SP 800-63 Revision 4

**Source class:** B2  
**Status:** Current, published July 2025  
**Priority:** Critical

NIST SP 800-63 Revision 4 supersedes Revision 3 and covers identity proofing, authentication, authenticator management, federation, and assertions.

### Intended use

- client identity assurance;
- lawyer and employee authentication;
- multifactor authentication;
- account recovery;
- privileged accounts;
- federation;
- session assurance;
- step-up authentication.

### Constraint

NIST assurance levels will be used as engineering guidance, not represented as an Egyptian legal classification.

---

## STD-APP-001 — OWASP ASVS 5.0.0

**Source class:** B2  
**Status:** Current stable release  
**Priority:** Critical

OWASP identifies ASVS 5.0.0 as the current stable Application Security Verification Standard and recommends version-qualified requirement identifiers.

### Intended use

- security requirements;
- architecture review;
- application verification;
- procurement;
- acceptance testing;
- release gates.

### Project rule

All ASVS references must include the version, for example:

`OWASP-ASVS-v5.0.0-<requirement>`

This prevents requirement drift after future OWASP releases.

---

## STD-APP-002 — OWASP Top 10:2025

**Source class:** B2  
**Status:** Current awareness baseline  
**Priority:** High

OWASP identifies the 2025 release as the current Top 10 web-application security risk list.

### Intended use

- developer education;
- threat discussions;
- code-review checklists;
- secure-development awareness.

### Constraint

OWASP Top 10 is not sufficient as the complete application-security specification. ASVS and project-specific threat models control verification.

---

## STD-ACC-001 — WCAG 2.2

**Source class:** B2  
**Status:** W3C Recommendation  
**Priority:** Critical

WCAG 2.2 is a W3C Recommendation covering accessibility of web content across desktop and mobile environments.

### Target

The initial product target is:

> **WCAG 2.2 Level AA**, subject to final approval.

### Applies to

- public website;
- client portal;
- internal application;
- forms;
- document previews;
- errors;
- authentication;
- dashboards;
- responsive layouts;
- Arabic and English interfaces.

---

## STD-BIDI-001 — Unicode Bidirectional Algorithm and Internationalization Guidance

**Source class:** B2  
**Status:** Exact specifications to be registered during UX architecture  
**Priority:** Critical

### Intended use

- mixed Arabic and English names;
- case numbers;
- email addresses;
- phone numbers;
- currencies;
- dates;
- citations;
- identifiers;
- file names;
- document titles;
- tables;
- timelines.

### Required action

Register the exact Unicode and W3C internationalization specifications before implementation.

---

## STD-REC-001 — Records Integrity and Audit Standard Set

**Source class:** B2  
**Status:** To be selected  
**Priority:** High

Candidate areas include:

- records-management principles;
- electronic record integrity;
- trusted timestamps;
- digital evidence handling;
- audit logging;
- legal holds;
- immutable storage.

Final standards will be selected after D03 clarifies Egyptian evidentiary and retention requirements.

---

# 8. Academic and Research Evidence Register

Academic research may support organizational and design choices, but it cannot establish Egyptian legal obligations.

## RES-ORG-001 — Legal Technology Adoption and Organizational Change

Michalakopoulou, Bamford, Reid, and Nikitas identified six recurring areas affecting innovation in legal-service firms: human factors and culture, clients and markets, technology, organizational transitions, legal processes, and education. The study involved 53 interviews with legal professionals across seven countries.

**Publication:** Production Planning & Control, 2021  
**DOI:** 10.1080/09537287.2021.1946329

### Project use

- discovery interviews;
- adoption strategy;
- staff training;
- workflow redesign;
- rollout planning;
- resistance and change-management analysis.

---

## RES-ORG-002 — How Technology Changes Law Firms

Rodgers, Armour, and Sako concluded that technology is changing law-firm tasks, career paths, and business models, while adoption remains constrained by the suitability of use cases and organizational factors.

**Publication:** Annual Review of Law and Social Science, 2023  
**DOI:** 10.1146/annurev-lawsocsci-111522-074716

### Project use

- avoid technology-first assumptions;
- separate augmentation from autonomous legal decision-making;
- analyze professional responsibility;
- design human approval and accountability.

---

## RES-UX-001 — Bidirectional Interface Ambiguity

Goldenberg and Tractinsky studied direction interpretation among Arabic and Hebrew users and found that linguistic, individual, and interface-design factors affect how ambiguous directional interface items are interpreted. Proper design can address a substantial portion of resulting errors.

**Publication:** International Journal of Human-Computer Studies, 2024  
**DOI:** 10.1016/j.ijhcs.2024.103383

### Project use

- Arabic design system;
- icon direction;
- pagination;
- timelines;
- navigation;
- progress indicators;
- visualizations;
- mixed-direction content;
- usability testing.

---

# 9. Lex Gate Internal Evidence Register

The following firm-specific sources are mandatory and currently missing.

## LG-INT-001 — Firm Identity and Registration Package

Required:

- official Arabic name;
- official English name;
- legal form;
- registration documents;
- tax details;
- office addresses;
- authorized signatories;
- logo ownership;
- domain ownership;
- phone numbers and official email addresses.

---

## LG-INT-002 — Lawyer and Employee Register

Required:

- names;
- job titles;
- Bar registration;
- court-admission levels;
- departments;
- employment or association status;
- supervisor;
- office;
- active/inactive status;
- required matter access;
- public-profile approval.

Sensitive personal information must not be added until a controlled collection method exists.

---

## LG-INT-003 — Existing Client Intake Materials

Required:

- consultation forms;
- conflict-check procedures;
- engagement letters;
- powers of attorney;
- identity-document requests;
- fee quotations;
- client acceptance and rejection processes;
- source-of-funds or compliance forms, where used.

---

## LG-INT-004 — Existing Matter and Case Files

Required samples should cover:

- civil matters;
- criminal matters;
- family matters;
- commercial matters;
- administrative matters;
- corporate or advisory matters;
- enforcement matters;
- appeals.

Samples must be sanitized or reviewed under a controlled confidentiality process before product personnel access them.

---

## LG-INT-005 — Financial Documents

Required:

- invoice examples;
- receipt examples;
- expense records;
- payment methods;
- tax reports;
- accountant procedures;
- electronic-invoice and receipt records;
- refunds;
- instalments;
- deposits or retainers.

---

## LG-INT-006 — Communications Inventory

Required:

- official email;
- WhatsApp use;
- phone calls;
- SMS;
- Facebook messages;
- website enquiries;
- physical correspondence;
- courier records;
- internal chat;
- client update practices.

The inventory must identify which tools contain client or case information.

---

## LG-INT-007 — Document and Storage Inventory

Required:

- paper archives;
- employee laptops;
- shared drives;
- Google Drive or Microsoft storage;
- email attachments;
- personal devices;
- USB storage;
- scanned documents;
- backup locations;
- case-naming conventions;
- destruction practices.

---

## LG-INT-008 — Facebook and Brand Evidence

Required:

- page screenshots;
- profile and cover images;
- About section;
- listed services;
- addresses;
- contact data;
- representative posts;
- audience comments;
- current visual identity;
- administrator ownership.

The Facebook page could not be reliably inspected through the research environment and therefore cannot yet be treated as an approved brand source.

---

# 10. Source-to-Requirement Derivation Rules

Each derived requirement must include:

- requirement ID;
- source ID;
- article, section, or evidence reference;
- Arabic source extract where legally material;
- English working interpretation;
- reviewer;
- applicability rationale;
- system consequence;
- verification method;
- confidence status.

Example:

**Requirement ID:** `PRV-CONSENT-001`  
**Source:** `EG-PRV-001`, Article `[pending extraction]`  
**Interpretation status:** Pending legal review  
**System consequence:** Consent records require purpose, version, timestamp, actor, withdrawal state, and evidence.  
**Acceptance evidence:** Automated tests, UI tests, audit-log review, privacy-review approval.

A requirement may not cite “Egyptian law” generically. The exact source and provision must be recorded.

---

# 11. Prohibited Source Practices

The following are prohibited:

- citing an AI answer as legal authority;
- accepting an article number without opening the source;
- relying solely on an English translation;
- deriving obligations from a law-firm blog without checking the law;
- using a repealed law because it ranks highly in search results;
- ignoring future effective dates;
- treating a ministry news article as the complete legal instrument;
- treating an unofficial API or scraping method as authorized;
- copying requirements from US, UK, EU, or Gulf legal software without Egyptian validation;
- using GDPR requirements as if they were automatically Egyptian law;
- referencing an unversioned technical standard;
- allowing an implementer to select their own legal baseline.

---

# 12. Controlled Source Repository Structure

The project repository should eventually contain:

```text
/docs
  /sources
    /egypt
      /constitution
      /legal-profession
      /privacy
      /cybercrime
      /electronic-signature
      /evidence
      /civil-procedure
      /criminal-procedure
        /current-pre-2026-10-01
        /law-174-2025
      /consumer-protection
      /labour
      /tax
      /telecommunications
      /intellectual-property
      /aml
    /regulators
      /itida
      /eta
      /moj
      /ntra
      /labour
      /consumer-protection
    /standards
      /iso
      /nist
      /owasp
      /w3c
      /unicode
    /research
    /lex-gate-internal
  /registers
    source-register.yaml
    source-register.xlsx
    amendments-register.yaml
    terminology-register.yaml
```

Copyright-restricted standards must not be committed to the repository unless the project possesses the necessary licence. The register may reference licensed copies stored in an approved access-controlled location.

---

# 13. Source File Integrity

Every acquired source should record:

```yaml
source_id: EG-PRV-002
title_ar: قرار وزير الاتصالات وتكنولوجيا المعلومات رقم 816 لسنة 2025
authority: وزارة الاتصالات وتكنولوجيا المعلومات
classification: A1
retrieved_at: 2026-08-06
original_filename: ""
sha256: ""
publication:
  gazette: الوقائع المصرية
  issue: ""
  date: ""
effective_date: ""
language: ar
official_copy_verified: false
amendment_status: pending
legal_review_status: pending
derived_requirements: []
```

A new file must not silently replace an earlier file. New editions or amended versions require a new version record and comparison.

---

# 14. Review Cadence

## Continuous or Event-Driven Review

- new Egyptian laws;
- new executive regulations;
- amendments;
- regulator decisions;
- court-system changes;
- ETA rollout decisions;
- privacy-centre announcements;
- security vulnerabilities affecting deployed components.

## Quarterly Review

- government service availability;
- regulator technical documentation;
- implementation decisions;
- court integration assumptions;
- payment-provider and tax-integration requirements.

## Annual Review

- Constitution and foundational laws;
- ISO and NIST standards;
- records policies;
- firm policies;
- legal-service workflow assumptions.

## Release Review

Before every material production release:

- confirm that no critical source was superseded;
- confirm all legal assumptions affected by the release;
- confirm technical-standard versions;
- confirm open legal questions;
- record reviewer approval.

---

# 15. Initial Source Gaps

The following gaps block finalization of the SRS:

1. official consolidated Legal Profession Law and complete amendment history;
2. Lex Gate legal-entity and Bar registration information;
3. official Personal Data Protection Law and regulations package;
4. confirmation of privacy licensing, registration, and transition requirements;
5. current and future criminal procedure comparison;
6. current civil procedure and deadline rules;
7. evidence and electronic-document legal analysis;
8. verified tax status and electronic-invoice obligations;
9. employee and lawyer relationship model;
10. Bar rules affecting advertising and public lawyer profiles;
11. engagement and fee practices;
12. records-retention obligations;
13. AML applicability;
14. official court integration permissions;
15. brand assets and Facebook-page evidence;
16. existing matter, document, and communication practices.

---

# 16. Gate A Acceptance Criteria for D02

D02 may receive **provisional Gate A approval** when:

- all critical source categories have an assigned source ID;
- each source has an owner and acquisition status;
- the authority hierarchy is accepted;
- the Arabic-primary-text rule is accepted;
- the technical standards are version locked;
- source gaps are formally recorded;
- the sponsor appoints the Egyptian legal reviewer;
- the sponsor authorizes acquisition and controlled storage of official texts;
- no unverified source is treated as final authority.

D02 will receive **full Gate A approval** only after the critical official texts and Lex Gate identity documents are acquired.

---

# 17. Approval Record

## Prepared By

Name: ______________________________  
Role: ______________________________  
Date: ______________________________

## Egyptian Legal Reviewer

Name: ______________________________  
Role: ______________________________  
Decision: Approved / Approved with Conditions / Rejected  
Date: ______________________________  
Conditions: ______________________________

## Privacy Reviewer

Name: ______________________________  
Role: ______________________________  
Decision: Approved / Approved with Conditions / Rejected  
Date: ______________________________

## Tax Reviewer

Name: ______________________________  
Role: ______________________________  
Decision: Approved / Approved with Conditions / Rejected  
Date: ______________________________

## Project Sponsor

Name: Ahmed Elshazlly  
Role: Project Sponsor / Lex Gate Owner  
Decision: Approved / Approved with Conditions / Rejected  
Date: ______________________________  
Comments: ______________________________

---

# Appendix A — Current Baseline Summary

| Domain | Current baseline | Verification state |
|---|---|---|
| Constitutional | Egyptian Constitution, including 2019 amendments | Official online; controlled copy pending |
| Legal profession | Law No. 17 of 1983 and amendments | Consolidation pending |
| Personal data | Law No. 151 of 2020 | Official copy pending |
| Privacy regulations | Decree No. 816 of 2025 | Gazette copy and transition analysis pending |
| Cybercrime | Law No. 175 of 2018 and regulations | Primary law located; full package pending |
| Electronic signatures | Law No. 15 of 2004 and ITIDA framework | Core authority verified |
| Evidence | Law No. 25 of 1968 and amendments | Consolidation pending |
| Civil procedure | Law No. 13 of 1968 and amendments | Pending acquisition |
| Criminal procedure | Law No. 150 of 1950 until transition | Pending consolidation |
| New criminal procedure | Law No. 174 of 2025 from 1 October 2026 | Official gazette confirmed |
| Consumer protection | Law No. 181 of 2018; Decree No. 822 of 2019 | Located |
| Employment | Labour Law No. 14 of 2025 and decisions | Ministry source verified |
| Tax | Income tax, VAT, unified procedures | Consolidated texts pending |
| E-invoice | ETA electronic-invoice framework | Official operational guidance located |
| E-receipt | ETA electronic-receipt framework | Lex Gate obligation status pending |
| Security governance | ISO/IEC 27001:2022; NIST CSF 2.0 | Version locked |
| Privacy management | ISO/IEC 27701:2025 | Version locked |
| Identity | NIST SP 800-63-4 suite | Version locked |
| Application security | OWASP ASVS 5.0.0 | Version locked |
| Accessibility | WCAG 2.2 AA target | Version locked |
| Arabic UX | Unicode/W3C specifications plus empirical BiDi research | Exact technical set pending |

---

# Appendix B — Immediate Acquisition Queue

## Priority 0 — Before D03 Legal Interpretation

1. Lex Gate registration and identity documents;
2. Legal Profession Law and all amendments;
3. Personal Data Protection Law;
4. Decree No. 816 of 2025;
5. Cybercrime Law and executive regulations;
6. Electronic Signature Law and regulations;
7. Evidence Law and amendments;
8. Labour Law No. 14 of 2025 and relevant decisions;
9. electronic-invoice and electronic-receipt registration evidence;
10. Criminal Procedure Laws No. 150 of 1950 and 174 of 2025.

## Priority 1 — Before Detailed Workflow Specification

1. Civil and Commercial Procedures Law;
2. Civil Code;
3. Consumer Protection Law and regulations;
4. tax laws and current executive materials;
5. Social Insurance Law, if HR scope is approved;
6. AML legislation and applicability opinion;
7. relevant NTRA communication rules;
8. relevant Bar Association rules and decisions.

## Priority 2 — Before UI and Implementation Finalization

1. complete brand package;
2. Facebook-page evidence;
3. existing templates;
4. sanitized case files;
5. communication inventory;
6. document-storage inventory;
7. staff and role inventory;
8. accounting and payment workflows.