# Data Model: Records Lifecycle

Three new structures, plus a change to how existing party values are stored. Every table is additive; nothing existing is dropped or altered destructively.

## Entity — Legal hold event

The append-only ledger of every hold placement and release. Mirrors `membership_lifecycle_events`.

| Field               | Type                   | Notes                                                           |
| ------------------- | ---------------------- | --------------------------------------------------------------- |
| `id`                | uuid                   | Event identity.                                                 |
| `holdId`            | uuid                   | The hold this event belongs to. Placement and release share it. |
| `organizationId`    | text                   | Scope.                                                          |
| `resourceType`      | text                   | What kind of record is held — `party` today, `matter` later.    |
| `resourceId`        | text                   | Which record.                                                   |
| `eventType`         | `placed` \| `released` | The act.                                                        |
| `priorRevision`     | integer, nullable      | Null for a placement.                                           |
| `revision`          | integer                | Monotonic per hold.                                             |
| `operatorAccountId` | text                   | Who acted. Required.                                            |
| `reasonCode`        | text                   | Why. Required — an unexplained hold is refused.                 |
| `correlationId`     | text                   | Ties the act to its originating request.                        |
| `occurredAt`        | timestamptz            | When.                                                           |

**Validation rules**

- A placement has no prior revision; a release must cite the current one.
- A release requires an existing active hold. Releasing an unheld record is refused rather than silently recorded.
- Operator and reason are required on both. The table is append-only, enforced by trigger.

## Entity — Effective legal hold

The rebuildable projection answering "is this held right now?" in one read. Derived data, never an audit substitute.

| Field                                          | Type                   | Notes                                   |
| ---------------------------------------------- | ---------------------- | --------------------------------------- |
| `holdId`                                       | uuid                   | Primary key.                            |
| `organizationId`, `resourceType`, `resourceId` | text                   | What is covered.                        |
| `state`                                        | `active` \| `released` | Current state.                          |
| `revision`                                     | integer                | Revision of the event that produced it. |
| `placedAt`, `releasedAt`                       | timestamptz            | `releasedAt` null while active.         |
| `lastEventId`                                  | uuid                   | Provenance back to the ledger.          |

**Validation rules**: fully reconstructible from the ledger; a rebuild must reproduce it exactly. A record is held when at least one active hold covers it — multiple concurrent holds for different reasons are permitted, and releasing one does not release the others.

## Entity — Subject encryption key

One key per subject. Its destruction is what erasure means.

| Field                 | Type              | Notes                                                     |
| --------------------- | ----------------- | --------------------------------------------------------- |
| `subjectId`           | uuid              | The party. Primary key.                                   |
| `organizationId`      | text              | Scope.                                                    |
| `keyMaterial`         | text, nullable    | Null once shredded. Nullability **is** the erasure state. |
| `createdAt`           | timestamptz       | When the subject became readable.                         |
| `shreddedAt`          | timestamptz, null | When it stopped being readable.                           |
| `shreddedByAccountId` | text, nullable    | Who erased.                                               |
| `shredReasonCode`     | text, nullable    | Why.                                                      |

**Validation rules**

- Shredding sets `keyMaterial` to null and populates all three shred fields together; a partially shredded key is invalid.
- A shredded key is never regenerated for the same subject. Erasure is not reversible, which is the point.
- Repeating a shred on an already-shredded key resolves without recording a second erasure.

**Deliberate exception to append-only**: this is the one table where a value is nulled in place, because destroying the key _is_ the erasure. It carries no append-only trigger for that reason. The erasure event that records what happened lives in the audit trail and is itself immutable, so the act remains evidenced even though the key does not.

## Changed — party name and contact values

`party_name_forms.value` and `party_contact_assertions.value` change from plaintext to an encrypted envelope containing IV, authentication tag, and ciphertext under the subject's key.

**Validation rules**

- `assertSyntheticValue` runs on the plaintext before encryption, so the synthetic-only control is unaffected.
- A read whose key is present returns the original value; a read whose key is shredded returns a redaction marker rather than failing.
- A fresh IV per value, so two parties sharing a name do not produce identical ciphertext — which would otherwise leak the duplicate relationship the system is specifically designed not to assert.

## Relationships

A legal hold covers a resource by type and identifier; for `party` that identifier is the subject whose key erasure would destroy. The destruction evaluator reads the effective hold projection, never the ledger, for the same reason the authorization reader reads effective access.

## State transitions

**Hold**: absent → `active` (placed) → `released`. Release is a successor event; there is no path that edits a placement. A released hold may be followed by a new placement with a new hold identity.

**Subject key**: `readable` → `shredded`. One-way. No transition returns a subject to readable, and none is offered.
