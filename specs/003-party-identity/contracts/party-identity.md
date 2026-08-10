# Internal Contract: Party Identity Commands

## Scope

This is an internal TypeScript application-port contract for DAT-PRT-001. It is not an HTTP API, public form, webhook, server action, or client-portal contract. Callers are trusted server composition roots only; browser payloads and browser permission assertions are never authorization evidence.

## Common command envelope

Every mutation receives:

| Field           | Rule                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `commandId`     | Opaque UUID, unique for the semantic command. Reuse with incompatible inputs is rejected.                  |
| `correlationId` | Non-empty technical correlation ID; it contains no name, contact, or legal information.                    |
| `actor`         | Trusted M1 `Actor` with account and organization IDs. It is constructed server-side.                       |
| `authorization` | M1 restricted-resource authorization port. The command calls it; a caller cannot supply an allow decision. |
| `persistence`   | Internal party-identity persistence port. It owns the atomic state/audit/outbox transaction.               |

Server-generated timestamps and opaque assertion IDs are accepted only from the trusted composition root/test fixture. Every party/assertion carries the required synthetic privacy-handling metadata: purpose, classification, subject category, source, retention candidate, access boundary, and validation requirement. All textual identity/contact fields are trimmed, required where stated, and excluded from logs/outbox payloads.

## Commands

| Command                     | Minimum payload                                                                                   | Required authorization                                  | Success                                                                    | Prohibited effect                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `createNeutralParty`        | Party ID, `person`/`organization`, initial name form, primary assignment, privacy metadata        | `party-registry` + `party.create` in actor organization | Immutable party, name form, primary assignment, audit receipt/outbox event | Client, engagement, matter, authorization, or legal verification creation     |
| `recordPartyName`           | Party ID, name form, optional predecessor/primary-assignment predecessor                          | Exact party + `party.record_name`                       | New immutable name/history row                                             | Update/delete of a name, auto-match, or merge                                 |
| `recordPartyContact`        | Party ID, contact type/value, operational purpose, privacy metadata, review                       | Exact party + `party.record_contact`                    | New immutable contact assertion                                            | Consent, identity, authority, or client-status proof                          |
| `recordRepresentationClaim` | Represented/representative IDs, claim state, privacy metadata, review, optional dates/predecessor | Both party IDs + `party.record_representation`          | New immutable claim                                                        | Legal authority, representation acceptance, matter access, or engagement      |
| `flagPossibleDuplicate`     | Ordered distinct party IDs, privacy metadata, review                                              | Both party IDs + `party.flag_possible_duplicate`        | New immutable candidate cue                                                | Merge, canonical selection, or conflict clearance                             |
| `readPartyIdentityHistory`  | Party ID                                                                                          | Exact party + `party.read`                              | Server-side internal projection of party assertions/history                | Client projection, unscoped list/search, or unauthorized existence disclosure |

## Outcomes and error behavior

| Outcome                        | Semantics                                                                                                                                                                                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Success                        | Returns opaque party/assertion identifiers and non-sensitive state metadata. The atomic receipt/audit/outbox records are created together.                                                                                                                     |
| `not_authorized`               | Generic M1 deny result. It does not reveal whether a party exists or why access was denied. No party write occurs.                                                                                                                                             |
| `invalid_party_identity_input` | Trusted validation rejects malformed IDs, blank values/purpose/source/language, unsupported controlled vocabulary, same-party duplicate pair, invalid correction lineage, or invalid effective range. No write occurs.                                         |
| `party_identity_conflict`      | Duplicate/incompatible command ID, conflicting primary lineage, duplicate candidate cue, FK/organization mismatch, or serializable transaction conflict. The caller may read/retry only according to the server-owned command policy; no partial write occurs. |
| `persistence_failed`           | Canonical transaction rolls back. No partial party assertion, audit event, or outbox event is retained.                                                                                                                                                        |

No outcome says `client`, `verified`, `cleared`, `engaged`, `authorized representative`, or `legal identity`. The future G2 workflow owns those distinct decisions.

## Internal read projection

The read projection returns only the target party in the actor organization and its own append-only name, primary-name assignment, and contact history. A linked party’s identity is never included merely because a representation or duplicate relationship exists; a future linked-party read requires its own exact-party authorization. The projection includes source and review metadata so an internal reviewer can distinguish an unreviewed assertion from a reviewed one. It never includes M1 grants, other-organization records, client/matter state, conflict decisions, or a client-facing projection.

## Non-contracts

The following remain absent by design: public REST/GraphQL endpoints, browser request schemas, public search, intake form submissions, automatic similarity matching, merge endpoints, conflict clearance, identity/KYC integrations, external directory lookups, provider callbacks, and personal-data imports.
