# Lex Gate Legal Practice Platform  
## D09 — System Context and Architecture

**Document ID:** LG-D09  
**Document Title:** System Context and Architecture  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.1  
**Status:** Proposed Architecture Baseline — Validation and Technology Selection Required  
**Classification:** Confidential — Internal Architecture Documentation  
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

---

# 1. Purpose

This document defines the proposed system architecture for the Lex Gate Legal Practice Platform.

It establishes:

- system boundaries;
- trust zones;
- logical components;
- service responsibilities;
- data-store responsibilities;
- identity and authorization architecture;
- client-visible and internal separation;
- document and evidence architecture;
- integration architecture;
- notification architecture;
- audit architecture;
- privacy architecture;
- security architecture;
- deployment topology;
- resilience and disaster-recovery principles;
- observability;
- environment separation;
- architectural decision rules;
- technology-selection criteria.

This document does not yet select every final technology.

Technology choices shall be made only when they can be justified against:

- legal requirements;
- privacy requirements;
- security requirements;
- expected scale;
- operational capability;
- cost;
- supportability;
- data residency;
- migration requirements;
- developer productivity;
- vendor lock-in;
- disaster recovery.

---

# 2. Architecture Status

The architecture in this document is a proposed baseline.

The following remain subject to D04 discovery and specialist approval:

- cloud provider;
- hosting region;
- exact database technology;
- identity provider;
- email provider;
- SMS provider;
- payment provider;
- electronic-signature provider;
- accounting integration;
- Egyptian Tax Authority integration method;
- WhatsApp integration;
- AI provider;
- search technology;
- document-processing technology;
- mobile application requirements.

The core architectural principles, however, should remain stable regardless of vendor selection.

---

# 3. Architecture Objectives

The architecture shall prioritize, in order:

1. legal and professional confidentiality;
2. correctness of authorization;
3. preservation of legal and operational evidence;
4. data protection and privacy;
5. recoverability;
6. availability;
7. maintainability;
8. auditability;
9. interoperability;
10. performance;
11. development velocity;
12. cost efficiency.

Development convenience shall not override confidentiality, legal correctness, or recoverability.

---

# 4. Architecture Quality Attributes

## 4.1 Confidentiality

Unauthorized users must not gain access to:

- clients;
- matter existence;
- legal documents;
- internal strategy;
- evidence;
- financial information;
- restricted personnel information.

---

## 4.2 Integrity

The system must prevent or detect unauthorized modification of:

- legal deadlines;
- case statuses;
- documents;
- approvals;
- invoices;
- audit records;
- access rights;
- signatures.

---

## 4.3 Availability

Critical legal operations must remain usable during ordinary infrastructure failures.

---

## 4.4 Recoverability

The firm must be able to recover from:

- database corruption;
- accidental deletion;
- infrastructure failure;
- region failure where required by risk assessment;
- compromised deployment;
- failed migration.

---

## 4.5 Traceability

Material actions must be reconstructable.

---

## 4.6 Maintainability

The architecture shall permit:

- new practice areas;
- new workflows;
- new procedural rule versions;
- new integrations;
- new client types;
- regulatory changes;

without requiring fundamental rewrites.

---

## 4.7 Localization

Arabic and English support must be structural, not cosmetic.

---

## 4.8 Accessibility

Accessibility requirements apply to architecture where they affect:

- rendering;
- state management;
- forms;
- authentication;
- document conversion;
- notifications.

---

# 5. Architectural Style Recommendation

The initial Lex Gate platform should use a:

> **modular monolith with explicit domain boundaries, asynchronous background workers, isolated integration adapters, and independently scalable infrastructure components.**

This is preferred over an initial microservices architecture.

---

# 6. Why a Modular Monolith

The platform contains many legal domains but is initially being built for one firm.

Premature microservices would introduce:

- distributed transactions;
- service-to-service authentication;
- network failure modes;
- multiple deployment pipelines;
- distributed tracing complexity;
- increased operational cost;
- complex versioning;
- harder local development;
- more difficult data consistency.

Lex Gate requires strong correctness and transactional integrity more urgently than independent service scaling.

A modular monolith permits:

- one primary application deployment;
- one strongly consistent transactional boundary;
- clear domain modules;
- shared observability;
- simpler disaster recovery;
- easier development;
- lower infrastructure overhead.

---

# 7. Modular Does Not Mean Monolithic Code

Each domain shall have an explicit boundary.

Candidate modules include:

```text id="5m7efx"
identity
organization
intake
conflicts
clients
engagements
matters
cases
deadlines
tasks
documents
evidence
communications
portal
billing
payments
people
knowledge
privacy
records
audit
security
integrations
notifications
reporting
automation
```

Each module shall own:

- domain rules;
- domain entities;
- domain services;
- commands;
- queries;
- events;
- database access for its owned records.

Cross-module coupling shall be explicit.

---

# 8. Future Service Extraction

A module may later become an independent service if justified by:

- substantially different scaling characteristics;
- regulatory isolation;
- security isolation;
- failure isolation;
- independent development cadence;
- external reuse;
- provider-specific infrastructure.

Likely future extraction candidates include:

- document processing;
- notifications;
- search;
- AI processing;
- tax integration;
- electronic signature;
- analytics.

Extraction is an optimization, not an initial requirement.

---

# 9. System Context

The Lex Gate platform interacts with the following actor classes.

## 9.1 Human Actors

- public visitors;
- prospective clients;
- clients;
- client representatives;
- lawyers;
- trainee lawyers;
- legal assistants;
- intake personnel;
- finance personnel;
- records and compliance personnel;
- administrators;
- external lawyers and specialists;
- auditors.

---

## 9.2 External Systems

Potential external systems include:

- email provider;
- SMS provider;
- identity verification provider;
- payment gateway;
- bank services;
- accounting platform;
- Egyptian Tax Authority;
- ITIDA-licensed electronic-signature provider;
- approved calendar provider;
- government and court portals;
- cloud infrastructure;
- monitoring services;
- approved AI providers.

---

# 10. High-Level System Context

```text id="zk3bxy"
                     ┌─────────────────────┐
                     │   Public Visitors   │
                     └─────────┬───────────┘
                               │ HTTPS
                               ▼
┌──────────────────────────────────────────────────────┐
│                 Lex Gate Platform                    │
│                                                      │
│  Public Web ─ Client Portal ─ Internal Application   │
│                         │                            │
│                 Application Core                     │
│                         │                            │
│            Data / Documents / Audit                  │
└──────────────────────────────────────────────────────┘
        ▲                ▲                 ▲
        │                │                 │
        │                │                 │
     Clients          Employees       Administrators
        │                                  │
        └──────────────────────────────────┘

             Controlled Integration Boundary
                         │
      ┌──────────────────┼────────────────────┐
      ▼                  ▼                    ▼
  Notifications       Payments          Government /
  Email / SMS         / Banking         Regulatory
                                           Systems
                         │
                         ▼
                  Approved AI /
                  Processing Services
```

All external integrations are untrusted until authenticated, authorized, validated, and monitored.

---

# 11. Primary Trust Zones

The architecture shall use explicit trust zones.

## TZ-01 — Public Internet

Contains:

- anonymous visitors;
- unauthenticated traffic;
- bots;
- search crawlers;
- malicious actors.

Trust level:

> None.

---

## TZ-02 — Public Application Edge

Contains:

- CDN;
- reverse proxy;
- WAF;
- rate limiting;
- public website delivery.

This zone must not have direct database access.

---

## TZ-03 — Authenticated Client Zone

Contains requests from:

- clients;
- client representatives;
- external authorized users.

This zone remains untrusted from an authorization perspective.

Authentication does not imply matter access.

---

## TZ-04 — Internal User Zone

Contains:

- lawyers;
- employees;
- approved collaborators.

Internal users remain subject to:

- authentication;
- authorization;
- matter access;
- data classification;
- professional authority.

---

## TZ-05 — Application Trust Zone

Contains:

- application runtime;
- business logic;
- authorization services;
- workflow engine;
- background jobs.

Only approved application components may communicate directly with primary data stores.

---

## TZ-06 — Sensitive Data Zone

Contains:

- relational database;
- document storage;
- evidence;
- secrets;
- encryption keys;
- audit records.

Direct end-user access is prohibited.

---

## TZ-07 — Administrative Security Zone

Contains:

- production administration;
- infrastructure configuration;
- secret rotation;
- backup operations;
- privileged logging.

Access requires stronger controls than normal employee access.

---

## TZ-08 — External Integration Zone

Contains traffic to and from:

- ETA;
- payment providers;
- email;
- SMS;
- electronic signature;
- accounting;
- AI providers;
- external APIs.

All traffic must pass through controlled adapters.

---

# 12. Public Website Architecture

The public website should be logically separated from authenticated legal operations.

It may share:

- design system;
- content infrastructure;
- deployment pipeline components.

It shall not share unrestricted access to:

- client tables;
- matter tables;
- documents;
- internal search;
- audit records.

---

## 12.1 Public Content

Public content should be served from either:

- controlled content tables;
- a dedicated content module;
- an approved CMS.

Public content shall have:

- status;
- language;
- reviewer;
- publication date;
- version;
- expiry or review date.

---

## 12.2 Public Enquiry Boundary

Public enquiry submission shall pass through a restricted intake API.

The endpoint shall:

- validate fields;
- rate limit requests;
- prevent arbitrary file upload initially;
- sanitize input;
- protect against abuse;
- minimize collected data;
- create a prospective-client record through the intake module.

The public web tier shall not write directly to matter records.

---

# 13. Client Portal Architecture

The client portal shall be an authenticated application surface.

It may share the same application core as the internal application, but authorization must be explicitly client-aware.

---

## 13.1 Portal Principle

A client shall never query the internal matter model directly.

The portal shall retrieve data through a:

> **client projection layer**

that deliberately exposes only approved fields.

---

## 13.2 Client Projection

Example:

Internal matter:

```text id="9u9qlh"
legal_strategy
risk_rating
conflict_notes
internal_deadline
responsible_lawyer_notes
client_visible_updates
published_documents
upcoming_client_appointments
```

Client projection:

```text id="gplkwx"
approved_status
published_updates
published_documents
client_actions
appointments
billing_summary
approved_contacts
```

Internal fields shall not be filtered solely in the browser.

They must not be returned by the server.

---

# 14. Internal Application Architecture

The internal application shall provide:

- intake;
- conflict management;
- client management;
- engagements;
- matters;
- cases;
- tasks;
- deadlines;
- documents;
- communications;
- finance;
- reporting;
- administration.

Internal user access remains subject to server-side authorization.

---

# 15. Presentation Architecture

The user interface layer shall support:

- server-rendered or securely generated initial content where appropriate;
- client-side interaction;
- Arabic and English localization;
- RTL/LTR switching;
- accessible navigation;
- responsive layouts;
- progressive enhancement.

No business authorization rule shall exist only in presentation code.

---

# 16. API Architecture

The application shall expose a controlled application API.

Preferred architectural characteristics:

- REST or typed RPC for standard application operations;
- explicit commands for state-changing operations;
- query endpoints for read models;
- idempotency for retried sensitive commands;
- consistent error envelope;
- request correlation IDs;
- audit context.

---

## 16.1 Command Example

Rather than:

```text id="r0f4jf"
PATCH /matter/123
status=closed
```

the platform should use an explicit domain operation:

```text id="z3dke6"
POST /matters/123/close
```

with:

- actor;
- reason;
- required checklist;
- validation;
- approval;
- audit event.

This prevents bypassing lifecycle rules by editing fields directly.

---

# 17. Domain Command Pattern

High-risk changes shall occur through domain commands such as:

- `ClearConflict`
- `ActivateEngagement`
- `OpenMatter`
- `ConfirmLegalDeadline`
- `PublishDocumentToClient`
- `IssueInvoice`
- `GrantRestrictedAccess`
- `CloseMatter`
- `ApproveRecordDestruction`

Each command shall perform:

1. authentication;
2. authorization;
3. domain-state validation;
4. legal prerequisite validation;
5. required approval validation;
6. persistence;
7. audit event creation;
8. domain event publication.

---

# 18. Query Architecture

Read operations may use optimized projections.

Examples:

- lawyer dashboard;
- client portal dashboard;
- management risk dashboard;
- finance queue;
- conflict search index;
- document search.

Read models must still apply authorization.

Cached data must never bypass permissions.

---

# 19. Primary Transactional Database

The recommended initial database class is:

> ACID-compliant relational database.

A PostgreSQL-compatible database is a strong candidate.

Reasons include:

- strong relational integrity;
- transactions;
- foreign-key constraints;
- structured querying;
- mature backup tooling;
- JSON support where appropriate;
- indexing;
- row-level control options;
- broad cloud support;
- portability.

Final selection shall be made during technology approval.

---

# 20. Database Ownership

Each module shall own its tables conceptually.

Example:

```text id="2oqzt4"
identity.*
clients.*
conflicts.*
engagements.*
matters.*
cases.*
deadlines.*
documents.*
billing.*
privacy.*
audit.*
```

Physical schemas may be used to reinforce ownership.

Modules should not make arbitrary direct writes into another module’s data.

---

# 21. Database Integrity

Database constraints shall enforce invariants where practical.

Examples:

- unique matter ID;
- valid foreign keys;
- engagement version uniqueness;
- immutable issued invoice ID;
- required responsible lawyer for active matter;
- document parent-child version relationship;
- non-null audit actor context where applicable.

Application validation alone is insufficient for critical invariants.

---

# 22. Optimistic Concurrency

Material records shall use concurrency control.

Examples:

- engagement edits;
- deadlines;
- matter status;
- access policy;
- client updates.

A user must not silently overwrite another user’s newer decision.

The system should reject stale writes and require reconciliation.

---

# 23. Document Storage Architecture

Legal files shall not be stored primarily as database binary fields.

Use a dedicated encrypted object-storage layer.

---

## 23.1 Object Store Requirements

The object store shall support:

- encryption at rest;
- private access;
- versioning where approved;
- lifecycle policies;
- integrity metadata;
- retention controls where required;
- region selection;
- backup or replication strategy;
- access logging.

---

## 23.2 Access Model

Users shall not receive permanent object-store URLs.

Downloads shall use:

- short-lived authorized URLs; or
- application-mediated streaming.

Authorization shall be checked immediately before access is granted.

---

## 23.3 Object Key Security

Object names shall not reveal:

- client names;
- national identifiers;
- matter names;
- case details.

Use opaque internal identifiers.

---

# 24. Document Processing Pipeline

Uploads shall pass through a processing pipeline.

```text id="qbzrf4"
Upload
  │
  ▼
Temporary quarantine
  │
  ├── MIME/type validation
  ├── file-size validation
  ├── malware scan
  ├── hash calculation
  └── metadata extraction
  │
  ▼
Secure original storage
  │
  ├── preview generation
  ├── OCR / text extraction
  ├── thumbnail
  └── optional classification
  │
  ▼
Review / matter repository
```

---

## 24.1 Processing Isolation

Document conversion and extraction should execute in:

- isolated workers;
- restricted containers;
- sandboxed runtime where possible.

Untrusted documents should not execute within the main application process.

---

# 25. Original vs Derived Documents

The architecture shall preserve lineage.

Example:

```text id="ih8cdt"
Original PDF
├── Preview PDF
├── OCR text
├── Arabic-English translation
├── Redacted version
└── Signed version
```

Each derivative must link to its source.

No derivative replaces the original.

---

# 26. Evidence Architecture

Evidence objects shall use enhanced controls.

Additional fields may include:

- custody state;
- integrity hash;
- source;
- physical location;
- custodian;
- transfer history;
- seal or signature;
- legal hold.

Evidence metadata shall be stored transactionally.

---

# 27. Search Architecture

Search shall be treated as an authorization-sensitive subsystem.

Potential searchable data:

- client names;
- matter metadata;
- documents;
- OCR text;
- communications;
- legal templates.

---

## 27.1 Security Rule

A search engine must never return a result simply because the search index contains it.

Authorization must apply:

- during indexing where appropriate;
- during query;
- before result display;
- before document retrieval.

---

## 27.2 Search Index Content

Avoid indexing unnecessarily sensitive fields.

Examples that may require exclusion or special control:

- conflict analysis;
- passwords or secrets;
- complete identity numbers;
- privileged notes;
- highly restricted matters.

---

# 28. Arabic Search

Arabic search architecture should support:

- Unicode normalization;
- Arabic letter variants;
- diacritic-insensitive search;
- optional normalization of hamza variants;
- Arabic/English transliteration aliases;
- name tokenization;
- organization aliases.

Conflict search must preserve the original submitted form while using normalized search representations.

---

# 29. Identity Architecture

The platform shall centralize authentication.

The application should not implement raw password security independently when a mature identity provider can provide:

- password hashing;
- MFA;
- account recovery;
- session security;
- lockout;
- device controls;
- federation.

---

# 30. Authentication Assurance

Authentication policy shall depend on user type.

Example baseline:

| User | Baseline |
|---|---|
| Public visitor | None |
| Prospective client | Limited session |
| Client | Password/passkey plus risk-based MFA |
| Lawyer | Mandatory MFA |
| Finance | Mandatory MFA |
| Administrator | Strong MFA / phishing-resistant preferred |
| External collaborator | MFA |
| Security administrator | Highest supported assurance |

The final policy belongs in D11.

---

# 31. Authorization Architecture

Authentication answers:

> Who are you?

Authorization answers:

> May you perform this action on this specific record?

Authorization shall be evaluated server side.

---

# 32. Authorization Dimensions

A decision may depend on:

- user account state;
- organization;
- employment state;
- professional status;
- system role;
- matter assignment;
- matter classification;
- document classification;
- client relationship;
- temporary grant;
- ethical restriction;
- professional authority;
- action type;
- approval state.

---

# 33. Authorization Model

The recommended model is:

> **RBAC + relationship-based access + contextual policy evaluation**

RBAC alone is insufficient.

Example:

A user may have role:

`LAWYER`

but access to matter `M-0042` only when:

- assigned to the matter; or
- approved as supervisor; or
- granted controlled temporary access.

---

# 34. Policy Decision Layer

Authorization logic should be centralized in reusable policy functions or an authorization engine.

Example:

```text id="5n0suh"
mayViewDocument(user, document)
mayConfirmDeadline(user, deadline)
mayPublishToClient(user, document, client)
mayAccessRestrictedMatter(user, matter)
mayIssueInvoice(user, invoice)
```

Interface components should consume these decisions rather than reproduce the logic independently.

---

# 35. Administrative Access

Infrastructure administrators shall not automatically have legal data access.

Where emergency support requires substantive access:

1. support request created;
2. business owner approves;
3. access is time limited;
4. access purpose recorded;
5. session audited;
6. access revoked automatically;
7. review performed.

---

# 36. Audit Architecture

Audit shall be a first-class subsystem.

Audit records shall be logically append-only.

---

## 36.1 Audit Event Structure

Each event should contain:

```text id="ro8pdm"
event_id
event_type
occurred_at
actor_id
actor_type
session_id
request_id
target_type
target_id
matter_id_if_authorized
action
decision
reason
source_ip_or_context
previous_state_reference
new_state_reference
metadata
```

---

## 36.2 Audit Content Rule

Audit records should record:

> what happened

without unnecessarily copying:

> the confidential substantive content.

---

## 36.3 Audit Tamper Resistance

Options may include:

- restricted append-only table privileges;
- separate audit database;
- write-only application credentials;
- cryptographic chaining;
- export to immutable storage.

D11 will define the final level.

---

# 37. Domain Events

The application shall generate domain events after successful transactional changes.

Examples:

```text id="y2vwc8"
EnquiryReceived
ConflictCleared
EngagementActivated
MatterOpened
LegalDeadlineConfirmed
HearingScheduled
DocumentFinalized
DocumentPublishedToClient
InvoiceIssued
PaymentReconciled
MatterClosed
AccessGranted
SecurityIncidentReported
```

Domain events support:

- notifications;
- reporting;
- integrations;
- background work;
- audit correlation.

---

# 38. Transactional Outbox

To avoid losing events after database commits, the architecture should use a transactional outbox pattern.

Within one database transaction:

1. domain change is committed;
2. corresponding event is written to outbox.

A background worker then dispatches the event.

This avoids:

- state saved but notification never queued;
- invoice issued but integration event lost;
- matter closed but retention job missing.

---

# 39. Background Job Architecture

Asynchronous workers shall handle tasks such as:

- notifications;
- document scanning;
- OCR;
- preview generation;
- search indexing;
- ETA submission;
- electronic-signature status checking;
- report generation;
- data export;
- retention jobs;
- scheduled access review;
- AI processing.

---

## 39.1 Job Requirements

Jobs shall support:

- unique ID;
- idempotency;
- retries;
- backoff;
- dead-letter handling;
- status;
- correlation ID;
- authorization context where required;
- failure alerting.

---

# 40. Idempotency

High-risk external operations must be retry-safe.

Examples:

- invoice submission;
- payment recording;
- email sending;
- document publication;
- signature request creation.

An infrastructure timeout must not cause duplicate legal or financial actions.

---

# 41. Notification Architecture

Notifications shall be event driven.

```text id="bfmfxe"
Domain Event
     │
     ▼
Notification Policy
     │
     ├── Portal
     ├── Email
     ├── SMS
     └── Future approved channels
```

---

## 41.1 Notification Policy

The notification engine must decide:

- whether notification is allowed;
- recipient;
- channel;
- sensitivity;
- template;
- language;
- urgency;
- acknowledgement requirement.

---

## 41.2 Notification Security

External notifications should avoid sensitive matter details.

Example:

Preferred:

> “A new document is available in your Lex Gate portal.”

Avoid:

> “Your criminal appeal judgment in Case 12345 has been uploaded.”

unless explicitly approved for the channel.

---

# 42. Integration Architecture

External integrations shall use dedicated adapters.

Application domain logic shall not directly contain provider-specific API code.

---

# 43. Adapter Pattern

Example:

```text id="9za48h"
Billing Domain
     │
     ▼
Tax Integration Interface
     │
     ├── ETA Direct Adapter
     └── Accounting Provider Adapter
```

This allows:

- provider replacement;
- testing;
- local simulation;
- specification changes;
- failure isolation.

---

# 44. Integration Gateway

Sensitive outbound integrations may be routed through a controlled integration layer responsible for:

- authentication;
- credential management;
- request logging;
- retries;
- rate limits;
- data minimization;
- response validation;
- circuit breaking.

---

# 45. Government Integration Rule

Government systems remain manual unless an approved machine interface is verified.

The architecture shall still create interfaces such as:

```text id="9uknlm"
CourtStatusProvider
TaxInvoiceProvider
ElectronicSignatureProvider
```

Initial implementation may be:

```text id="ifmnse"
ManualCourtStatusProvider
```

This keeps the domain model independent from unsupported scraping.

---

# 46. Payment Architecture

Payment providers shall be isolated from legal engagement state.

A successful payment event may update:

- payment record;
- invoice state;
- balance.

It shall not directly:

- activate engagement;
- clear conflict;
- open matter;
- authorize legal work;

unless an explicit approved workflow command checks all prerequisites.

---

# 47. Electronic Signature Architecture

Signature workflows should use provider adapters.

Core system stores:

- document hash;
- signature request;
- signer;
- status;
- provider;
- certificate information;
- validation result.

The signed artifact remains in controlled document storage.

---

# 48. AI Architecture

AI functionality shall be isolated behind an internal AI gateway.

Domain modules shall not call external models directly.

---

## 48.1 AI Gateway Responsibilities

- approved provider selection;
- data classification check;
- matter AI policy;
- prompt-template version;
- redaction where approved;
- token and cost control;
- output capture;
- provider logging;
- human-review requirement;
- model-version tracking.

---

## 48.2 AI Data Boundary

Before AI processing:

```text id="9k7biq"
User request
   │
   ▼
Authorization
   │
   ▼
Matter AI policy
   │
   ▼
Data classification
   │
   ▼
Provider / region eligibility
   │
   ▼
Approved prompt assembly
   │
   ▼
Model
```

Any failed policy evaluation blocks transmission.

---

## 48.3 AI Provider Rules

Providers must support contractual settings compatible with:

- client confidentiality;
- no training on Lex Gate content;
- approved retention;
- approved processing locations;
- processor obligations;
- incident handling.

---

# 49. Reporting Architecture

Operational reporting should not run uncontrolled heavy queries against the transactional system.

Initial architecture may use:

- optimized database views;
- read replicas;
- materialized projections.

At larger scale, reporting may use:

- analytics warehouse;
- event-derived reporting store.

---

# 50. Reporting Security

Reporting shall preserve:

- matter restrictions;
- field-level restrictions;
- financial restrictions;
- personal-data controls.

Management access to aggregate numbers shall not automatically grant drill-down access to restricted matters.

---

# 51. Privacy Architecture

Privacy controls shall be represented as system capabilities rather than static legal notices.

---

## 51.1 Processing Register

The system should maintain structured metadata concerning:

- processing purpose;
- data categories;
- legal basis;
- processors;
- recipients;
- retention;
- countries.

---

## 51.2 Data Lineage

Where practical, sensitive data should record its source.

Examples:

- entered by client;
- entered by lawyer;
- imported;
- extracted from document;
- supplied by authority.

---

## 51.3 Deletion Architecture

Deletion shall be policy-driven.

A deletion request shall not directly issue arbitrary database deletes.

It should create:

```text id="m4k8ju"
Deletion Review
  │
  ├── legal hold?
  ├── retention rule?
  ├── professional obligation?
  ├── financial obligation?
  ├── related records?
  ▼
Approved Destruction Plan
```

---

# 52. Data Classification Architecture

Every major record type should support a classification.

Candidate levels:

```text id="6yupua"
PUBLIC
INTERNAL
CLIENT_CONFIDENTIAL
MATTER_CONFIDENTIAL
RESTRICTED
HIGHLY_RESTRICTED
SECURITY_SENSITIVE
```

Classification may influence:

- access;
- export;
- notification content;
- AI availability;
- backup;
- logging;
- sharing;
- retention.

---

# 53. Encryption Architecture

## 53.1 In Transit

All application traffic shall use modern TLS.

Unencrypted HTTP shall redirect or be blocked.

---

## 53.2 At Rest

Encrypt:

- databases;
- object storage;
- backups;
- queues where sensitive content is stored;
- secrets.

---

## 53.3 Application-Level Encryption

Highly sensitive fields may require application-level or field-level encryption.

Potential candidates:

- national identifiers;
- passport identifiers;
- highly sensitive evidence metadata;
- selected secrets.

The final set shall be defined in D11.

---

# 54. Key Management

Encryption keys shall be managed through an approved key-management service.

Requirements:

- no keys in source code;
- separation of keys and encrypted data;
- rotation;
- restricted administration;
- audit;
- recovery plan.

---

# 55. Secret Management

Secrets include:

- database credentials;
- API keys;
- signing secrets;
- webhook secrets;
- encryption materials.

Secrets shall be stored in:

- dedicated secret manager;
- protected environment injection.

They shall not be stored in:

- Git;
- tickets;
- chat messages;
- client-side bundles;
- configuration files committed to the repository.

---

# 56. Deployment Architecture

The preferred deployment architecture separates edge, application, worker, and data tiers.

```text id="yujn3n"
Internet
   │
   ▼
CDN / WAF / Rate Limiting
   │
   ▼
Application Load Boundary
   │
   ├───────────────┐
   ▼               ▼
Web/API        Background Workers
   │               │
   └───────┬───────┘
           ▼
   Private Data Network
      │          │
      ▼          ▼
 Relational DB  Object Storage
      │
      ├── Search
      ├── Cache
      └── Queue / Event Infrastructure
```

Actual provider topology may vary.

---

# 57. Network Architecture

Data stores shall not be directly accessible from the public internet.

Preferred controls:

- private networking;
- security groups/firewall policies;
- least-privilege service identities;
- controlled administrative access;
- egress restrictions where feasible.

---

# 58. Environment Separation

Required environments:

```text id="0jky1q"
local
development
test
staging
production
```

Production client data shall not be copied into lower environments without an approved sanitization process.

---

# 59. Environment Rules

## Development

Synthetic data.

No production secrets.

---

## Test

Automated and integration testing.

Synthetic fixtures.

---

## Staging

Production-like configuration.

Synthetic or legally approved sanitized data.

---

## Production

Real client and firm data.

Strict access.

Controlled releases.

---

# 60. Infrastructure as Code

Infrastructure shall be defined declaratively.

Infrastructure-as-code should control:

- networks;
- application deployments;
- databases;
- storage;
- queues;
- monitoring;
- IAM;
- secret references;
- backup policies;
- WAF;
- DNS.

Manual production configuration shall be minimized.

---

# 61. Deployment Immutability

Production deployment should create immutable application artifacts.

Do not:

- manually edit application code on servers;
- patch production files directly;
- alter database schema outside controlled migration.

---

# 62. Database Migrations

Migrations shall be:

- version controlled;
- reviewed;
- tested;
- reversible where practical;
- backward compatible during rolling deployment where required.

Destructive migrations require:

- backup;
- migration rehearsal;
- explicit approval;
- rollback plan.

---

# 63. Release Architecture

A release should progress through:

```text id="187plz"
Code
  ↓
Static Checks
  ↓
Unit Tests
  ↓
Security Checks
  ↓
Build
  ↓
Integration Tests
  ↓
Staging
  ↓
End-to-End Tests
  ↓
Release Approval
  ↓
Production
  ↓
Post-deployment Verification
```

Details will be defined in D15 and D16.

---

# 64. Feature Flags

High-risk functionality may be guarded by feature flags.

Examples:

- client portal;
- AI features;
- tax integration;
- electronic signature;
- new deadline calculator;
- external collaborator portal.

Feature flags must not become permanent unmanaged configuration.

---

# 65. Availability Architecture

The architecture should initially target high availability appropriate to a professional-service firm without unnecessary hyperscale complexity.

Candidate baseline:

- redundant application instances;
- managed database failover;
- redundant storage;
- queue persistence;
- monitored external services.

Final SLA targets require D04 operational analysis.

---

# 66. Graceful Degradation

Failure of a non-core external system should not make the entire application unusable.

Examples:

If SMS fails:

- portal remains available;
- email may continue;
- failure is queued for review.

If ETA fails:

- internal billing records remain accessible;
- invoice remains pending external confirmation.

If AI fails:

- legal workflows remain fully operable manually.

---

# 67. External Dependency Circuit Breakers

Repeated integration failure should:

- stop uncontrolled retry storms;
- mark integration degraded;
- preserve queued work;
- alert operations;
- offer manual fallback.

---

# 68. Backup Architecture

Backups shall cover:

- relational database;
- object metadata;
- document objects;
- configuration;
- necessary encryption metadata;
- audit records.

---

## 68.1 Backup Properties

Backups shall be:

- encrypted;
- automated;
- monitored;
- periodically restored in test;
- protected from ordinary application deletion;
- subject to retention policy.

---

# 69. Recovery Objectives

D04 will determine final business targets.

Architecture shall define:

## RPO — Recovery Point Objective

Maximum acceptable amount of recent data loss.

## RTO — Recovery Time Objective

Maximum acceptable period before service restoration.

Candidate classes may include:

| System | Preliminary criticality |
|---|---|
| Matter/deadline database | Critical |
| Documents | Critical |
| Client portal | High |
| Public website | Medium/High |
| Reporting | Medium |
| AI | Low |

---

# 70. Disaster Recovery

A disaster-recovery plan shall account for:

- database loss;
- region outage;
- credential compromise;
- corrupt deployment;
- ransomware;
- document-store failure;
- provider outage.

Recovery architecture must be tested, not merely documented.

---

# 71. Observability Architecture

The platform shall provide:

- metrics;
- structured logs;
- traces;
- security events;
- job monitoring;
- integration health;
- client-facing error tracking.

---

# 72. Correlation IDs

Every user request and asynchronous chain should carry a correlation identifier.

Example:

```text id="4v2n8d"
HTTP request
   ↓
Domain command
   ↓
Database transaction
   ↓
Outbox event
   ↓
Notification job
   ↓
Email provider
```

All steps should be traceable through one correlation chain.

---

# 73. Logging Rules

Logs shall not contain by default:

- passwords;
- authentication tokens;
- full identity documents;
- complete legal documents;
- privileged legal text;
- payment-card data;
- secret keys.

Where identifiers are necessary, use controlled internal IDs.

---

# 74. Monitoring Categories

## Application

- request error rate;
- latency;
- database health;
- queue backlog;
- background-job failures.

## Security

- failed authentication;
- suspicious access;
- privilege changes;
- large exports;
- restricted-matter access.

## Business Critical

- unconfirmed critical deadlines;
- failed client-critical notifications;
- orphaned active matters;
- failed ETA submission.

Technical and business monitoring should remain distinct but correlated.

---

# 75. Cache Architecture

Caching may improve:

- public content;
- reference data;
- configuration;
- non-sensitive aggregates.

Caching restricted matter data requires exceptional care.

Cache keys must incorporate authorization context or avoid caching user-specific legal content altogether.

---

# 76. Session Architecture

Sessions shall support:

- secure cookies or equivalent;
- inactivity timeout;
- maximum lifetime;
- session revocation;
- device visibility;
- step-up authentication.

Client and employee policies may differ.

---

# 77. File Upload Limits

The system shall centrally define:

- permitted types;
- maximum sizes;
- multiple-file limits;
- archive handling;
- executable-file handling;
- encrypted file handling;
- quarantine rules.

Legal business need may justify uncommon file types, but they must be handled safely.

---

# 78. Internationalization Architecture

All user-facing strings should be externalized.

Avoid hard-coded strings within components.

Translation keys should support:

```text id="q48yxt"
matter.status.active
matter.status.waiting_for_client
deadline.status.provisional
deadline.status.confirmed
```

Translations shall be reviewed legal terminology, not automated word-for-word substitutions.

---

# 79. Directionality Architecture

Directionality shall operate at:

- application level;
- component level;
- field level.

Example:

An Arabic page may contain:

- English email;
- Latin case number;
- URL;
- English company name.

Fields must support explicit bidirectional handling rather than inheriting page direction blindly.

---

# 80. Date and Time Architecture

Internally:

- store timestamps in UTC;
- preserve originating timezone where legally relevant.

Display:

- user-appropriate timezone;
- explicit timezone for legal-critical events where ambiguity matters.

Date-only legal deadlines shall not be confused with midnight UTC timestamps.

---

# 81. Calendar Architecture

The system shall distinguish:

- date;
- local time;
- timezone;
- all-day event;
- deadline cutoff;
- working-calendar rule.

External calendar integration shall receive only information permitted for that user and channel.

---

# 82. Identifier Architecture

Publicly exposed records should use non-sequential opaque identifiers where practical.

Internal business-friendly identifiers may exist separately.

Example:

```text id="q3ut2w"
internal DB id:
8235

public opaque id:
01JQ...

matter reference:
LG-MAT-2026-0042
```

The public ID should not reveal record counts.

---

# 83. Data Import Architecture

Imports shall occur through controlled ingestion workflows.

Steps:

1. upload source;
2. quarantine;
3. parse;
4. map;
5. validate;
6. deduplicate;
7. preview;
8. approve;
9. commit;
10. reconcile;
11. archive migration evidence.

Direct production database manipulation is prohibited for routine migration.

---

# 84. Export Architecture

Exports are high-risk operations.

The export service shall:

- authorize user;
- define scope;
- apply field restrictions;
- log reason;
- generate asynchronously where large;
- encrypt output where appropriate;
- provide temporary access;
- expire automatically;
- audit download.

Bulk matter exports may require enhanced approval.

---

# 85. Webhook Architecture

External inbound webhooks shall:

- verify signatures;
- check replay protection;
- validate timestamps;
- deduplicate;
- parse using strict schemas;
- store raw event metadata where appropriate;
- process asynchronously.

Examples:

- payment event;
- electronic signature;
- email status;
- ETA status.

---

# 86. Rate Limiting

Apply rate limits to:

- login;
- password reset;
- public enquiry;
- client uploads;
- exports;
- expensive search;
- AI requests;
- public APIs.

Rate limiting shall avoid blocking legitimate urgent legal use without an escalation path.

---

# 87. Security Headers and Browser Controls

The web platform should support:

- Content Security Policy;
- HSTS;
- secure cookies;
- SameSite;
- frame protections;
- referrer policy;
- permissions policy.

Final configuration belongs in D11.

---

# 88. Browser Storage

Sensitive information shall not be stored unnecessarily in:

- localStorage;
- sessionStorage;
- IndexedDB;
- browser caches.

Offline functionality involving legal content requires separate security design.

---

# 89. Client-Side Analytics

Public analytics should minimize personal data.

Authenticated legal application analytics shall focus on:

- performance;
- errors;
- product usability;

without sending substantive matter content to third-party analytics services.

---

# 90. Technology Selection Criteria

Every major technology shall be evaluated against:

## Legal and Privacy

- processing countries;
- controller/processor terms;
- deletion;
- audit;
- subprocessor transparency;
- breach commitments.

## Security

- encryption;
- IAM;
- vulnerability management;
- security certifications;
- secret management.

## Reliability

- SLA;
- backup;
- disaster recovery;
- vendor history.

## Engineering

- mature ecosystem;
- testing;
- observability;
- maintainability;
- portability;
- developer experience.

## Cost

- expected operating cost;
- scaling cost;
- data-egress cost;
- support cost;
- minimum commitments.

## Exit Strategy

- export formats;
- migration capability;
- lock-in;
- contractual exit.

---

# 91. Candidate Application Stack Categories

The eventual stack will likely require:

- TypeScript or similarly strongly typed application development;
- modern server-rendered web framework;
- relational database;
- encrypted object storage;
- queue;
- cache;
- full-text search;
- centralized authentication;
- infrastructure as code;
- container or managed runtime;
- monitoring and logging;
- CI/CD.

The exact implementation is intentionally deferred.

---

# 92. Build vs Buy Principle

Build internally when the capability is:

- part of Lex Gate’s distinctive legal workflow;
- dependent on proprietary domain rules;
- tightly coupled to matters and permissions.

Prefer mature external services for:

- email delivery;
- SMS;
- payments;
- authentication infrastructure;
- electronic signature;
- cloud storage;
- monitoring;

where the provider passes legal, privacy, security, and commercial review.

---

# 93. Architecture Decision Records

Material architectural decisions shall use ADRs.

Example:

```text id="6cdv6m"
ADR-001
Title: Use Modular Monolith for Initial Core Platform
Status: Proposed
Context:
Decision:
Alternatives:
Legal impact:
Privacy impact:
Security impact:
Operational impact:
Cost impact:
Reversibility:
Consequences:
Review date:
```

---

# 94. Initial ADR Register

## ADR-001

Use modular monolith as initial core architecture.

**Status:** Proposed.

---

## ADR-002

Use relational ACID database for core transactional records.

**Status:** Proposed.

---

## ADR-003

Use dedicated object storage for documents.

**Status:** Proposed.

---

## ADR-004

Separate internal matter representation from client portal projections.

**Status:** Required principle.

---

## ADR-005

Use centralized server-side authorization.

**Status:** Required principle.

---

## ADR-006

Use transactional outbox for reliable domain events.

**Status:** Proposed.

---

## ADR-007

Use dedicated adapters for external integrations.

**Status:** Required principle.

---

## ADR-008

Keep AI behind an internal policy gateway.

**Status:** Required before AI release.

---

## ADR-009

Separate administrative infrastructure authority from legal matter access.

**Status:** Required.

---

## ADR-010

Use immutable/versioned handling for legal and financial records.

**Status:** Required.

---

# 95. Prohibited Architectural Patterns

The project shall not use:

- client-side-only authorization;
- public object-storage buckets for matter documents;
- direct external API calls from the browser using secret credentials;
- shared administrator accounts;
- global firm-wide matter access by default;
- production secrets committed to Git;
- arbitrary direct database editing as workflow;
- unversioned legal rule constants scattered throughout code;
- silent overwriting of material records;
- synchronous dependence on every external provider;
- AI-provider calls directly from UI components;
- public analytics containing client or matter content;
- production data copied freely to development.

---

# 96. Failure Isolation

Failure of one subsystem should not corrupt another.

Examples:

- OCR failure does not lose uploaded document;
- email failure does not roll back matter update;
- AI failure does not block lawyer workflow;
- ETA outage does not corrupt invoice draft;
- search failure does not make source records unavailable;
- analytics failure does not block legal operations.

---

# 97. Data Consistency Classification

Different operations require different consistency.

## Strong Consistency Required

- engagement activation;
- conflict decision;
- matter opening;
- access grant;
- legal deadline confirmation;
- invoice issuance;
- payment reconciliation;
- matter closure.

## Eventual Consistency Acceptable

- search index;
- analytics;
- dashboard aggregates;
- notifications;
- document preview generation.

Architecture shall deliberately distinguish the two.

---

# 98. Privacy by Architecture

Before introducing any new external component, answer:

1. What data enters it?
2. Why?
3. Is each field necessary?
4. Where is the data processed?
5. How long is it retained?
6. Who can access it?
7. Is it used for provider training?
8. Can it be deleted?
9. What subprocessors exist?
10. What happens after contract termination?

No integration is “just technical.”

---

# 99. Architecture Security Assumptions

Assume:

- user credentials may be phished;
- employee devices may be lost;
- insiders may misuse access;
- external providers may fail;
- users may upload malicious files;
- browsers may be compromised;
- application bugs will occur;
- secrets may accidentally leak;
- automation may retry unexpectedly;
- users may click the wrong item.

Controls must be designed for these conditions.

---

# 100. Architecture Threat Boundaries

D11 shall perform detailed threat modeling for:

- login and recovery;
- client portal;
- matter access;
- document upload;
- document download;
- external sharing;
- conflict search;
- deadline changes;
- billing;
- payment webhooks;
- ETA integration;
- administrator operations;
- AI processing;
- exports;
- backups.

---

# 101. Architecture Testing Implications

Architecture-level tests must include:

- unauthorized record access;
- cross-matter leakage;
- client projection leakage;
- stale-write rejection;
- duplicate webhook;
- duplicate job retry;
- external provider timeout;
- object-storage denial;
- database failover;
- corrupted document processing;
- search authorization;
- backup restoration;
- expired access;
- audit immutability;
- Arabic directionality.

---

# 102. Scalability Strategy

Initial architecture should scale vertically and horizontally where straightforward.

Scale independently:

- application instances;
- workers;
- document processing;
- search;
- object storage.

Database scaling should prioritize:

1. good indexing;
2. query optimization;
3. connection pooling;
4. appropriate instance sizing;
5. read replicas where justified;

before distributed database complexity.

---

# 103. Cost Architecture

Major cost centers likely include:

- application compute;
- managed database;
- object storage;
- backups;
- document processing;
- email/SMS;
- monitoring;
- search;
- AI;
- data egress.

Cost metrics should be attributable by capability where practical.

AI and document processing require explicit usage budgets.

---

# 104. Portability

Avoid unnecessary dependence on proprietary abstractions where standard alternatives exist.

Data should remain exportable through:

- SQL or standard database backups;
- ordinary file objects;
- JSON/CSV structured exports;
- documented APIs.

Portability does not require lowest-common-denominator architecture.

---

# 105. Repository Architecture

A potential repository layout is:

```text id="1t9bo4"
/apps
  /web
  /workers

/packages
  /domain
    /identity
    /clients
    /conflicts
    /engagements
    /matters
    /cases
    /deadlines
    /documents
    /billing
    /privacy
    /audit
  /ui
  /auth
  /database
  /integrations
  /observability
  /localization
  /testing

/infrastructure

/docs
  /architecture
  /adrs
  /requirements
  /sources
```

Exact repository structure will be finalized in the implementation specification.

---

# 106. Dependency Direction

Domain modules should avoid dependence on:

- UI framework;
- database driver details;
- cloud provider APIs;
- specific notification vendors.

Preferred dependency direction:

```text id="de9tkd"
UI
 ↓
Application
 ↓
Domain
 ↑
Infrastructure Adapters
```

Domain rules should remain testable without cloud infrastructure.

---

# 107. Legal Rule Engine Boundary

Procedural and legally derived rules such as:

- deadline calculations;
- retention periods;
- authority rules;

should be:

- versioned;
- effective dated;
- source linked;
- reviewer approved.

They must not be implemented as undocumented magic constants.

---

# 108. Configuration Classes

Configuration shall be separated into:

## Technical Configuration

Examples:

- timeout;
- worker concurrency;
- file-size limit.

## Business Configuration

Examples:

- intake routing;
- reminder intervals;
- invoice approval threshold.

## Legally Sensitive Configuration

Examples:

- retention period;
- procedural rule;
- deadline formula;
- electronic-signature requirement.

Legally sensitive configuration requires stricter approval and audit.

---

# 109. Data Migration Boundary

Migration tools shall be separate from ordinary UI functionality.

Migration code should be:

- version controlled;
- repeatable;
- dry-run capable;
- reconciled;
- disabled after migration where appropriate.

---

# 110. Architecture Review Gates

## Architecture Gate 1 — Conceptual

Approve:

- modular architecture;
- trust zones;
- data classes;
- client projection model;
- integration boundaries.

---

## Architecture Gate 2 — Technology Selection

Approve:

- cloud provider;
- region;
- web stack;
- database;
- storage;
- identity;
- queue;
- search;
- monitoring.

---

## Architecture Gate 3 — Security

Approve:

- threat model;
- IAM;
- encryption;
- secrets;
- logging;
- administrative access;
- backup.

---

## Architecture Gate 4 — Production Readiness

Approve:

- load tests;
- failure tests;
- restoration test;
- observability;
- incident response;
- deployment rollback;
- privacy and legal review.

---

# 111. Open Architecture Decisions

The following remain unresolved:

1. cloud provider;
2. primary hosting region;
3. disaster-recovery region;
4. web framework;
5. backend runtime;
6. database provider;
7. identity provider;
8. object-storage provider;
9. search engine;
10. queue system;
11. cache;
12. observability provider;
13. email provider;
14. SMS provider;
15. payment provider;
16. accounting platform;
17. ETA integration architecture;
18. electronic-signature provider;
19. WhatsApp integration;
20. AI provider and routing;
21. whether a dedicated mobile app will ever be required;
22. expected user and matter scale;
23. document volume;
24. backup RPO/RTO;
25. availability target.

---

# 112. D09 Completion Criteria

D09 shall receive provisional approval when:

- system context is accepted;
- modular architecture is accepted;
- trust zones are accepted;
- public/client/internal separation is accepted;
- server-side matter authorization is mandatory;
- document-storage design is accepted;
- audit architecture is accepted;
- integration adapters are mandatory;
- AI gateway principle is accepted;
- transactional outbox principle is accepted;
- environment separation is accepted;
- production data restrictions are accepted;
- prohibited architectural patterns are accepted.

D09 shall receive final approval after:

- D04 scale and environment discovery;
- D10 data architecture;
- D11 threat model;
- D12 privacy architecture;
- hosting and vendor review;
- architecture decision records;
- operational cost analysis;
- recovery target approval.

---

# 113. Approval Record

## Solution Architect

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Engineering Lead

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Security Architect

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Privacy Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Egyptian Legal Reviewer

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

# Appendix A — Architecture Principles

**ARCH-001**  
Server authorization controls every protected operation.

**ARCH-002**  
Client-visible data is explicitly projected from internal data.

**ARCH-003**  
Documents remain private by default.

**ARCH-004**  
Original documents are preserved separately from derivatives.

**ARCH-005**  
Legal state changes occur through domain commands.

**ARCH-006**  
Material state history is immutable.

**ARCH-007**  
External integrations are isolated behind adapters.

**ARCH-008**  
External failure shall degrade safely.

**ARCH-009**  
Audit is a first-class subsystem.

**ARCH-010**  
Production data does not flow freely into lower environments.

**ARCH-011**  
AI is an optional controlled dependency, never a core workflow requirement.

**ARCH-012**  
Legally sensitive rules are versioned and effective dated.

**ARCH-013**  
Administrative privilege does not imply matter access.

**ARCH-014**  
Strong consistency is used for legally material state changes.

**ARCH-015**  
Search, reporting, caches, and projections preserve authorization boundaries.

---

# Appendix B — Initial Component Map

```text id="p7ro9j"
                         Lex Gate Platform

┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION                                                │
│                                                             │
│ Public Web       Client Portal        Internal Application  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│ APPLICATION LAYER                                          │
│                                                             │
│ Commands │ Queries │ Authorization │ Workflows │ Validation │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│ DOMAIN MODULES                                              │
│                                                             │
│ Intake        Conflicts      Clients       Engagements      │
│ Matters       Cases          Deadlines     Tasks            │
│ Documents     Evidence       Communications                 │
│ Billing       Privacy        Records       Audit            │
└──────────────┬─────────────────────────────┬────────────────┘
               │                             │
       ┌───────▼────────┐            ┌──────▼─────────┐
       │ INFRASTRUCTURE │            │ INTEGRATIONS   │
       │                │            │                │
       │ Database       │            │ Email          │
       │ Object Store   │            │ SMS            │
       │ Search         │            │ Payment        │
       │ Queue          │            │ ETA            │
       │ Cache          │            │ E-Signature    │
       │ Secrets/KMS    │            │ AI Gateway     │
       └────────────────┘            └────────────────┘
```

---

# Appendix C — Architectural Decision Rule

A technology or architectural pattern shall not be selected merely because it is fashionable, familiar, or highly scalable.

It must demonstrate that it:

> satisfies Lex Gate’s legal and security requirements, preserves strong domain correctness, is operationally supportable, has a credible recovery model, and introduces complexity proportional to the actual problem.