# Feature Specification: M1 Authorization Policy Foundation

**Requirement IDs:** SEC-AUT-001, SEC-MAT-001  
**Risk tier:** P0  
**Release / validation gate:** M1 / G1 Identity and authorization  
**Data classification:** Internal; synthetic local development data only  
**Legal/privacy validation:** SEC-AUT-001 not required; SEC-MAT-001 required before activation  
**Feature owner:** Security  
**Status:** Approved for reversible, non-activated foundation work

## User outcome and scope

The security and engineering teams need a dependable policy foundation that decides whether a trusted internal actor may perform a requested operation on a restricted resource. It prevents generic employment, administration, or browser visibility from being treated as authority to access a legal matter or other restricted object.

This feature covers synthetic internal actors, organization membership, explicit resource relationships, server-side deny-by-default decisions, and recorded decision evidence. It establishes policy behavior for later protected-object commands without presenting a login screen, a public route, a client projection, or a legal-workflow screen.

The feature must not activate an external identity provider, collect real credentials or personal data, create real accounts, matters, clients, engagements, or proceedings, grant authority from a system role alone, implement a break-glass approval flow, or claim that G1 has passed. Arabic and English user-facing surfaces are unaffected because this is an internal, server-side foundation; any future user-facing authorization state must be localized and RTL-reviewed in its own feature.

**Assumptions**

- A trusted internal caller supplies an already-established synthetic actor context; establishing a real identity session is out of scope until an approved identity-provider decision exists.
- A generic restricted-resource reference may be used only to exercise policy decisions. It must not carry legal matter facts or customer data.
- Break-glass is unavailable until its legal/security design and reviewer approval are recorded; requests that would need it are denied safely.
- The immutable static relationship rows establish only the original M1 synthetic foundation. Their lifecycle limitation is addressed by the separate, still-G1-blocked [Gate Readiness Programme](../004-gate-readiness/spec.md); neither feature represents G1 as passed.

## User scenarios and acceptance criteria

### User story 1 — Enforce a relationship-based access decision (Priority: P1)

A security engineer can rely on a server-side decision to allow a synthetic actor to perform an approved operation only when that actor has an explicit relationship to the exact restricted resource in the correct organization.

**Why this priority:** A positive relationship check is the minimum useful authorization foundation and must never be inferred from browser state or general employment.

**Independent test:** With synthetic actors and resources, an actor with a matching organization and explicit relationship is allowed for the approved operation; the evidence identifies the actor, resource reference, operation, decision, and policy reason without exposing extra data.

**Acceptance scenarios:**

1. **Given** an active synthetic organization membership and an explicit relationship to a restricted resource, **when** the actor requests the relationship-approved operation, **then** the server-side policy returns an allow decision and records minimal decision evidence.
2. **Given** an actor relationship for one restricted resource, **when** the actor requests the same operation on a different resource, **then** the policy returns a deny decision and records the denial reason.
3. **Given** a relationship from a different organization, **when** the actor requests access, **then** the policy denies access without disclosing whether the target resource exists.

### User story 2 — Reject authority inferred from role or browser state (Priority: P1)

A security engineer can prove that an administrator, employee, or browser-displayed control receives no access merely from their role, and that an unknown or malformed request fails closed.

**Why this priority:** This prevents the highest-risk shortcut: confusing technical administration or a visible UI control with substantive access to a restricted legal object.

**Independent test:** Negative tests show that a role-only synthetic administrator, missing relationship, missing organization membership, malformed resource reference, and browser-provided “allowed” assertion are all rejected server-side.

**Acceptance scenarios:**

1. **Given** a synthetic actor with an administrative or employment role but no explicit resource relationship, **when** the actor requests any restricted-resource operation, **then** the server-side policy denies it.
2. **Given** a request that contains a client-side permission assertion, **when** its server-side policy inputs do not independently establish access, **then** the policy denies it and never trusts the assertion.
3. **Given** a request needing emergency access, **when** no separately approved break-glass grant is present, **then** the policy denies the request and reports that emergency access is unavailable.

### User story 3 — Preserve reviewable authorization evidence (Priority: P1)

A security reviewer can inspect deterministic synthetic decision evidence to verify that an authorization denial or allow decision is attributable to the requested operation and resource context without silently changing access history.

**Why this priority:** P0 authorization controls need reproducible evidence for G1 and must remain reviewable without relying on a browser UI.

**Independent test:** A sequence of synthetic allow and deny decisions produces independently reviewable evidence, and a failed persistence attempt leaves no partial authorization grant or contradictory decision record.

**Acceptance scenarios:**

1. **Given** a completed decision, **when** its evidence is retrieved for internal review, **then** it identifies the decision context and outcome while excluding unrelated resource data.
2. **Given** a request to overwrite an existing authorization decision or relationship history, **when** it is submitted, **then** the system rejects the overwrite and requires a separately modeled change or revocation path.

## Requirements

### FR-001 — Server-side, object-specific authorization (SEC-AUT-001)

Every restricted-resource operation shall obtain a server-side, deny-by-default decision using an actor, organization, operation, and exact resource reference. A missing, malformed, or unverifiable input shall deny the request. The browser may display a result but never determines it. Positive and negative decisions require reproducible evidence. No Arabic/English/RTL surface is introduced.

### FR-002 — Explicit relationship is required for matter-equivalent access (SEC-MAT-001)

An employment, administration, or system role alone shall never authorize restricted-resource access. The policy shall require an explicit relationship in the correct organization; it shall deny a missing or mismatched relationship without leaking the resource’s existence. A real matter-access or break-glass workflow remains out of scope until legal validation is completed. Synthetic authorization data is internal only, has no client projection, and is retained only in local development evidence.

### FR-003 — Immutable, minimal authorization evidence

Each completed policy decision shall retain minimal, reviewable evidence of actor reference, organization reference, resource reference, requested operation, outcome, reason, and time. Existing authorization evidence must not be silently overwritten. Failed decisions must not create an access relationship or elevate privilege.

### FR-004 — No unauthorized activation or identity-provider assumption

The feature shall remain provider-neutral and local-only. It shall not expose a public login route, accept production credentials, invoke an external identity service, introduce customer data, or represent the feature as G1-approved. Any emergency-access flow must deny by default until its separate approval is present.

## Non-functional and quality profile

| Test / evidence layer                                                    | Status and rationale          | Acceptance evidence                                                                                                                                                                                               |
| ------------------------------------------------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static, documentation, type, and lint                                    | Required                      | Canonical documentation validation plus workspace format, lint, and type checks.                                                                                                                                  |
| Unit/domain invariant and negative behavior                              | Required                      | Deterministic policy tests cover matching relationship allow and every listed deny condition.                                                                                                                     |
| Database, migration, integration, contract, or provider                  | Required                      | Synthetic persistence integration proves decision evidence and relationship changes are atomic; provider activation is prohibited.                                                                                |
| Authorization, privacy, records, and security-negative                   | Required                      | Server-side authorization-negative, cross-organization, role-only, browser-assertion, overwrite, and no-break-glass tests.                                                                                        |
| Browser/E2E, accessibility, locale, and RTL                              | Not applicable with rationale | This feature creates no user-facing route or browser authorization flow; any later UI must supply its own browser and accessibility coverage.                                                                     |
| Performance, resilience, backup/restore, incident, or release validation | Required / partially blocked  | Deterministic failure/rollback and G1 evidence are required. Production identity, MFA/provider review, topology, backup/restore, and incident claims remain blocked until approved decisions and reviewers exist. |

Measurable outcomes: all malformed, role-only, cross-organization, missing-relationship, browser-asserted, and unapproved emergency requests are denied in deterministic tests; every successful synthetic decision requires an exact explicit relationship; and no feature test depends on real credentials or personal data. All required technical checks must pass before the feature is considered implementation-complete. G1 activation remains unavailable until Security and Engineering lead approval and MFA/provider review evidence are recorded.

## Risks, decisions, and safe interim behavior

| Risk or decision                                           | Owner                                      | Gate / validation                                    | Safe interim behavior                                                                      |
| ---------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| External identity/MFA vendor selection (ODR-005)           | Architecture + security leads              | Before production environment and G1 provider review | No external identity provider, credentials, or login activation.                           |
| Matter access and emergency-access semantics (SEC-MAT-001) | Security + lead practising Egyptian lawyer | Legal validation before activation                   | Use only generic synthetic resource references; no real matter access or break-glass path. |
| Personal-data processing (ODR-003)                         | Privacy reviewer                           | Before production personal-data processing           | Synthetic actor/resource references only; no client or employee data.                      |
| Security review and G1 approval                            | Security + engineering leads               | G1                                                   | Maintain negative authorization evidence; do not claim release activation.                 |

## Verification record contract

`specs/002-authorization-policy/verification.md` must map SEC-AUT-001 and SEC-MAT-001, every acceptance scenario, decision-evidence behavior, test layer, exact command outcome, legal/security review, G1 evidence, residual risk, and any approved exception. Missing required evidence blocks implementation completion; missing legal/security/MFA-provider review blocks activation.
