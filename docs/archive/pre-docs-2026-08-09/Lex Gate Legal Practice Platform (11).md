# Lex Gate Legal Practice Platform  
## D13 — API and Integration Specification

**Document ID:** LG-D13  
**Document Title:** API and Integration Specification  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.1  
**Status:** Proposed API and Integration Baseline — Provider-Specific Validation Required  
**Classification:** Confidential — Internal Architecture and Engineering Documentation  
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

---

# 1. Purpose

This document defines how Lex Gate application components and external systems shall communicate.

It establishes:

- API design principles;
- internal application APIs;
- domain command APIs;
- query APIs;
- client portal APIs;
- public APIs;
- service-to-service interfaces;
- authentication;
- authorization;
- idempotency;
- request and response contracts;
- error semantics;
- pagination;
- filtering;
- concurrency;
- versioning;
- events;
- webhooks;
- integration adapters;
- external provider boundaries;
- government-system integration rules;
- email and notification interfaces;
- calendar interfaces;
- payment interfaces;
- ETA interfaces;
- electronic-signature interfaces;
- AI interfaces;
- document-processing interfaces;
- observability;
- testing;
- failure recovery;
- provider replacement;
- deprecation.

The objective is to ensure that external connectivity cannot bypass the legal, security, privacy, and operational rules established in D03–D12.

---

# 2. API Architecture Principle

The Lex Gate platform shall distinguish between:

1. **Domain API**
2. **Application API**
3. **Presentation API**
4. **Integration API**
5. **Event interface**

These serve different purposes.

---

# 3. Domain API

The Domain API expresses legal and business operations.

Examples:

- `CompleteConflictReview`
- `ActivateEngagement`
- `OpenMatter`
- `ConfirmLegalDeadline`
- `FinalizeDocument`
- `PublishDocumentToClient`
- `IssueInvoice`
- `ReconcilePayment`
- `CloseMatter`

The Domain API does not expose raw database updates as business operations.

---

# 4. Application API

The Application API:

- authenticates caller;
- authorizes action;
- validates request;
- invokes domain operation;
- persists transaction;
- records audit evidence;
- publishes domain events;
- returns controlled output.

---

# 5. Presentation API

Presentation APIs support:

- public website;
- client portal;
- internal application.

Each presentation surface receives only the data appropriate to it.

The client portal shall never receive complete internal domain entities and rely on the browser to hide restricted fields.

---

# 6. Integration API

Integration APIs communicate with:

- email providers;
- SMS providers;
- payment providers;
- Egyptian Tax Authority interfaces;
- electronic-signature providers;
- calendar providers;
- identity providers;
- accounting systems;
- approved AI providers;
- other future services.

Provider-specific details remain outside the core domain.

---

# 7. Event Interface

Events describe completed facts.

Examples:

```text
EnquiryReceived
ConflictReviewCompleted
EngagementActivated
MatterOpened
LegalDeadlineConfirmed
DocumentFinalized
DocumentPublishedToClient
InvoiceIssued
PaymentReconciled
MatterClosed
```

Events are not commands.

An event states:

> Something happened.

A command states:

> Attempt to make something happen.

---

# 8. API Design Principles

## API-PRN-001 — Explicit Intent

High-risk actions shall have explicit endpoints or commands.

Avoid:

```text
PATCH /matters/123
{ "status": "closed" }
```

Prefer:

```text
POST /matters/123/close
```

---

## API-PRN-002 — Server-Side Authority

No API trusts the requesting UI to have already enforced authorization.

---

## API-PRN-003 — Domain Invariants

APIs shall not expose operations that permit bypassing D08 state transitions.

---

## API-PRN-004 — Minimum Disclosure

Responses contain only fields required by the requesting surface.

---

## API-PRN-005 — Stable Contracts

Contracts shall be versioned and documented.

---

## API-PRN-006 — Retry Safety

Operations vulnerable to duplicate execution shall use idempotency.

---

## API-PRN-007 — Failure Explicitness

Errors shall state enough for safe recovery without disclosing sensitive internals.

---

## API-PRN-008 — Auditability

Material state-changing operations shall carry sufficient request context for audit.

---

## API-PRN-009 — Provider Independence

Core domain code shall depend on integration interfaces, not provider APIs.

---

## API-PRN-010 — No External Direct Writes

External providers shall never write directly into Lex Gate’s core transactional database.

---

# 9. API Surface Classification

Each endpoint shall have a surface classification.

Possible classifications:

```text
PUBLIC
CLIENT_AUTHENTICATED
INTERNAL_AUTHENTICATED
PRIVILEGED_ADMIN
INTEGRATION_INBOUND
INTEGRATION_OUTBOUND
SYSTEM_INTERNAL
```

---

# 10. Endpoint Metadata

Each documented API endpoint should include:

```text
Endpoint ID:
Path:
Method:
Surface:
Purpose:
Authentication:
Authorization:
Input schema:
Output schema:
Idempotency:
Rate limit:
Audit:
Data classification:
Errors:
Related domain command:
Related requirements:
```

---

# 11. URL Design

Recommended pattern:

```text
/api/v1/...
```

Examples:

```text
/api/v1/enquiries
/api/v1/matters/{matterId}
/api/v1/matters/{matterId}/tasks
/api/v1/documents/{documentId}
/api/v1/invoices/{invoiceId}
```

High-risk state transitions should use explicit actions:

```text
/api/v1/conflict-reviews/{id}/complete
/api/v1/engagements/{id}/activate
/api/v1/deadlines/{id}/confirm
/api/v1/documents/{id}/publish
/api/v1/matters/{id}/close
```

---

# 12. Identifier Rules

API identifiers should be:

- opaque;
- non-sequential where externally visible;
- stable;
- independent from database sequence numbers.

Business references may additionally be returned where appropriate.

Example:

```json
{
  "id": "01K2...",
  "reference": "LG-MAT-2026-0042"
}
```

---

# 13. Authentication

Each protected request must establish a valid authenticated principal.

Authentication mechanism may vary by surface.

Examples:

- browser session;
- OAuth/OIDC access token;
- workload identity;
- signed webhook.

---

# 14. Authentication Context

The application should resolve authentication into a context such as:

```text
principal_id
user_account_id
party_id
organization_id
session_id
authentication_strength
authentication_time
device_context
```

Domain logic should not parse raw identity-provider tokens throughout application code.

---

# 15. Authorization

Every protected operation must evaluate:

- principal;
- action;
- resource;
- context.

Example:

```text
authorize(
  principal = user,
  action = PUBLISH_DOCUMENT,
  resource = documentVersion,
  context = matter
)
```

---

# 16. Authorization Enforcement Points

Authorization must be enforced:

1. before query result disclosure;
2. before state-changing commands;
3. before file download;
4. before export;
5. before search results;
6. before integration-triggered changes.

---

# 17. Client Portal API Boundary

Client portal APIs shall use dedicated response contracts.

Example internal Matter:

```text
id
internal_title
client_title
risk
strategy
conflict_information
responsible_lawyer
internal_notes
client_updates
```

Client response:

```json
{
  "id": "...",
  "title": "Your appeal matter",
  "status": "active",
  "responsibleContact": {
    "displayName": "..."
  },
  "updates": []
}
```

The internal fields must never be serialized and then removed client-side.

---

# 18. Public API Boundary

The public website may expose endpoints for:

- content;
- lawyer profiles;
- practice areas;
- enquiry submission;
- consultation requests.

The public API shall not expose:

- client search;
- matter IDs;
- conflict records;
- staff directory beyond approved public data;
- internal operational metadata.

---

# 19. Request Contract

A request contract shall define:

- field names;
- field types;
- required fields;
- maximum lengths;
- supported values;
- validation rules;
- business meaning.

---

# 20. Unknown Fields

For high-risk command APIs, unknown fields should ordinarily be rejected.

This reduces:

- accidental mass assignment;
- silent client incompatibility;
- hidden behavior.

---

# 21. Response Envelope

A consistent response style should be adopted.

Example success response:

```json
{
  "data": {
    "id": "01K2..."
  },
  "meta": {
    "requestId": "..."
  }
}
```

A simple API may omit an envelope when it provides no value, but consistency must be deliberate.

---

# 22. Error Envelope

Recommended:

```json
{
  "error": {
    "code": "MATTER_ACCESS_DENIED",
    "message": "You are not authorized to perform this action.",
    "requestId": "..."
  }
}
```

Do not expose:

- stack traces;
- SQL errors;
- internal file paths;
- secret names;
- existence of restricted matters.

---

# 23. Error Code Taxonomy

Suggested categories:

```text
AUTHENTICATION_REQUIRED
AUTHENTICATION_INSUFFICIENT
ACCESS_DENIED
RESOURCE_NOT_FOUND
VALIDATION_FAILED
STATE_CONFLICT
CONCURRENCY_CONFLICT
PREREQUISITE_MISSING
RATE_LIMITED
INTEGRATION_UNAVAILABLE
INTEGRATION_REJECTED
DUPLICATE_OPERATION
INTERNAL_ERROR
```

Domain-specific codes should be explicit.

---

# 24. Existence-Hiding Errors

For restricted resources, the API may intentionally return the same external response for:

- not found;
- not authorized.

Example:

```text
RESOURCE_NOT_FOUND
```

This prevents matter enumeration.

Internal audit may retain the actual authorization denial.

---

# 25. Validation Errors

Validation should identify safe field-level errors.

Example:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "fields": {
      "email": "INVALID_FORMAT"
    }
  }
}
```

Sensitive business rules should not be over-explained to an unauthorized caller.

---

# 26. State Conflict

Example:

Attempt:

> Close matter

State:

> unresolved critical deadline

Return:

```json
{
  "error": {
    "code": "MATTER_CLOSURE_BLOCKED",
    "blockingConditions": [
      "ACTIVE_CRITICAL_DEADLINE"
    ]
  }
}
```

Only authorized users should receive such internal details.

---

# 27. HTTP Method Semantics

Preferred use:

- GET — read;
- POST — create or execute command;
- PUT — replace where full replacement semantics are appropriate;
- PATCH — limited safe partial update;
- DELETE — only where actual deletion is semantically correct.

Legal destruction should ordinarily be an explicit command, not a generic HTTP DELETE.

---

# 28. PATCH Restrictions

PATCH should be limited to ordinary mutable records.

Example acceptable use:

- change user preference;
- edit draft title.

Avoid PATCH for:

- conflict decisions;
- confirmed deadline;
- accepted engagement;
- issued invoice;
- document finalization.

---

# 29. Idempotency

Idempotency is mandatory for operations where retry could create duplicate external or legal effects.

Examples:

- public enquiry creation;
- engagement acceptance;
- payment creation;
- payment webhook;
- invoice submission;
- signature request;
- communication send;
- client publication where duplicate action matters.

---

# 30. Idempotency Header

Recommended:

```text
Idempotency-Key: <opaque-client-generated-value>
```

The server stores:

- principal;
- key;
- operation;
- request fingerprint;
- result;
- timestamp.

---

# 31. Idempotency Conflict

If the same key is reused with materially different payload:

return a conflict rather than silently executing a second operation.

---

# 32. Concurrency Control

Material mutable resources should support optimistic concurrency.

Potential mechanisms:

- version number;
- ETag;
- revision.

Example:

```text
If-Match: "version-12"
```

If current version is 13:

```text
409 CONCURRENCY_CONFLICT
```

---

# 33. Concurrency-Sensitive Records

Especially:

- Matter;
- Deadline;
- Engagement draft;
- access policy;
- invoice draft;
- client representative.

---

# 34. Pagination

Large collections must paginate.

Preferred cursor-based pagination for high-volume or changing collections.

Example:

```json
{
  "data": [],
  "page": {
    "nextCursor": "..."
  }
}
```

---

# 35. Pagination Security

Cursor tokens must not disclose:

- database IDs;
- query structure;
- confidential metadata.

---

# 36. Filtering

Filters should be allow-listed.

Avoid generic SQL-like filter APIs.

Example:

```text
GET /matters?status=active&responsibleLawyer=currentUser
```

---

# 37. Sorting

Sorting shall use approved fields.

Do not allow arbitrary column expressions.

---

# 38. Search APIs

Search should have separate scopes.

Examples:

```text
/api/v1/search/matters
/api/v1/search/documents
/api/v1/conflicts/search
```

Conflict search requires stronger permission than ordinary matter search.

---

# 39. Search Response

Search must return only authorized records.

Unauthorized matter existence shall not appear through:

- count;
- snippet;
- autocomplete;
- facet.

---

# 40. Bulk Operations

Bulk APIs are high risk.

Examples:

- bulk invite;
- bulk document export;
- mass access review;
- migration import.

Bulk operation design shall include:

- explicit scope;
- preview;
- authorization;
- asynchronous execution;
- audit;
- error report.

---

# 41. Asynchronous API Pattern

For long-running operations:

```text
POST /exports
```

returns:

```json
{
  "jobId": "..."
}
```

Then:

```text
GET /jobs/{jobId}
```

states:

```text
QUEUED
RUNNING
COMPLETED
FAILED
CANCELLED
```

---

# 42. Asynchronous Job Security

A job belongs to an authorized principal and scope.

Possessing a job ID alone shall not grant access to its result.

---

# 43. Correlation ID

Every request should have a correlation ID.

Accept or generate:

```text
X-Request-ID
```

Propagate through:

- application logs;
- domain events;
- integrations;
- background jobs.

---

# 44. Audit Context

State-changing requests should capture:

- principal;
- session;
- request ID;
- target;
- action;
- reason where required.

---

# 45. Domain Command Contract

A high-risk command should define:

```text
Command:
Actor:
Target:
Prerequisite state:
Input:
Authorization:
Approval:
Idempotency:
Audit event:
Domain events:
Errors:
```

---

# 46. Example — Confirm Legal Deadline

Endpoint:

```text
POST /api/v1/deadlines/{deadlineId}/confirm
```

Request:

```json
{
  "confirmedDate": "2026-10-15",
  "sourceDocumentVersionId": "...",
  "ruleVersionId": "...",
  "reasoningNote": "..."
}
```

Requirements:

- authenticated lawyer;
- matter access;
- professional authority;
- source evidence;
- deadline not already superseded;
- concurrency check.

Result:

- deadline state updated;
- history created;
- audit event;
- `LegalDeadlineConfirmed` event.

---

# 47. Example — Publish Document to Client

Endpoint:

```text
POST /api/v1/documents/{documentId}/publish
```

Request:

```json
{
  "documentVersionId": "...",
  "recipientPartyIds": ["..."],
  "expiresAt": null,
  "downloadAllowed": true
}
```

Server validates:

- exact version;
- matter;
- authorized recipient;
- document state;
- publication authority;
- restrictions.

---

# 48. Example — Close Matter

Endpoint:

```text
POST /api/v1/matters/{matterId}/close
```

Request:

```json
{
  "closureReason": "WORK_COMPLETED",
  "closureChecklistInstanceId": "...",
  "finalCommunicationId": "..."
}
```

Server checks:

- active legal deadlines;
- unresolved client actions;
- lawyer authority;
- closure checklist;
- document/retention state.

---

# 49. Query API Pattern

Queries may expose optimized read models.

Examples:

```text
GET /api/v1/dashboard/me
GET /api/v1/matters/{id}
GET /api/v1/matters/{id}/timeline
GET /api/v1/matters/{id}/documents
```

Read models may be denormalized but are not authoritative for legal state changes.

---

# 50. Timeline API

Matter timeline may combine:

- legal events;
- hearings;
- client communications;
- document publication;
- billing milestones.

Each item shall include:

- event type;
- date;
- source domain;
- client visibility.

Internal and client timeline APIs shall differ.

---

# 51. API Versioning

Breaking changes require explicit version strategy.

Initial proposal:

```text
/api/v1/
```

Minor backward-compatible changes may not require a new version.

---

# 52. Breaking Change Definition

Breaking changes include:

- removing field;
- changing field meaning;
- changing type;
- changing requiredness incompatibly;
- changing status vocabulary without compatibility.

---

# 53. Deprecation

Deprecated APIs shall record:

- deprecation date;
- replacement;
- affected clients;
- sunset date.

Internal APIs should not remain indefinitely duplicated.

---

# 54. Event Versioning

Event type and schema version are separate.

Example:

```json
{
  "type": "MatterOpened",
  "version": 2
}
```

Consumers must tolerate additive fields.

---

# 55. Event Ordering

Do not assume global event ordering.

Where order matters, use:

- aggregate version;
- sequence number;
- occurred_at.

---

# 56. Transactional Outbox

The database transaction that changes business state shall also write the corresponding event to the outbox.

This prevents:

- state committed but event lost.

---

# 57. Consumer Idempotency

Consumers must tolerate duplicate event delivery.

Each event has unique `event_id`.

Processed-event tracking may be used where necessary.

---

# 58. Dead-Letter Queue

Events or integration jobs that repeatedly fail should move to a controlled dead-letter state.

A dead-letter entry records:

- event/job;
- failure reason;
- attempts;
- first failure;
- last failure;
- owner.

It must not disappear silently.

---

# 59. Integration Adapter Principle

Domain modules shall call interfaces such as:

```text
EmailProvider
SmsProvider
PaymentProvider
TaxInvoiceProvider
ElectronicSignatureProvider
CalendarProvider
AIProvider
```

They shall not directly call specific vendor SDKs.

---

# 60. Adapter Responsibilities

A provider adapter translates between:

- Lex Gate canonical model;
- provider-specific model.

It handles:

- authentication;
- field mapping;
- request construction;
- response validation;
- errors;
- idempotency;
- provider references.

---

# 61. Integration Registry

Maintain:

```text
integration_id
provider
integration_type
environment
owner
processing_activity
data_categories
region
credentials_reference
status
api_version
contract_version
last_health_check
```

---

# 62. Integration States

Suggested:

```text
DISABLED
CONFIGURED
TESTING
ACTIVE
DEGRADED
SUSPENDED
RETIRED
```

---

# 63. Integration Activation Gate

Before production activation:

- vendor approved;
- security reviewed;
- privacy reviewed;
- credentials configured;
- test environment validated;
- failure behavior tested;
- owner assigned;
- runbook exists.

---

# 64. Integration Health

Each integration should expose:

- availability;
- last success;
- last failure;
- queue backlog;
- credential expiry;
- API version support.

---

# 65. Circuit Breaker

Repeated provider failures should suspend automatic calls temporarily.

The system should:

- preserve queued actions;
- surface degraded status;
- avoid retry storms;
- provide manual fallback.

---

# 66. Timeout Policy

Every external API call shall have explicit:

- connect timeout;
- response timeout;
- retry policy.

No request should hang indefinitely.

---

# 67. Retry Policy

Retry only errors likely to be transient.

Examples:

Retry:

- timeout;
- 502;
- 503;
- rate limit where retry is allowed.

Do not blindly retry:

- validation failure;
- authorization failure;
- invalid tax payload.

---

# 68. Backoff

Retries should use controlled backoff and jitter.

---

# 69. External Response Validation

Provider responses are untrusted.

Validate:

- schema;
- identifiers;
- status;
- type;
- correlation;
- amount/currency where financial.

---

# 70. Webhook Architecture

Inbound webhooks shall terminate at a dedicated integration endpoint.

Flow:

```text
Provider
  ↓
Webhook Endpoint
  ↓
Signature Verification
  ↓
Replay Check
  ↓
Schema Validation
  ↓
Event Storage
  ↓
Async Processing
  ↓
Domain Command
```

---

# 71. Webhook Raw Evidence

Where useful, retain:

- provider event ID;
- headers needed for verification;
- received time;
- verified state;
- canonical parsed payload.

Avoid retaining unnecessary secrets or excessive personal data.

---

# 72. Webhook Replay Protection

Use:

- provider event ID;
- timestamp;
- signature;
- processed-event registry.

---

# 73. Webhook Acknowledgement

Webhook endpoints should respond quickly after verifying and safely queuing the event.

Long domain processing should occur asynchronously.

---

# 74. Email Integration

Email interfaces should distinguish:

1. transactional outbound email;
2. inbound/firm mailbox synchronization.

Release 1 may require only transactional sending.

---

# 75. Transactional Email API

Canonical interface:

```text
sendEmail(
  template,
  recipient,
  language,
  variables,
  classification,
  correlationId
)
```

The provider adapter receives rendered or approved content according to architecture.

---

# 76. Email Delivery State

Canonical states:

```text
QUEUED
SENT
DELIVERED
BOUNCED
FAILED
COMPLAINT
```

Provider-specific statuses map to these.

---

# 77. Sensitive Email

For highly sensitive documents, prefer:

- portal notification;
- secure retrieval;

rather than attaching files directly.

---

# 78. Inbound Email

If inbound email synchronization is implemented:

- link messages to matter only through controlled rules;
- preserve original message metadata;
- avoid global mailbox visibility;
- scan attachments;
- prevent email from automatically creating legal conclusions.

---

# 79. Email Matter Association

Association methods may include:

- approved matter reference;
- dedicated matter address;
- manual linking;
- safe automated suggestion.

Automatic suggestion requires human confirmation where ambiguity exists.

---

# 80. SMS Integration

SMS interface should primarily support:

- OTP where approved;
- appointment reminder;
- minimal notification.

Do not place sensitive legal details in SMS payloads by default.

---

# 81. Calendar Integration

Calendar provider interface should support:

- create/update approved calendar projection;
- delete projection;
- receive provider changes where bidirectional sync is allowed.

The Lex Gate canonical event remains authoritative.

---

# 82. Calendar Privacy

External calendar entries should use safe titles where necessary.

Example:

Preferred:

```text
Lex Gate — Client Appointment
```

instead of:

```text
Criminal defense hearing — Client Name
```

on a general external calendar.

---

# 83. Calendar Conflict

If an external calendar event changes:

- do not silently change confirmed legal deadline or hearing;
- create a synchronization discrepancy;
- require approved reconciliation.

---

# 84. Payment Provider Interface

Canonical interface may support:

```text
createPaymentRequest
getPaymentStatus
refundPayment
verifyWebhook
```

Payment provider does not control engagement state.

---

# 85. Payment Request

A payment request shall reference:

- payer;
- invoice;
- amount;
- currency;
- internal reference.

Do not trust client-supplied amount as authoritative.

---

# 86. Payment Webhook

On successful provider notification:

1. verify signature;
2. verify event ID;
3. verify amount;
4. verify currency;
5. verify merchant account;
6. map provider reference;
7. create/reconcile Payment;
8. audit.

---

# 87. Duplicate Payment Events

Duplicate webhook delivery shall not create duplicate payments.

---

# 88. Payment Failure

Failure should update payment-request state without altering invoice incorrectly.

---

# 89. Egyptian Tax Authority Integration

The tax interface shall be represented canonically as:

```text
TaxInvoiceProvider
```

Potential operations:

```text
submitInvoice
getSubmissionStatus
submitCorrection
```

Exact API operations depend on current ETA specifications and provider choice.

---

# 90. ETA Domain Separation

Canonical Lex Gate invoice exists independently of external ETA submission.

Possible sequence:

```text
Invoice Draft
   ↓
Approved
   ↓
ETA Submission Pending
   ↓
ETA Accepted
   ↓
Issued
```

or another accountant-approved sequence.

---

# 91. ETA Submission Record

Store:

```text
submission_id
invoice_id
provider
request_version
submitted_at
external_reference
status
response_reference
failure_code
retry_count
```

---

# 92. ETA Failure

Do not overwrite the invoice.

Create:

- submission failure;
- correction task;
- explicit retry.

---

# 93. Government and Court Systems

No direct machine integration shall be assumed merely because a website exists.

Integration modes shall be classified as:

```text
OFFICIAL_API
AUTHORIZED_PROVIDER
HUMAN_ASSISTED_PORTAL
FILE_IMPORT_EXPORT
UNSUPPORTED
```

---

# 94. Human-Assisted Government Workflow

Where only manual portal use is lawful/available:

1. authorized staff checks official portal;
2. records time;
3. records source;
4. captures approved evidence;
5. records observed result;
6. lawyer verifies where required.

---

# 95. Prohibited Government Integration

Without authorization:

- automated scraping;
- CAPTCHA bypass;
- credential automation;
- reverse-engineered undocumented private APIs;

shall not be part of the production design.

---

# 96. Electronic Signature Provider Interface

Canonical interface:

```text
createSignatureRequest
getSignatureStatus
cancelSignatureRequest
retrieveSignedDocument
verifySignatureEvidence
```

---

# 97. Signature Request

A signature request shall reference:

- immutable document version;
- signer Party;
- signer authority;
- required signature class;
- provider;
- expiry.

---

# 98. Signature Evidence

Preserve:

- provider reference;
- document hash;
- signer;
- method;
- timestamp;
- certificate/validation metadata where applicable;
- signed artifact.

---

# 99. Signature Callback

Webhook/event shall not automatically activate an engagement unless:

- signature state is valid;
- signer authority is valid;
- other engagement prerequisites are met.

---

# 100. Identity Verification Provider

If used, canonical interface may include:

```text
startVerification
getVerificationStatus
```

The provider result should be recorded as evidence.

It shall not replace all legal/business identity review automatically.

---

# 101. Document Processing Interface

Canonical services may include:

```text
scanForMalware
extractText
generatePreview
classifyDocument
```

These should be asynchronous.

---

# 102. Document Processing Failure

Original upload remains preserved in quarantine/repository.

A failed OCR job must not delete the source file.

---

# 103. Search Integration

If search uses a separate engine, indexing occurs through domain events.

Example:

```text
DocumentFinalized
   ↓
Indexing Worker
   ↓
Search Projection
```

---

# 104. Search Rebuild

Search index must be rebuildable from canonical data.

---

# 105. Search Access Revocation

Permission removal should result in:

- source authorization immediately denying access;
- search projection update as soon as practical.

Even if search index is stale, source retrieval must still deny access.

---

# 106. Accounting Integration

Potential canonical operations:

```text
exportInvoice
exportPayment
importAccountingStatus
```

The accounting system and Lex Gate must have clearly defined source-of-truth boundaries.

---

# 107. Financial Source of Truth

Before implementation, define authority for:

- invoice creation;
- tax acceptance;
- payment;
- general ledger;
- balance.

Do not allow two systems to independently mutate the same financial state without reconciliation.

---

# 108. AI Integration Interface

All models are behind:

```text
AIProvider
```

or a higher-level internal AI Gateway.

Operations might include:

```text
generateSummary
extractStructuredData
translateDraft
retrieveAndAnswerInternal
```

---

# 109. AI Request Contract

Include:

```text
user
matter
purpose
model_policy
authorized_context
source_documents
output_schema
human_review_required
```

Provider-specific API shape remains hidden behind adapter.

---

# 110. AI Tool Calls

An AI provider should not call Lex Gate domain APIs directly with unrestricted authority.

Tool flow:

```text
Model proposes tool action
      ↓
Lex Gate tool gateway
      ↓
Authenticate current user
      ↓
Authorize action
      ↓
Validate domain state
      ↓
Human approval if required
      ↓
Execute domain command
```

---

# 111. AI Structured Output

When AI extracts data, require a defined schema.

Example:

```json
{
  "candidateDate": "2026-10-15",
  "sourcePage": 3,
  "confidence": 0.81
}
```

It remains derived/unreviewed data.

---

# 112. AI Failure

AI failure must never prevent:

- matter access;
- deadline management;
- document storage;
- client communication through normal workflows.

---

# 113. Provider Selection Routing

The AI gateway may select providers based on:

- data classification;
- approved processing country;
- model capability;
- cost;
- matter AI policy.

The user cannot bypass prohibited-provider policy through an API parameter.

---

# 114. API Rate Limiting

Apply rate limits by risk.

Examples:

- public enquiry;
- login;
- recovery;
- search;
- exports;
- AI;
- document upload.

---

# 115. Rate Limit Responses

Recommended:

```text
429 RATE_LIMITED
```

Include retry timing where appropriate.

---

# 116. Internal Service Rate Limits

Even internal integrations should protect expensive resources such as:

- OCR;
- AI;
- exports;
- external provider calls.

---

# 117. API Quotas

Administrative quotas may control:

- maximum upload size;
- export volume;
- AI usage;
- message send volume.

Quotas must not create hidden legal risk, such as blocking an urgent required document upload without fallback.

---

# 118. File Upload API

Recommended sequence:

```text
POST /document-uploads
```

returns upload session.

After upload:

```text
POST /document-uploads/{id}/complete
```

Then processing begins.

---

# 119. File Upload Authorization

Upload permission should be scoped to:

- Party;
- Matter;
- request;
- allowed file types.

A portal user should not be able to upload directly into an arbitrary matter ID.

---

# 120. File Download API

Recommended:

```text
POST /documents/{versionId}/download-session
```

After authorization, server returns:

- short-lived signed URL;
- or streamed response.

---

# 121. Export API

Example:

```text
POST /exports
```

Request:

```json
{
  "type": "MATTER_EXPORT",
  "matterId": "...",
  "reason": "CLIENT_TRANSFER"
}
```

Large exports execute asynchronously.

---

# 122. Export Result

Export artifact shall have:

- owner;
- scope;
- created;
- expiry;
- download count;
- encryption state.

---

# 123. Import API

Imports should use:

```text
upload
→ validate
→ map
→ preview
→ approve
→ commit
```

No “upload CSV and immediately mutate production” path.

---

# 124. Import Validation Results

Return:

- valid rows;
- warnings;
- rejected rows;
- duplicates;
- unresolved references.

---

# 125. Integration Credentials

API credentials shall be:

- stored in secret manager;
- environment-specific;
- rotated;
- scoped.

Never send provider secrets to browsers.

---

# 126. OAuth Integrations

Where providers use OAuth:

- store refresh/access tokens securely;
- scope minimally;
- monitor expiration;
- revoke on disconnect.

---

# 127. User-Authorized Integrations

If a lawyer connects their own external calendar/email account:

- define data scope;
- define ownership;
- define disconnect behavior;
- prevent connected account from gaining more matter access than the Lex Gate user already has.

---

# 128. Service Accounts

Machine identities shall have:

- dedicated principal;
- narrow permissions;
- no interactive login;
- credential rotation or workload identity.

---

# 129. Integration Environment Separation

Production providers/credentials shall be separate from:

- development;
- test;
- staging.

Sandbox provider events must not mutate production.

---

# 130. Sandbox and Test Adapters

Every integration should ideally have:

- fake adapter;
- provider sandbox adapter;
- production adapter.

This enables deterministic tests.

---

# 131. Contract Testing

Integration tests should verify:

- expected request mapping;
- response mapping;
- errors;
- version compatibility;
- webhook verification.

---

# 132. Provider API Change

When provider contract changes:

1. detect change;
2. assess breaking impact;
3. update adapter;
4. test;
5. deploy;
6. monitor;
7. retire old version.

Provider-specific changes should not require redesigning the Lex Gate domain model.

---

# 133. Integration Failure Classification

Suggested:

```text
TRANSIENT
AUTHENTICATION
AUTHORIZATION
RATE_LIMIT
VALIDATION
PROVIDER_OUTAGE
VERSION_INCOMPATIBLE
UNKNOWN
```

---

# 134. Manual Reconciliation Queue

Failed high-value integrations should create a queue.

Examples:

- ETA rejection;
- unmatched payment;
- failed signature callback;
- calendar discrepancy.

Each record should include:

- owner;
- failure;
- retry;
- manual resolution;
- evidence.

---

# 135. Integration Runbooks

Every critical provider requires a runbook containing:

- purpose;
- credentials owner;
- health check;
- common failures;
- retry behavior;
- outage procedure;
- support contact;
- credential rotation;
- disconnect procedure.

---

# 136. Integration Observability

Track:

- calls;
- latency;
- errors;
- retries;
- provider status;
- quota usage;
- webhook failures;
- backlog.

Do not log entire confidential payloads by default.

---

# 137. Data Minimization at Integration Boundary

Only send fields required by the provider.

Example:

An SMS provider may need:

- telephone number;
- message;

not:

- complete client profile;
- matter documents.

---

# 138. Integration Payload Classification

Each external operation should declare:

```text
data_categories
confidentiality
destination_country
processor
retention
```

This ties D13 to D12.

---

# 139. Data Location Enforcement

An integration adapter should not be active if its provider/region conflicts with the approved transfer registry.

---

# 140. API Logging

Request logs may include:

- route;
- status;
- timing;
- request ID;
- principal ID;
- safe target IDs.

Do not log full:

- message body;
- documents;
- national IDs;
- tokens.

---

# 141. Sensitive Headers

Logs shall redact:

- Authorization;
- Cookie;
- API keys;
- webhook secrets.

---

# 142. API Metrics

Candidate metrics:

- request rate;
- latency;
- error rate;
- authorization denials;
- integration failures;
- queue depth;
- idempotency collisions.

---

# 143. API Security Tests

Test:

- missing authentication;
- invalid authentication;
- wrong role;
- wrong matter;
- expired representative;
- malicious IDs;
- mass assignment;
- overposting;
- object enumeration;
- stale concurrency;
- replay;
- duplicate request.

---

# 144. Integration Security Tests

Test:

- invalid webhook signature;
- expired signature;
- replay;
- wrong merchant/account;
- malformed response;
- provider timeout;
- credential failure;
- duplicate provider event.

---

# 145. Contract Schema Validation

Use formal schemas where practical:

- OpenAPI;
- JSON Schema;
- protocol-specific schema.

Generated code may be used but does not replace domain validation.

---

# 146. OpenAPI Governance

OpenAPI specification should document:

- routes;
- schemas;
- auth;
- errors;
- examples;
- deprecations.

Sensitive internal endpoints may have restricted documentation access.

---

# 147. API Documentation Security

Production API documentation shall not expose:

- secrets;
- live tokens;
- internal infrastructure;
- unsupported admin operations.

---

# 148. Testing Environments

API testing should cover:

```text
unit
domain
contract
integration
end-to-end
security
failure
```

---

# 149. Provider Mocks

Mocks should emulate:

- success;
- timeout;
- duplicate event;
- malformed response;
- rejection;
- unavailable service.

---

# 150. Chaos / Failure Testing

Critical integrations should be tested with simulated:

- provider outage;
- latency;
- queue failure;
- expired token;
- invalid response.

---

# 151. API Availability Classification

Not all APIs have the same criticality.

## Critical

- matter access;
- deadline;
- document access;
- authentication.

## High

- portal;
- communications;
- billing.

## Moderate

- analytics;
- AI;
- optional integrations.

---

# 152. Graceful Integration Degradation

Examples:

Payment provider down:

- invoices remain;
- manual bank transfer may continue if approved;
- payment request clearly shows degraded state.

Email provider down:

- portal remains available;
- queued notifications preserved.

AI down:

- no legal workflow blocked.

---

# 153. API Data Ownership

APIs shall expose the owning domain.

Example:

Finance should not directly update:

```text
Matter.status
```

Matter domain should not directly update:

```text
Invoice.eta_status
```

Cross-domain change occurs through command or event.

---

# 154. API Transaction Boundaries

Within modular monolith, a domain command may atomically change related records where invariant requires it.

External integration cannot participate in the same database transaction.

Use:

```text
local transaction
→ outbox
→ external operation
→ reconciliation state
```

---

# 155. Saga / Process Manager

Long-running workflows spanning domains/providers may use a process manager.

Examples:

- engagement activation;
- invoice/ETA workflow;
- electronic-signature workflow.

---

# 156. Engagement Activation Process

Possible orchestration:

```text
Engagement terms accepted
      ↓
Verify signer authority
      ↓
Verify conflict
      ↓
Verify identity
      ↓
Verify required payment if applicable
      ↓
Activate Engagement
      ↓
Open Matter workflow
```

The signature provider alone cannot activate it.

---

# 157. External Event vs Internal Fact

Provider event:

```text
PAYMENT_PROVIDER_SUCCESS
```

does not become canonical:

```text
PaymentReconciled
```

until Lex Gate validates and processes it.

---

# 158. API Reason Codes

High-risk commands may require structured reasons.

Examples:

- access grant;
- export;
- matter closure;
- deadline correction;
- record destruction.

Reason data supports audit and reporting.

---

# 159. User-Entered Free Text

API free-text fields should:

- have maximum length;
- be safely rendered;
- have classification;
- avoid serving as hidden structured data.

---

# 160. Locale

Requests may include:

```text
Accept-Language: ar-EG
```

or account preference.

Machine codes and states remain language neutral.

---

# 161. Dates

API contracts shall distinguish:

- date-only: `YYYY-MM-DD`
- timestamp: ISO 8601 with offset/UTC
- local event time with timezone where required.

Do not ambiguously send legal deadlines as midnight timestamps.

---

# 162. Money

Use decimal string or exact decimal representation.

Example:

```json
{
  "amount": "12500.00",
  "currency": "EGP"
}
```

Never floating-point semantics.

---

# 163. Telephone

Canonical phone API should use normalized representation plus optional display value.

---

# 164. Arabic Names

API should preserve original names and expose explicit variants where needed.

Do not overwrite Arabic names with normalized conflict-search forms.

---

# 165. Sensitive Identifiers

National IDs and similar fields shall:

- use dedicated endpoints or permission scopes where necessary;
- be masked by default;
- never appear in URLs.

---

# 166. Field-Level Authorization

Some DTOs may require field-level policy.

Example:

A lawyer may receive:

```text
client.identityVerificationStatus
```

while a finance user receives:

```text
client.billingName
client.taxReferenceMasked
```

---

# 167. Expand Parameters

Avoid generic:

```text
?include=everything
```

that can accidentally expose restricted relationships.

Any expansion mechanism must be allow-listed and authorization-aware.

---

# 168. Admin APIs

Administrative APIs should be separated logically and may require:

- stronger authentication;
- restricted network context;
- privileged authorization.

---

# 169. Admin API Examples

- suspend account;
- rotate integration credential reference;
- inspect job;
- enable feature flag;
- create support grant.

Admin API does not automatically expose matter documents.

---

# 170. Support APIs

Support tooling should expose:

- system state;
- request IDs;
- provider failures;
- sanitized diagnostics.

Not complete client content by default.

---

# 171. Data Destruction API

Record destruction should use:

```text
POST /retention/destruction-decisions/{id}/execute
```

not generic:

```text
DELETE /documents/{id}
```

for retained records.

---

# 172. DSR API

Privacy workflow APIs may include:

```text
POST /privacy/requests
POST /privacy/requests/{id}/verify-identity
POST /privacy/requests/{id}/approve-response
POST /privacy/requests/{id}/complete
```

No one-step destructive endpoint.

---

# 173. Breach API

Incident interfaces should support immutable regulatory timing fields.

Example:

```text
POST /privacy/incidents/{id}/confirm-awareness
```

must audit who established `awareness_at`.

---

# 174. API Change Approval

Changes affecting:

- authorization;
- client visibility;
- personal data;
- financial state;
- legal deadline;

require higher review.

---

# 175. Integration Change Approval

Adding a provider requires:

- architecture review;
- security review;
- privacy review;
- legal review where regulated;
- operations review.

---

# 176. API Threat Scenarios

## API-THR-001 — ID Enumeration

Attacker changes opaque ID attempting cross-client access.

Control:

- non-guessable IDs;
- object authorization.

---

## API-THR-002 — Mass Assignment

Attacker submits:

```json
{
  "role": "ADMIN"
}
```

to an ordinary profile update.

Control:

- explicit DTO.

---

## API-THR-003 — Replay Payment Event

Control:

- signature;
- event ID;
- idempotency.

---

## API-THR-004 — Duplicate Invoice Submission

Control:

- submission idempotency;
- external reference.

---

## API-THR-005 — Client Requests Internal Expansion

Control:

- dedicated client DTO;
- no unrestricted include.

---

## API-THR-006 — AI Attempts Privileged Tool Call

Control:

- authorization gateway;
- human approval.

---

# 177. Integration Decision Matrix

Every integration should be classified by:

| Dimension | Values |
|---|---|
| Legal authorization | Confirmed / Conditional / Unverified |
| API status | Official / Provider / Manual / Unsupported |
| Data sensitivity | Low / Medium / High / Restricted |
| Cross-border | No / Yes / Unknown |
| Operational criticality | Low / Medium / High / Critical |
| Failure fallback | Automated / Manual / None |
| Release | R1–R6 |

---

# 178. Initial Integration Register

## INT-EMAIL-001

Transactional email.

**Status:** Required.

---

## INT-SMS-001

SMS notification/verification.

**Status:** Conditional.

---

## INT-CAL-001

External calendar synchronization.

**Status:** Later planned.

---

## INT-PAY-001

Payment provider.

**Status:** Provider selection required.

---

## INT-ETA-001

Egyptian Tax Authority electronic invoice/receipt interface.

**Status:** Regulatory/accounting validation required.

---

## INT-ESIGN-001

Electronic signature provider.

**Status:** Conditional on approved signature workflows.

---

## INT-MOJ-001

Ministry/court information.

**Status:** Manual human-assisted default until official API/authority verified.

---

## INT-ACC-001

Accounting system.

**Status:** Discovery dependent.

---

## INT-WA-001

WhatsApp Business.

**Status:** Deferred pending legal/privacy/records design.

---

## INT-AI-001

AI Gateway.

**Status:** Release 6 / controlled pilot.

---

# 179. Integration Acceptance Criteria

An integration is production-ready only when:

- interface contract is defined;
- data ownership is defined;
- authentication works;
- authorization is enforced;
- privacy processing is approved;
- credentials are secure;
- retries are controlled;
- idempotency exists where needed;
- failures are monitored;
- manual fallback exists where required;
- runbook exists;
- tests pass.

---

# 180. API Acceptance Criteria

A protected API is production-ready only when:

- authentication test passes;
- object authorization test passes;
- wrong-role test passes;
- input validation passes;
- audit requirement passes;
- error behavior is safe;
- concurrency behavior is defined;
- documentation exists.

---

# 181. Performance Requirements

Final thresholds belong in D15, but APIs should initially be designed for:

- predictable interactive latency;
- asynchronous long-running jobs;
- controlled payload size;
- efficient pagination.

Avoid premature optimization that weakens authorization.

---

# 182. Payload Size

Large documents shall not be serialized as base64 through ordinary JSON APIs.

Use object-storage upload/download flow.

---

# 183. Compression

HTTP compression may be used for appropriate textual responses.

Sensitive compression side-channel considerations should be evaluated where relevant.

---

# 184. Caching

API caching may be applied to:

- public content;
- reference data;
- safe aggregates.

Do not cache restricted legal data through shared public caches.

---

# 185. Cache-Control

Sensitive authenticated responses should ordinarily use headers preventing unintended shared caching.

---

# 186. API Documentation Repository

Recommended:

```text
/docs/api
  /openapi
  /events
  /webhooks
  /integrations
  /examples
  /deprecations
```

---

# 187. Integration Documentation Repository

```text
/docs/integrations
  /email
  /sms
  /calendar
  /payments
  /eta
  /esign
  /accounting
  /government
  /ai
```

Each should contain:

- contract;
- configuration;
- security;
- privacy;
- testing;
- runbook.

---

# 188. API Requirement IDs

Recommended prefixes:

- `API-AUTH-*`
- `API-AUTHZ-*`
- `API-CMD-*`
- `API-QRY-*`
- `API-EVT-*`
- `API-WHK-*`
- `API-ERR-*`
- `API-IDM-*`
- `API-VER-*`

Integration:

- `INT-EMAIL-*`
- `INT-SMS-*`
- `INT-CAL-*`
- `INT-PAY-*`
- `INT-ETA-*`
- `INT-ESIGN-*`
- `INT-GOV-*`
- `INT-ACC-*`
- `INT-AI-*`

---

# 189. Priority API Requirements

## API-AUTHZ-001 — Critical

Every protected resource API shall perform server-side object-level authorization.

## API-AUTHZ-002 — Critical

Client APIs shall never serialize unrestricted internal domain entities.

## API-CMD-001 — Critical

Legally significant transitions shall use explicit domain commands rather than arbitrary state mutation.

## API-IDM-001 — High

Retry-sensitive operations shall support idempotency.

## API-EVT-001 — High

Domain events shall use transactional outbox.

## API-WHK-001 — Critical

Inbound provider webhooks shall authenticate source and resist replay.

## INT-GOV-001 — Critical

Government/court automation shall not use unsupported scraping or credential bypass.

## INT-PAY-001 — Critical

Payment-provider events shall not directly activate legal engagement or matter state.

## INT-AI-001 — Critical

AI tool actions shall pass through ordinary Lex Gate authentication, authorization, and domain rules.

---

# 190. Prohibited API Patterns

The following are prohibited:

1. raw database CRUD API exposed to clients;
2. generic `setStatus` endpoint for legal workflows;
3. client-side-only authorization;
4. predictable IDs treated as access control;
5. secrets in frontend code;
6. unsigned webhooks;
7. provider callback directly updating core tables;
8. full legal documents in ordinary logs;
9. arbitrary SQL-style public filters;
10. unrestricted `include=*`;
11. direct AI calls from browsers using provider secrets;
12. payment-success callback automatically opening a matter;
13. calendar event deletion automatically deleting a legal deadline;
14. external government status treated as verified without source evidence;
15. unlimited retries on non-idempotent operations.

---

# 191. Open Decisions

The following remain unresolved:

1. REST vs typed RPC implementation details.
2. Exact web framework.
3. Exact API schema tooling.
4. Identity provider.
5. Session vs token strategy for each surface.
6. Public API need beyond first-party clients.
7. Email provider.
8. SMS provider.
9. Calendar platform.
10. Payment provider.
11. ETA direct vs intermediary architecture.
12. Electronic-signature provider.
13. Accounting platform.
14. Government API availability.
15. WhatsApp Business strategy.
16. AI provider/routing.
17. Search technology.
18. Queue technology.
19. Event bus technology.
20. API rate limits.
21. API retention/logging periods.
22. Mobile-app API requirements.
23. External client API/product possibility.

---

# 192. D13 Completion Criteria

D13 may receive provisional approval when:

- API layering is accepted;
- explicit domain commands are mandatory;
- client projection boundary is accepted;
- authentication/authorization rules are accepted;
- idempotency strategy is accepted;
- concurrency strategy is accepted;
- error semantics are accepted;
- event/outbox architecture is accepted;
- webhook verification is mandatory;
- provider adapters are mandatory;
- government integration classification is accepted;
- payment/legal-state separation is accepted;
- AI tool gateway is accepted.

D13 receives final approval after:

- technology stack is selected;
- provider contracts are known;
- initial OpenAPI schemas exist;
- event schemas exist;
- webhook tests pass;
- payment provider selected;
- ETA integration path approved;
- electronic-signature path approved;
- integration runbooks exist;
- security/privacy reviews are complete.

---

# 193. Approval Record

## API Architect

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Integration Architect

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Engineering Lead

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Security Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Privacy Reviewer

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Legal Operations Reviewer

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

# Appendix A — Endpoint Specification Template

```text
Endpoint ID:
Name:
Method:
Path:
Surface:
Purpose:
Authentication:
Authorization:
Input:
Validation:
Output:
Idempotency:
Concurrency:
Audit:
Events:
Rate limit:
Errors:
Data classification:
Privacy activity:
Related command/query:
Tests:
Owner:
```

---

# Appendix B — Integration Specification Template

```text
Integration ID:
Provider:
Purpose:
Canonical interface:
Environment:
Authentication:
Credentials:
Input data:
Output data:
Personal-data categories:
Confidentiality:
Processing country:
Cross-border status:
Idempotency:
Retries:
Timeouts:
Webhook:
Failure behavior:
Manual fallback:
Monitoring:
Runbook:
Security approval:
Privacy approval:
Legal approval:
Owner:
```

---

# Appendix C — Webhook Specification Template

```text
Webhook ID:
Provider:
Endpoint:
Event:
Authentication method:
Signature:
Timestamp validation:
Replay protection:
Provider event ID:
Schema version:
Acknowledgement behavior:
Canonical event mapping:
Domain command:
Idempotency:
Audit:
Failure queue:
Retention:
```

---

# Appendix D — Domain Command Template

```text
Command:
Aggregate:
Purpose:
Actor:
Target:
Input:
Source state:
Target state:
Authentication:
Authorization:
Professional authority:
Prerequisites:
Idempotency:
Concurrency:
Validation:
Approval:
Transaction:
Audit:
Events:
Notifications:
Errors:
Tests:
```

---

# Appendix E — API Invariants

**INV-API-001**

No client API can retrieve unpublished internal matter fields.

**INV-API-002**

No protected endpoint authorizes access based solely on possession of a resource identifier.

**INV-API-003**

No integration provider can directly mutate core Lex Gate database records.

**INV-API-004**

No duplicate payment webhook creates duplicate canonical payment records.

**INV-API-005**

No provider callback can activate engagement unless all domain prerequisites pass.

**INV-API-006**

No calendar synchronization can silently replace a confirmed legal deadline.

**INV-API-007**

No AI model can execute a privileged domain command without the same authorization controls that apply to a human user.

**INV-API-008**

No court or government integration is treated as authoritative unless its source and authorization are verified.

**INV-API-009**

No external API credential is exposed to the browser.

**INV-API-010**

No high-risk command silently ignores concurrency conflicts.

---

# Appendix F — Integration Architecture Rule

An integration is not permitted to become a second, uncontrolled business-logic engine.

Every external provider must remain behind a controlled boundary where:

> Lex Gate authenticates the provider, validates the message, maps it into its own canonical model, applies its own authorization and domain rules, records the evidence, and remains capable of operating safely when that provider is unavailable.