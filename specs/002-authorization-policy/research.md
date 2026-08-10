# Research: M1 Authorization Policy Foundation

## Decision: retain a provider-neutral, trusted-principal boundary

**Rationale:** The existing authentication package already models an authenticated principal and identity-provider port without choosing a vendor. Continuing with that boundary permits server-side authorization policy work while ODR-005 and G1 MFA/provider review remain unresolved.

**Alternatives considered:** Adding local passwords or a hosted identity SDK would introduce credentials or a vendor before the required decision; both are rejected. Browser-supplied identity is rejected because it violates SEC-AUT-001.

## Decision: use a generic restricted-resource reference, not a matter aggregate

**Rationale:** M1 must prove that explicit relationship and organization context govern access, while M4 matter modeling and SEC-MAT legal activation remain out of scope. Opaque synthetic resource type/id references exercise the policy without manufacturing a legal matter workflow.

**Alternatives considered:** Adding a real matter table now would cross the M4 release boundary. Treating a system role as a substitute for a resource relationship would violate ADR-009 and SEC-MAT-001.

## Decision: deny without resource enumeration

**Rationale:** Unknown-resource, cross-organization, missing-grant, role-only, and unavailable break-glass requests return the same generic denial outcome. This prevents an authorization caller from learning whether a restricted resource exists.

**Alternatives considered:** Detailed caller-facing denial messages would leak resource-state information. A browser-side pre-check is not security enforcement and is rejected.

## Decision: record append-only, minimal decision evidence

**Rationale:** G1 needs reviewable evidence, while decision data must not be silently rewritten. Minimal opaque references, operation, outcome, reason, timestamp, and correlation ID support auditability without introducing personal or legal data.

**Alternatives considered:** Mutating a single “latest decision” row loses history. Logging raw grants or payloads risks over-collection. An outbox event is unnecessary because no external side effect exists.

## Decision: leave grant administration and break-glass unavailable

**Rationale:** This feature evaluates only pre-existing synthetic relationships. Creating, changing, revoking, or emergency-escalating access requires separate authorization semantics and legal/security review.

**Alternatives considered:** A generic admin grant route would make technical administration an unreviewed source of substantive access. An automatic emergency bypass would violate deny-by-default.

## Decision: database-enforce evidence immutability

**Rationale:** Application conventions alone cannot prevent a later database caller from rewriting decision history. An additive migration includes an explicit, tested guard that rejects updates and deletes of decision-evidence records.

**Alternatives considered:** Relying only on repository API discipline is insufficient for an immutable P0 record. A destructive or mutable recovery path is rejected; corrections require new evidence.
