# Lex Gate Legal Practice Platform  
## D11 — Security Architecture and Threat Model

**Document ID:** LG-D11  
**Document Title:** Security Architecture and Threat Model  
**Project:** Lex Gate Legal Practice Platform  
**Organization:** Lex Gate  
**Project Sponsor:** Ahmed Elshazlly  
**Jurisdiction:** Arab Republic of Egypt  
**Primary Languages:** Arabic and English  
**Version:** 0.1  
**Status:** Proposed Security Baseline — Threat-Model Validation and Penetration Testing Required  
**Classification:** Strictly Confidential — Security Architecture  
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

---

# 1. Purpose

This document defines the security architecture and threat model for the Lex Gate Legal Practice Platform.

It establishes:

- security objectives;
- assets requiring protection;
- threat actors;
- trust boundaries;
- threat-model methodology;
- security architecture;
- identity and authentication requirements;
- authorization controls;
- matter isolation;
- privileged-access controls;
- client-portal security;
- document and evidence security;
- application security;
- infrastructure and cloud security;
- integration security;
- payment and tax integration security;
- AI security;
- audit and logging;
- insider-risk controls;
- supply-chain security;
- backup and recovery security;
- vulnerability management;
- security testing;
- incident response;
- security risk acceptance;
- launch-blocking security conditions.

Security shall not be implemented as a collection of isolated technical controls.

For Lex Gate, security forms part of the firm’s:

- professional confidentiality;
- client protection;
- personal-data protection;
- evidentiary integrity;
- business continuity;
- professional responsibility.

---

# 2. Governing Security Baseline

The architecture shall be designed with reference to the currently selected security baselines recorded in D02, including:

- OWASP Application Security Verification Standard 5.0.0;
- OWASP Top 10:2025;
- NIST Cybersecurity Framework 2.0;
- NIST SP 800-63 Revision 4;
- ISO/IEC 27001:2022;
- ISO/IEC 27701:2025;
- WCAG 2.2 where security controls interact with accessibility.

OWASP lists ASVS 5.0.0 as the current stable release.

OWASP Top 10:2025 is the selected current application-risk reference.

NIST Cybersecurity Framework 2.0 provides the overarching cybersecurity risk framework.

NIST SP 800-63 Revision 4 is the selected digital-identity baseline. 

These standards provide engineering guidance.

They do not replace Egyptian law or Lex Gate’s professional obligations.

---

# 3. Security Objectives

Lex Gate security shall protect the following properties.

## SEC-OBJ-001 — Confidentiality

Only appropriately authorized parties may access information.

---

## SEC-OBJ-002 — Integrity

Unauthorized alteration of records must be prevented or reliably detectable.

---

## SEC-OBJ-003 — Availability

Legal work must remain available or recoverable during infrastructure or service failures.

---

## SEC-OBJ-004 — Accountability

Material actions must be attributable to an identifiable actor or system.

---

## SEC-OBJ-005 — Authenticity

Lex Gate must be able to establish reasonable confidence in:

- user identity;
- system identity;
- message origin;
- document origin;
- external integration responses.

---

## SEC-OBJ-006 — Non-Repudiation Evidence

Where legally and technically appropriate, the system should preserve evidence sufficient to establish that a specific action occurred.

The platform shall not claim legal non-repudiation merely because an audit record exists.

---

## SEC-OBJ-007 — Least Privilege

No actor receives more access than necessary.

---

## SEC-OBJ-008 — Compartmentalization

A compromise of one account or subsystem should not provide unrestricted access to the firm.

---

## SEC-OBJ-009 — Recoverability

Security incidents shall not permanently destroy Lex Gate’s ability to reconstruct and restore important legal records.

---

## SEC-OBJ-010 — Safe Failure

A security-control failure should default to the safer state.

---

# 4. Security Classification

Security requirements use four priority classes.

## S0 — Critical

Failure could cause:

- major client confidentiality breach;
- missed legal deadline;
- unauthorized legal action;
- catastrophic record loss;
- administrator takeover;
- compromise of highly restricted matters.

S0 controls are production launch blockers.

---

## S1 — High

Failure could cause substantial:

- data exposure;
- operational disruption;
- fraud;
- account compromise;
- financial or regulatory harm.

---

## S2 — Moderate

Failure creates meaningful but contained risk.

---

## S3 — Defense in Depth

Improves resilience but does not independently determine production suitability.

---

# 5. Threat Modeling Methodology

The platform shall use a hybrid threat-model process.

Primary methodology:

> STRIDE applied to data flows, trust boundaries, components, and high-risk workflows.

STRIDE categories:

- Spoofing
- Tampering
- Repudiation
- Information Disclosure
- Denial of Service
- Elevation of Privilege

Threat modeling shall additionally consider:

- privacy harms;
- insider misuse;
- credential theft;
- supply-chain attacks;
- business-logic abuse;
- social engineering;
- operational mistakes;
- misuse of AI;
- malicious documents;
- regulatory and evidentiary consequences.

---

# 6. Threat Model Scope

Threat modeling shall cover at minimum:

1. Public website
2. Public enquiry
3. Authentication
4. Account recovery
5. Client portal
6. Internal application
7. Matter authorization
8. Restricted matters
9. Conflict search
10. Legal deadlines
11. Document upload
12. Document processing
13. Document download
14. Evidence custody
15. Client publication
16. Communications
17. Billing
18. Payments
19. ETA integration
20. Electronic signature
21. External integrations
22. Webhooks
23. Search
24. Reporting
25. Data exports
26. Data imports
27. Administrative operations
28. Support access
29. CI/CD
30. Backups
31. Disaster recovery
32. AI processing
33. Employee onboarding
34. Employee offboarding
35. Security incident response

---

# 7. Security Assets

## 7.1 Tier A — Critical Legal Assets

- client identity;
- matter existence;
- matter strategy;
- legal advice;
- legal deadlines;
- evidence;
- court records;
- privileged documents;
- conflict records;
- highly restricted matters.

---

## 7.2 Tier B — Critical Security Assets

- authentication secrets;
- session tokens;
- encryption keys;
- administrator credentials;
- API credentials;
- signing keys;
- CI/CD credentials;
- production infrastructure access.

---

## 7.3 Tier C — Financial Assets

- fee arrangements;
- invoices;
- payments;
- bank references;
- ETA credentials and responses;
- payment-provider credentials.

---

## 7.4 Tier D — Privacy Assets

- national identifiers;
- passports;
- contact details;
- employee information;
- sensitive personal information;
- minors’ data;
- criminal-case information.

---

## 7.5 Tier E — Operational Assets

- source code;
- configuration;
- audit records;
- backups;
- templates;
- migration records;
- monitoring systems.

---

# 8. Threat Actors

The architecture assumes risk from several actor categories.

## TA-01 — Opportunistic Internet Attacker

Capabilities:

- automated scanning;
- credential stuffing;
- phishing;
- known vulnerability exploitation.

---

## TA-02 — Targeted Criminal Attacker

May seek:

- client information;
- legal strategy;
- extortion;
- payment fraud;
- credentials.

---

## TA-03 — Adverse Party

An adverse party may have strong motivation to obtain information relating to a legal matter.

Threats include:

- impersonating a client;
- social engineering;
- attacking client portal accounts;
- malicious document delivery;
- attempting to identify hidden matters.

---

## TA-04 — Compromised Client

A legitimate client account or device may be compromised.

The system shall therefore not trust a request merely because authentication succeeded.

---

## TA-05 — Compromised Employee

A lawyer or employee account may be phished or malware infected.

---

## TA-06 — Malicious Insider

A legitimate employee may intentionally:

- access unrelated matters;
- export data;
- alter records;
- disclose documents;
- abuse administrator functions.

---

## TA-07 — Negligent Insider

A user may accidentally:

- send to wrong recipient;
- upload wrong document;
- misclassify information;
- share credentials;
- expose data through a public link.

---

## TA-08 — Former Employee

A departing user may:

- retain downloaded documents;
- retain credentials;
- retain active sessions;
- retain access through personal accounts.

---

## TA-09 — Compromised Administrator

Particularly severe because of infrastructure access.

Architecture must limit the ability of a technical administrator to turn infrastructure compromise automatically into unrestricted substantive matter access.

---

## TA-10 — Compromised Vendor

Examples:

- cloud provider account;
- email provider;
- SMS provider;
- payment provider;
- AI provider;
- monitoring vendor.

---

## TA-11 — Supply-Chain Attacker

May compromise:

- package dependency;
- build pipeline;
- CI action;
- container image;
- development tool.

---

## TA-12 — Automated Abuse

Examples:

- bots;
- scraping;
- credential stuffing;
- denial-of-service attacks;
- spam enquiries.

---

# 9. Trust Boundaries

D09 trust zones shall be treated as security boundaries.

The most significant boundaries include:

```text id="2mx8zt"
PUBLIC INTERNET
     ↓
EDGE / WAF
     ↓
PUBLIC APPLICATION
     ↓
AUTHENTICATION BOUNDARY
     ↓
CLIENT OR EMPLOYEE SESSION
     ↓
APPLICATION AUTHORIZATION
     ↓
DOMAIN LOGIC
     ↓
PRIVATE DATA STORES

APPLICATION
     ↓
INTEGRATION GATEWAY
     ↓
EXTERNAL PROVIDER
```

Every crossing requires explicit validation.

---

# 10. Zero-Trust Principle

The platform shall not trust a user because they are:

- inside the office;
- on a corporate network;
- using a VPN;
- employed by Lex Gate;
- a lawyer;
- a system administrator.

Security decisions shall depend on:

- verified identity;
- current account state;
- current role;
- matter relationship;
- device/session context where applicable;
- action sensitivity;
- authorization policy.

---

# 11. Identity Security Architecture

Authentication shall be centralized.

The application shall not implement ad hoc password management when a mature identity infrastructure is available.

---

# 12. User Identity Binding

Every authenticated account shall bind to a canonical `UserAccount`.

The system shall not authorize client matter access using:

- email-address matching alone;
- telephone-number matching alone;
- URL possession alone.

---

# 13. Employee Authentication

Minimum production baseline:

- unique user account;
- no account sharing;
- mandatory MFA;
- secure recovery;
- session revocation;
- account state monitoring.

---

# 14. Privileged Authentication

Administrators and other privileged personnel shall use stronger authentication.

Preferred methods include phishing-resistant authentication where operationally feasible.

Examples:

- passkeys;
- hardware security keys;
- approved cryptographic authenticators.

SMS should not be the preferred factor for the highest-privilege accounts where stronger methods are available.

---

# 15. Client Authentication

Client authentication should balance security and accessibility.

Possible baseline:

- password or passkey;
- verified email/telephone;
- MFA for sensitive access or as risk requires;
- step-up authentication for selected high-risk actions.

---

# 16. Step-Up Authentication

Require reauthentication or stronger authentication before actions such as:

- changing MFA;
- changing recovery information;
- bulk export;
- granting privileged access;
- viewing highly restricted records;
- downloading highly sensitive evidence;
- changing financial destination information.

---

# 17. Account Recovery Threat Model

Recovery is often weaker than normal authentication.

Threats include:

- SIM swap;
- email compromise;
- support impersonation;
- social engineering;
- stolen identity documents.

---

# 18. Recovery Requirements

**SEC-IAM-001 — S0**

Recovery shall not permit help-desk personnel to bypass authentication arbitrarily.

**SEC-IAM-002 — S0**

Changing MFA for privileged accounts shall require enhanced verification and audit.

**SEC-IAM-003 — S1**

Recovery events shall notify the affected user through an independent known channel where appropriate.

**SEC-IAM-004 — S1**

Recovery attempts shall be rate limited and monitored.

**SEC-IAM-005 — S1**

High-risk recovery may introduce a temporary restriction period before sensitive actions become available.

---

# 19. Credential Storage

Where passwords are used, they shall be:

- processed through approved modern password hashing;
- salted;
- never reversibly encrypted for later display.

The application shall never store plaintext passwords.

---

# 20. Session Security

Sessions shall support:

- secure cookies;
- HttpOnly where relevant;
- Secure flag;
- SameSite policy;
- rotation after authentication;
- inactivity timeout;
- maximum lifetime;
- revocation;
- compromised-session termination.

---

# 21. Session Binding

Risk-based checks may consider:

- unusual location;
- new device;
- impossible travel;
- session token reuse;
- suspicious IP reputation.

Such checks shall not make sensitive decisions entirely automatically without appropriate recovery paths.

---

# 22. Logout

Logout shall revoke server-side session state where feasible.

For high-risk applications, clearing browser state alone is insufficient.

---

# 23. Authorization Security Architecture

Authorization is the most important application-level security control for Lex Gate.

A successful login does not imply permission to a matter.

---

# 24. Authorization Decision Inputs

Authorization may consider:

```text id="96tdg5"
user
account state
organization
professional status
role
matter assignment
matter restriction
document classification
client relationship
temporary grant
ethical restriction
action
resource state
```

---

# 25. Deny by Default

Any action not explicitly authorized shall be denied.

---

# 26. Server-Side Enforcement

**SEC-AUTHZ-001 — S0**

Every protected operation shall be authorized server-side.

Hiding a button is not authorization.

---

# 27. Object-Level Authorization

Every resource request shall verify authorization for that specific object.

Example:

```text id="yrbgmz"
GET /documents/{documentId}
```

must verify the requesting user may access that particular document.

This protects against insecure direct object reference / broken object-level authorization.

---

# 28. Matter-Level Authorization

The principal rule should resemble:

```text id="pgxsjr"
user may access matter
IF
  user has approved active relationship to matter
AND
  matter restriction permits the relationship
AND
  account is active
AND
  no applicable restriction blocks access
```

---

# 29. No Implicit Related-Matter Access

Access to Matter A must not imply access to:

- related Matter B;
- parent matter;
- appeal;
- another client matter.

Each relationship requires authorization.

---

# 30. Existence-Restricted Matters

For a highly restricted matter, unauthorized users must not learn:

- the matter title;
- client;
- matter reference;
- assigned lawyers;
- existence.

Search, reports, notifications, and audit interfaces must respect this.

---

# 31. Side-Channel Disclosure

Matter restrictions must also be enforced in:

- search suggestions;
- autocomplete;
- notification counts;
- dashboards;
- error messages;
- URLs;
- exported reports;
- logs;
- performance traces.

---

# 32. Authorization Testing

Every sensitive API shall include tests for:

- anonymous access;
- wrong client;
- wrong matter;
- former employee;
- expired external collaborator;
- administrator without substantive permission;
- related-but-unassigned lawyer;
- restricted matter.

---

# 33. Privilege Escalation

Threats include:

- changing role parameters;
- editing API payload;
- manipulating route IDs;
- abusing group membership;
- stale access after role changes.

All role and permission changes require server-side validation.

---

# 34. Access Grant Security

Matter access grants shall record:

- requester;
- recipient;
- reason;
- scope;
- approver;
- effective date;
- expiry;
- restriction conditions.

---

# 35. Temporary Access

Temporary access should expire automatically.

Expiry must revoke:

- UI access;
- API access;
- search visibility;
- portal projection;
- integration access where relevant.

---

# 36. Separation of Duties

Sensitive actions should separate duties where practical.

Examples:

- requester ≠ approver for privileged access;
- finance preparer ≠ final approver for selected invoices;
- system administrator ≠ unrestricted matter reviewer;
- destruction requester ≠ sole destruction approver.

---

# 37. Privileged Administration

Infrastructure administration shall use separate privileged identities.

Users should not perform everyday activities from administrative accounts.

---

# 38. Break-Glass Access

Emergency access may be needed.

A break-glass process shall require:

- genuine emergency;
- named user;
- enhanced authentication;
- reason;
- defined scope;
- short expiry;
- real-time notification where feasible;
- post-use review.

---

# 39. No Permanent Break-Glass

Emergency access credentials shall not become shared administrator passwords.

---

# 40. Support Access

External support should not receive standing production client-data access.

Support workflow:

```text id="jo9v64"
Support issue
    ↓
Scope identification
    ↓
Approval
    ↓
Temporary support grant
    ↓
Monitored session
    ↓
Automatic expiry
    ↓
Review
```

---

# 41. Public Website Threat Model

Principal threats:

- injection;
- malicious form submissions;
- DDoS;
- bot abuse;
- content compromise;
- dependency compromise;
- account takeover of content editors;
- malicious redirects;
- tracking-data leakage.

---

# 42. Public Website Controls

- WAF where appropriate;
- rate limiting;
- Content Security Policy;
- strict input validation;
- output encoding;
- secure CMS/editor authentication;
- limited public API surface;
- file-upload restriction;
- dependency scanning;
- integrity-controlled deployments.

---

# 43. Public Enquiry Threats

- spam;
- harassment;
- malicious HTML;
- injection payloads;
- malicious documents;
- excessive sensitive data;
- automated enumeration;
- denial of service.

---

# 44. Public Enquiry Controls

- server validation;
- content size limits;
- rate limiting;
- bot mitigation proportionate to usability;
- no HTML execution;
- safe rendering;
- no unrestricted file upload in early stage;
- isolated intake processing.

---

# 45. Client Portal Threat Model

Principal threats:

- account takeover;
- horizontal privilege escalation;
- client-to-client leakage;
- stolen session;
- insecure downloads;
- shared-device exposure;
- unsafe password recovery;
- sensitive browser caching;
- malicious upload.

---

# 46. Client Portal Controls

**SEC-PRT-001 — S0**

Portal data shall be obtained only from approved client projections.

**SEC-PRT-002 — S0**

Every portal matter access request shall verify representative authority.

**SEC-PRT-003 — S0**

Internal entities shall never be serialized directly to clients.

**SEC-PRT-004 — S1**

Document download links shall be short-lived.

**SEC-PRT-005 — S1**

Sensitive notifications shall use minimal preview content.

**SEC-PRT-006 — S1**

Portal sessions shall support remote revocation.

---

# 47. Shared Device Risk

Client users may access Lex Gate from:

- shared family devices;
- work devices;
- public computers.

Controls should include:

- no confidential browser push preview by default;
- clear sign-out;
- limited cache;
- session expiry;
- avoiding sensitive data in browser history and URLs.

---

# 48. Application Input Security

All externally supplied data is untrusted.

Sources include:

- browser forms;
- APIs;
- files;
- webhooks;
- email;
- imported spreadsheets;
- AI outputs;
- external government responses.

---

# 49. Validation Model

Validation shall include:

- syntax;
- length;
- format;
- allowed values;
- domain rules;
- authorization;
- business state.

---

# 50. SQL Injection

Database access shall use:

- parameterized queries;
- safe ORM/query interfaces;
- no uncontrolled SQL concatenation.

---

# 51. Cross-Site Scripting

Untrusted content shall be output encoded.

Rich text, if supported, must use strict allow-list sanitization.

---

# 52. Cross-Site Request Forgery

State-changing browser operations shall use appropriate CSRF protections where the session architecture requires them.

---

# 53. Server-Side Request Forgery

Components capable of fetching remote URLs shall:

- restrict protocols;
- validate destinations;
- deny metadata endpoints;
- deny internal private address ranges where not required;
- use egress controls.

Especially relevant to:

- URL previews;
- document imports;
- AI tools;
- integrations.

---

# 54. Mass Assignment

APIs shall use explicit command DTOs.

The application shall not automatically map arbitrary user JSON onto database entities.

---

# 55. Error Handling

External errors must not disclose:

- stack traces;
- query structure;
- secret names;
- filesystem paths;
- internal hosts;
- access-control logic.

Detailed diagnostics belong in restricted observability systems.

---

# 56. Document Upload Threat Model

Uploaded legal files must be treated as hostile.

Potential threats:

- malware;
- macro malware;
- malformed PDF exploit;
- decompression bombs;
- executable masquerading as document;
- archive bombs;
- malicious filename;
- content-type spoofing.

---

# 57. Upload Quarantine

All uploads shall initially enter quarantine.

They shall not become available for normal matter use until required checks complete.

---

# 58. File Validation

Validate:

- file size;
- extension;
- detected MIME;
- magic bytes;
- compression ratio where relevant;
- archive contents;
- executable content.

File extension alone is insufficient.

---

# 59. Malware Scanning

Malware scanning shall occur before ordinary download or processing.

Detection shall create:

- quarantined state;
- security event;
- restricted access;
- remediation procedure.

---

# 60. Document Processor Isolation

OCR, preview generation, conversion, and metadata extraction shall run in isolated environments with:

- minimal privileges;
- network restrictions;
- resource limits;
- disposable execution context.

---

# 61. Document Download

Before creating a download:

1. authenticate;
2. authorize document;
3. authorize exact version;
4. check matter restriction;
5. check download policy;
6. create short-lived retrieval mechanism;
7. audit access.

---

# 62. File URL Security

Object-storage keys and signed URLs shall not expose client information.

Pre-signed URLs should have short expiry proportional to use.

---

# 63. Document Integrity

Each stored file shall have a cryptographic hash.

Hashes support:

- integrity checking;
- migration validation;
- evidence handling;
- duplicate analysis.

---

# 64. Evidence Security

Evidence requires enhanced protection.

Controls may include:

- append-only custody history;
- write restrictions;
- immutable versions;
- enhanced audit;
- restricted export;
- original preservation.

---

# 65. Client Publication Threat

One of the highest-risk application operations is publishing the wrong internal document to a client.

---

# 66. Client Publication Controls

**SEC-PUB-001 — S0**

Publication must reference an immutable specific document version.

**SEC-PUB-002 — S0**

Publication requires recipient authorization validation.

**SEC-PUB-003 — S0**

The user must preview the exact client-visible artifact.

**SEC-PUB-004 — S1**

Highly sensitive publication may require dual confirmation.

**SEC-PUB-005 — S1**

Publication is fully audited.

---

# 67. Search Threat Model

Threats:

- discovering hidden matter names;
- snippet leakage;
- stale permissions;
- unrestricted conflict search;
- query abuse.

---

# 68. Search Controls

- authorization-filtered queries;
- revalidation before record retrieval;
- no sensitive autocomplete;
- separate conflict-search permissions;
- search-index purge after access revocation where required;
- minimal indexed sensitive content.

---

# 69. Conflict Database Security

Conflict data can expose the existence of clients and adverse parties.

Access should be narrow.

Results should display only the information needed for conflict assessment.

---

# 70. Deadline Security

Deadline manipulation can cause direct legal harm.

Threats include:

- malicious alteration;
- accidental alteration;
- deleting reminders;
- replacing confirmed deadline;
- unauthorized confirmation.

---

# 71. Deadline Controls

**SEC-DLN-001 — S0**

Only authorized lawyers may confirm legal deadlines.

**SEC-DLN-002 — S0**

Historical deadline values shall remain preserved.

**SEC-DLN-003 — S0**

Confirmed deadlines shall record supporting evidence.

**SEC-DLN-004 — S1**

Material changes shall alert responsible parties.

**SEC-DLN-005 — S1**

Unconfirmed critical deadlines shall be monitored.

---

# 72. Communication Security

Threats include:

- wrong recipient;
- spoofed sender;
- compromised mailbox;
- unsafe attachments;
- delivery failure;
- business email compromise.

---

# 73. Communication Controls

- approved sender identities;
- recipient validation;
- attachment validation;
- domain email authentication where applicable;
- delivery status;
- material communication audit;
- separation of internal and client communication.

---

# 74. Email Domain Security

Firm email domains should support industry-standard sender-authentication controls such as:

- SPF;
- DKIM;
- DMARC.

Policies should progress to enforcement after monitoring and validation.

---

# 75. Payment Threat Model

Potential attacks:

- invoice manipulation;
- payment redirection;
- fake payment confirmation;
- webhook forgery;
- duplicate payment processing;
- changing bank details.

---

# 76. Payment Controls

**SEC-PAY-001 — S0**

Payment-provider webhook signatures shall be verified.

**SEC-PAY-002 — S0**

Webhook replay shall be prevented.

**SEC-PAY-003 — S0**

Payment does not directly alter engagement authority.

**SEC-PAY-004 — S1**

Bank/payment destination changes require enhanced approval.

**SEC-PAY-005 — S1**

Payment reconciliation shall preserve provider evidence.

---

# 77. ETA Integration Threat Model

Threats include:

- credential theft;
- duplicate submission;
- wrong taxpayer;
- response tampering;
- API specification change;
- unavailable service.

---

# 78. ETA Controls

- isolated integration credentials;
- least-privilege access;
- idempotent submission;
- immutable request/response references;
- retry control;
- no silent resubmission with changed financial data;
- provider/API version tracking.

---

# 79. Webhook Security

Inbound webhooks shall validate:

- source authentication;
- signature;
- timestamp;
- replay protection;
- schema;
- expected event type.

Webhook endpoints must not trust user-supplied object IDs without matching them to internal records.

---

# 80. External API Security

Outbound connections require:

- TLS;
- credential protection;
- request validation;
- response validation;
- timeouts;
- retry policy;
- rate limiting;
- circuit breaking;
- audit/correlation.

---

# 81. Secrets Security

Secrets shall be held in an approved secret-management system.

Access to secrets must be restricted to the workload or administrator that needs them.

---

# 82. Secret Rotation

Rotation procedures must exist for:

- database credentials;
- provider API keys;
- webhook secrets;
- signing keys;
- CI/CD credentials.

Emergency rotation must be possible after compromise.

---

# 83. Key Management

Encryption keys shall use a dedicated key-management service.

Requirements:

- restricted key administrators;
- rotation where appropriate;
- separation of data and key access;
- audit;
- documented recovery.

---

# 84. Database Security

Controls include:

- private network access;
- encryption;
- least-privilege database accounts;
- no public database exposure;
- protected backups;
- query monitoring;
- schema migrations through CI/CD.

---

# 85. Application Database Identity

Applications should use dedicated database identities with only required permissions.

Migration tooling may use a separate, more privileged identity.

---

# 86. Database Administrative Access

Human production database access should be exceptional.

Where required:

- named user;
- approved reason;
- restricted network;
- short duration;
- audit;
- no shared credentials.

---

# 87. Direct Production Edits

Direct manual changes to:

- deadlines;
- conflict decisions;
- matter states;
- invoices;
- access grants;

through database tools are prohibited as normal operations.

Emergency corrections require an incident/exception process.

---

# 88. Object Storage Security

Object storage shall be:

- private;
- encrypted;
- blocked from anonymous listing;
- accessed through workload identity;
- protected against accidental public configuration.

---

# 89. Public Access Prevention

Cloud account policy should prevent matter-document buckets from becoming public even through administrator error.

Where provider functionality exists, organization/account-wide public-access blocks should be used.

---

# 90. Network Security

Production data services should reside in private networking wherever practical.

Internet-facing components should be limited to required application edges.

---

# 91. Egress Security

Sensitive workloads should not have unlimited outbound network access where practical.

Restrict egress particularly for:

- document processors;
- application servers;
- AI gateway;
- build systems.

---

# 92. WAF and Edge Protection

Internet-facing services should use controls appropriate to risk, potentially including:

- DDoS protection;
- bot management;
- rate limiting;
- web-attack filtering;
- request-size enforcement.

---

# 93. Security Headers

At minimum evaluate:

- Content Security Policy;
- HSTS;
- frame restrictions;
- secure cookie controls;
- Referrer-Policy;
- Permissions-Policy.

---

# 94. Browser-Side Secret Rule

No backend secret may appear in:

- JavaScript bundles;
- HTML;
- client source maps;
- browser storage.

---

# 95. Content Security Policy

A restrictive Content Security Policy should reduce the effects of script injection.

Third-party scripts should be minimized.

---

# 96. Third-Party Browser Scripts

Do not load unnecessary third-party scripts within:

- client portal;
- internal legal application;
- authentication surfaces.

Analytics, chat, session replay, and advertising scripts require explicit security and privacy approval.

---

# 97. Session Replay

Third-party session replay shall be prohibited on legal or client surfaces unless an exceptional privacy/security review proves it safe.

---

# 98. Logging Security

Logs themselves are sensitive.

Access to logs shall be restricted.

---

# 99. Prohibited Log Content

Logs must not intentionally include:

- passwords;
- full tokens;
- secret keys;
- full national ID numbers;
- full payment-card data;
- complete legal-document bodies;
- unredacted identity documents.

---

# 100. Audit Security

Material audit events shall be resistant to alteration.

Application users shall not be able to delete audit events.

---

# 101. Audit Event Protection Options

The final implementation may use:

- append-only privileges;
- separate audit store;
- immutable object storage;
- cryptographic hash chaining;
- external security-log replication.

---

# 102. Clock Security

Accurate time is essential for:

- deadlines;
- audit;
- signatures;
- custody;
- incidents.

Production infrastructure shall use reliable time synchronization.

---

# 103. Monitoring Architecture

Security monitoring shall cover:

- authentication;
- authorization failures;
- administrator actions;
- exports;
- document access;
- integration failures;
- malware detections;
- unusual downloads;
- permission changes.

---

# 104. Security Event Examples

Examples:

- repeated failed login;
- MFA reset;
- password recovery;
- privileged role assignment;
- bulk matter export;
- restricted matter access;
- malware upload;
- unusual download volume;
- public-link attempt;
- failed webhook verification;
- secret rotation.

---

# 105. Detection Engineering

Each high-risk threat should define:

- signal;
- threshold or correlation;
- severity;
- owner;
- response procedure;
- false-positive strategy.

---

# 106. Alert Fatigue

Not every technical event should page a human.

Security alerts require prioritization.

False-positive rates should be measured.

---

# 107. Bulk Export Threat Model

Exports create a major exfiltration path.

---

# 108. Export Controls

**SEC-EXP-001 — S0**

Export scope must respect matter authorization.

**SEC-EXP-002 — S1**

Bulk exports require explicit purpose.

**SEC-EXP-003 — S1**

Highly sensitive exports require enhanced approval.

**SEC-EXP-004 — S1**

Generated files should expire.

**SEC-EXP-005 — S1**

Downloads are audited.

**SEC-EXP-006 — S1**

Export files should support encryption where warranted.

---

# 109. Insider Data Exfiltration

Detection candidates:

- unusual number of downloaded matters;
- repeated out-of-practice-area access;
- large exports near departure;
- access outside expected working pattern;
- repeated access to highly restricted matters.

Signals must be reviewed carefully and not treated as automatic employee guilt.

---

# 110. Employee Offboarding Security

Offboarding must be capable of immediate security suspension.

Actions include:

- account disablement;
- session revocation;
- token revocation;
- integration removal;
- device recovery;
- matter reassignment;
- export review.

---

# 111. Personal Devices

D04 must determine the current BYOD model.

If personal devices are allowed, controls may include:

- secure authentication;
- device encryption requirements;
- no unmanaged local synchronization;
- remote session revocation;
- restricted highly sensitive downloads.

---

# 112. Device Security

Lex Gate-managed devices should support:

- full-disk encryption;
- automatic locking;
- supported OS versions;
- patching;
- endpoint protection;
- secure boot where practical;
- device inventory.

---

# 113. Mobile Device Loss

Loss of a device must not automatically expose cached legal documents.

Architecture should minimize permanent local storage.

---

# 114. Supply-Chain Threat Model

Attack surfaces include:

- npm/Python/etc. dependencies;
- CI actions;
- base images;
- developer plugins;
- code generators;
- package registries.

---

# 115. Dependency Management

Requirements:

- lock files;
- dependency updates;
- vulnerability scanning;
- provenance review for critical packages;
- avoidance of unnecessary dependencies.

---

# 116. Software Bill of Materials

Production releases should be capable of generating an SBOM.

The exact format will be selected in D15.

---

# 117. Package Risk

A package shall not be accepted merely because:

- it is popular;
- an automated tool proposed it;
- it simplifies one task.

Security-sensitive dependencies require review.

---

# 118. CI/CD Security

CI/CD shall use:

- least privilege;
- protected branches;
- protected production environment;
- short-lived cloud authentication where supported;
- secret masking;
- isolated build runners appropriate to risk.

---

# 119. Production Deployment Approval

Production deployment should require:

- passing tests;
- security checks;
- reviewed migration;
- appropriate approval;
- rollback plan.

---

# 120. Branch Protection

Protected production branches should prevent:

- unreviewed direct pushes;
- history rewrite;
- bypass of required checks except controlled emergency procedure.

---

# 121. Commit Signing

Signed commits or protected authenticated contribution records may be used for high-assurance repository governance.

The exact requirement will depend on the development model.

---

# 122. Build Artifact Integrity

Production should deploy the tested build artifact.

Do not rebuild materially different code manually on the production server.

---

# 123. Infrastructure-as-Code Security

Infrastructure changes shall be:

- version controlled;
- reviewed;
- scanned;
- applied through controlled identities.

---

# 124. Cloud IAM

Cloud IAM shall use:

- workload identities;
- role separation;
- least privilege;
- no long-lived root credential use;
- MFA for privileged humans.

---

# 125. Root / Owner Accounts

Cloud root or owner accounts shall:

- use strongest available MFA;
- not be used for routine work;
- have recovery controls;
- be monitored.

---

# 126. Cloud Account Separation

Depending on the selected provider and scale, separate environments/accounts/projects should be used to reduce blast radius.

At minimum production shall be meaningfully isolated from development.

---

# 127. Production Data Boundary

Development personnel do not automatically receive production data access.

---

# 128. Backup Threat Model

Threats include:

- ransomware deleting backups;
- stolen backup data;
- corrupted backups;
- unnoticed failed backup;
- encryption-key loss.

---

# 129. Backup Controls

**SEC-BKP-001 — S0**

Critical data shall have automated backups.

**SEC-BKP-002 — S0**

Backups shall be encrypted.

**SEC-BKP-003 — S0**

Backup restoration shall be tested.

**SEC-BKP-004 — S1**

Backups should be protected from compromise of ordinary application credentials.

**SEC-BKP-005 — S1**

Backup failures shall alert operations.

---

# 130. Ransomware Resilience

At least one recovery path should be protected from ordinary production deletion privileges.

Options may include:

- immutable backup retention;
- isolated backup account;
- protected snapshots.

---

# 131. Disaster Recovery Security

Recovery must not weaken security.

Emergency restoration shall still preserve:

- access control;
- encryption;
- secrets;
- audit;
- matter restrictions.

---

# 132. Availability Threats

Consider:

- DDoS;
- cloud outage;
- database failure;
- queue failure;
- payment-provider outage;
- ETA outage;
- DNS compromise;
- certificate expiration.

---

# 133. Graceful Degradation

Core matter data should remain available when non-critical services fail.

Examples:

- AI unavailable → manual workflow;
- SMS unavailable → portal continues;
- search unavailable → direct matter navigation remains;
- ETA unavailable → invoice remains pending external confirmation.

---

# 134. Denial-of-Service Controls

Use:

- edge rate limiting;
- connection controls;
- resource quotas;
- upload limits;
- background processing;
- queue backpressure;
- provider circuit breakers.

---

# 135. AI Threat Model

AI introduces additional threats:

- confidential-data leakage;
- prompt injection;
- malicious documents influencing model behavior;
- provider retention;
- cross-matter information leakage;
- incorrect legal output;
- fabricated citations;
- excessive data transfer;
- indirect prompt injection through web content;
- unsafe tool execution.

---

# 136. AI Gateway Requirement

All AI calls shall pass through the approved Lex Gate AI gateway.

Direct provider calls from application features are prohibited.

---

# 137. AI Authorization Pipeline

```text id="04sy4x"
AI request
   ↓
authenticate user
   ↓
authorize matter
   ↓
check matter AI policy
   ↓
check data classification
   ↓
check provider / region
   ↓
minimize context
   ↓
invoke model
   ↓
record output
   ↓
require human review where applicable
```

---

# 138. Prompt Injection

Documents supplied to an AI system are untrusted data.

Instructions contained inside client or opposing-party documents must not automatically become system instructions.

---

# 139. AI Tool Security

An AI system shall not receive unrestricted ability to:

- send messages;
- publish documents;
- delete records;
- confirm deadlines;
- issue invoices;
- modify permissions.

High-risk actions require ordinary domain authorization and human approval.

---

# 140. AI Cross-Matter Isolation

An AI assistant operating in Matter A shall not automatically retrieve Matter B.

Retrieval must use the same authorization system as ordinary application search.

---

# 141. AI Data Minimization

Only the necessary documents or excerpts should be transmitted.

“Send the whole matter” shall not be the default.

---

# 142. AI Output Classification

AI-generated output is untrusted until reviewed.

Possible states:

- generated;
- unreviewed;
- reviewed;
- approved;
- rejected.

---

# 143. AI Citation Security

AI-produced legal citations shall be verified against controlled sources before use in substantive client work.

---

# 144. Prompt and Output Logging

AI logging shall balance:

- auditability;
- confidentiality;
- data minimization.

Complete prompts containing confidential documents should not automatically enter general observability systems.

---

# 145. Integration Vendor Security Review

Before enabling a vendor, assess:

- security certifications;
- breach history where available;
- data residency;
- encryption;
- IAM;
- support access;
- subprocessors;
- incident notification;
- deletion;
- business continuity.

---

# 146. Vendor Credential Scope

Vendor tokens should be scoped narrowly.

A notification provider should not have credentials granting database access.

---

# 147. Vendor Outage

Every high-impact external dependency requires:

- outage behavior;
- retry policy;
- manual fallback;
- reconciliation procedure.

---

# 148. Domain Protection Against External Systems

External integrations must never directly mutate core records.

Responses should be validated and translated into domain commands/events.

---

# 149. Secure Development Lifecycle

Security activities shall occur throughout development.

Minimum stages:

```text id="zuwvfb"
Design
  → threat model

Development
  → secure coding + tests

Pull request
  → review + automated scanning

Build
  → dependency / artifact checks

Staging
  → integration and security tests

Pre-production
  → penetration testing for major releases

Production
  → monitoring and vulnerability management
```

---

# 150. Security Requirements as Code

Where possible, security controls should be tested automatically.

Examples:

- no public storage;
- MFA required for administrators;
- database not internet accessible;
- encryption enabled;
- branch protection;
- security headers;
- dependency-policy checks.

---

# 151. Static Application Security Testing

SAST should identify:

- injection patterns;
- unsafe API usage;
- secret leakage;
- insecure cryptography;
- dangerous file operations.

SAST findings require human triage.

---

# 152. Dynamic Security Testing

DAST should evaluate deployed application behavior, including:

- authentication;
- authorization;
- headers;
- input handling;
- common web vulnerabilities.

---

# 153. Software Composition Analysis

Dependencies shall be checked for known vulnerabilities.

Critical exploitable vulnerabilities should block release unless formally risk accepted.

---

# 154. Secret Scanning

Repository and CI should scan for:

- API keys;
- cloud credentials;
- private keys;
- passwords.

If a secret is committed, deleting the Git line is not sufficient.

The secret must be rotated.

---

# 155. Infrastructure Scanning

IaC shall be checked for:

- public databases;
- open storage;
- overly broad IAM;
- unencrypted resources;
- unrestricted ingress.

---

# 156. Container Security

Where containers are used:

- use minimal images;
- pin versions;
- scan images;
- avoid running as root where possible;
- remove unnecessary packages;
- use read-only filesystem where practical.

---

# 157. Penetration Testing

External penetration testing is required before full production release of sensitive client functionality.

Scope should include:

- authentication;
- recovery;
- portal authorization;
- internal authorization;
- file upload;
- file download;
- exports;
- administrator functions;
- APIs.

---

# 158. Authorization Testing Priority

Authorization testing shall receive higher priority than generic vulnerability scanning because a broken matter-access rule could expose complete legal files despite otherwise secure infrastructure.

---

# 159. Vulnerability Severity

Vulnerability prioritization shall consider:

- exploitability;
- exposed data;
- affected matter classes;
- privilege required;
- availability of mitigations;
- legal/professional impact.

CVSS alone is insufficient.

---

# 160. Vulnerability Remediation

Internal targets shall be defined for:

- critical;
- high;
- medium;
- low vulnerabilities.

Critical actively exploited vulnerabilities may require emergency patching.

Exact SLAs will be defined in D15.

---

# 161. Security Exceptions

A security requirement may be temporarily excepted only with:

- documented business need;
- risk assessment;
- compensating control;
- owner;
- approval;
- expiry;
- review.

No permanent “temporary” exceptions.

---

# 162. Incident Response

The security response process shall integrate D03 privacy notification requirements and D08 incident procedure.

---

# 163. Incident Severity

Proposed levels:

## SEV-1 Critical

Examples:

- confirmed unauthorized access to multiple matters;
- administrator compromise;
- ransomware;
- destructive production compromise;
- major data exfiltration.

## SEV-2 High

Examples:

- compromised user with sensitive access;
- wrong client receives privileged document;
- public link to restricted material.

## SEV-3 Moderate

Contained incident with limited impact.

## SEV-4 Low

Security event with no identified substantive exposure.

---

# 164. Incident Response Roles

At minimum:

- Incident Commander
- Security Lead
- Legal Reviewer
- Privacy Reviewer
- System Owner
- Communications Owner
- Matter Owner where affected

One person may perform several functions in a small organization, but responsibilities remain defined.

---

# 165. Incident Evidence

Preserve:

- timestamps;
- logs;
- affected accounts;
- affected records;
- IP/device context;
- integration responses;
- access grants;
- relevant system versions;
- corrective actions.

---

# 166. Forensic Preservation

Incident response should avoid destroying evidence through:

- immediate uncontrolled log deletion;
- reimaging before evidence capture;
- deleting compromised accounts rather than disabling them;
- overwriting affected files.

---

# 167. Security Communication

Security messages to clients must be legally reviewed where appropriate.

They should:

- provide confirmed facts;
- avoid unsupported speculation;
- provide protective actions;
- identify support route.

---

# 168. Security Metrics

Candidate security metrics include:

- MFA coverage;
- privileged-account count;
- former-user revocation time;
- failed authentication anomalies;
- security patch age;
- critical vulnerability count;
- unresolved access reviews;
- bulk exports;
- malicious upload detections;
- restore-test success;
- incident detection time;
- incident containment time.

---

# 169. Security Anti-Metrics

Do not use:

- number of employee alerts;
- number of blocked requests;
- number of security tickets;

as standalone measures of security success.

High volumes may simply reflect poor tuning.

---

# 170. Threat Register

The following initial threats shall be tracked formally.

---

## THR-001 — Client-to-Client Data Leakage

**Asset:** Client and matter data  
**Threat:** Horizontal authorization bypass  
**Impact:** Critical  
**Likelihood:** Material  
**Priority:** S0

### Controls

- client projection;
- server-side authorization;
- object-level checks;
- automated cross-client tests;
- penetration testing.

---

## THR-002 — Employee Accesses Unassigned Matter

**Asset:** Matter confidentiality  
**Threat:** Insider misuse or authorization error  
**Impact:** Critical  
**Priority:** S0

### Controls

- matter-based access;
- deny by default;
- restricted search;
- audit;
- access review.

---

## THR-003 — Technical Administrator Reads Client Files

**Asset:** Professional confidentiality  
**Threat:** Excessive privileged access  
**Impact:** Critical  
**Priority:** S0

### Controls

- infrastructure/data separation;
- time-limited support access;
- separate identities;
- monitored privileged sessions.

---

## THR-004 — Wrong Document Published to Client

**Asset:** Confidential information  
**Threat:** Human error / access-control failure  
**Impact:** Critical  
**Priority:** S0

### Controls

- explicit publication object;
- exact-version selection;
- preview;
- recipient validation;
- approval;
- audit.

---

## THR-005 — Legal Deadline Tampered With

**Asset:** Client legal rights  
**Threat:** Unauthorized or accidental modification  
**Impact:** Critical  
**Priority:** S0

### Controls

- lawyer-only confirmation;
- version history;
- source evidence;
- change alerts;
- audit.

---

## THR-006 — Account Takeover

**Asset:** All user-accessible records  
**Threat:** Credential theft  
**Impact:** High/Critical  
**Priority:** S0

### Controls

- MFA;
- secure recovery;
- session monitoring;
- revocation;
- anomaly detection.

---

## THR-007 — Malicious Uploaded Document

**Asset:** Application and endpoints  
**Threat:** Malware/exploit  
**Impact:** High  
**Priority:** S1

### Controls

- quarantine;
- type validation;
- malware scan;
- isolated processing.

---

## THR-008 — Conflict Database Disclosure

**Asset:** Client existence and relationships  
**Threat:** Unauthorized access/search leakage  
**Impact:** Critical  
**Priority:** S0

### Controls

- narrow role access;
- restricted results;
- search audit;
- no general staff access.

---

## THR-009 — Bulk Data Exfiltration

**Asset:** Firm-wide matter data  
**Threat:** Insider or compromised account  
**Impact:** Critical  
**Priority:** S0

### Controls

- export authorization;
- approval;
- monitoring;
- temporary files;
- anomaly detection.

---

## THR-010 — Backup Destruction by Ransomware

**Asset:** Business continuity  
**Threat:** Compromised production administration  
**Impact:** Critical  
**Priority:** S0

### Controls

- isolated/immutable recovery copies;
- encryption;
- restore tests;
- privilege separation.

---

## THR-011 — Payment Webhook Forgery

**Asset:** Financial integrity  
**Threat:** Fake payment notification  
**Impact:** High  
**Priority:** S1

### Controls

- signature validation;
- replay prevention;
- provider reconciliation;
- idempotency.

---

## THR-012 — AI Leakage of Matter Data

**Asset:** Confidential legal data  
**Threat:** Unsafe AI processing  
**Impact:** Critical  
**Priority:** S0 before AI launch

### Controls

- AI gateway;
- data policy;
- approved providers;
- matter authorization;
- no provider training;
- audit.

---

## THR-013 — AI Prompt Injection

**Asset:** Legal workflow integrity  
**Threat:** Malicious document controls model behavior  
**Impact:** High  
**Priority:** S1 before AI launch

### Controls

- treat documents as data;
- tool restrictions;
- explicit system policy;
- human approval.

---

## THR-014 — Supply-Chain Compromise

**Asset:** Application and infrastructure  
**Threat:** Malicious dependency/build artifact  
**Impact:** Critical  
**Priority:** S1

### Controls

- dependency locking;
- SCA;
- SBOM;
- protected CI;
- reviewed dependencies.

---

## THR-015 — Former Employee Retains Access

**Asset:** Client confidentiality  
**Threat:** Offboarding failure  
**Impact:** Critical  
**Priority:** S0

### Controls

- immediate account suspension;
- session revocation;
- device recovery;
- access review.

---

## THR-016 — Public Storage Misconfiguration

**Asset:** Documents and backups  
**Threat:** Accidental public access  
**Impact:** Critical  
**Priority:** S0

### Controls

- account-wide public block;
- IaC;
- policy scanning;
- continuous configuration monitoring.

---

## THR-017 — Recovery Procedure Hijack

**Asset:** User identity  
**Threat:** Social engineering  
**Impact:** High/Critical  
**Priority:** S0

### Controls

- strong recovery;
- independent notification;
- restricted help-desk powers;
- audit.

---

## THR-018 — Secret Committed to Source Control

**Asset:** Infrastructure/integration security  
**Threat:** Credential exposure  
**Impact:** High/Critical  
**Priority:** S1

### Controls

- secret scanning;
- secret manager;
- immediate rotation procedure.

---

## THR-019 — Court or Government Status Spoofing

**Asset:** Legal decision integrity  
**Threat:** Unverified external information  
**Impact:** High  
**Priority:** S1

### Controls

- source recording;
- external verification;
- lawyer confirmation;
- no blind scraping.

---

## THR-020 — Search Reveals Restricted Matter Existence

**Asset:** Highly restricted matters  
**Threat:** Metadata leakage  
**Impact:** Critical  
**Priority:** S0

### Controls

- restriction-aware indexing;
- query authorization;
- no global autocomplete leakage;
- negative tests.

---

# 171. Risk Rating Method

Each threat shall be assessed using:

- likelihood;
- confidentiality impact;
- integrity impact;
- availability impact;
- legal/professional impact;
- detectability;
- blast radius.

Suggested qualitative rating:

- Critical
- High
- Medium
- Low

---

# 172. Risk Acceptance

Critical and high security risks may not be silently accepted by engineering.

Risk acceptance requires:

- threat ID;
- current exposure;
- compensating controls;
- reason;
- legal/privacy review where applicable;
- named business owner;
- expiration or review date.

---

# 173. Security Design Review

Every high-risk capability requires security review before implementation.

Examples:

- new authentication method;
- new client sharing method;
- AI provider;
- document-processing service;
- payment provider;
- external collaborator access;
- new bulk export.

---

# 174. Security Release Gates

## Gate S1 — Architecture

Required:

- threat model;
- trust boundaries;
- authorization model;
- encryption architecture;
- secret management;
- backup architecture.

---

## Gate S2 — Implementation

Required:

- secure coding controls;
- authorization tests;
- dependency scanning;
- secret scanning;
- infrastructure review.

---

## Gate S3 — Pre-Production

Required:

- penetration test;
- remediation of critical issues;
- backup restoration;
- incident simulation;
- access review;
- security monitoring.

---

## Gate S4 — Production

Required:

- MFA;
- logging;
- alerting;
- rollback;
- production access approval;
- incident contacts;
- vulnerability process.

---

# 175. Security Test Catalogue

Minimum security tests include:

## Authentication

- invalid credentials;
- credential stuffing protections;
- MFA bypass;
- recovery abuse;
- session fixation;
- session revocation.

## Authorization

- cross-client access;
- cross-matter access;
- related-matter access;
- expired access;
- administrator substantive access;
- restricted-matter enumeration.

## Input

- injection;
- XSS;
- SSRF;
- malformed payloads;
- file-type spoofing.

## Documents

- malware;
- archive bomb;
- unauthorized download;
- stale signed URL;
- wrong version publication.

## Finance

- duplicate webhook;
- forged webhook;
- replay;
- invoice manipulation.

## AI

- cross-matter retrieval;
- prompt injection;
- unauthorized provider;
- prohibited data class.

## Infrastructure

- public storage;
- public database;
- excessive IAM;
- backup restore;
- secret exposure.

---

# 176. Abuse-Case Testing

Security tests must include realistic legal-practice abuse cases.

Examples:

> A lawyer searches for a celebrity client they are not assigned to.

> A finance user guesses a document ID from another matter.

> A former employee reuses an active browser session.

> A client changes a matter identifier in the URL.

> An administrator generates a direct object-storage link.

> An uploaded PDF contains malicious instructions targeting an AI system.

These scenarios should become automated tests where possible.

---

# 177. Security Operations Ownership

Lex Gate must appoint ownership for:

- account security;
- vulnerabilities;
- incidents;
- backups;
- access reviews;
- cloud IAM;
- vendor security;
- privileged access;
- security awareness.

For a small firm, one individual may coordinate several responsibilities, but roles and escalation must remain documented.

---

# 178. Security Awareness

Staff training should address:

- phishing;
- credential sharing;
- client impersonation;
- malicious attachments;
- wrong-recipient errors;
- restricted matters;
- reporting suspicious activity;
- public Wi-Fi;
- device loss;
- AI confidentiality risks.

---

# 179. Phishing Simulation

Phishing simulations may be used for awareness only if:

- appropriately governed;
- not punitive;
- proportionate;
- privacy respecting.

---

# 180. Security and Accessibility

Security controls shall not unnecessarily exclude users with accessibility needs.

Examples:

- MFA must have accessible methods;
- CAPTCHA alternatives must exist;
- recovery must support users unable to use a particular device;
- timeouts must account for accessibility requirements.

Security and accessibility must be resolved together rather than treating one as an exception to the other.

---

# 181. Security and Privacy Boundary

D11 focuses primarily on:

- unauthorized access;
- misuse;
- integrity;
- availability;
- security incidents.

D12 will separately define:

- lawful processing;
- data minimization;
- consent;
- rights;
- transfer;
- retention;
- processors;
- privacy governance.

The two documents must remain aligned.

---

# 182. Security Configuration Registry

Security-sensitive configuration shall include:

- session lifetime;
- MFA requirements;
- file-upload rules;
- export thresholds;
- temporary-access duration;
- logging policy;
- alert thresholds.

Changes require:

- authorization;
- audit;
- testing.

---

# 183. Prohibited Security Practices

The following are prohibited:

1. shared user accounts;
2. shared administrator passwords;
3. public matter-document storage;
4. client-side-only access control;
5. unrestricted production database access;
6. secrets in Git;
7. plaintext passwords;
8. unrestricted administrator matter access;
9. permanent support access;
10. unverified payment webhooks;
11. direct AI provider calls from client code;
12. copying production data into development casually;
13. disabling audit logs to solve performance problems;
14. manually editing confirmed deadlines in the database;
15. silently suppressing failed security alerts;
16. unrestricted external analytics on client surfaces;
17. using predictable identifiers as security controls;
18. trusting internal-network location as authorization;
19. storing full credentials in application logs;
20. restoring backups without validating security state.

---

# 184. Launch-Blocking Security Conditions

Production with real client data is blocked until:

- server-side authorization is complete;
- cross-matter isolation is tested;
- restricted matters are tested;
- employees use MFA;
- administrators use strong MFA;
- account recovery is tested;
- secrets use approved storage;
- production databases are private;
- document storage is private;
- upload quarantine exists;
- malware scanning exists;
- backups exist and restoration succeeds;
- audit events are protected;
- incident-response procedure exists;
- offboarding revokes access;
- critical security findings are remediated;
- penetration testing is completed for exposed sensitive surfaces.

---

# 185. Security Acceptance Criteria for Release 1

Public website and enquiry:

- secure headers;
- content-security controls;
- rate limiting;
- enquiry validation;
- no arbitrary sensitive upload;
- protected content-editor authentication;
- vulnerability scanning;
- logging.

---

# 186. Security Acceptance Criteria for Release 2

Core operations:

- employee MFA;
- matter authorization;
- restricted matters;
- audit;
- private documents;
- secure upload;
- backups;
- privileged-access controls;
- deadline integrity;
- offboarding.

---

# 187. Security Acceptance Criteria for Release 3

Client portal:

- client authentication;
- client projections;
- horizontal authorization testing;
- safe document download;
- safe account recovery;
- notification privacy;
- portal penetration testing.

---

# 188. Security Acceptance Criteria for Release 4

Billing/payments:

- financial role separation;
- immutable invoice control;
- webhook authentication;
- idempotency;
- payment reconciliation;
- ETA credential isolation.

---

# 189. Security Acceptance Criteria for Release 6

AI:

- AI gateway;
- provider review;
- matter policy;
- cross-matter isolation;
- prompt-injection testing;
- tool restrictions;
- output review;
- no-training contract/control;
- approved data-transfer route.

---

# 190. D11 Open Decisions

The following remain unresolved:

1. final cloud provider;
2. identity provider;
3. privileged MFA mechanism;
4. client MFA policy;
5. client recovery process;
6. endpoint-management platform;
7. antivirus/EDR platform;
8. WAF provider;
9. SIEM/logging platform;
10. audit immutability mechanism;
11. malware-scanning technology;
12. document sandbox technology;
13. secret manager;
14. key-management provider;
15. backup isolation model;
16. administrator access method;
17. support-access recording method;
18. security-monitoring staffing model;
19. penetration-testing provider;
20. vulnerability remediation SLAs;
21. BYOD policy;
22. AI security architecture details;
23. production RPO/RTO.

---

# 191. D11 Completion Criteria

D11 may receive provisional approval when:

- security objectives are accepted;
- critical assets are classified;
- threat actors are approved;
- trust boundaries are confirmed;
- deny-by-default matter authorization is mandatory;
- administrative and substantive access are separated;
- upload quarantine is mandatory;
- audit is protected;
- secrets and keys have dedicated management;
- production data stores are private;
- security gates are accepted;
- initial critical threats have owners.

D11 may receive final approval after:

- architecture technologies are selected;
- complete STRIDE workshops are performed;
- D12 privacy architecture is completed;
- CI/CD security is implemented;
- infrastructure security is tested;
- penetration testing is completed;
- backup restoration is demonstrated;
- incident-response exercise is completed;
- critical/high findings are remediated or formally accepted;
- legal, security, privacy, engineering, and sponsor approval is obtained.

---

# 192. Approval Record

## Security Architect

Name: ______________________________  
Date: ______________________________  
Decision: Approved / Conditional / Rejected  
Comments: ______________________________

## Engineering Lead

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

# Appendix A — Threat Record Template

```text id="x7x7gi"
Threat ID:
Title:
Component:
Trust boundary:
Threat actor:
STRIDE category:
Asset:
Attack scenario:
Prerequisites:
Likelihood:
Confidentiality impact:
Integrity impact:
Availability impact:
Legal/professional impact:
Overall severity:
Existing controls:
Required controls:
Detection:
Response:
Verification test:
Owner:
Status:
Risk acceptance:
Review date:
```

---

# Appendix B — Security Requirement Template

```text id="mza0na"
Requirement ID:
Control:
Priority:
Threat IDs:
Assets:
Architecture component:
Requirement:
Rationale:
Implementation guidance:
Evidence:
Automated verification:
Manual verification:
Applicable standard:
Legal source:
Owner:
Status:
```

---

# Appendix C — STRIDE Review Template

```text id="ta290m"
Component:
Data:
Trust boundary:

Spoofing:
Threats:
Controls:

Tampering:
Threats:
Controls:

Repudiation:
Threats:
Controls:

Information Disclosure:
Threats:
Controls:

Denial of Service:
Threats:
Controls:

Elevation of Privilege:
Threats:
Controls:

Residual risks:
Required tests:
Reviewer:
```

---

# Appendix D — Security Invariant Examples

**INV-SEC-001**

No authenticated client can access another client’s unpublished matter information.

**INV-SEC-002**

No unassigned employee can access a restricted matter merely because they are a lawyer.

**INV-SEC-003**

No technical administrator receives permanent substantive matter access through ordinary infrastructure privileges.

**INV-SEC-004**

No document can become client-visible without explicit publication authorization.

**INV-SEC-005**

No legal deadline becomes confirmed solely through automated calculation.

**INV-SEC-006**

No issued financial record can be silently rewritten.

**INV-SEC-007**

No external AI provider receives matter data before policy and authorization checks succeed.

**INV-SEC-008**

No production secret is stored in the source repository.

**INV-SEC-009**

No public application component directly reads confidential matter storage without application authorization.

**INV-SEC-010**

No critical backup strategy is considered complete until restoration has been demonstrated.

**

No critical backup strategy is considered complete until restoration has been demonstrated.

---

# Appendix E — Security Design Rule

Lex Gate security shall assume that authentication can fail, devices can be compromised, employees can make mistakes, administrators can be abused, vendors can fail, and software vulnerabilities will eventually occur.

The architecture must therefore ensure that:

> a single compromised credential, mistaken click, vulnerable dependency, or failed external service cannot silently become unrestricted access to the firm’s complete confidential legal record.