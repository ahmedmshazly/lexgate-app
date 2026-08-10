# Contract: Records Lifecycle

The internal contract between the domain, the application command layer, and persistence. No external or client-facing interface is introduced.

## Domain — pure decisions, no I/O

| Function                    | Answers                                                                  |
| --------------------------- | ------------------------------------------------------------------------ |
| `deriveLegalHoldTransition` | Given a command and the current hold state, what successor fact follows? |
| `evaluateRecordDestruction` | May this record be destroyed?                                            |
| `evaluateSubjectErasure`    | May this subject's key be shredded?                                      |

**Guarantees**

1. `evaluateRecordDestruction` has **no successful branch**. It returns a refusal carrying one of `held`, `gate_g6_closed`, or `no_approved_retention_schedule`, and a hold is reported ahead of the shut gate so the two remain distinguishable once G6 opens.
2. `evaluateSubjectErasure` refuses whenever an active hold covers the subject. **No operator identity, role, or authority appears in its inputs** — a hold is not a permission that a sufficiently privileged actor can pass. This is structural, not a policy check.
3. A release requires an existing active hold and cites its revision. Releasing an unheld record is refused rather than recorded as a no-op.
4. Every transition requires an operator and a reason code. Neither may be blank.
5. All three are pure: no clock beyond an injected time, no database, no framework import.

## Application — orchestration

| Command            | Effect                                             |
| ------------------ | -------------------------------------------------- |
| `placeLegalHold`   | Records a hold over a resource.                    |
| `releaseLegalHold` | Records a release as a successor fact.             |
| `eraseSubject`     | Shreds a subject's key once the domain permits it. |

**Guarantees**

1. A trusted server-side actor is required; a browser-supplied claim is never an authority input.
2. A domain refusal is propagated unchanged. The application layer never converts a refusal into a success, and never retries past one.
3. `eraseSubject` is idempotent: repeating it for an already-erased subject resolves without recording a second erasure.
4. Failures are generic to the caller. A refusal states its reason to the audit trail, not to an unauthenticated requester, so refusals cannot be used to enumerate what exists.

## Persistence

| Operation                    | Guarantee                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Hold placement and release   | Ledger row, projection update, and audit row commit in one serializable transaction, or none do.            |
| `rebuildEffectiveLegalHolds` | Reconstructs the projection from the ledger. Requires an attributable operator and writes audit.            |
| Subject key shredding        | Nulls the key material and populates every shred field together, or leaves the row untouched.               |
| Party value read             | Returns the plaintext when the key is present, a redaction marker when it is shredded, never an error.      |
| Party value write            | Encrypts under the subject's key with a fresh IV, after the synthetic-value check has run on the plaintext. |

**Consumer obligations**

- Read hold state from the projection, never by replaying the ledger. The ledger is evidence; the projection is the answer.
- Never write a party value without going through the persistence port, which is where encryption is applied.
- Never treat an absent hold as a clearance to destroy. Absence of a hold is one of three reasons destruction is refused, not a permission.
- Never regenerate a key for a shredded subject. Erasure is one-way by design.

## Stability

The refusal reasons are additive: a new reason may be introduced without breaking a consumer, because there is no successful branch to widen. Should G6 ever open and destruction become permissible, that is a new capability requiring its own specification and its own reviewer — not a relaxation of this contract.
