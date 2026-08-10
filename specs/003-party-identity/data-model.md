# Data Model: M2 Party Identity Foundation

All records are internal, synthetic-only M2 foundation data. UUIDs are opaque identifiers. Timestamps are UTC. No table or field represents a client relationship, engagement, matter, proceeding, conflict disposition, legal authority, national identifier, or identity-document verification.

## Entity overview

| Entity                      | Purpose                                                                | Historical rule                                     |
| --------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| Party                       | Neutral person or organization record within one internal organization | Immutable after creation                            |
| Party name form             | A name/alias assertion with bilingual provenance                       | Append-only; corrected by successor reference       |
| Primary-name assignment     | Selects a current primary name without rewriting the name form         | Append-only replacement chain                       |
| Party contact assertion     | Purpose-limited contact information                                    | Append-only; no proof semantics                     |
| Representation claim        | Non-authoritative assertion between two parties                        | Append-only; corrected/withdrawn by successor claim |
| Possible-duplicate flag     | Human-review cue between two distinct parties                          | Append-only; no merge effect                        |
| Party audit/command receipt | Organization-scoped record of a successful command                     | Append-only; enables safe replay detection          |

## Party

| Field                     | Type / validation                                                   | Notes                                                                       |
| ------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `id`                      | UUID, primary key                                                   | Opaque party ID.                                                            |
| `organization_id`         | Non-empty opaque text, part of a unique `(organization_id, id)` key | Internal authorization and tenancy scope; not the represented organization. |
| `kind`                    | `person` or `organization`                                          | Immutable neutral classification only.                                      |
| `created_at`              | UTC timestamp                                                       | Server-generated.                                                           |
| `created_by_account_id`   | Non-empty opaque text                                               | Audit context; not a professional-authority claim.                          |
| privacy-handling metadata | Required typed fields below                                         | Synthetic-development posture only; not production processing approval.     |

`Party` has one initial primary-name assignment. It may have zero or more later name forms, contacts, claims, and duplicate flags. A party never has a client, matter, or authorization relationship through this model. Every M2 child table independently carries `organization_id` and references the party through `(organization_id, party_id)`; this makes a cross-organization assertion impossible at the database boundary.

## Required privacy-handling metadata

Each party and assertion record includes these typed, non-null values. For M2, their accepted values describe only the synthetic-local foundation; a later privacy-approved workflow may extend the vocabulary through a reviewed migration.

| Field                    | M2 value / validation                                                                                | Meaning                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `processing_purpose`     | Non-empty purpose; M2 synthetic examples use `party_identity_foundation`                             | Why the assertion is held; not a consent or engagement state. |
| `data_classification`    | `internal`                                                                                           | Current classification for synthetic foundation data.         |
| `subject_category`       | `synthetic_individual`, `synthetic_organization`, `synthetic_representative`, or `synthetic_unknown` | Data-subject context; not legal identity proof.               |
| `source`                 | Trimmed non-empty text                                                                               | Provenance; synthetic in M2.                                  |
| `retention_candidate`    | `synthetic_development_only`                                                                         | Not a production retention schedule.                          |
| `access_boundary`        | `internal_authorized_only`                                                                           | Required internal boundary; does not itself grant access.     |
| `validation_requirement` | `privacy_and_g2_required`                                                                            | Explicitly preserves the ODR-003/G2 block.                    |

## Party name form and primary assignment

| Field                                    | Type / validation                                                                                | Notes                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `party_name_forms.id`                    | UUID, primary key                                                                                | Opaque assertion ID.                                                                 |
| `organization_id`, `party_id`            | Composite FK to `parties`, indexed                                                               | Prevents cross-organization name assertions.                                         |
| `value`                                  | Trimmed non-empty text                                                                           | Stored only in the private canonical table; never copied to logs/outbox.             |
| `form_type`                              | `legal`, `common`, `alternate`, `former`, `trading`, `abbreviated`, `transliterated`, or `other` | A controlled, extendable foundation vocabulary.                                      |
| `language_tag`                           | Trimmed non-empty text                                                                           | Supports Arabic/English and future locale forms without asserting legal equivalence. |
| `script`                                 | Nullable non-empty text                                                                          | Captures known script without making it mandatory.                                   |
| privacy-handling metadata                | Required fields above                                                                            | Includes source; source is synthetic in M2.                                          |
| `review_state`                           | `unreviewed`, `reviewed`, or `rejected`                                                          | A workflow review, never legal identity verification.                                |
| `recorded_at` / `recorded_by_account_id` | UTC timestamp / opaque actor ID                                                                  | Server-generated attribution.                                                        |
| `supersedes_name_form_id`                | Nullable self-FK                                                                                 | Optional correction lineage; source and successor remain visible.                    |

`party_primary_name_assignments` has `id`, `organization_id`, `party_id`, `name_form_id`, nullable `supersedes_assignment_id`, `recorded_at`, and `recorded_by_account_id`. It uses composite FKs to the organization-scoped party/name form. A unique root assignment per party plus a unique successor per assignment forms one unambiguous, append-only primary-name chain. The database adapter validates that the selected name belongs to the party and extends the live chain inside a serializable transaction. An alias or correction never overwrites an earlier row.

## Party contact assertion

| Field                                                   | Type / validation                        | Notes                                                                                |
| ------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `id`, `organization_id`, `party_id`                     | UUID primary key / composite FK to party | Multiple contacts and shared values are allowed.                                     |
| `contact_type`                                          | `email`, `phone`, `address`, or `other`  | Contact transport/category only.                                                     |
| `value`                                                 | Trimmed non-empty text                   | Synthetic only until ODR-003/G2; no log/event copy.                                  |
| `operational_purpose`                                   | Trimmed non-empty text                   | Required purpose limitation; no consent or authority implication.                    |
| privacy-handling metadata                               | Required fields above                    | Includes classification/source; no consent or production retention field is implied. |
| `review_state`, `recorded_at`, `recorded_by_account_id` | As for name forms                        | Required review/attribution.                                                         |
| `supersedes_contact_id`                                 | Nullable self-FK                         | Optional append-only correction lineage.                                             |

A matching contact value across two parties is not an identity match, household link, or authority proof.

## Representation claim

| Field                                                                              | Type / validation                                 | Notes                                                               |
| ---------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `id`                                                                               | UUID primary key                                  | Opaque claim ID.                                                    |
| `organization_id`, `represented_party_id` / `representative_party_id`              | Two composite FKs to party                        | Cross-organization claims are rejected by the database.             |
| `claim_state`                                                                      | `asserted`, `disputed`, `withdrawn`, or `expired` | Non-authoritative workflow state; no `verified`/`authorized` value. |
| `effective_from` / `effective_until`                                               | Nullable UTC timestamps                           | Factual supplied timing only; not a legal validity decision.        |
| privacy-handling metadata, `review_state`, `recorded_at`, `recorded_by_account_id` | As for name forms                                 | Required provenance/privacy/review.                                 |
| `supersedes_claim_id`                                                              | Nullable self-FK                                  | Correction or later withdrawal remains reviewable.                  |

The representation claim does not create engagement, matter access, professional authority, a power of attorney, or any client-facing privilege.

## Possible-duplicate flag

| Field                                                                              | Type / validation               | Notes                                                                  |
| ---------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `id`                                                                               | UUID primary key                | Opaque cue ID.                                                         |
| `organization_id`, `first_party_id` / `second_party_id`                            | Distinct composite FKs to party | Stored in deterministic ID order; a check constraint rejects equality. |
| privacy-handling metadata, `review_state`, `recorded_at`, `recorded_by_account_id` | As for name forms               | Captures why the cue exists and its synthetic handling posture.        |

The pair has a unique cue identity in its deterministic order and no merge target. There is intentionally no `canonical_party_id`, `merge`, `clearance`, or conflict-decision table/command.

## Party audit and command receipt

`party_identity_audit_events` has `command_id` as its primary key, plus `organization_id`, `actor_account_id`, `correlation_id`, `action`, `resource_type`, `resource_id`, `assertion_category`, and `occurred_at`. It contains no name, contact value, source text, or representation content. It is an append-only organization-scoped audit record and idempotency receipt; the adapter compares a replayed command with this receipt and its canonical state before returning an existing result. Incompatible command-ID reuse fails closed.

## Referential integrity, authorization, and retention posture

- Composite foreign keys prevent orphaned or cross-organization assertions. The adapter presents a generic authorization/not-found boundary error rather than revealing a missing party to an unauthorized caller.
- Every command receives a trusted actor and passes M1 exact-resource authorization before persistence. A representation claim or possible-duplicate cue requires authorization for both linked party IDs before either record is accessed. The data model itself grants no access.
- PostgreSQL triggers reject all direct updates/deletes against the M2 party, assertion, primary-assignment, duplicate, and audit-receipt tables. Corrections are new rows only.
- `party_identity_audit_events` and `outbox_events` receive opaque metadata inside the same transaction as successful writes. Outbox delivery remains inactive.
- There is no retention, deletion, consent, export, transfer, or production-encryption policy in this M2 model. Those require ODR-003/G6 design before real personal data is processed.
