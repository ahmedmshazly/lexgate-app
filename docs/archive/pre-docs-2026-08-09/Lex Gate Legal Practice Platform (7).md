# Lex Gate Legal Practice Platform  
## D08 — Matter Lifecycle and Standard Operating Procedures

**Document ID:** LG-D08  
**Document Title:** Matter Lifecycle and Standard Operating Procedures  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.1  
**Status:** Proposed Operational Baseline — Firm and Legal Validation Required  
**Classification:** Confidential — Internal Legal Operations Documentation  
**Prepared Date:** 6 August 2026  

**Parent Documents:**

- LG-D01 — Project Charter and Documentation Research Protocol
- LG-D02 — Authoritative Source Register
- LG-D03 — Egyptian Legal and Regulatory Analysis
- LG-D04 — Firm Discovery and Current-State Assessment
- LG-D05 — Product Vision, Scope, Capability Map, and Release Strategy
- LG-D06 — Stakeholder and User Research Report
- LG-D07 — Legal Service Blueprint

---

# 1. Purpose

This document defines the proposed operational lifecycle and Standard Operating Procedures for managing legal work through the Lex Gate Legal Practice Platform.

It establishes:

- controlled lifecycle states;
- permitted state transitions;
- required approvals;
- responsible roles;
- prerequisite information;
- required documentary evidence;
- client-visible and internal statuses;
- exception processes;
- escalation rules;
- audit requirements;
- closure and retention controls;
- relationships among clients, engagements, matters, cases, proceedings, tasks, deadlines, documents, communications, and financial records.

The document is intended to prevent:

- a software status being mistaken for a legal conclusion;
- matters being opened without conflict review;
- client relationships beginning without clear engagement;
- critical deadlines being stored without ownership or evidence;
- internal information being exposed to clients;
- documents being overwritten or losing provenance;
- matters being closed while legal obligations remain active;
- emergency exceptions becoming permanent informal practice;
- automated systems performing lawyer-only decisions.

---

# 2. Document Status

The procedures in this document are proposed future-state procedures.

They require validation against:

- Lex Gate’s actual operating practices;
- the firm’s practice areas;
- lawyer admission and authority levels;
- current Egyptian professional rules;
- applicable procedural laws;
- privacy and records requirements;
- tax and invoicing processes;
- existing staff structure;
- approved technical architecture.

No procedure is final until its legal owner and operational owner approve it.

---

# 3. Operating Model

The Lex Gate operating model shall use four distinct but related concepts.

## 3.1 Client Relationship

The legal and commercial relationship between Lex Gate and an individual or organization.

A client relationship may include multiple engagements and matters.

---

## 3.2 Engagement

The approved scope under which Lex Gate agrees to provide specified legal services to specified represented parties.

An engagement records:

- represented parties;
- scope;
- exclusions;
- fee arrangement;
- responsible lawyer;
- acceptance evidence;
- effective date;
- applicable terms.

---

## 3.3 Matter

The principal internal unit through which Lex Gate organizes legal work.

A matter may be:

- advisory;
- transactional;
- contentious;
- investigative;
- administrative;
- regulatory;
- pre-litigation;
- litigation-related.

---

## 3.4 Case or Proceeding

A formal judicial, prosecutorial, arbitral, administrative, enforcement, or other official proceeding connected to a matter.

A single matter may contain:

- no formal case;
- one case;
- multiple related cases;
- several court levels;
- investigations and subsequent cases;
- enforcement proceedings following judgment.

Matter and case identifiers must not be treated as interchangeable.

---

# 4. Core Record Hierarchy

The proposed hierarchy is:

```text
Organization or Individual
└── Prospective Client Record
    └── Conflict Review
        └── Consultation
            └── Client Relationship
                └── Engagement
                    └── Matter
                        ├── Case or Proceeding
                        │   ├── Procedural Event
                        │   ├── Hearing
                        │   └── Legal Deadline
                        ├── Tasks
                        ├── Documents and Evidence
                        ├── Communications
                        ├── Expenses
                        ├── Invoices and Payments
                        └── Closure and Retention Record
```

Not every enquiry progresses through the full hierarchy.

---

# 5. State Management Principles

## 5.1 State Must Be Explicit

Every controlled record shall have an explicit state.

Examples:

- prospective client: `conflict_pending`;
- engagement: `awaiting_acceptance`;
- matter: `active`;
- deadline: `provisional`;
- document: `under_review`;
- invoice: `issued`.

---

## 5.2 State and Legal Effect Are Separate

A database state shall not independently establish that:

- Lex Gate accepted representation;
- a conflict was legally cleared;
- a deadline is legally correct;
- a document is admissible;
- an electronic signature is legally valid;
- a tax invoice was accepted by the Egyptian Tax Authority.

The state must be supported by evidence and an authorized decision.

---

## 5.3 State Transitions Must Be Controlled

Each material transition must define:

- source state;
- target state;
- initiating role;
- approving role;
- prerequisites;
- validations;
- evidence;
- notifications;
- audit event;
- rollback or correction method.

---

## 5.4 Historical States Must Be Preserved

A transition must not erase prior state history.

The system shall preserve:

- previous state;
- new state;
- actor;
- approver;
- date and time;
- reason;
- supporting evidence;
- applicable policy or rule.

---

## 5.5 Client-Visible States Are Separately Controlled

Internal states may be more detailed than client-visible states.

Example:

| Internal state | Possible client-visible state |
|---|---|
| Conflict investigation in progress | Under review |
| Partner approval pending | Under review |
| Drafting internal strategy | Lex Gate is working on your matter |
| Unconfirmed hearing date | No confirmed hearing date |
| Invoice pending finance approval | No invoice issued |
| Matter closure review | Final review in progress |

The system shall not expose internal terminology without approval.

---

# 6. Standard Roles

The final role assignments depend on D04 discovery.

## 6.1 Project Sponsor or Firm Owner

Responsible for strategic and exceptional business decisions.

---

## 6.2 Managing or Supervising Lawyer

Responsible for:

- professional oversight;
- escalation;
- conflict review;
- exceptional engagement approval;
- supervision;
- high-risk matter review.

---

## 6.3 Responsible Matter Lawyer

Professionally responsible for the matter.

The responsible lawyer owns:

- legal decisions;
- deadline confirmation;
- team supervision;
- client advice;
- matter status;
- closure recommendation.

---

## 6.4 Assigned Lawyer

Performs legal work within assigned authority.

---

## 6.5 Trainee Lawyer

Performs supervised work and cannot independently exercise unapproved lawyer-only authority.

---

## 6.6 Legal Assistant or Matter Coordinator

Performs approved administrative and coordination activities.

---

## 6.7 Intake Coordinator

Receives and organizes prospective-client information without providing unapproved legal advice.

---

## 6.8 Finance User

Prepares financial records from approved engagement and matter information.

---

## 6.9 Finance Approver

Approves issuance or correction of financial records.

---

## 6.10 Records or Compliance Reviewer

Administers retention, legal holds, privacy procedures, and records controls.

---

## 6.11 System Administrator

Maintains technical operation without receiving unrestricted substantive legal access.

---

# 7. Authority Classification

Each controlled action shall be assigned one authority class.

## A0 — Automated Administrative Action

Examples:

- acknowledgement;
- reminder;
- technical upload confirmation;
- duplicate suggestion.

No legal judgment.

---

## A1 — Administrative User Action

Examples:

- enter contact details;
- schedule a consultation;
- upload a document;
- record payment evidence.

---

## A2 — Supervised Legal Support Action

Examples:

- prepare a draft;
- enter proposed deadline;
- classify a document;
- prepare client communication.

Requires lawyer review where legally material.

---

## A3 — Lawyer Decision

Examples:

- confirm legal deadline;
- approve legal communication;
- approve document filing;
- accept matter responsibility.

---

## A4 — Senior or Managing Lawyer Decision

Examples:

- clear complex conflict;
- approve exceptional engagement;
- override matter restriction;
- approve withdrawal from representation.

---

## A5 — External or Regulatory Confirmation

Examples:

- court filing confirmation;
- ETA invoice acceptance;
- ITIDA-regulated signature validation;
- bank payment confirmation.

The system shall distinguish internal approval from external confirmation.

---

# 8. Global Standard Operating Procedure Structure

Every SOP shall contain:

- SOP identifier;
- purpose;
- trigger;
- scope;
- roles;
- prerequisites;
- normal procedure;
- decision points;
- exceptions;
- prohibited actions;
- evidence;
- audit events;
- service measures;
- completion criteria.

---

# 9. SOP-INT-001 — Receive and Register an Enquiry

## 9.1 Purpose

Create a controlled record of initial contact without implying that Lex Gate has accepted representation.

---

## 9.2 Trigger

An enquiry is received through:

- website;
- telephone;
- email;
- social media;
- physical visit;
- referral;
- approved messaging channel.

---

## 9.3 Responsible Roles

**Operational owner:** Intake coordinator  
**Escalation owner:** Authorized lawyer  
**Technical support:** System administrator where delivery failed

---

## 9.4 Minimum Information

Record only what is necessary for initial routing:

- name;
- contact method;
- preferred language;
- general service category;
- brief description;
- known opposing party;
- known urgent date;
- source of enquiry;
- authority if acting for another person.

---

## 9.5 Procedure

1. Create a unique enquiry ID.
2. Record receipt channel and timestamp.
3. Check for possible duplicate enquiries.
4. Record preferred contact language.
5. classify initial urgency;
6. send an acknowledgement;
7. state that representation has not yet been accepted;
8. assign an intake owner;
9. request only the minimum missing information;
10. escalate potentially urgent matters to a lawyer.

---

## 9.6 States

- `new`
- `acknowledged`
- `awaiting_information`
- `ready_for_triage`
- `urgent_review`
- `duplicate`
- `closed_without_progression`

---

## 9.7 Prohibited Actions

Intake personnel shall not:

- guarantee acceptance;
- guarantee an outcome;
- confirm a final legal deadline;
- request complete sensitive evidence through an unsecured channel;
- disclose information about another client;
- classify a conflict as cleared.

---

## 9.8 Evidence

- enquiry record;
- acknowledgement;
- duplicate links;
- information requests;
- urgency escalation;
- closure reason.

---

## 9.9 Audit Events

- enquiry created;
- owner assigned;
- urgency changed;
- duplicate linked;
- enquiry closed;
- information exported.

---

## 9.10 Completion Criteria

The SOP ends when the enquiry is:

- ready for preliminary triage;
- marked duplicate;
- closed with documented reason;
- escalated for urgent legal review.

---

# 10. SOP-INT-002 — Preliminary Triage

## 10.1 Purpose

Determine the appropriate next operational step without making a final legal assessment.

---

## 10.2 Prerequisites

- enquiry registered;
- sufficient contact information;
- sufficient general description;
- initial party information where available.

---

## 10.3 Procedure

1. Review the general request.
2. Identify likely practice area.
3. identify apparent urgency;
4. identify whether Lex Gate appears to handle the category;
5. identify missing conflict information;
6. determine whether lawyer review is required before further contact;
7. assign triage state;
8. communicate the next step.

---

## 10.4 Triage Outcomes

- proceed to conflict-information collection;
- schedule consultation subject to conflict review;
- obtain further information;
- urgent lawyer review;
- apparent out-of-scope;
- unsuitable or abusive enquiry;
- duplicate existing matter;
- close without engagement.

---

## 10.5 Control

The triage classification shall not be presented as a final legal opinion.

---

# 11. SOP-CFL-001 — Perform Conflict Screening

## 11.1 Purpose

Identify relationships or interests that may prevent, restrict, or condition Lex Gate’s acceptance or continuation of work.

---

## 11.2 Trigger

Conflict screening is required:

- before consultation where substantive confidential information may be exchanged;
- before engagement;
- when a new party is added;
- when matter scope materially changes;
- when a new lawyer joins;
- when a matter is transferred;
- when a related matter is discovered.

---

## 11.3 Roles

**Search preparation:** Intake or authorized support user  
**Legal reviewer:** Authorized lawyer  
**Complex escalation:** Managing lawyer  
**Access:** Restricted to approved conflict personnel

---

## 11.4 Required Information

As applicable:

- prospective client;
- represented parties;
- adverse parties;
- affiliates;
- beneficial owners;
- directors;
- family members;
- witnesses;
- experts;
- prior lawyers;
- transaction or property;
- related matters;
- alternative names.

---

## 11.5 Search Procedure

1. Confirm party information.
2. normalize Arabic and English names;
3. create transliteration and spelling variants;
4. search prospective clients;
5. search active clients;
6. search former clients;
7. search rejected enquiries where retained;
8. search matter parties and related persons;
9. review possible matches;
10. record search scope and results;
11. submit for legal decision.

---

## 11.6 Conflict Decision States

- `pending_information`
- `search_complete`
- `legal_review_required`
- `cleared`
- `cleared_with_conditions`
- `possible_conflict`
- `prohibited`
- `senior_review`
- `emergency_provisional`

---

## 11.7 Decision Requirements

The legal reviewer shall record:

- decision;
- rationale;
- relationships considered;
- applicable conditions;
- access restrictions;
- required approvals;
- review date;
- whether renewed screening is required.

---

## 11.8 Prohibited Actions

The system shall not:

- auto-clear a conflict;
- disclose another client’s identity to the prospective client;
- delete conflicting search results;
- permit ordinary matter work while conflict status is prohibited;
- treat lack of exact name match as clearance.

---

## 11.9 Emergency Provisional Procedure

Permitted only where delay may materially harm a prospective client.

Required:

- written reason;
- authorized lawyer;
- precisely limited work;
- restricted access;
- expiry time;
- unresolved conflict information;
- immediate senior review.

The provisional state shall expire automatically and block further work unless renewed by an authorized decision.

---

## 11.10 Evidence

- names searched;
- normalized values;
- systems searched;
- search time;
- results;
- reviewer;
- decision;
- approval;
- conditions;
- waiver or other supporting document where approved.

---

# 12. SOP-CNS-001 — Schedule and Conduct Consultation

## 12.1 Purpose

Provide a controlled consultation while preserving correct expectations regarding representation.

---

## 12.2 Prerequisites

- sufficient conflict status;
- appropriate lawyer assigned;
- consultation terms communicated;
- payment conditions established where applicable;
- required accessibility or interpretation support arranged.

---

## 12.3 Preparation Procedure

1. Confirm appointment format.
2. confirm participants;
3. confirm lawyer authority;
4. request appropriate preliminary documents;
5. provide consultation scope;
6. provide payment instructions;
7. provide cancellation and rescheduling rules;
8. ensure secure meeting access.

---

## 12.4 Consultation Procedure

The lawyer shall:

1. verify participants and their roles;
2. explain consultation scope;
3. confirm representation has not necessarily begun;
4. obtain and distinguish facts, allegations, and assumptions;
5. identify urgent dates;
6. identify missing information;
7. explain preliminary options and uncertainty;
8. state next steps;
9. avoid unsupported guarantees.

---

## 12.5 Consultation Outcome States

- `further_information_required`
- `engagement_review`
- `conflict_reassessment`
- `declined`
- `referred`
- `consultation_complete_no_engagement`
- `emergency_action_review`

---

## 12.6 Evidence

- attendance;
- participants;
- lawyer;
- consultation notes;
- documents reviewed;
- identified dates;
- outcome;
- client follow-up;
- payment record.

---

# 13. SOP-ENG-001 — Decide Whether to Accept Representation

## 13.1 Purpose

Ensure that Lex Gate accepts work only after legal, professional, operational, and commercial review.

---

## 13.2 Decision Factors

- conflict status;
- professional competence;
- lawyer admission level;
- capacity;
- matter risk;
- client identity;
- authority to instruct;
- scope clarity;
- fee feasibility;
- payment conditions;
- ethical concerns;
- information completeness;
- data-processing implications;
- geographic and procedural requirements.

---

## 13.3 Decision States

- `accept`
- `accept_with_conditions`
- `further_review`
- `further_information`
- `decline_conflict`
- `decline_scope`
- `decline_capacity`
- `decline_risk`
- `decline_other_approved_reason`

---

## 13.4 Procedure

1. Review conflict decision.
2. review consultation information;
3. identify represented parties;
4. define proposed scope;
5. identify responsible lawyer;
6. assess capacity and authority;
7. assess fees and costs;
8. document risks and conditions;
9. issue decision;
10. communicate approved outcome.

---

## 13.5 Non-Engagement Communication

The communication should confirm:

- Lex Gate has not accepted representation;
- the person remains responsible for relevant deadlines;
- any limited information supplied does not constitute continuing advice;
- document return or retention position;
- approved referral information where appropriate.

---

## 13.6 Evidence

- decision;
- decision-maker;
- reason;
- conditions;
- client communication;
- delivery evidence;
- retention classification.

---

# 14. SOP-ENG-002 — Prepare and Approve Engagement

## 14.1 Purpose

Create a clear and approved professional relationship.

---

## 14.2 Prerequisites

- acceptance decision;
- conflict clearance;
- identified client;
- identified represented parties;
- responsible lawyer;
- approved fee structure;
- verified Lex Gate legal identity.

---

## 14.3 Engagement Content

At minimum:

- Lex Gate identity;
- client identity;
- represented parties;
- matter scope;
- exclusions;
- responsible lawyer;
- client responsibilities;
- fee arrangement;
- expenses;
- payment terms;
- communication methods;
- termination rules;
- document handling;
- privacy information;
- effective date;
- signature or acceptance method.

---

## 14.4 Procedure

1. Select approved template.
2. populate controlled fields;
3. review scope;
4. review fee terms;
5. review client and representative authority;
6. complete required legal and financial approvals;
7. generate immutable engagement version;
8. deliver securely;
9. obtain approved acceptance;
10. validate acceptance;
11. record effective date.

---

## 14.5 Engagement States

- `draft`
- `internal_review`
- `approved_for_client`
- `sent`
- `awaiting_acceptance`
- `accepted_pending_conditions`
- `active`
- `declined`
- `expired`
- `superseded`
- `terminated`

---

## 14.6 Activation Conditions

The engagement may become active only when required conditions are satisfied.

Possible conditions:

- signed engagement;
- verified representative authority;
- required payment;
- power of attorney;
- identity verification;
- required documentation;
- senior approval.

---

## 14.7 Prohibited Actions

- editing an accepted engagement without a new version;
- treating payment alone as acceptance;
- using an unapproved template;
- classifying a checkbox as a regulated signature without legal basis;
- opening a normal matter before engagement prerequisites.

---

# 15. SOP-MAT-001 — Open a Matter

## 15.1 Purpose

Create a complete, authorized, and appropriately restricted operational record.

---

## 15.2 Prerequisites

- active engagement or approved emergency exception;
- conflict clearance;
- responsible lawyer;
- defined represented parties;
- approved scope;
- confidentiality classification;
- initial fee arrangement;
- known urgent dates recorded.

---

## 15.3 Procedure

1. Generate matter ID.
2. assign matter title;
3. assign client and represented parties;
4. assign responsible lawyer;
5. assign supervising lawyer where required;
6. assign authorized team;
7. select matter type;
8. establish confidentiality class;
9. record initial cases or proceedings;
10. record known legal events and dates;
11. create initial tasks;
12. establish document structure;
13. configure client visibility;
14. configure financial structure;
15. complete opening checklist;
16. approve activation.

---

## 15.4 Matter States

- `opening`
- `opening_review`
- `active`
- `waiting_for_client`
- `waiting_for_authority`
- `stayed`
- `dormant`
- `restricted`
- `closing_review`
- `closed`
- `archived`
- `reopened`

---

## 15.5 Matter Access States

Access shall be separately represented as:

- `ordinary_matter_access`
- `restricted_team_only`
- `existence_restricted`
- `external_collaboration_limited`
- `temporarily_suspended`

---

## 15.6 Matter-Opening Checklist

Required:

- conflict decision;
- engagement;
- client identity;
- represented-party list;
- adverse-party list;
- responsible lawyer;
- authorized team;
- scope;
- matter classification;
- confidentiality;
- critical dates;
- document categories;
- client contact method;
- fee arrangement;
- portal decision;
- retention class placeholder.

---

## 15.7 Emergency Opening

An emergency matter shall have:

- `emergency_provisional` marker;
- responsible lawyer;
- reason;
- permitted actions;
- prohibited actions;
- expiry;
- unresolved prerequisites;
- senior review task.

---

# 16. SOP-MAT-002 — Maintain Matter Information

## 16.1 Purpose

Ensure that the matter record remains accurate, complete, and professionally controlled.

---

## 16.2 Required Ongoing Information

- current responsible lawyer;
- active team;
- represented parties;
- opposing and related parties;
- matter status;
- active cases;
- upcoming events;
- confirmed deadlines;
- client communication state;
- pending approvals;
- financial state;
- restrictions;
- legal holds.

---

## 16.3 Material Change Triggers

A material change includes:

- new party;
- new case;
- new court level;
- changed scope;
- new conflict concern;
- lawyer reassignment;
- new client representative;
- new critical deadline;
- settlement;
- judgment;
- appeal;
- client termination;
- Lex Gate withdrawal.

Each material change shall trigger relevant reassessment.

---

# 17. SOP-CAS-001 — Create and Manage a Case or Proceeding

## 17.1 Purpose

Represent formal proceedings separately from the general matter.

---

## 17.2 Required Case Information

- case identifier;
- related matter;
- official case number;
- year;
- court or authority;
- circuit, chamber, or division;
- proceeding type;
- parties and procedural roles;
- filing date;
- current procedural stage;
- governing procedural regime;
- assigned lawyer;
- source evidence;
- official status verification date.

---

## 17.3 Case States

- `pre_filing`
- `filing_preparation`
- `filed_pending_confirmation`
- `active`
- `stayed`
- `reserved_for_judgment`
- `judgment_issued`
- `appeal_review`
- `appealed`
- `final_subject_to_confirmation`
- `enforcement`
- `closed`

---

## 17.4 State-Control Rules

- `filed_pending_confirmation` shall not display as officially filed.
- `judgment_issued` requires source evidence.
- `final_subject_to_confirmation` must not be represented as unconditionally final.
- appeal review shall identify relevant deadlines and responsible lawyer.
- a case may close while the broader matter remains active.

---

## 17.5 External Status

Every externally obtained status shall record:

- source;
- checker;
- check time;
- method;
- evidence;
- confidence;
- next verification date.

---

# 18. SOP-DLN-001 — Record and Confirm a Legal Deadline

## 18.1 Purpose

Ensure that legally material dates are evidence-based, reviewed, owned, and escalated.

---

## 18.2 Deadline Types

- limitation period;
- appeal deadline;
- filing deadline;
- hearing date;
- response deadline;
- payment deadline with legal consequence;
- notice deadline;
- internal preparation deadline;
- client-request deadline.

---

## 18.3 Deadline Fields

- deadline ID;
- matter;
- case;
- type;
- triggering event;
- trigger date;
- legal source;
- source document;
- proposed calculation;
- proposed deadline;
- confirmed deadline;
- responsible lawyer;
- verifier;
- timezone;
- confidence;
- exceptions;
- reminder schedule;
- escalation schedule;
- state.

---

## 18.4 Deadline States

- `identified_unreviewed`
- `provisional`
- `awaiting_source`
- `awaiting_confirmation`
- `confirmed`
- `disputed`
- `changed`
- `satisfied`
- `missed`
- `cancelled_with_reason`

---

## 18.5 Procedure

1. Record triggering event.
2. preserve source evidence;
3. identify applicable rule version;
4. calculate proposed deadline;
5. identify exceptions and holidays where applicable;
6. assign responsible lawyer;
7. submit for confirmation;
8. confirm or dispute;
9. create reminders;
10. create preparation tasks;
11. communicate to client where required.

---

## 18.6 Control Rules

- machine-calculated dates remain provisional;
- internal deadlines must not replace legal deadlines;
- changes must preserve prior values;
- a task completion does not satisfy a deadline automatically;
- a matter cannot close with unresolved active critical deadlines;
- a deadline cannot be deleted without approved reason.

---

## 18.7 Escalation Pattern

A critical deadline may include:

- initial responsible-lawyer reminder;
- team reminder;
- supervisory escalation;
- management escalation;
- incident escalation if overdue or unresolved.

Exact timing shall be configured by deadline type.

---

# 19. SOP-HRG-001 — Prepare for and Record a Hearing

## 19.1 Purpose

Coordinate legal preparation, attendance, outcome recording, and client communication.

---

## 19.2 Hearing Record

- court or authority;
- case;
- date and time;
- location;
- circuit;
- purpose;
- assigned attending lawyer;
- attendance requirement;
- client attendance;
- documents required;
- preparation tasks;
- source;
- status.

---

## 19.3 Hearing States

- `proposed`
- `confirmed`
- `preparation`
- `ready`
- `attended`
- `postponed`
- `cancelled`
- `outcome_pending_review`
- `outcome_recorded`

---

## 19.4 Preparation Procedure

1. Verify hearing source.
2. assign attending lawyer;
3. confirm authority and availability;
4. identify required documents;
5. assign preparation tasks;
6. verify client attendance requirements;
7. create contingency plan;
8. complete readiness review.

---

## 19.5 Post-Hearing Procedure

1. Record attendance.
2. record outcome;
3. upload supporting evidence;
4. identify new dates;
5. identify required actions;
6. confirm deadlines;
7. create tasks;
8. prepare client update;
9. obtain lawyer approval;
10. send and record communication.

---

## 19.6 Failure Scenarios

- lawyer unavailable;
- hearing postponed;
- court information inconsistent;
- missing document;
- client absent;
- outcome not confirmed;
- external portal unavailable.

A manual escalation path is mandatory.

---

# 20. SOP-TSK-001 — Assign and Complete Legal Work

## 20.1 Purpose

Ensure work is assigned with sufficient context, authority, review, and evidence.

---

## 20.2 Task Fields

- task ID;
- matter;
- case;
- task type;
- instructions;
- assigner;
- assignee;
- professional authority required;
- priority;
- due date;
- related deadline;
- dependencies;
- review requirement;
- confidentiality;
- status.

---

## 20.3 Task States

- `draft`
- `assigned`
- `accepted`
- `in_progress`
- `blocked`
- `submitted_for_review`
- `changes_requested`
- `approved`
- `completed`
- `cancelled`

---

## 20.4 Procedure

1. Define outcome.
2. identify required authority;
3. assign appropriate user;
4. provide source material;
5. set due date;
6. identify review requirement;
7. assignee accepts or raises issue;
8. work is performed;
9. output submitted;
10. reviewer approves or requests changes;
11. completion evidence recorded.

---

## 20.5 Control Rules

- assignment does not prove acceptance;
- completion does not prove legal approval;
- trainee output cannot become client visible without required review;
- blocked tasks must state reason and escalation;
- critical task cancellation requires approval;
- overdue task alerts must respect matter confidentiality.

---

# 21. SOP-DOC-001 — Receive and Classify a Document

## 21.1 Purpose

Preserve document integrity, provenance, confidentiality, and matter context.

---

## 21.2 Intake Sources

- client portal;
- email;
- physical delivery;
- court or authority;
- lawyer;
- external collaborator;
- scanner;
- approved integration.

---

## 21.3 Procedure

1. Record source and receipt time.
2. perform technical safety checks;
3. preserve original file;
4. calculate cryptographic hash;
5. assign matter;
6. classify document type;
7. record original, copy, or derivative status;
8. assign confidentiality;
9. assign client visibility;
10. assign retention class;
11. create reviewer task;
12. create derivative preview or searchable text where approved.

---

## 21.4 Document States

- `received`
- `quarantined`
- `pending_classification`
- `pending_review`
- `incomplete`
- `unreadable`
- `accepted`
- `draft`
- `under_review`
- `approved`
- `final`
- `signed`
- `superseded`
- `returned`
- `held`
- `destroyed`

---

## 21.5 Control Rules

- original must not be overwritten;
- OCR output is a derivative;
- translation is a derivative;
- redaction is a derivative;
- final status requires authorized approval;
- client-visible status requires separate publication approval;
- deletion is not an ordinary document action.

---

# 22. SOP-DOC-002 — Prepare, Review, and Finalize a Legal Document

## 22.1 Purpose

Control the creation and approval of legal output.

---

## 22.2 Procedure

1. Select approved template or approved blank document type.
2. record template version;
3. identify author;
4. identify source materials;
5. draft;
6. perform factual verification;
7. perform legal review;
8. perform language and formatting review where required;
9. resolve comments;
10. approve final content;
11. lock final version;
12. sign or file where applicable;
13. record external submission;
14. classify client visibility.

---

## 22.3 Review Classes

- administrative review;
- factual review;
- legal review;
- supervisory review;
- client approval;
- financial review;
- external confirmation.

---

## 22.4 Prohibited Actions

- overwriting signed version;
- deleting review history;
- using an obsolete template silently;
- presenting AI output as lawyer-approved before review;
- filing a draft;
- sharing internal comments with a client accidentally.

---

# 23. SOP-EVD-001 — Manage Evidence and Chain of Custody

## 23.1 Purpose

Preserve the source, integrity, movement, and handling of evidence.

---

## 23.2 Evidence Record

- evidence ID;
- matter;
- case;
- description;
- source;
- received by;
- receipt date and time;
- original or copy;
- physical or electronic;
- hash or seal;
- storage location;
- custody holder;
- transfers;
- derivatives;
- access history;
- condition;
- legal hold;
- return or disposition.

---

## 23.3 Procedure

1. Identify evidence.
2. record source;
3. preserve original;
4. assign custody;
5. record integrity evidence;
6. restrict access;
7. record every transfer;
8. generate working copies where approved;
9. prevent alteration of original;
10. document return, filing, or lawful destruction.

---

## 23.4 Control

The platform may support chain-of-custody evidence but shall not represent that technical records alone determine admissibility.

---

# 24. SOP-COM-001 — Send a Client Communication

## 24.1 Purpose

Ensure that material communications are accurate, authorized, sent to the correct recipient, and preserved.

---

## 24.2 Communication Types

- acknowledgement;
- administrative update;
- request;
- appointment;
- legal advice;
- deadline notice;
- judgment update;
- formal notice;
- financial communication;
- security communication;
- closure communication.

---

## 24.3 Procedure

1. Select communication type.
2. confirm matter;
3. confirm recipients and authority;
4. draft content;
5. classify legal significance;
6. attach correct approved documents;
7. obtain required review;
8. select approved channel;
9. send;
10. record delivery state;
11. require acknowledgement where applicable;
12. follow up on failure.

---

## 24.4 Communication States

- `draft`
- `under_review`
- `approved`
- `scheduled`
- `sent`
- `delivered`
- `viewed`
- `acknowledged`
- `failed`
- `cancelled`
- `superseded`

---

## 24.5 Control Rules

- delivery is not acknowledgement;
- notification is not legal advice;
- message previews must minimize sensitive details;
- client-visible attachments require approval;
- recipient changes after approval require renewed review where material;
- failed legal-critical communications require escalation.

---

# 25. SOP-PRT-001 — Publish Information to the Client Portal

## 25.1 Purpose

Prevent accidental disclosure of internal or restricted matter information.

---

## 25.2 Publishable Items

Potentially:

- approved matter update;
- document;
- appointment;
- request;
- invoice;
- receipt;
- engagement;
- communication.

---

## 25.3 Procedure

1. Select item.
2. confirm client or representative;
3. verify portal authority;
4. confirm matter scope;
5. preview client view;
6. review document version;
7. review redaction;
8. set access and expiry;
9. approve publication;
10. publish;
11. record access and acknowledgement.

---

## 25.4 Prohibited Publication

- internal notes;
- conflict analysis;
- lawyer-only strategy;
- unapproved draft;
- unrelated-party information;
- privileged material not intended for client distribution;
- security or administrative records.

---

# 26. SOP-BIL-001 — Record Fee Arrangement

## 26.1 Purpose

Ensure billing is derived from approved engagement terms.

---

## 26.2 Fee Arrangement Fields

- engagement;
- matter;
- fee type;
- amount or rate;
- stages;
- expenses;
- tax treatment;
- payment schedule;
- currency;
- approver;
- effective date;
- superseded date.

---

## 26.3 Fee Types

Subject to legal and accountant approval:

- fixed fee;
- stage-based fee;
- hourly fee;
- consultation fee;
- recurring advisory fee;
- mixed approved arrangement.

Unsupported arrangements must require escalation.

---

# 27. SOP-BIL-002 — Prepare and Issue an Invoice

## 27.1 Purpose

Create an accurate financial record using approved information and applicable tax processes.

---

## 27.2 Procedure

1. Confirm client and payer.
2. confirm engagement and matter;
3. retrieve approved fee and expense data;
4. verify tax treatment;
5. prepare invoice draft;
6. perform finance review;
7. obtain required approval;
8. submit through ETA process where applicable;
9. preserve ETA response;
10. issue final invoice;
11. publish or send to authorized recipient;
12. record outstanding amount.

---

## 27.3 Invoice States

- `draft`
- `pending_approval`
- `approved`
- `pending_eta_submission`
- `eta_rejected`
- `eta_accepted`
- `issued`
- `partially_paid`
- `paid`
- `overdue`
- `cancelled_through_approved_process`
- `credited`
- `superseded`

---

## 27.4 Control Rules

- issued invoice shall not be overwritten;
- ETA rejection must be preserved;
- tax status cannot be invented by the application;
- payer and client may differ;
- finance users receive only necessary matter information;
- correction must use an approved financial process.

---

# 28. SOP-BIL-003 — Record and Reconcile Payment

## 28.1 Purpose

Accurately connect received money to the proper client, invoice, and matter.

---

## 28.2 Procedure

1. Record payment evidence.
2. identify payer;
3. identify amount and currency;
4. identify payment channel;
5. identify proposed invoice;
6. reconcile;
7. resolve differences;
8. record final allocation;
9. issue receipt where required;
10. update client-visible balance.

---

## 28.3 Payment States

- `unidentified`
- `pending_reconciliation`
- `partially_reconciled`
- `reconciled`
- `refunded`
- `reversed`
- `disputed`

---

## 28.4 Control

Payment receipt shall not automatically:

- create engagement;
- close an invoice incorrectly;
- authorize work outside scope;
- alter the issued invoice.

---

# 29. SOP-ACC-001 — Grant Matter Access

## 29.1 Purpose

Ensure that matter access is necessary, approved, limited, and reviewable.

---

## 29.2 Access Request Fields

- user;
- matter;
- requested permission;
- reason;
- role;
- duration;
- requester;
- approver;
- restrictions;
- review date.

---

## 29.3 Procedure

1. Submit access request.
2. verify user status;
3. verify professional or operational need;
4. check restrictions and conflicts;
5. obtain matter-owner approval;
6. obtain additional approval for restricted matters;
7. grant minimum necessary access;
8. notify user;
9. record review or expiry date.

---

## 29.4 Access States

- `requested`
- `under_review`
- `approved`
- `active`
- `suspended`
- `expired`
- `revoked`
- `denied`

---

## 29.5 Prohibited Access Practices

- automatic access to all matters by seniority;
- permanent support access;
- shared accounts;
- unrestricted administrator access;
- inheritance of access from related matters;
- access without owner or reason.

---

# 30. SOP-PEO-001 — Onboard a Lawyer or Employee

## 30.1 Purpose

Create controlled system access based on verified role and authority.

---

## 30.2 Procedure

1. Verify identity.
2. verify employment or engagement status;
3. verify lawyer registration where applicable;
4. assign organizational role;
5. obtain confidentiality acknowledgement;
6. approve account creation;
7. configure authentication and MFA;
8. assign baseline access;
9. assign matter access separately;
10. provide training;
11. confirm account activation.

---

## 30.3 Evidence

- identity verification;
- professional status;
- approval;
- confidentiality acknowledgement;
- training;
- account creation;
- role assignment;
- device assignment.

---

# 31. SOP-PEO-002 — Offboard a Lawyer or Employee

## 31.1 Purpose

Protect client information and preserve continuity when a person departs or loses access.

---

## 31.2 Trigger

- resignation;
- dismissal;
- contract end;
- suspension;
- security concern;
- extended leave where access should change;
- role change.

---

## 31.3 Immediate Security Procedure

1. Record offboarding trigger.
2. suspend or revoke access according to risk;
3. terminate active sessions;
4. revoke tokens and application credentials;
5. protect email and communication records;
6. secure devices;
7. preserve logs.

Security suspension may occur before the legal employment process is complete.

---

## 31.4 Operational Procedure

1. identify assigned matters;
2. assign new responsible users;
3. transfer tasks;
4. review deadlines;
5. preserve documents and messages;
6. remove group and external access;
7. recover devices and records;
8. review recent exports;
9. confirm completion.

---

## 31.5 Control

Employment status and system-access status shall remain separate.

---

# 32. SOP-REV-001 — Conduct Periodic Matter Review

## 32.1 Purpose

Identify legal, operational, client-service, financial, and access risks.

---

## 32.2 Review Categories

- responsibility;
- deadlines;
- tasks;
- client communication;
- documents;
- financial status;
- access;
- legal holds;
- inactivity;
- closure eligibility.

---

## 32.3 Matter Health States

- `healthy`
- `attention_required`
- `high_risk`
- `critical`
- `closure_candidate`

These are operational indicators and not legal conclusions.

---

## 32.4 Procedure

1. Review responsible lawyer.
2. review upcoming deadlines;
3. review overdue tasks;
4. review client-update interval;
5. review missing documents;
6. review access;
7. review financial state;
8. review inactivity;
9. assign corrective tasks;
10. escalate critical risks.

---

# 33. SOP-CLS-001 — Close a Matter

## 33.1 Purpose

Conclude active work safely without losing continuing obligations.

---

## 33.2 Closure Triggers

- work completed;
- judgment or outcome;
- settlement;
- client termination;
- Lex Gate withdrawal;
- transfer;
- approved inactivity closure;
- inability to continue.

---

## 33.3 Closure Prerequisites

- responsible lawyer review;
- legal status recorded;
- active deadlines reviewed;
- client informed;
- documents reviewed;
- client property accounted for;
- financial position recorded;
- access review;
- retention class identified;
- legal hold checked.

---

## 33.4 Procedure

1. Initiate closure review.
2. record reason;
3. review procedural status;
4. review appeal or challenge rights;
5. review active deadlines;
6. prepare final client communication;
7. account for documents and client property;
8. review invoices and payments;
9. determine portal access;
10. review team access;
11. assign retention;
12. approve closure;
13. archive according to policy.

---

## 33.5 Closure States

- `closure_requested`
- `closure_review`
- `awaiting_client_action`
- `awaiting_finance`
- `awaiting_document_return`
- `closed`
- `closed_financially_open`
- `transferred`
- `archived`
- `reopened`

---

## 33.6 Closure Blocking Conditions

Closure shall be blocked or require exceptional approval where:

- critical deadline remains unresolved;
- legal responsibility remains active;
- court status is unknown;
- client has not been informed;
- client original documents remain unaccounted for;
- legal hold status is unresolved;
- matter ownership transfer is incomplete.

Outstanding payment alone may not prevent legal closure, but financial status must remain active and visible where appropriate.

---

# 34. SOP-REC-001 — Archive and Retain Matter Records

## 34.1 Purpose

Apply an approved records lifecycle after closure.

---

## 34.2 Procedure

1. Confirm matter closure.
2. identify record classes;
3. identify retention triggers;
4. calculate proposed retention date;
5. identify legal holds;
6. reduce ordinary access;
7. preserve required indexes;
8. schedule review or destruction;
9. record backup treatment;
10. maintain retrieval procedure.

---

## 34.3 Archive States

- `active_archive`
- `restricted_archive`
- `legal_hold`
- `retention_review`
- `destruction_approved`
- `destroyed`
- `permanent_retention_if_legally_approved`

---

## 34.4 Control Rules

- indefinite retention requires approved justification;
- account closure does not delete records;
- legal hold overrides destruction;
- backup lifecycle must align with destruction;
- archived records remain subject to confidentiality.

---

# 35. SOP-REC-002 — Destroy Records

## 35.1 Purpose

Ensure that destruction is lawful, approved, complete, and evidenced.

---

## 35.2 Procedure

1. Identify eligible records.
2. verify retention completion;
3. verify no legal hold;
4. verify no active matter dependency;
5. obtain legal and records approval;
6. identify all copies and derivatives;
7. execute destruction;
8. record method;
9. confirm backup expiry or deletion process;
10. create destruction certificate.

---

## 35.3 Prohibited Actions

- ordinary user deletion of retained records;
- destruction without record class;
- destruction during investigation;
- destruction based solely on client account closure;
- deletion of audit evidence needed to prove destruction.

---

# 36. SOP-PRV-001 — Handle a Data-Subject Request

## 36.1 Purpose

Manage privacy requests without compromising another person’s rights, professional secrecy, or legal obligations.

---

## 36.2 Procedure

1. Register request.
2. verify requester identity;
3. determine request type;
4. identify scope;
5. identify affected systems and records;
6. assess professional secrecy and legal restrictions;
7. identify third-party information;
8. obtain legal and privacy review;
9. approve response;
10. provide response securely;
11. preserve decision evidence.

---

## 36.3 Request Types

- access;
- correction;
- restriction;
- objection;
- withdrawal;
- deletion;
- information request.

---

## 36.4 Control

No automated export or deletion shall occur without review.

---

# 37. SOP-INC-001 — Handle a Security or Privacy Incident

## 37.1 Purpose

Detect, contain, assess, notify, recover, and learn from incidents.

---

## 37.2 Incident Examples

- wrong document recipient;
- compromised account;
- public document exposure;
- device loss;
- unauthorized export;
- malware;
- system outage;
- data corruption;
- failed deadline control;
- incorrect portal visibility.

---

## 37.3 Procedure

1. Record incident awareness time.
2. classify initial severity;
3. contain;
4. preserve evidence;
5. notify security, privacy, and legal roles;
6. identify affected matters and persons;
7. assess confidentiality and personal-data impact;
8. assess legal deadline impact;
9. determine regulatory or client notification;
10. recover service;
11. verify corrective action;
12. complete root-cause review;
13. approve closure.

---

## 37.4 Incident States

- `reported`
- `triage`
- `contained`
- `investigating`
- `notification_review`
- `recovery`
- `monitoring`
- `closed`
- `reopened`

---

## 37.5 Control

Incident records shall be protected from ordinary alteration.

---

# 38. SOP-CMP-001 — Handle a Complaint

## 38.1 Purpose

Provide fair, documented, confidential review of service complaints.

---

## 38.2 Procedure

1. Register complaint.
2. acknowledge receipt;
3. classify type and urgency;
4. preserve relevant evidence;
5. identify independent reviewer;
6. assess legal, professional, financial, privacy, and security implications;
7. request necessary clarification;
8. investigate;
9. approve response;
10. communicate outcome;
11. assign corrective actions;
12. close with evidence.

---

## 38.3 Control

The person complained about shall not have sole control over the review.

---

# 39. Exception Management

## 39.1 Exception Definition

An exception is a controlled departure from an approved procedure.

Examples:

- emergency matter opening;
- temporary restricted access;
- work before full document receipt;
- manual invoice process during external outage;
- client unable to use portal;
- lawyer substitution before a hearing.

---

## 39.2 Required Exception Record

- exception ID;
- SOP affected;
- reason;
- legal urgency;
- approving authority;
- scope;
- permitted actions;
- prohibited actions;
- start;
- expiry;
- compensating controls;
- review;
- closure.

---

## 39.3 Exception Rule

No exception shall:

- become permanent silently;
- remove required evidence;
- permit unauthorized legal advice;
- bypass conflict review without senior approval;
- permit unrestricted access;
- eliminate later reconciliation.

---

# 40. Override Management

An override is a high-risk exception that bypasses a system control.

Examples:

- accessing a restricted matter;
- reopening a closed period;
- correcting a confirmed deadline;
- bypassing a normal approval sequence.

Every override requires:

- enhanced authentication;
- reason;
- authority;
- affected records;
- automatic audit event;
- post-action review;
- client or regulatory assessment where necessary.

---

# 41. RACI Baseline

The final RACI depends on D04.

| Procedure | Intake | Responsible lawyer | Supervising lawyer | Assistant | Finance | Compliance | System admin |
|---|---|---|---|---|---|---|---|
| Register enquiry | R | I | I | C | — | I | C |
| Triage | R | A/C | C | C | — | — | — |
| Conflict search | R/C | A | A for complex | C | — | I | — |
| Accept client | I | R/A | A for exceptions | — | C | C | — |
| Approve engagement | C | R/A | A where required | C | C | C | — |
| Open matter | C | A | C | R | C | I | — |
| Confirm deadline | — | R/A | C/A for high risk | C | — | — | — |
| Prepare legal document | — | A | C/A | R/C | — | — | — |
| Publish to portal | — | A | C | R | C for finance | I | — |
| Issue invoice | — | C | I | — | R/A | I | — |
| Grant matter access | — | A | A for restricted | — | — | C | R technically |
| Close matter | — | R/A | C/A | C | C | C | — |
| Destroy records | — | C | A | — | C | R/A | R technically |
| Handle incident | I | C | C | I | C | R/A | R |

**R:** Responsible  
**A:** Accountable  
**C:** Consulted  
**I:** Informed

---

# 42. Mandatory Audit Events

The system shall audit at least:

- enquiry creation and closure;
- urgency classification;
- conflict searches and decisions;
- consultation completion;
- client acceptance or rejection;
- engagement approval and acceptance;
- matter opening;
- responsible-lawyer change;
- matter access changes;
- case-state changes;
- deadline creation, confirmation, and correction;
- hearing changes;
- task approval;
- document finalization;
- client publication;
- evidence custody transfer;
- communication approval and sending;
- invoice issuance and correction;
- payment reconciliation;
- matter closure;
- retention assignment;
- legal hold;
- destruction;
- privacy request;
- complaint;
- incident;
- administrative override.

---

# 43. Notification and Escalation Rules

## 43.1 Legal-Critical

Examples:

- unresolved conflict;
- unconfirmed deadline;
- imminent hearing;
- failed legal communication;
- missing responsible lawyer;
- compromised restricted matter.

Requires:

- assigned owner;
- repeated escalation;
- acknowledgement;
- management visibility;
- resolution evidence.

---

## 43.2 Client-Critical

Examples:

- failed consultation confirmation;
- unreadable requested document;
- unanswered client request;
- rejected payment.

Requires:

- owner;
- response target;
- alternative channel;
- closure evidence.

---

## 43.3 Operational

Examples:

- non-critical report delay;
- template review reminder.

May use ordinary task reminders.

---

# 44. Procedure Metrics

Final targets require baseline evidence.

## Intake

- acknowledgement time;
- unassigned enquiry count;
- duplicate rate;
- urgent-escalation time.

## Conflict

- review time;
- incomplete search rate;
- reopened conflict rate;
- decisions lacking evidence.

## Engagement

- proposal-to-acceptance time;
- unsigned engagement rate;
- matters opened without active engagement;
- scope amendments.

## Matters

- matters without responsible lawyer;
- matters without active team;
- inactive matters;
- matters missing classifications.

## Deadlines

- unconfirmed deadline count;
- deadline correction rate;
- overdue legal-critical tasks;
- missed deadlines.

## Documents

- unclassified documents;
- unreadable uploads;
- documents without provenance;
- incorrect publication incidents.

## Communications

- failed legal-critical messages;
- unanswered client requests;
- unapproved client communications;
- time since material update.

## Finance

- invoice preparation time;
- ETA rejection rate;
- unreconciled payments;
- corrected invoice rate.

## Closure

- matters in prolonged closure review;
- closures with active deadlines;
- unreturned client documents;
- missing retention classification.

---

# 45. Procedure Anti-Metrics

The firm shall not optimize solely for:

- fastest intake;
- highest client acceptance;
- largest number of closed matters;
- largest number of messages;
- shortest document review;
- maximum billable entries;
- maximum automated actions.

These measures may encourage:

- inadequate conflict review;
- inappropriate client acceptance;
- rushed legal work;
- unnecessary communication;
- premature closure;
- excessive automation.

---

# 46. Implementation Requirements Derived from D08

The future system must support:

- configurable state machines;
- role- and matter-based authorization;
- separate internal and client-visible states;
- immutable transition history;
- approval workflows;
- exception expiry;
- override review;
- versioned checklists;
- evidence attachments;
- effective-dated legal rules;
- escalation policies;
- task dependencies;
- external confirmation states;
- audit reporting;
- state-transition tests.

State transitions must be implemented as domain rules, not scattered interface conditions.

---

# 47. Testing Requirements

Each SOP must be tested through:

## Normal-Path Test

The standard procedure reaches the approved outcome.

## Missing-Information Test

The workflow blocks or requests the missing prerequisite.

## Unauthorized-Role Test

A user without authority cannot perform the action.

## Restricted-Matter Test

Information remains hidden from unassigned users.

## Failure Test

External delivery, integration, or upload failure creates recovery work.

## Concurrent-Change Test

Simultaneous edits do not silently overwrite material decisions.

## Audit Test

Every required event appears with sufficient context.

## Client-Visibility Test

Internal information remains unavailable.

## Exception-Expiry Test

Temporary permission or provisional matter state expires correctly.

## Historical-Integrity Test

Previous states and versions remain available.

---

# 48. Open Operational Decisions

The following require D04 and firm approval:

1. Who performs initial intake?
2. Which enquiries require conflict review before consultation?
3. Who may clear ordinary conflicts?
4. Who may clear complex conflicts?
5. Who approves fee arrangements?
6. Which engagement conditions are mandatory?
7. Which lawyer levels may own each matter type?
8. How are emergency matters approved?
9. Which matters require existence restriction?
10. Which deadlines receive management escalation?
11. How often must active matters be reviewed?
12. What client-update intervals apply?
13. Which communications require senior approval?
14. Which documents require two-person review?
15. Which financial corrections require sponsor approval?
16. Who administers retention and legal holds?
17. Which matters may use AI assistance?
18. Which users may export complete matter records?
19. How long may external collaborators retain access?
20. What are the approved offboarding timelines?

---

# 49. D08 Completion Criteria

D08 shall not be considered complete until:

- actual Lex Gate workflows have been compared with the proposed SOPs;
- every SOP has an operational owner;
- every lawyer-only decision has an authorized role;
- conflicts and engagement procedures are approved;
- matter and case distinctions are approved;
- deadline procedures are validated by practising Egyptian lawyers;
- document and evidence procedures are approved;
- billing procedures are approved by finance and tax reviewers;
- access and offboarding procedures are approved;
- closure and retention procedures are legally reviewed;
- emergency and exception paths are tested;
- state-machine transitions are entered into D18;
- legal, operations, privacy, security, finance, and sponsor approvals are recorded.

---

# 50. Approval Record

## Legal Operations Lead

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Egyptian Legal Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Privacy and Records Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Security Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Finance and Tax Reviewer

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

# Appendix A — State Transition Definition

```text
Transition ID:
Record type:
Source state:
Target state:
Business meaning:
Legal meaning:
Initiating roles:
Approving roles:
Prerequisites:
Validations:
Required evidence:
Client-visible result:
Notifications:
Audit event:
Failure handling:
Rollback or correction:
Related SOP:
Related requirements:
```

---

# Appendix B — SOP Definition Template

```text
SOP ID:
Name:
Purpose:
Trigger:
Scope:
Operational owner:
Legal owner:
Participants:
Prerequisites:
Inputs:
Normal procedure:
Decision points:
States:
Exceptions:
Prohibited actions:
Outputs:
Evidence:
Audit events:
Notifications:
Escalation:
Service measures:
Completion criteria:
Related capabilities:
Related legal requirements:
```

---

# Appendix C — High-Risk State Transitions

The following transitions require enhanced controls:

- prospective client → accepted client;
- conflict pending → cleared;
- engagement pending → active;
- matter opening → active;
- deadline provisional → confirmed;
- document draft → final;
- document internal → client visible;
- invoice draft → issued;
- restricted access requested → active;
- matter active → closed;
- archived record → destruction approved;
- incident under investigation → closed.

---

# Appendix D — Operational Rule

A workflow is not complete merely because its final screen shows “Done.”

It is complete only when:

> the authorized decision has occurred, all required evidence has been preserved, affected users have been informed where necessary, dependent obligations have been created, and the resulting state accurately reflects the legal and operational reality.