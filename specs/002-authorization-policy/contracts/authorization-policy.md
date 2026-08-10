# Contract: Restricted-Resource Authorization Policy

## Purpose

This internal application contract evaluates access to one exact restricted-resource reference. It is not an HTTP endpoint and must only be invoked from server-side application code after a trusted identity boundary has supplied the synthetic actor context.

## Command input

| Field                                     | Required behavior                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| decision ID and correlation ID            | Opaque, non-empty, unique decision context.                                                             |
| actor account and organization references | Trusted server-side context; browser assertions are not accepted.                                       |
| requested organization                    | Must match active membership and any grant.                                                             |
| resource type and reference               | Exact, non-empty target; no wildcard is permitted.                                                      |
| operation                                 | Exact, non-empty requested action.                                                                      |
| emergency-access assertion                | Always results in generic denial unless a later approved feature supplies a separate break-glass grant. |

## Command outcome

| Outcome            | Caller-visible behavior                                                                | Required evidence                                                 |
| ------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Allowed            | The server-side caller may proceed with the separately modeled operation.              | Append-only minimal decision evidence.                            |
| Denied             | The caller receives a generic `not_authorized` result without target-existence detail. | Append-only minimal decision evidence where persistence succeeds. |
| Evaluation failure | The caller fails closed; no operation may proceed.                                     | No partial grant or mutable decision record.                      |

## Required policy checks

1. Input is complete and internally consistent.
2. Actor has active membership in the requested organization.
3. An active explicit grant matches account, organization, exact resource type/id, and operation.
4. System role, employment, UI visibility, and browser assertions are ignored as authority.
5. Emergency access is denied because break-glass is not in scope.

## Compatibility and prohibited behavior

- No public route, browser API, provider callback, credential, client projection, or real identity session is part of this contract.
- No response may reveal whether an unknown or cross-organization resource exists.
- A successful decision is not a grant and cannot be used to silently create or change a relationship.
- A decision-evidence update or deletion must fail; later corrections use a new record.
