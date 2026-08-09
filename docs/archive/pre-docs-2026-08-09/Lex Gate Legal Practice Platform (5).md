# Lex Gate Legal Practice Platform  
## D06 — Stakeholder and User Research Report

**Document ID:** LG-D06  
**Document Title:** Stakeholder and User Research Report  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.1  
**Status:** Provisional Research Baseline — Field Validation Required  
**Classification:** Confidential — Internal Project Documentation  
**Prepared Date:** 6 August 2026  

**Parent Documents:**

- LG-D01 — Project Charter and Documentation Research Protocol
- LG-D02 — Authoritative Source Register
- LG-D03 — Egyptian Legal and Regulatory Analysis
- LG-D04 — Firm Discovery and Current-State Assessment
- LG-D05 — Product Vision, Scope, Capability Map, and Release Strategy

---

# 1. Purpose

This document defines the stakeholder and user-research framework for the Lex Gate Legal Practice Platform.

It establishes:

- the stakeholder ecosystem;
- the difference between users, stakeholders, roles, and permissions;
- provisional user groups requiring validation;
- user needs and jobs to be performed;
- professional authority and confidentiality boundaries;
- accessibility and inclusion requirements;
- research recruitment and evidence standards;
- interview and usability-testing protocols;
- provisional personas;
- user-risk and vulnerability considerations;
- role-specific experience requirements;
- criteria for converting research findings into product requirements.

This document is designed to prevent the platform from being built around:

- the preferences of only one senior user;
- generic foreign law-firm personas;
- assumptions about Egyptian clients;
- stereotypes based on age, education, disability, income, or language;
- organizational titles that do not reflect real authority;
- technical roles that accidentally imply legal authority;
- convenience for administrators at the expense of confidentiality;
- client transparency that exposes privileged or internal information.

---

# 2. Document Status

The user groups and personas in this document are provisional.

They are hypotheses to be tested through the discovery and research activities defined in D04 and D06.

They must not be treated as validated facts until:

- representative users have been interviewed;
- actual workflows have been observed;
- current tools and records have been reviewed;
- contradictions have been documented;
- legal and operational reviewers have approved the findings;
- the project sponsor has approved the resulting stakeholder model.

No persona shall become a permanent product requirement merely because it appears in this document.

---

# 3. Research Objectives

The research programme must determine:

1. who interacts with Lex Gate;
2. who makes legally significant decisions;
3. who performs administrative work;
4. who needs access to which information;
5. what each user is trying to accomplish;
6. where users currently experience delay, confusion, repetition, or risk;
7. which information users need to make decisions;
8. which information they must not receive;
9. which users require assistance or alternative access methods;
10. how Arabic, English, legal terminology, and mixed-direction content affect use;
11. which activities are suitable for self-service;
12. which activities require a lawyer;
13. which actions require approval;
14. which actions require stronger identity verification;
15. which communication channels users trust;
16. which current behaviours are caused by poor tools rather than actual preference;
17. which organizational changes are required for successful adoption.

Research into legal-service innovation indicates that adoption is influenced by human factors, organizational culture, client expectations, technology, legal processes, and education rather than software capability alone.

---

# 4. Governing Research Principles

## 4.1 Legal Authority Is Not the Same as System Access

A user may have technical access to a record without being legally authorized to:

- advise a client;
- sign a legal document;
- appear before a court;
- approve a conflict;
- confirm a legal deadline;
- accept an engagement;
- disclose confidential information.

Research must identify both:

- what a person can technically do today;
- what the person is professionally authorized to do.

---

## 4.2 Organizational Title Is Not Sufficient

Titles such as:

- manager;
- assistant;
- administrator;
- associate;
- consultant;
- accountant;
- lawyer;

do not fully define responsibilities or permissions.

Research must establish:

- actual duties;
- supervision;
- professional registration;
- matter assignment;
- decision authority;
- confidentiality restrictions;
- approval rights.

---

## 4.3 Needs Are Not Feature Requests

A participant may request:

> “Add a WhatsApp button.”

The underlying need may instead be:

- rapid confirmation;
- familiar communication;
- low-friction document sharing;
- assurance that the firm received the message;
- access without remembering another password.

Research must record the underlying need before selecting the feature.

---

## 4.4 Current Behaviour Is Not Necessarily Preference

A client who uses WhatsApp may do so because:

- the firm has no portal;
- email responses are slow;
- the client lacks confidence in email;
- the lawyer requested WhatsApp;
- the client needs an immediate acknowledgement.

The research team must not conclude that WhatsApp is the preferred or safest long-term solution without further evidence.

---

## 4.5 Legal Complexity Must Not Be Hidden Through Misleading Simplicity

The interface should make legal processes understandable.

It must not:

- guarantee a legal outcome;
- conceal uncertainty;
- imply that a procedural event is final when it is provisional;
- use simplified labels that change legal meaning;
- encourage a client to take an irreversible action without appropriate explanation.

---

## 4.6 Users Must Not Be Blamed for System Failure

Where users rely on workarounds, research should ask:

- what the existing system prevented;
- what information was missing;
- what delay or pressure existed;
- whether the official process was realistic;
- whether training was available.

---

## 4.7 Accessibility Is a Lifecycle Requirement

Accessibility shall influence:

- user research;
- content;
- navigation;
- forms;
- authentication;
- document exchange;
- dashboards;
- mobile use;
- testing;
- support.

Accessibility research in software practice supports treating accessibility as a first-class concern throughout development rather than as a final compliance exercise.

---

# 5. Terminology

## 5.1 Stakeholder

A person or organization affected by the product or capable of affecting its operation, even if they do not directly use it.

Examples:

- Lex Gate management;
- Egyptian Bar Association;
- Personal Data Protection Center;
- Egyptian Tax Authority;
- courts;
- cloud providers.

---

## 5.2 User

A person who directly interacts with one or more product surfaces.

Examples:

- prospective client;
- client;
- lawyer;
- finance user;
- administrator.

---

## 5.3 Actor

A person, system, or organization performing a step in a workflow.

An actor may be:

- a platform user;
- an external system;
- a court;
- an accountant;
- a client representative.

---

## 5.4 Role

A defined organizational or functional responsibility.

Examples:

- responsible lawyer;
- intake coordinator;
- matter supervisor;
- finance reviewer.

---

## 5.5 Permission

A technical capability granted to an authenticated user.

Examples:

- view matter;
- upload document;
- approve invoice;
- manage users.

---

## 5.6 Professional Authority

The legal or professional capacity to perform an act.

Examples:

- approve a final legal opinion;
- appear before a specified court;
- accept a conflict decision;
- sign on behalf of Lex Gate.

---

## 5.7 Persona

A research-supported representation of a recurring user pattern.

A persona is not:

- a real individual;
- a demographic stereotype;
- a substitute for requirements;
- a permission role;
- a legal classification.

---

# 6. Stakeholder Ecosystem

## 6.1 Internal Primary Stakeholders

- project sponsor;
- Lex Gate owner or partners;
- managing lawyer;
- senior lawyers;
- responsible matter lawyers;
- junior or associate lawyers;
- trainee lawyers;
- legal assistants;
- administrative staff;
- intake staff;
- finance personnel;
- records personnel;
- privacy and compliance personnel;
- system administrators;
- security reviewers.

---

## 6.2 Internal Secondary Stakeholders

- reception staff;
- marketing or content personnel;
- recruitment personnel;
- office managers;
- external technology support;
- temporary staff;
- interns;
- consultants;
- auditors.

---

## 6.3 External Primary Stakeholders

- prospective clients;
- individual clients;
- company clients;
- authorized client representatives;
- guardians;
- family representatives;
- external lawyers;
- experts;
- translators;
- accountants;
- process servers or couriers, where used.

---

## 6.4 External Institutional Stakeholders

- Egyptian Bar Association;
- Ministry of Justice;
- courts;
- prosecution authorities;
- Personal Data Protection Center;
- Ministry of Communications and Information Technology;
- ITIDA;
- Egyptian Tax Authority;
- Ministry of Labour;
- Consumer Protection Agency;
- payment providers;
- banks;
- electronic-signature providers;
- cloud and communications providers.

---

## 6.5 Indirectly Affected Persons

The platform may hold information about people who are not Lex Gate users, including:

- opposing parties;
- witnesses;
- victims;
- defendants;
- family members;
- minors;
- company officers;
- beneficial owners;
- experts;
- judges and court personnel;
- employees of client organizations;
- persons mentioned in evidence.

These individuals are data subjects and matter participants, but they do not automatically receive platform accounts or portal access.

---

# 7. Stakeholder Influence and Impact Model

Each stakeholder shall be assessed across:

- decision influence;
- legal authority;
- operational knowledge;
- frequency of use;
- sensitivity of information;
- impact if excluded;
- training need;
- resistance risk;
- availability for research.

---

## 7.1 High-Influence, High-Impact Stakeholders

Likely examples:

- project sponsor;
- managing lawyer;
- legal process reviewer;
- privacy reviewer;
- senior responsible lawyers;
- finance approver.

These stakeholders must participate in approval, but they must not be the only research participants.

---

## 7.2 High-Use, Lower-Decision Stakeholders

Likely examples:

- trainee lawyers;
- legal assistants;
- intake staff;
- administrative staff.

These users may understand operational friction better than senior decision-makers and must be directly researched.

---

## 7.3 Lower-Frequency, High-Risk Stakeholders

Likely examples:

- client with an especially restricted matter;
- external lawyer;
- privacy reviewer;
- incident-response administrator;
- auditor.

Their workflows may occur infrequently but require exact controls.

---

# 8. Decision-Rights Model

The following decision categories must have named owners.

| Decision | Proposed authority | Final validation required |
|---|---|---|
| Accept a prospective client | Authorized lawyer or management | Yes |
| Clear a conflict | Authorized lawyer | Yes |
| Approve engagement scope | Responsible or supervising lawyer | Yes |
| Approve fees | Authorized business and legal approver | Yes |
| Open an emergency matter | Authorized lawyer | Yes |
| Confirm a legal deadline | Authorized lawyer | Yes |
| Publish a client update | Responsible lawyer or delegate under policy | Yes |
| Approve final legal advice | Authorized lawyer | Yes |
| Make a document client-visible | Matter-authorized reviewer | Yes |
| Issue an invoice | Finance approver under approved workflow | Yes |
| Change access to a restricted matter | Matter owner and/or security authority | Yes |
| Approve a privacy disclosure | Privacy and legal reviewer | Yes |
| Approve public legal content | Authorized lawyer | Yes |
| Approve AI use on a matter | Approved matter authority under policy | Yes |
| Delete or destroy legal records | Records and legal authority | Yes |

The final model must be based on Lex Gate’s actual structure.

---

# 9. Research Questions by Domain

## 9.1 Client Access

- How do clients find Lex Gate?
- What makes them trust or distrust a law firm online?
- What do they need to know before making contact?
- What prevents them from submitting an enquiry?
- Which channels are familiar?
- Which channels feel secure?
- What acknowledgement do they expect?
- What language and terminology do they understand?

---

## 9.2 Intake and Engagement

- What information can clients provide accurately without a lawyer?
- Which information is often incomplete?
- Which questions confuse prospective clients?
- When do clients believe representation has begun?
- Do clients understand the difference between consultation and engagement?
- How should Lex Gate communicate rejection or non-engagement?

---

## 9.3 Matter Transparency

- What information do clients need to understand progress?
- Which internal information would confuse or harm clients?
- How often do clients expect updates?
- Which events require immediate contact?
- How should uncertainty be communicated?
- What does a client consider a meaningful update?

---

## 9.4 Document Exchange

- What devices do clients use?
- Can they scan documents?
- Do they understand file formats?
- Do they recognize original versus copy?
- How do they know an upload succeeded?
- How should the system request missing pages?
- What assistance is needed for large or unclear files?

---

## 9.5 Lawyer Work

- What information does the lawyer need when opening a matter?
- What changes must be visible immediately?
- What requires legal judgment?
- What is repetitive?
- What can be delegated?
- What must be reviewed?
- Which alerts are useful?
- Which alerts become noise?

---

## 9.6 Administration and Finance

- Which data is repeatedly entered?
- Where do approvals delay work?
- Which documents are required before billing?
- Which errors cause invoice correction?
- How is payment matched to a client or matter?
- What must finance not see?

---

## 9.7 Security and Privacy

- How do users currently share credentials?
- What security steps are perceived as unreasonable?
- Which devices are shared?
- How often do users change phones or numbers?
- What recovery methods are feasible?
- How can strong security be implemented without excluding clients?

---

# 10. Research Ethics and Confidentiality Protocol

## 10.1 Participant Information

Participants shall be told:

- the purpose of the research;
- how notes will be used;
- whether recording is proposed;
- who may review the findings;
- how confidentiality will be protected;
- that participation does not affect employment or legal representation;
- that they may decline to answer unnecessary sensitive questions.

---

## 10.2 Client Research

Client participation must not be requested in a manner that pressures a client because of an active legal relationship.

Where clients are invited:

- participation must be voluntary;
- refusal must not affect legal service;
- substantive legal details should not be collected unless necessary;
- research notes must not become part of the legal matter by default;
- the responsible lawyer must approve recruitment;
- highly sensitive or unstable situations should normally be excluded.

---

## 10.3 Employee Research

Employees must not be told that research measures individual productivity or performance unless that is genuinely the approved purpose.

Management should receive:

- process findings;
- aggregated themes;
- operational risks;

rather than unnecessary attributed criticism.

---

## 10.4 Recording

Audio or video recording shall require:

- participant approval;
- defined purpose;
- secure storage;
- restricted access;
- retention period;
- deletion procedure.

Written notes should be used where recording creates unnecessary sensitivity.

---

## 10.5 Research Data Classification

Research material shall be classified as:

- public;
- internal;
- participant confidential;
- client confidential;
- matter confidential;
- highly restricted.

---

## 10.6 Use of AI in Research

Research recordings, transcripts, notes, or matter examples shall not be submitted to AI services unless:

- the service is approved;
- processing terms are approved;
- transfer requirements are satisfied;
- the participant was appropriately informed;
- client confidentiality is protected;
- unnecessary identifying information is removed.

---

# 11. Research Recruitment Strategy

## 11.1 Internal Participants

The target should include representation from:

- sponsor or owner;
- senior lawyer;
- lawyer from each major practice area;
- trainee lawyer;
- legal assistant;
- intake or reception function;
- finance;
- administration;
- system or technology support.

In a small firm, one person may perform several functions. Each function must still be researched separately.

---

## 11.2 Client Participants

Where feasible and approved, include variation across:

- individual and organization clients;
- Arabic-dominant and English-capable clients;
- new and established clients;
- mobile-only and desktop-capable clients;
- users with different levels of digital confidence;
- clients who required frequent updates;
- clients who exchanged many documents;
- clients using an authorized representative.

---

## 11.3 Inclusion Criteria

Research should deliberately include users who may encounter barriers, including:

- users with low digital literacy;
- users with visual impairments;
- users with motor impairments;
- users who rely on keyboard navigation;
- users using screen magnification;
- older users;
- users with limited bandwidth;
- users using older phones;
- users with limited storage;
- users sharing devices;
- users who cannot easily visit the office;
- users outside Egypt;
- users who prefer spoken explanation.

These are research dimensions, not assumptions about competence.

---

## 11.4 Exclusion Criteria

A participant may be excluded from a specific research activity where:

- participation could affect an active dispute;
- consent is not freely obtainable;
- the person is experiencing acute distress;
- legal privilege may be compromised;
- a minor cannot be appropriately represented;
- recording creates unacceptable risk;
- the research question can be answered through safer evidence.

---

# 12. Research Methods

## 12.1 Semi-Structured Interviews

Best used to understand:

- goals;
- perceived problems;
- authority;
- exceptions;
- trust;
- expectations;
- mental models.

---

## 12.2 Contextual Observation

Best used to understand:

- actual steps;
- workarounds;
- duplicate entry;
- tool switching;
- interruptions;
- hidden dependencies;
- physical records.

---

## 12.3 Document and Artefact Review

Best used to understand:

- required information;
- terminology;
- data structures;
- approval evidence;
- document versions;
- communication patterns.

---

## 12.4 Workflow Reconstruction

Participants should reconstruct a recent real matter without disclosing unnecessary client identities.

This reveals:

- sequence;
- decisions;
- delays;
- channels;
- records;
- missing evidence.

---

## 12.5 Diary Study

Selected lawyers or assistants may record for a limited period:

- interruptions;
- document searches;
- client update requests;
- missed information;
- duplicated tasks;
- urgent work.

Diary participation must not expose substantive matter details unnecessarily.

---

## 12.6 Usability Testing

Prototype testing should assess whether users can complete representative tasks, not merely whether they “like” the design.

---

## 12.7 Accessibility Testing

Accessibility evaluation should include:

- automated checks;
- keyboard testing;
- screen-reader testing;
- zoom and reflow;
- reduced motion;
- real user testing where feasible;
- Arabic and English versions.

---

## 12.8 Survey

A survey may quantify patterns identified qualitatively.

It should not be the first or sole research method where the firm’s workflows remain unclear.

---

# 13. Research Evidence Levels

## Level R1 — Directly Observed

The researcher observed the user performing the activity.

## Level R2 — Artefact Supported

The statement is supported by a document, system record, screenshot, or other evidence.

## Level R3 — Repeated Participant Evidence

Several relevant participants independently described the pattern.

## Level R4 — Single Participant Statement

One participant described the pattern.

## Level R5 — Research Hypothesis

The pattern is inferred and requires validation.

Product requirements should preferably rely on R1–R3 evidence.

---

# 14. User Segmentation Dimensions

Users shall not be segmented only by job title or age.

Relevant dimensions include:

- relationship to Lex Gate;
- legal authority;
- professional registration;
- matter assignment;
- client type;
- matter sensitivity;
- frequency of use;
- digital confidence;
- device access;
- language preference;
- accessibility needs;
- location;
- urgency;
- need for representation;
- need for supervision;
- financial authority;
- administrative privilege.

---

# 15. Provisional User Groups

## External Users

- public visitor;
- prospective individual client;
- prospective organization representative;
- consultation client;
- engaged individual client;
- engaged organization representative;
- guardian or authorized representative;
- external lawyer;
- expert or translator;
- auditor or authorized reviewer.

## Internal Users

- sponsor or owner;
- managing lawyer;
- responsible lawyer;
- supervising lawyer;
- junior lawyer;
- trainee lawyer;
- legal assistant;
- intake coordinator;
- finance user;
- finance approver;
- records administrator;
- privacy reviewer;
- security administrator;
- technical administrator;
- public-content editor.

One person may hold several internal roles.

---

# 16. Provisional Persona P01 — Prospective Individual Client

## Description

An individual seeking initial guidance about a legal problem and deciding whether to contact or engage Lex Gate.

## Primary goals

- understand whether Lex Gate handles the problem;
- make contact quickly;
- know what information to provide;
- receive acknowledgement;
- arrange a consultation;
- avoid exposing sensitive information unnecessarily.

## Possible context

- may be stressed or uncertain;
- may not know legal terminology;
- may use a mobile phone only;
- may prefer Arabic;
- may expect WhatsApp communication;
- may believe submitting an enquiry creates representation.

## Risks

- oversharing sensitive information;
- missing urgent deadlines;
- misunderstanding the relationship;
- sending documents through an insecure channel;
- receiving no clear response.

## Product needs

- clear practice-area descriptions;
- urgent-situation guidance without legal determination;
- minimal first-contact form;
- language selection;
- acknowledgement and expected next step;
- explicit statement that representation is not yet established;
- secure transition to detailed intake.

## Must not receive

- guaranteed outcome;
- misleading automated legal advice;
- another client’s information;
- an implication that a lawyer has accepted the matter before approval.

---

# 17. Provisional Persona P02 — Business Client Representative

## Description

An authorized employee, officer, or adviser acting for an organization.

## Primary goals

- open and monitor matters for the organization;
- provide company and matter documents;
- coordinate several internal stakeholders;
- understand fees and invoices;
- control which colleagues may access the portal.

## Context

- may manage several matters simultaneously;
- may require English and Arabic documents;
- may need finance personnel to see invoices without seeing legal strategy;
- may change roles or leave the client organization.

## Product needs

- organization-client structure;
- verified representative authority;
- role-specific portal access;
- multiple matters;
- organization contacts;
- billing permissions separated from legal permissions;
- representative removal and replacement.

## Risks

- unauthorized employee access;
- outdated representative authority;
- accidental visibility across business units;
- exposure of unrelated matters.

---

# 18. Provisional Persona P03 — Existing Individual Client

## Description

A client with one or more active matters.

## Primary goals

- know what requires attention;
- receive understandable updates;
- provide documents;
- attend appointments;
- understand payments;
- contact the responsible team.

## Product needs

- concise dashboard;
- clear action requests;
- secure document exchange;
- approved status explanations;
- notification preferences;
- visible responsible contact;
- accessible mobile use.

## Risks

- misinterpreting internal legal status;
- believing an unconfirmed date is final;
- exposing documents on a shared device;
- missing a request hidden among many notifications.

---

# 19. Provisional Persona P04 — Client with Additional Support Needs

## Description

A client who may need additional assistance because of disability, digital access, language, literacy, location, urgency, or personal circumstances.

This persona is not defined by a single medical or demographic characteristic.

## Possible needs

- larger text;
- screen-reader compatibility;
- simplified navigation;
- assisted intake;
- telephone support;
- trusted representative;
- low-bandwidth access;
- saved progress;
- clear error recovery;
- alternative document-submission methods.

## Design principle

The product should provide equitable completion paths without publicly labeling or stigmatizing the client.

---

# 20. Provisional Persona P05 — Managing or Supervising Lawyer

## Description

A lawyer responsible for legal quality, client acceptance, supervision, workload, and risk.

## Primary goals

- identify matters requiring intervention;
- approve conflicts and engagements;
- supervise legal work;
- monitor deadlines;
- understand workload;
- ensure clients receive appropriate updates;
- control restricted matters.

## Product needs

- risk-oriented dashboard;
- pending approvals;
- unconfirmed deadlines;
- overdue reviews;
- workload and supervision visibility;
- access-review tools;
- exception and override history.

## Risks

- excessive notifications;
- dashboards exposing restricted matters;
- quantity metrics replacing professional judgment;
- becoming a bottleneck for low-risk administrative approvals.

---

# 21. Provisional Persona P06 — Responsible Matter Lawyer

## Description

The lawyer professionally responsible for a client matter.

## Primary goals

- understand current matter state;
- protect deadlines;
- review evidence and documents;
- delegate work;
- communicate with the client;
- approve substantive output;
- maintain a defensible matter history.

## Product needs

- focused matter workspace;
- complete timeline;
- upcoming legal events;
- document review;
- client communication history;
- task delegation;
- approval queue;
- quick identification of missing information;
- client-visibility preview.

## Risks

- alert fatigue;
- incorrect machine-calculated deadlines;
- incomplete imported history;
- unauthorized team access;
- accidental client disclosure;
- confusion between drafts and final documents.

---

# 22. Provisional Persona P07 — Junior or Trainee Lawyer

## Description

A lawyer working under supervision and with limited or developing professional authority.

## Primary goals

- understand assignments;
- access necessary matter information;
- use approved templates;
- submit work for review;
- receive clear corrections;
- avoid acting beyond authority.

## Product needs

- task clarity;
- structured instructions;
- review status;
- approved sources and templates;
- explicit authority boundaries;
- safe escalation;
- version comparison.

## Risks

- accidental final publication;
- excessive access;
- unclear reviewer;
- using obsolete precedent;
- system permission being mistaken for legal authority.

---

# 23. Provisional Persona P08 — Legal Assistant or Case Coordinator

## Description

A non-lawyer or operational staff member supporting matter administration.

## Primary goals

- organize documents;
- schedule events;
- request information;
- maintain records;
- assist lawyers;
- prepare administrative material.

## Product needs

- controlled task queue;
- clear matter access;
- document metadata tools;
- hearing and appointment scheduling;
- communication templates;
- escalation to lawyers;
- prohibition on unapproved legal advice.

## Risks

- seeing unnecessary substantive information;
- being asked to interpret law;
- altering confirmed deadlines;
- sending unapproved communications;
- performing lawyer-only actions.

---

# 24. Provisional Persona P09 — Intake Coordinator

## Description

The person receiving and organizing initial enquiries.

## Primary goals

- respond quickly;
- collect sufficient preliminary information;
- identify urgency;
- route enquiries;
- initiate conflict screening;
- avoid creating false expectations.

## Product needs

- structured intake queue;
- duplicate detection;
- minimal information capture;
- clear escalation;
- scripts and templates;
- conflict-status visibility without unrestricted matter access;
- pending-response tracking.

## Risks

- collecting excessive sensitive data;
- giving legal advice;
- promising acceptance;
- missing urgent matters;
- duplicate prospective-client records.

---

# 25. Provisional Persona P10 — Finance User

## Description

A person preparing, issuing, reconciling, or reporting financial records.

## Primary goals

- understand approved billing arrangements;
- prepare valid invoices and receipts;
- record payments;
- reconcile outstanding amounts;
- support ETA compliance;
- avoid seeing unnecessary legal content.

## Product needs

- matter financial summary;
- approved fee data;
- expense evidence;
- invoice workflow;
- ETA status;
- payment reconciliation;
- restricted finance reporting.

## Risks

- access to privileged legal material;
- modifying issued records;
- incorrect tax classification;
- unclear client or payer identity;
- payment recorded against the wrong matter.

---

# 26. Provisional Persona P11 — Privacy, Records, or Compliance Reviewer

## Description

The person responsible for privacy operations, processing records, retention, incidents, or compliance evidence.

## Primary goals

- understand data processing;
- review vendors and transfers;
- manage privacy requests;
- manage retention and legal holds;
- assess incidents;
- produce evidence.

## Product needs

- processing inventory;
- processor register;
- data-flow map;
- privacy request workflow;
- retention controls;
- incident deadlines;
- audit access;
- restricted-content handling.

## Risks

- receiving excessive substantive access;
- automated deletion conflicting with legal obligations;
- incomplete processor information;
- missed notification deadlines;
- inability to prove a decision.

---

# 27. Provisional Persona P12 — System Administrator

## Description

A technical user responsible for account, configuration, integration, and system operations.

## Primary goals

- maintain availability;
- administer accounts;
- configure integrations;
- monitor failures;
- support users;
- restore service.

## Product needs

- operational administration;
- health monitoring;
- configuration history;
- access request workflow;
- support-session controls;
- backup and restore;
- security event visibility.

## Must not automatically receive

- unrestricted matter contents;
- internal legal advice;
- all client communications;
- unrestricted document download.

## Risks

- excessive privilege;
- shared administrator accounts;
- support access becoming permanent;
- administrative logs containing confidential content.

---

# 28. Provisional Persona P13 — External Lawyer or Specialist

## Description

An external professional engaged for a defined matter or task.

## Primary goals

- receive the material needed for the assignment;
- communicate securely;
- submit work;
- understand scope and deadlines;
- lose access when the assignment ends.

## Product needs

- time-limited access;
- restricted matter scope;
- specific document sharing;
- task and submission workflow;
- external-user agreement;
- access-expiry controls.

## Risks

- access to unrelated matters;
- uncontrolled download;
- expired access remaining active;
- unclear responsibility;
- cross-border processing.

---

# 29. Provisional Persona P14 — Executive or Firm Owner

## Description

A person responsible for strategy, risk, commercial performance, and organizational development.

## Primary goals

- understand the firm’s operating health;
- identify risk;
- plan growth;
- supervise service quality;
- approve major changes;
- understand financial performance.

## Product needs

- concise management indicators;
- drill-down controlled by confidentiality;
- unresolved risk;
- adoption data;
- workload;
- client service;
- revenue and collection summaries;
- compliance status.

## Risks

- using aggregate dashboards to access restricted detail unnecessarily;
- overreliance on productivity metrics;
- interpreting incomplete data as complete business truth.

---

# 30. User Jobs to Be Performed

## 30.1 Prospective Client Jobs

- determine whether Lex Gate may be relevant;
- submit a safe first enquiry;
- understand what happens next;
- prepare for consultation;
- know whether Lex Gate accepted representation.

---

## 30.2 Client Jobs

- understand required action;
- receive approved updates;
- provide accurate documents;
- communicate securely;
- attend appointments;
- understand financial obligations;
- preserve a record of exchanges.

---

## 30.3 Lawyer Jobs

- assess legal and professional risk;
- understand the matter;
- protect deadlines;
- delegate and review work;
- communicate advice;
- preserve evidence;
- close matters properly.

---

## 30.4 Operational Staff Jobs

- move work through approved processes;
- maintain accurate records;
- coordinate users;
- identify incomplete information;
- escalate decisions;
- avoid acting beyond authority.

---

## 30.5 Management Jobs

- identify operational risk;
- ensure ownership;
- balance workload;
- improve service;
- govern access;
- make evidence-based decisions.

---

# 31. Cross-User Needs

The following needs are expected across several groups.

## USR-COM-001 — Clarity

Users need to understand:

- current state;
- next action;
- responsible person;
- deadline;
- whether the information is provisional or confirmed.

---

## USR-COM-002 — Confirmation

Users need evidence that:

- information was submitted;
- a message was sent;
- a document was received;
- an action was approved;
- a payment was recorded.

---

## USR-COM-003 — Recoverability

Users need to recover from:

- interrupted forms;
- failed uploads;
- forgotten passwords;
- accidental navigation;
- incomplete data;
- unavailable approvers.

---

## USR-COM-004 — Trust

Users need confidence that:

- the recipient is Lex Gate;
- information is protected;
- legal content was reviewed;
- dates and statuses are not misleading;
- the system does not expose unrelated information.

---

## USR-COM-005 — Language Control

Users need:

- stable language selection;
- correct Arabic direction;
- understandable terminology;
- preservation of original-language content;
- clear handling of mixed Arabic and English data.

---

## USR-COM-006 — Support

Users need an identifiable support path when:

- the system fails;
- identity cannot be verified;
- a document cannot be uploaded;
- information appears incorrect;
- urgent legal attention may be required.

---

# 32. Accessibility and Inclusion Requirements

## 32.1 Visual Accessibility

The system shall support:

- text resizing;
- sufficient contrast;
- visible focus;
- readable line length;
- non-colour status indicators;
- accessible charts;
- large interactive targets;
- clear typography.

---

## 32.2 Screen-Reader Accessibility

The system shall provide:

- semantic headings;
- meaningful form labels;
- error associations;
- status announcements;
- accessible dialogs;
- table structure;
- descriptive links;
- logical reading order in Arabic and English.

---

## 32.3 Keyboard and Motor Accessibility

All essential functions shall be usable without a mouse.

The interface shall avoid:

- small targets;
- drag-only interactions;
- time-limited actions without extension;
- complex gestures without alternatives.

---

## 32.4 Cognitive Accessibility

The system shall use:

- clear steps;
- concise explanations;
- progress indicators;
- saved progress where appropriate;
- consistent labels;
- specific errors;
- confirmation before destructive action;
- manageable information density.

---

## 32.5 Low-Bandwidth and Older-Device Access

Client-facing pages should:

- minimize unnecessary media;
- support interrupted uploads;
- compress previews appropriately;
- avoid large animations;
- work on common mobile screen sizes;
- preserve entered information during temporary network failure.

---

## 32.6 Shared-Device Considerations

The portal shall consider clients who use:

- family devices;
- workplace devices;
- public computers;
- shared phones.

Controls may include:

- discreet notification content;
- session termination;
- no confidential information in page titles or previews;
- safe sign-out;
- controlled document caching.

---

# 33. Arabic and Bilingual Experience Requirements

## 33.1 Arabic as a Full Product Language

Arabic shall include:

- complete navigation;
- complete forms;
- complete error messages;
- complete help content;
- complete privacy notices;
- complete status labels;
- complete email and notification templates.

---

## 33.2 Mixed-Direction Content

The interface must correctly handle:

- Arabic names containing Latin abbreviations;
- English company names within Arabic text;
- case numbers;
- email addresses;
- URLs;
- telephone numbers;
- currency;
- dates;
- file names;
- legal citations.

---

## 33.3 Directional Controls

Empirical research involving Arabic and Hebrew users found that ambiguous interface elements can be interpreted differently depending on individual, linguistic, and design factors. Proper design can reduce many of these errors.

Research and testing must therefore include:

- back and forward actions;
- previous and next;
- progress indicators;
- timelines;
- pagination;
- carousels;
- arrow icons;
- charts;
- matter history;
- document comparison.

---

## 33.4 Legal Terminology

Each important term shall have:

- approved Arabic term;
- approved English term;
- plain-language explanation where appropriate;
- internal definition;
- context restrictions.

The interface must distinguish legal precision from client-friendly explanation.

---

## 33.5 Dialect and Formal Arabic

Public and client-facing content may use accessible Modern Standard Arabic.

Highly informal dialect should not replace precise legal meaning.

User research should determine where warmer conversational wording improves clarity without reducing professionalism.

---

# 34. Trust and Assurance Model

Users need different forms of assurance.

## 34.1 Identity Assurance

- Is this really Lex Gate?
- Is this user really authorized?
- Is the client representative still authorized?

---

## 34.2 Process Assurance

- Was the request received?
- Who is reviewing it?
- What happens next?
- Is the deadline confirmed?

---

## 34.3 Content Assurance

- Is this document final?
- Was it approved by a lawyer?
- Has it been superseded?
- Is the translation reviewed?

---

## 34.4 Security Assurance

- Who can see this?
- Was this shared with the correct person?
- Can access be revoked?
- Will the system expose the document in a notification?

---

## 34.5 Legal Relationship Assurance

- Has Lex Gate accepted representation?
- What is the agreed scope?
- Who is the responsible lawyer?
- Which communication is formal advice?

---

# 35. Notification Research

Notifications can reduce missed actions but can also expose information or create fatigue.

Research must determine:

- which events require notification;
- which events require escalation;
- preferred channels;
- acceptable frequency;
- what information may appear in previews;
- whether acknowledgement is needed;
- what happens after delivery failure.

---

## 35.1 Notification Classes

- security;
- legal deadline;
- appointment;
- client request;
- document request;
- document shared;
- communication;
- approval;
- billing;
- general update.

---

## 35.2 Notification Principles

- Critical does not mean every message.
- Sensitive matter names should not appear in insecure previews.
- A notification is not proof that the user understood the information.
- Failed notifications require follow-up.
- Users should control non-essential notification categories.

---

# 36. Role and Permission Separation

## 36.1 Role Dimensions

The permission model shall consider:

1. organizational role;
2. professional status;
3. matter assignment;
4. task assignment;
5. data classification;
6. approval authority;
7. temporary access;
8. client relationship;
9. administrative privilege.

---

## 36.2 Examples

A finance user may:

- see client billing identity;
- see approved fee arrangements;
- issue invoices;

but may not:

- see legal strategy;
- read witness statements;
- review restricted criminal evidence.

A system administrator may:

- reset an account;
- configure an integration;
- review a service error;

but may not automatically:

- read matter documents;
- view client messages;
- approve legal work.

A trainee lawyer may:

- read assigned matter documents;
- create drafts;
- complete assigned tasks;

but may not:

- approve final advice;
- clear a conflict;
- confirm a final legal deadline unless separately authorized.

---

# 37. High-Risk User Actions

The following actions require explicit research and authority validation:

- accepting a client;
- rejecting a client after substantive review;
- clearing a conflict;
- overriding a conflict warning;
- opening an emergency matter;
- confirming a legal deadline;
- deleting a legal event;
- making a document client-visible;
- sharing evidence externally;
- downloading a complete matter;
- issuing legal advice;
- approving a final legal document;
- changing a fee;
- issuing or cancelling an invoice;
- granting restricted-matter access;
- deleting records;
- applying a legal hold;
- approving a privacy disclosure;
- enabling AI on confidential material.

---

# 38. Interview Guide — Clients

## Relationship and Context

- How did you first contact Lex Gate?
- What did you expect would happen next?
- When did you believe Lex Gate had accepted your matter?
- Which communication method was easiest?
- Which method felt safest?

## Information

- What information was difficult to provide?
- Which legal terms were unclear?
- Did you know which documents were needed?
- How did you know your documents were received?

## Updates

- What makes an update useful?
- How often did you expect updates?
- Was it clear when no change had occurred?
- Did you know who to contact?

## Portal Concept

- Which information would you expect to see?
- Which information would you prefer not to appear online?
- Would you use a portal on a phone?
- What would make you distrust the portal?
- What assistance would you need?

---

# 39. Interview Guide — Lawyers

## Matter Responsibility

- What must you know immediately when assigned a matter?
- What information is commonly missing?
- Which deadlines require the greatest care?
- Which events require client communication?

## Work and Delegation

- Which work can be delegated?
- What must you personally approve?
- How do you review a trainee’s work?
- How do you know which document is final?

## Confidentiality

- Which matters require restricted existence?
- Which documents require special handling?
- Which information should administrators never see?

## Automation

- Which repeated task would you automate first?
- Which automated action would you never trust without review?
- What evidence would you need before trusting a suggested deadline?
- When would AI use be inappropriate?

---

# 40. Interview Guide — Operational Staff

- Which requests arrive most often?
- Which information is entered more than once?
- Which tasks wait for lawyer approval?
- Which documents are difficult to locate?
- Which actions are unclear?
- Which mistakes are easiest to make?
- What happens when a lawyer is unavailable?
- What access do you need?
- What information do you currently see but do not need?
- Which client questions are difficult to answer without legal advice?

---

# 41. Interview Guide — Finance

- Which matter information is needed for billing?
- Who confirms the amount?
- What causes invoice correction?
- How are payments identified?
- What happens when someone other than the client pays?
- Which legal documents do finance users currently see?
- Which information is needed for ETA submission?
- How are expenses approved?
- What reports are required?
- Which financial events require lawyer approval?

---

# 42. Prototype Usability Tasks

## Public Website Tasks

- Find whether Lex Gate handles a specified legal-service category.
- Find the firm’s contact information.
- Request a consultation.
- Identify whether submitting the form creates representation.
- Switch between Arabic and English.
- Find the privacy notice.

---

## Prospective Client Tasks

- Submit a minimal enquiry.
- Correct an error.
- Save or resume where approved.
- understand the confirmation state;
- identify the next step.

---

## Client Portal Tasks

- identify required actions;
- upload a requested document;
- confirm the upload;
- read an approved matter update;
- find the responsible contact;
- view an invoice;
- sign out safely.

---

## Lawyer Tasks

- identify today’s critical matters;
- review an unconfirmed deadline;
- assign a task;
- compare document versions;
- publish an approved client update;
- restrict a document;
- review access history.

---

## Finance Tasks

- prepare an invoice from approved data;
- identify missing approval;
- record a payment;
- distinguish invoice draft from ETA-accepted invoice;
- generate an outstanding-balance view.

---

## Administrator Tasks

- suspend a user;
- grant time-limited access;
- review a failed integration;
- verify that substantive matter content remains unavailable;
- terminate a support session.

---

# 43. Usability Evaluation Criteria

A task evaluation shall consider:

- completion;
- completion time;
- errors;
- assistance required;
- confidence;
- interpretation accuracy;
- legal-risk error;
- confidentiality risk;
- accessibility barrier;
- recovery after failure.

A user completing a task quickly but misunderstanding a legal status does not represent success.

---

# 44. Critical User Errors

The following errors must receive special attention:

- believing representation has begun when it has not;
- sending sensitive evidence through an unsecured channel;
- sharing a document with the wrong client;
- confirming an unverified deadline;
- treating a draft as final;
- believing an internal status is official court status;
- deleting a legally retained record;
- assuming a payment means an engagement was accepted;
- confusing internal approval with regulated signature;
- giving a trainee or assistant lawyer-only authority.

---

# 45. User-Need Register

Every validated need shall receive an identifier.

Example structure:

```text
User Need ID: USR-CLI-014
User group: Existing individual client
Need: Know whether a document upload was complete and readable
Evidence level: R1
Evidence: Observed client upload test
Risk if unmet: Missing evidence and false confidence
Related capabilities: CAP-PRT-003, CAP-DOC-002
Proposed requirement: Pending
Owner: Product lead
Status: Validated
```

---

# 46. Research Finding Register

Every research finding shall record:

- finding ID;
- date;
- method;
- participants;
- user groups;
- statement;
- evidence level;
- supporting evidence;
- contradictory evidence;
- legal relevance;
- privacy relevance;
- accessibility relevance;
- product implication;
- confidence;
- owner;
- status.

---

# 47. User-Need Prioritization

A user need shall be prioritized according to:

## Legal Harm

Could failure cause:

- missed deadline;
- unauthorized disclosure;
- incorrect legal act;
- conflict;
- privacy violation?

## User Harm

Could failure cause:

- financial loss;
- loss of rights;
- distress;
- exclusion;
- inability to access legal service?

## Frequency

How often does the need occur?

## Reach

How many user groups are affected?

## Current Workaround

Is there a reliable existing alternative?

## Confidence

How strong is the evidence?

## Dependency

Must the need be solved before another capability?

---

# 48. Anti-Personas and Excluded Use

The platform is not being designed for:

- anonymous users seeking individualized final legal advice without lawyer involvement;
- persons attempting to access another client’s matter;
- unverified intermediaries claiming to represent clients;
- public scraping of client or case information;
- employees seeking unrestricted access because of seniority;
- administrators requiring ordinary access to substantive legal files;
- AI systems acting as autonomous legal decision-makers.

These are access and product-boundary statements, not descriptions of particular individuals.

---

# 49. Research Risks

## RSK-RES-001 — Sponsor Bias

The product may reflect only the owner’s workflow.

**Control:** Include users performing daily operational work and clients.

---

## RSK-RES-002 — Courtesy Bias

Participants may avoid criticizing current processes.

**Control:** Ask for recent examples and observe actual work.

---

## RSK-RES-003 — Idealized Workflow

Participants may describe policy rather than practice.

**Control:** Review artefacts and reconstruct real matters.

---

## RSK-RES-004 — Confidentiality Exposure

Research may collect unnecessary client information.

**Control:** Sanitize evidence and apply restricted storage.

---

## RSK-RES-005 — Demographic Stereotyping

Personas may make unsupported assumptions.

**Control:** Base characteristics on observed needs and context.

---

## RSK-RES-006 — Overgeneralization

A small number of participants may be treated as representative of all clients.

**Control:** Record evidence level and seek variation.

---

## RSK-RES-007 — Feature Confirmation

Researchers may ask users whether they want predefined features instead of understanding needs.

**Control:** Begin with tasks, problems, and recent behaviour.

---

# 50. Research Outputs

D06 shall ultimately contain:

1. stakeholder map;
2. stakeholder influence and impact matrix;
3. validated user-group catalogue;
4. validated personas or behavioural archetypes;
5. professional-authority matrix;
6. role and permission recommendations;
7. client-support and vulnerability considerations;
8. accessibility requirements;
9. Arabic and bilingual requirements;
10. user-need register;
11. jobs-to-be-performed catalogue;
12. research finding register;
13. interview records;
14. usability findings;
15. notification preferences;
16. trust and assurance requirements;
17. open questions;
18. product implications;
19. research sign-off.

---

# 51. Open Research Questions

The following remain unresolved:

1. Who currently performs client intake?
2. Which clients form Lex Gate’s principal market?
3. Which languages are used in practice?
4. How many clients rely on mobile-only access?
5. How frequently are clients updated?
6. Which channels are considered official?
7. Which client portal features are most valuable?
8. Which matters require hidden-existence restrictions?
9. Which lawyer admission levels are present?
10. How are tasks supervised?
11. Which roles require financial access?
12. How are organization representatives authorized?
13. Which accessibility needs are present among current clients and staff?
14. Which current workflows are most resisted?
15. Which users will participate in the first pilot?
16. Who will provide ongoing client and staff support?
17. Which user groups require stronger identity proofing?
18. Which users require offline or assisted alternatives?

---

# 52. D06 Completion Criteria

D06 shall not be considered complete until:

- each major stakeholder category has been assessed;
- each major internal role has participated or been represented;
- representative client research has been completed where legally and practically appropriate;
- professional authority is separated from system role;
- Arabic and English needs are tested;
- accessibility is assessed;
- user needs are supported by recorded evidence;
- contradictions are documented;
- provisional personas are revised or rejected;
- high-risk actions have named authorities;
- the research findings are reviewed by legal, privacy, operations, and product representatives;
- the sponsor approves the final stakeholder and user model.

---

# 53. Approval Record

## User Research Lead

Name: ______________________________  
Date: ______________________________  
Decision: Complete / Incomplete  
Comments: ______________________________

## Product Lead

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Egyptian Legal Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Accessibility Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Privacy Reviewer

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

# Appendix A — Provisional User Group Summary

| User group | Principal objective | Primary risk |
|---|---|---|
| Prospective client | Reach the right service safely | Oversharing or false expectation |
| Existing client | Understand and act | Misinterpreting status |
| Business representative | Coordinate organization matters | Excessive representative access |
| Supported-access client | Complete tasks equitably | Exclusion |
| Managing lawyer | Govern legal quality and risk | Alert overload or bottleneck |
| Responsible lawyer | Manage matter and professional duty | Missed information or deadline |
| Trainee lawyer | Complete supervised work | Acting beyond authority |
| Legal assistant | Support matter operations | Performing legal acts |
| Intake coordinator | Route enquiries correctly | Giving advice or missing urgency |
| Finance user | Issue and reconcile records | Seeing unnecessary legal content |
| Privacy reviewer | Govern data and records | Conflicting deletion obligations |
| System administrator | Maintain the platform | Excessive substantive access |
| External lawyer | Complete limited assignment | Uncontrolled access duration |
| Firm owner | Govern strategy and performance | Overreliance on incomplete metrics |

---

# Appendix B — Research Session Record

```text
Session ID:
Date:
Method:
Researcher:
Participant role:
User group:
Consent recorded:
Recording:
Confidentiality classification:
Topics:
Observed tasks:
Key statements:
Evidence shown:
Pain points:
Workarounds:
Authority issues:
Privacy issues:
Accessibility issues:
Contradictions:
Provisional findings:
Follow-up:
Retention action:
```

---

# Appendix C — User Research Rule

A product decision shall not be justified by saying:

> “Users want this.”

The decision record must identify:

- which users;
- what underlying need;
- what evidence;
- how frequently it occurs;
- what risk is involved;
- whether the proposed feature is the safest and simplest response.