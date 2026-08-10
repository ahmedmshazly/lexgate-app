# Data Model: Gate Readiness Programme

All executable G1 records use opaque synthetic identifiers only. Review-packet records store templates, reviewer references, synthetic scenarios, and safely redacted evidence references; they do not store client data, legal advice, credentials, or production exports.

## Membership lifecycle event

| Field                                      | Meaning                                                         | Rules                                                                                                     |
| ------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| event ID                                   | Immutable event identity                                        | Unique; append-only.                                                                                      |
| membership relationship ID                 | Stable relationship aggregate                                   | One aggregate per account and organization lifecycle.                                                     |
| organization and account references        | Tenant and subject scope                                        | Both required; organization must match trusted command context.                                           |
| event type                                 | Grant, suspend, reinstate, revoke, correct, expire, or offboard | Explicit command outcome; no generic status patch.                                                        |
| prior revision / next revision             | Concurrency history                                             | Expected current revision must match; next revision is monotonic.                                         |
| effective and expiry times                 | Applicability window                                            | Valid UTC instants; expiry denies when reached.                                                           |
| operator / requester / approver references | Accountability evidence                                         | New or expanded access has distinct requester/approver; subject cannot approve their own expansion.       |
| reason / approval references               | Minimal decision provenance                                     | Opaque, non-empty, privacy-safe, and tied to one immutable, matching-scope approval record when required. |
| correlation and command references         | Reproducibility                                                 | Required; command receipt controls replay.                                                                |
| occurred time                              | Event chronology                                                | Immutable UTC instant.                                                                                    |

## Restricted-resource access lifecycle event

| Field                                        | Meaning                                                               | Rules                                                  |
| -------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| event ID and relationship ID                 | Immutable fact and aggregate identity                                 | Unique; append-only.                                   |
| organization and account references          | Tenant and subject scope                                              | Required and exact.                                    |
| resource type, resource ID, operation        | Restricted scope                                                      | All exact and non-empty; wildcard scope is prohibited. |
| event type, revision, effective/expiry times | Lifecycle state                                                       | Same transition rules as membership events.            |
| accountability / provenance                  | Requester, approver, operator, reason, approval, command, correlation | Required according to event type; opaque values only.  |
| occurred time                                | Event chronology                                                      | Immutable UTC instant.                                 |

## Effective membership and grant projections

| Field                      | Meaning                                            | Rules                                                     |
| -------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| relationship ID and scope  | Current aggregate identity                         | Unique at the exact membership or grant scope.            |
| effective state            | Active, suspended, revoked, expired, or offboarded | Only active, unexpired state may authorize.               |
| revision and last event ID | Rebuild/checkpoint evidence                        | Must correspond to the most recent valid lifecycle event. |
| effective/expiry times     | Current applicability                              | Reader denies outside window.                             |
| rebuilt time               | Projection observability                           | Never replaces the event ledger as audit evidence.        |

The projections are reconstructible from the append-only ledger. A projection may change as a derived state; lifecycle facts and command receipts may not.

## Access lifecycle command receipt

| Field                                  | Meaning                       | Rules                                            |
| -------------------------------------- | ----------------------------- | ------------------------------------------------ |
| command ID                             | Idempotency identity          | Unique and immutable.                            |
| command fingerprint                    | Canonical request identity    | Must match exact replay; a mismatch is rejected. |
| aggregate / resulting event references | Result linkage                | Required after successful command.               |
| outcome and recorded time              | Deterministic replay evidence | Immutable; failure cannot leave a partial state. |

## Access approval record

| Field                                       | Meaning                                          | Rules                                                                                                    |
| ------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| approval ID                                 | Immutable approval identity                      | Unique and organization-scoped.                                                                          |
| requester, approver, and subject references | Separation-of-duty evidence                      | Approver must differ from requester and subject for a new or expanded access scope.                      |
| exact scope                                 | Membership or restricted-resource scope approved | Must match the resulting lifecycle command exactly; it cannot authorize a wildcard or different command. |
| approved and expiry times                   | Approval validity                                | Must be valid when the command runs; expired approval denies.                                            |
| decision provenance                         | Minimal reason/correlation record                | Opaque and privacy-safe; append-only.                                                                    |

## Privacy processing review record

| Field group           | Required content                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Accountability        | Legal entity, controller/processor role, owner, DPO/legal reviewer, review outcome.                    |
| Purpose and data      | Purpose, proposed lawful basis, data-subject/categories, sensitivity, source/channel, access boundary. |
| Sharing and lifecycle | Recipients/processors, hosting/transfer position, retention trigger/period, legal-hold treatment.      |
| Rights and incident   | Rights route, breach route, security controls, outstanding decisions, evidence references.             |

This is a review artifact, not a production database table or a lawful-basis decision.

## Pilot Operating Profile and discovery finding

| Entity                  | Required content                                                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pilot Operating Profile | Objective, scope/exclusions, bilingual terminology, provisional taxonomy, roles/handoffs, channels/accessibility, volumes, systems/sources, authoritative-system map, greenfield decision, risks, sign-offs. |
| Discovery finding       | Participant role, source reference, confidence, date, classification, requirement IDs, safely redacted evidence reference.                                                                                   |
| Migration Decision Pack | Source authority/ownership, mapping/exclusions, quality measures, privacy/hold/security/conflict review, dry run, reconciliation, rollback, approvals.                                                       |

## Lawyer scenario and reviewer outcome

| Field                         | Meaning                                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| scenario ID/version           | Stable synthetic review case.                                                                                                                |
| fictional facts/unknowns      | Never client facts; uncertainty is explicit.                                                                                                 |
| name/party/candidate evidence | Arabic, English, Latin variants and provenance, all fictional.                                                                               |
| request and boundaries        | Requested reviewer question, safe system behaviour, prohibited automatic behaviour, escalation.                                              |
| reviewer outcome              | Approved, conditional, rejected, or deferred; conditional outcome includes scope, compensating behaviour, owner, expiry, and release impact. |

## Relationships and invariants

- A membership lifecycle aggregate belongs to one organization/account pair. A grant lifecycle aggregate belongs to one organization/account/exact-resource/operation scope.
- A lifecycle event succeeds only from a valid predecessor state and matching revision. It never mutates a predecessor.
- An effective projection is authorized only when it is active, within its effective window, and tied to the matching organization/scope.
- An access decision references the effective revisions used. A decision cannot create a relationship.
- Offboarding atomically appends the membership-removal outcome and removal outcomes for every effective grant in the organization; it never creates a matter, engagement, or break-glass privilege.
- A processing review, POP, migration pack, or lawyer outcome never itself changes authorization, party, engagement, conflict, matter, or legal state.

## Legacy M1 relationship migration

- `organization_memberships` and `restricted_resource_access_grants` remain immutable legacy evidence. After lifecycle activation, no command or fixture writes them as a current relationship.
- The additive migration creates a marked synthetic grant event and effective projection for each existing active legacy row. A legacy inactive row becomes non-authorizing because its prior lifecycle intent cannot be reconstructed safely.
- Effective projections own all future authorization reads. Legacy rows are retained only for historical evidence and migration reconciliation; they cannot restore access after a later lifecycle revocation.
- Authorization-decision evidence records the effective relationship revision used for the decision. The revision references a lifecycle event, not an inferred static row.
