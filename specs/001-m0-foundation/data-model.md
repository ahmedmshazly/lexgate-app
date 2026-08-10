# M0 Foundation Data Model

## Scope boundary

This model contains only M0 infrastructure records. It contains no client, prospect, party, engagement, matter, proceeding, deadline, document, evidence, financial, credential, or legal-rule entity.

## Audit event

| Field                         | Meaning                                        | Rules                                                         |
| ----------------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `id`                          | Immutable audit record identifier              | Synthetic UUID in tests; primary key; never updated.          |
| `actorAccountId`              | Account reference for the explicit command     | Synthetic opaque identifier in M0 tests; required.            |
| `action`                      | Explicit command/audit action name             | Required; no generic status semantics.                        |
| `resourceType` / `resourceId` | Resource reference for the recorded transition | Required opaque values; M0 does not expose them to a browser. |
| `occurredAt`                  | UTC time of the transition                     | Required; immutable.                                          |

An audit event is appended when a material transition record is accepted. It is not a client-visible projection and it is not a substitute for a future legal aggregate’s state history.

## Outbox event

| Field             | Meaning                                | Rules                                                                                       |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `id`              | Immutable event/idempotency identifier | Required UUID primary key; duplicate insertion fails deterministically.                     |
| `type`            | Domain event type                      | Required; provider-neutral.                                                                 |
| `aggregateId`     | Opaque aggregate reference             | Required; no future entity is implied by M0.                                                |
| `payload`         | Serialized event payload               | Required JSON; synthetic test values only.                                                  |
| `occurredAt`      | UTC event occurrence                   | Required; immutable.                                                                        |
| `attempts`        | Delivery-attempt count                 | Starts at zero; may increase only as worker bookkeeping in a future approved delivery flow. |
| `lastAttemptedAt` | Last delivery attempt time             | Nullable until attempted.                                                                   |
| `lastError`       | Sanitized delivery failure summary     | Nullable; secrets and personal/legal content are prohibited.                                |
| `publishedAt`     | Successful delivery time               | Nullable until delivery.                                                                    |

## Relationship and atomicity

One explicit M0 material-transition recording operation creates one audit event and one outbox event in the same database transaction. The operation either commits both records or leaves neither record. Retry bookkeeping may change only the outbox delivery metadata; it must never mutate the audit event or event payload.
