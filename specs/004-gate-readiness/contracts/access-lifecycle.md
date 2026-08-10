# Contract: Internal Access Lifecycle Commands

## Purpose

This provider-neutral internal contract changes a synthetic organization membership or exact restricted-resource relationship through explicit, server-side commands. It is not an HTTP endpoint, browser API, provider callback, login, or generic status update mechanism.

## Shared command envelope

| Field                          | Required behaviour                                                                                                                                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command ID and correlation ID  | Opaque, non-empty, unique command context. Exact replay returns the original result; changed reuse is rejected.                                                                                                                                       |
| trusted operator               | Obtained server-side from a verified-principal boundary; browser assertions are ignored.                                                                                                                                                              |
| organization and subject       | Required; cross-organization changes deny without target enumeration.                                                                                                                                                                                 |
| expected revision              | Required for an existing relationship; stale revision conflicts without applying state.                                                                                                                                                               |
| effective/expiry time          | Valid UTC time; an expired relationship cannot authorize.                                                                                                                                                                                             |
| reason and approval references | Opaque, required according to command policy, and safe for audit/logging. A new/expanded access reference resolves to one immutable approval record with matching organization, requester, distinct approver, subject, exact scope, time, and expiry. |

## Commands

| Command                         | Preconditions                                                                                                             | Outcome                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `GrantMembership`               | Separate requester/approver authority; no self-expansion; exact organization.                                             | Appends active membership event and updates effective projection.                                   |
| `GrantRestrictedResourceAccess` | Active effective membership; exact resource/operation; separate requester/approver authority; no wildcard/self-expansion. | Appends active exact-grant event and updates effective projection.                                  |
| `SuspendAccess`                 | Authorized operator and matching revision.                                                                                | Appends suspension event; protected access denies immediately.                                      |
| `ReinstateAccess`               | Authorized operator, valid predecessor, matching revision, and required approval.                                         | Appends active successor event; no prior history changes.                                           |
| `RevokeAccess`                  | Authorized operator and matching revision.                                                                                | Appends revocation event; protected access denies immediately.                                      |
| `CorrectAccessRelationship`     | Authorized requester/approver and valid predecessor.                                                                      | Appends a corrected successor; it never updates a prior event.                                      |
| `OffboardAccount`               | Authorized operator, exact organization/account, matching membership revision.                                            | Atomically removes effective organization membership and all effective grants in that organization. |

## Caller-visible outcome

| Outcome            | Behaviour                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Applied            | Returns opaque aggregate/event/revision references and the resulting effective state.              |
| Replayed           | Returns the exact prior outcome for the same command fingerprint.                                  |
| Denied             | Returns generic `not_authorized` without relationship or resource-existence detail.                |
| Conflict           | Returns a generic stale-state or incompatible-command result without applying a partial change.    |
| Validation failure | Returns a typed invalid-command result; no audit/event/projection/outbox partial state is created. |

## Required policy checks

1. The operator has separately authorized lifecycle-administration authority in the organization; system role, employment, UI visibility, and self-assertion never suffice.
2. The target scope is exact and organization-bound. A grant additionally requires an effective membership.
3. An access subject cannot approve their own new or expanded membership/grant.
4. Every command has a valid predecessor/revision and produces exactly one immutable receipt/event chain.
5. Emergency break-glass remains an authorization denial; it is not a lifecycle command.
6. Authorizing a later protected action always re-evaluates the current effective relationship server-side.

## Compatibility and prohibited behaviour

- Existing M1 rows remain immutable legacy evidence and are not directly changed by these commands.
- No command creates a client, engagement, matter, proceeding, conflict clearance, representation authority, or legal conclusion.
- No command accepts real credentials, creates a browser session, invokes a provider, or exposes a public route.
- Raw personal data, resource content, and approval narrative must not enter logs, audit payloads, or outbox messages.
