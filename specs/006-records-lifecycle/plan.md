# Implementation Plan: Records Lifecycle — Retention, Legal Hold, and Erasure

## Context and requirement coverage

**Canonical requirement IDs**: `REC-HLD-001` (Legal hold precedence, P0, approved, owner records, release M9, gate G6, `legal_validation: required`). `PRV-MIN-001` appears as a boundary — this feature must not widen collection. `REC-DOC-001` and `REC-EVD-001` are out of scope: no document or evidence record exists before M4–M6.

**Controlling authority**: `ADR-010` — _"Immutable/versioned material history. Use correction, supersession, versioning, and append-only events instead of destructive updates."_ Accepted, and the reason erasure is implemented as key destruction rather than record destruction.

**Release gate**: M9 / G6 (Privacy and records, Privacy/DPO reviewer). **No gate is closed.** This is an M0 foundation ahead of its gate, matching the technical G1 increment feature 004 built while G1 stayed shut.

**Data classification**: Internal, synthetic only.

**Affected packages**: `packages/domain` (new records-lifecycle contract), `packages/application` (command orchestration and ports), `packages/database` (schema, migration, adapter, and the party-identity read/write sites), `docs/assurance` and `docs/requirements` (records decision and traceability).

**Reviewed current implementation**

- 19 tables, 14 append-only triggers blocking `UPDATE` and `DELETE`. Destruction is impossible today, but nothing records that a hold applies.
- `packages/database/src/access-lifecycle.ts` is the established idiom for an append-only ledger with a rebuildable projection: serializable isolation, advisory lock per aggregate, attributable operator, reason code, audit and outbox rows written in the same transaction.
- Party personal values are stored as plain `text` at three write sites (`createParty`, `recordName`, `recordContact`) and read at two sites in `readPartyHistory`, all in `packages/database/src/party-identity.ts`.
- `assertSyntheticValue` in `packages/domain/src/party-identity.ts` validates value content before storage.
- No encryption exists anywhere; `node:crypto` is used only for hashing in `packages/brand`.

**Scope exclusions**: no gate closed, no real personal data, no record destroyed, no append-only trigger dropped, no automated expiry, no retention schedule, no document or matter record, no user-facing surface.

**Approved exceptions**: none requested.

## Bounded design

### Decision 1 — Reuse the access-lifecycle idiom rather than inventing a second one

Legal holds are an append-only `legal_hold_events` ledger plus a rebuildable `effective_legal_holds` projection, mirroring the membership and grant lifecycle exactly.

This is required rather than merely consistent: FR-002 says a release must be a successor fact and a hold record must never be edited. The append-only trigger enforces that at the database, and the projection is what makes "is this held right now?" answerable in one read. Inventing a different shape would mean a second set of guarantees to prove.

Placement and release carry an operator, a reason code, and a correlation identifier, and each writes an audit row in the same transaction — the pattern `writeOutboxAndAudit` already establishes.

### Decision 2 — Holds are polymorphic over `(resourceType, resourceId)`

Matters, documents, and evidence do not exist until M4–M6. A hold keyed on a resource kind and identifier covers a party today and a matter later with no schema change, and lets the destruction evaluator ask one question regardless of what it is evaluating.

The alternative — a party-specific hold — would need replacing the moment the first document arrives, and would leave two hold concepts in the codebase during the transition.

### Decision 3 — Erasure destroys the subject key, never the record

A `subject_encryption_keys` row holds one key per party. Party name and contact values are stored encrypted under it using AES-256-GCM from `node:crypto`, persisting IV, auth tag, and ciphertext together.

Erasure overwrites the key material and records `shreddedAt`, its operator, and its reason. The row survives; the ciphertext survives; only the means of reading is gone. `ADR-010` holds, no trigger is dropped, and the guarantee reaches backups because a backup of ciphertext is inert without its key.

**Encryption lives in the persistence layer, not the domain.** `ARC-MOD-001` keeps framework and provider concerns out of domain rules, and the domain continues to see plaintext — which is also what keeps `assertSyntheticValue` meaningful, since it must inspect the real value before it becomes unreadable.

_Alternatives rejected_: tombstoning by overwriting the value in place is a destructive update, exactly what ADR-010 forbids, and leaves backups holding the original. Genuine row deletion discards the audit history a legal practice most needs and cannot reach backups either.

### Decision 4 — Record destruction is a refusal, not a capability

`evaluateRecordDestruction` answers whether a record may be destroyed and returns one of `held`, `gate_g6_closed`, or `no_approved_retention_schedule`. It has no successful branch.

This satisfies REC-HLD-001's acceptance criterion — _"destruction command rejects held records"_ — honestly, because there is a real command doing the rejecting. It is called by the erasure path, so it is exercised rather than sitting as an unimplemented interface. That distinction matters here: a hardened redaction control sat with no production call site for an entire session earlier in this project, protecting nothing.

The reasons are ordered so a hold is reported ahead of the shut gate. A reader must be able to tell "this is held" from "nothing may be destroyed yet", because those become different answers once G6 opens.

### Decision 5 — A hold is not a permission

FR-004 requires that operator authority cannot override an active hold. The check therefore sits in the domain transition, not in an authorization port: authority determines _who may attempt_ an erasure, and the hold determines _whether it may proceed at all_. No actor, however privileged, has a path around it.

### Failure, rollback, and recovery

Reading a subject whose key is gone returns a redaction marker per value rather than throwing, so an erased record stays navigable (FR-009). A repeated erasure resolves without recording a second removal (FR-013), following the idempotent-replay pattern the access lifecycle already uses.

The hold projection is rebuildable from its ledger, with the same actor and audit requirements the access-lifecycle rebuild gained. Rollback is a revert: the migration is additive, and no data is destroyed by applying it.

### Arabic and RTL implications

None directly — no user-facing surface. One downstream consequence is recorded because it constrains M3: encrypted values cannot be matched, so the future conflict-detection work must decrypt in memory. The G2 analysis identified Arabic name variation as the sharpest matching risk, and that work must not be designed assuming readable stored values.

## Test and evidence design

| Layer                                | Target behaviour                                                                                                              | Prohibited behaviour                              | Location                                                      | Command                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Static, type, lint, documentation    | Strict types, controlled documentation, formatting.                                                                           | Untyped crypto handling.                          | repository-wide                                               | `pnpm format:check && pnpm docs:validate && pnpm lint && pnpm typecheck` |
| Domain — hold transitions            | Place, release as successor, reject release of an unheld record, reject an unattributed hold.                                 | A release represented as an edit.                 | `packages/domain/src/records-lifecycle.test.ts`               | `pnpm --filter @lexgate/domain test`                                     |
| Domain — refusal semantics           | Every destruction evaluation refuses; a hold is reported ahead of the shut gate.                                              | Any evaluation returning an allow.                | `packages/domain/src/records-lifecycle.test.ts`               | `pnpm --filter @lexgate/domain test`                                     |
| Application — command orchestration  | Trusted operator, reason required, refusal propagated unchanged.                                                              | An authority check that could bypass a hold.      | `packages/application/src/records-lifecycle.test.ts`          | `pnpm --filter @lexgate/application test`                                |
| Integration — the decisive path      | Place a hold, attempt erasure, confirm refusal; release, erase, confirm values unreadable **and** the event ledger intact.    | An erasure succeeding against a held subject.     | `packages/database/src/records-lifecycle.integration.test.ts` | `pnpm --filter @lexgate/database test`                                   |
| Integration — unreadability          | After erasure, direct inspection of stored rows yields no personal value.                                                     | A recoverable plaintext value after erasure.      | same                                                          | same                                                                     |
| Integration — round trip and rebuild | Encrypt/decrypt returns the original; erased values read as a marker, not an error; hold projection rebuilds from its ledger. | A crash when reading an erased record.            | same                                                          | same                                                                     |
| Regression — party identity          | Existing party tests continue to pass against encrypted storage.                                                              | Weakening an assertion to accommodate encryption. | `packages/database/src/party-identity.integration.test.ts`    | same                                                                     |

**Layers genuinely not applicable**

- _Browser, accessibility, locale, RTL_: no route, view, or user-facing surface is introduced. The existing shell suites run unchanged and would catch a regression.
- _Performance, resilience, backup/restore, incident_: no runtime service or operational surface changes, and no performance claim is made. Backup inertness is a design consequence of key destruction, argued in the specification, not an operational claim being evidenced here.

Existing party tests assert plaintext values in the database and **will need updating** — that is the change biting, not a workaround, and each update must preserve what the assertion was protecting.

## Delivery and verification

**Phase 1 — hold ledger.** Domain transitions and refusal semantics, test-first. Then schema, additive migration with append-only triggers following `0009`, and the serializable adapter with projection rebuild.

**Phase 2 — refusal path.** `evaluateRecordDestruction` with its three reasons, wired into the erasure path so it has a real caller.

**Phase 3 — keys and encryption.** Key registry, AES-256-GCM helpers, encryption at the three write sites and decryption or redaction at the two read sites. Update the party regression suite.

**Phase 4 — erasure.** The command, its hold check, key shredding, idempotent repeat, and the decisive integration test.

**Phase 5 — evidence and convergence.** Verification record, traceability, records-assurance documentation, then a cross-artifact analysis and the convergence review until clean.

**Rollout**: no feature flag. The change is additive, reversible by revert, and activates nothing — no caller outside tests invokes erasure.

**Independent review**: `REC-HLD-001` carries `legal_validation: required` and gate G6, whose Privacy/DPO reviewer has not been engaged. That review is **not obtained and not claimed**. The mechanism is built and tested on synthetic data; authorisation to use it against real personal data remains blocked.

**Completion commands**: `pnpm verify` and `pnpm verify:full` with `DATABASE_URL` exported, plus a clean-database migration run reproducing CI. `specs/006-records-lifecycle/verification.md` must record coverage for FR-001–FR-013 and SC-001–SC-008, exact commands and results, residual risks, and explicit statements that G6 remains shut, no record was destroyed, no append-only guard was removed, and no real personal data was processed.
