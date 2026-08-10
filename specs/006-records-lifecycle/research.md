# Research: Records Lifecycle

The specification carries no `NEEDS CLARIFICATION` marker — `REC-HLD-001` is approved and `ADR-010` is controlling. What follows resolves the engineering choices.

## R1 — How erasure can exist at all under an append-only architecture

**Decision**: erasure destroys the subject's key, not the subject's record.

**Rationale**: `ADR-010` forbids destructive updates outright, and 14 append-only triggers enforce it. Any erasure that alters or removes a row contradicts the architecture and requires dropping a guard whose whole purpose is to be undroppable. Destroying the key leaves every row and every guarantee intact while making the personal data permanently unreadable. It is the only one of the three options that satisfies erasure _and_ immutability simultaneously.

It also has a property the alternatives lack: it reaches backups. A backup taken before erasure holds ciphertext, which is inert once the key is gone. Row deletion and in-place redaction both leave the original recoverable from any prior backup, which for a legal practice is the case that matters.

**Alternatives considered**

- _Tombstone and redact in place_: simpler, no key management, but it is a destructive update — precisely what ADR-010 forbids — and backups still hold the original.
- _Genuine row deletion_: the most literal reading of erasure, but it discards audit history a legal practice most needs to retain, requires dropping append-only triggers, and still cannot reach backups.

**Known limitation, recorded rather than solved**: the key is stored in the same database as the ciphertext. Anyone with database access holds both halves, so this is an **erasure** mechanism, not a confidentiality control. Real crypto-shredding places keys in a separate managed store, which depends on `ODR-005` and is open.

## R2 — Where encryption belongs

**Decision**: the persistence layer. The domain continues to handle plaintext.

**Rationale**: `ARC-MOD-001` keeps framework and provider concerns out of domain rules. More concretely, `assertSyntheticValue` must inspect the actual value to reject a real national identifier or a reachable address — if the domain saw ciphertext, the synthetic-only control would be inspecting noise and would silently stop working.

**Alternatives considered**: encrypting in the domain would couple domain rules to a crypto implementation and break the synthetic-value guard. Encrypting in the application layer would leave the persistence port able to write plaintext, so the guarantee would depend on every caller remembering.

## R3 — The shape of the hold

**Decision**: an append-only `legal_hold_events` ledger with a rebuildable `effective_legal_holds` projection, keyed polymorphically on `(resourceType, resourceId)`.

**Rationale**: FR-002 requires release to be a successor fact rather than an edit, which is exactly what the access-lifecycle ledger already guarantees and what its append-only trigger enforces. Reusing that idiom means one set of guarantees to prove rather than two. The polymorphic key covers a party now and a matter at M4–M6 without a schema change, and lets the destruction evaluator ask a single question about anything.

**Alternatives considered**: a mutable `legal_holds` table with a `releasedAt` column would make release an update, contradicting FR-002 and requiring an exception to the append-only pattern. A party-specific hold would need replacing the moment documents arrive.

## R4 — Why the destruction path exists at all if it can never succeed

**Decision**: `evaluateRecordDestruction` is a real function with a real caller, returning `held`, `gate_g6_closed`, or `no_approved_retention_schedule`.

**Rationale**: `REC-HLD-001`'s acceptance criterion is _"destruction command rejects held records"_. A rejection needs something doing the rejecting. Declaring an interface and leaving it unimplemented would satisfy the wording while proving nothing — and this project has already learned that cost, when a hardened log-redaction control sat with no production call site for an entire session, protecting nothing. The evaluator is therefore called by the erasure path, so it is exercised on every run.

Ordering matters: a hold is reported ahead of the shut gate, because those become different answers once G6 opens and a reader must be able to tell them apart now.

## R5 — Whether a privileged actor should be able to override a hold

**Decision**: no. The hold check lives in the domain transition, not behind an authorization port.

**Rationale**: authority answers _who may attempt_ an erasure; a hold answers _whether it may proceed at all_. If a sufficiently privileged actor can proceed anyway, the hold is a suggestion. For a legal practice under litigation hold, that is the failure that ends in sanctions, so it is modelled as an invariant rather than a permission.

## R6 — Cipher selection

**Decision**: AES-256-GCM from `node:crypto`, storing IV, authentication tag, and ciphertext together.

**Rationale**: authenticated encryption detects tampering as well as preventing reading, which matters for records whose integrity is the point. It is available in the standard library, so no dependency and no provider decision is introduced ahead of `ODR-005`. A fresh IV per value prevents identical values producing identical ciphertext, which would otherwise leak that two parties share a name — a real risk given the duplicate-detection context.

**Alternatives considered**: AES-256-CBC lacks authentication and would let an undetected modification pass. A third-party crypto library would add a dependency for no benefit over the standard library.
