# Research: Gate Readiness Programme

## Decision: use an append-only lifecycle ledger and effective projection for G1

**Rationale:** Current M1 membership and exact-grant rows are immutable and uniquely keyed, so they cannot be suspended, revoked, reinstated, or replaced. A mutable “active” flag would weaken historical integrity. Separate immutable lifecycle events plus rebuildable effective projections preserve history while giving authorization an immediate, deterministic answer.

**Alternatives considered:** Mutating the existing rows violates ADR-010. Reusing static legacy rows indefinitely leaves offboarding and revocation impossible. A generic access-status endpoint is prohibited because material transitions must use explicit commands.

## Decision: require optimistic revisions and database serialization for lifecycle changes

**Rationale:** A revocation must not race a protected action and leave an unauthorized path. Commands use an expected revision and lock the effective relationship; protected operations read effective state within a compatible transaction. Exact command replay is idempotent, while a reused ID with changed content conflicts safely.

**Alternatives considered:** Last-write-wins creates silent privilege changes. Application-only locks do not protect concurrent database callers. Retrying without an explicit result is diagnostic, not authorization evidence.

## Decision: separate access administration from restricted-resource access

**Rationale:** ADR-009 and SEC-MAT-001 prohibit deriving matter access from technical administration. Lifecycle administration is an independently authorized server-side capability. New or expanded access records distinct requester/approver evidence; immediate removal is attributable and deny-safe.

**Alternatives considered:** A system role as access authority would repeat the prohibited shortcut. Self-grant would create an avoidable privilege-escalation path. Break-glass remains denied until a separate approved feature exists.

## Decision: preserve a provider-neutral identity boundary

**Rationale:** The existing identity package supplies an abstract principal boundary but no verified session, MFA, recovery, or provider. Extending only the typed verified-principal/session contract lets lifecycle code specify its required evidence without selecting a vendor before ODR-005.

**Alternatives considered:** Local passwords or a hosted SDK would introduce credentials or a provider before required Security, Privacy, and architecture review. Trusting browser identity/session flags violates SEC-AUT-001.

## Decision: prepare, do not self-approve, the ODR-003 privacy/DPO evidence package

**Rationale:** Lex Gate must preserve purpose limitation and minimization while the accountable privacy/DPO reviewer determines the firm’s legal entity, data-user position, processing lawful basis, sensitive-data, processor, and transfer obligations. The safe interim position remains synthetic local data only.

**Alternatives considered:** A generic privacy checkbox or a global “consent” basis cannot establish validity for every purpose. Treating this engineering plan as Egyptian legal advice would violate the authority hierarchy.

**Research basis:** The PDPC’s current official guidance refers to Law No. 151 of 2020 and Executive Regulations Decision No. 816 of 2025, distinguishes privacy notices from consent requests, and describes DPO, processing-record, rights, risk, and breach-management duties. It explicitly does not replace the law or legal interpretation. See [PDPC DPO guidance](https://pdpc.gov.eg/assets/pdf-data/Guidelines/DPO.pdf) and [PDPC consent guidance](https://pdpc.gov.eg/assets/pdf-data/Guidelines/DSConsent.pdf).

## Decision: default the first operational pilot to greenfield/no migration

**Rationale:** The firm’s actual taxonomy, records, volumes, current systems, and source quality remain unknown under ODR-004. Greenfield synthetic work avoids converting an assumption into a damaging migration or inaccurate conflict history.

**Alternatives considered:** Generic law-firm taxonomy is expressly not evidence. Manual re-keying of historical information would still be an uncontrolled migration. No historical source may be imported until a separate signed migration decision exists.

## Decision: use nine synthetic lawyer scenarios and defer M3 conflict implementation

**Rationale:** G2 covers M2–M3 and requires both Egyptian-lawyer scenario validation and conflict evidence. The scenario pack makes the needed legal decisions reviewable without presenting an automated system outcome as legal advice. M3 can implement only the rules later approved by the lawyer.

**Alternatives considered:** Passing G2 from the M2 party foundation alone would omit conflict evidence. An exact name-match engine or absence of a match cannot clear a conflict under LEG-CFL-004.

## Decision: retain all gate approvals as external evidence

**Rationale:** Gate ownership is explicit: Security + Engineering for G1; Privacy/DPO for ODR-003; Product + legal operations for ODR-004; lead practising Egyptian lawyer for G2. The Sponsor can authorize preparation but cannot replace specialist approval.

**Alternatives considered:** Self-certification would conflict with the validation register and legal/privacy uncertainty principle.
