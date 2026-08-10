# Data Model: M1 Authorization Policy Foundation

All entities contain synthetic opaque identifiers only. They must not store names, emails, credentials, client facts, matter facts, legal advice, or a client-visible projection.

## Synthetic organization membership

| Field                  | Meaning                   | Rules                                                   |
| ---------------------- | ------------------------- | ------------------------------------------------------- |
| membership ID          | Opaque record reference   | Unique; the complete membership row is append-only.     |
| account reference      | Synthetic actor reference | Must be present; no personal profile is implied.        |
| organization reference | Tenant boundary           | Must match the requested authorization organization.    |
| system role            | Technical context only    | Never independently permits restricted-resource access. |
| active state           | Membership availability   | Only active membership may satisfy a policy decision.   |

## Explicit resource access grant

| Field                       | Meaning                          | Rules                                               |
| --------------------------- | -------------------------------- | --------------------------------------------------- |
| grant ID                    | Opaque relationship reference    | Unique; the complete grant row is append-only.      |
| organization reference      | Tenant boundary                  | Must match actor and target resource context.       |
| account reference           | Subject of the relationship      | Must match the requesting actor.                    |
| resource type and reference | Exact protected-object reference | Must match exactly; no wildcard grant is in scope.  |
| allowed operation           | Explicit permitted action        | Must match exactly; role-derived access is invalid. |
| active state                | Grant availability               | Only active grants may satisfy the policy.          |
| granted time                | Evidence of creation             | Append-only; grant administration is out of scope.  |

## Authorization decision evidence

| Field                              | Meaning                            | Rules                                                       |
| ---------------------------------- | ---------------------------------- | ----------------------------------------------------------- |
| decision ID                        | Idempotency and evidence reference | Unique; retrying it must not create contradictory evidence. |
| correlation ID                     | Operational trace reference        | Required, opaque, and non-personal.                         |
| actor and organization references  | Evaluated subject context          | Minimal synthetic references only.                          |
| target resource type and reference | Evaluated object context           | Exact values only; no object data.                          |
| requested operation                | Requested action                   | Required.                                                   |
| outcome and generic reason         | Allow/deny decision                | Denials do not disclose resource existence.                 |
| decided time                       | Decision evidence time             | Required and immutable.                                     |

## Relationships and transitions

- A membership belongs to exactly one synthetic organization and references one synthetic account; updates and deletes are rejected.
- An explicit grant belongs to one organization, one account, one exact resource reference, and one operation; updates and deletes are rejected.
- A decision reads a membership and, for allow, one matching grant; it never creates either.
- Decision evidence is created once. Update and delete are rejected. A correction is a new decision evidence record.
- There is no break-glass state transition in this feature. The only safe response to such a request is denial.
