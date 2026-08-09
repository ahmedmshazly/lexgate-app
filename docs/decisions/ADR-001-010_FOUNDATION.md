# ADR-001 to ADR-010 — Foundation Decisions

**Status:** Accepted  
**Owner:** Architecture lead  
**Review trigger:** A measured requirement exceeds this foundation or a validated legal/security requirement conflicts with it.

1. **ADR-001 — Modular monolith.** Start with one deployable application/worker boundary and explicit packages. Avoid microservices until an approved ADR demonstrates a concrete operational need.
2. **ADR-002 — Relational ACID canonical database.** PostgreSQL is the authoritative state store for material facts, relationships, constraints, and transactions.
3. **ADR-003 — Private object storage.** Store confidential files privately; relational records retain stable metadata/provenance references.
4. **ADR-004 — Dedicated client projections.** Build client-visible contracts expressly rather than reusing internal entities.
5. **ADR-005 — Server-side authorization.** Centralize policy evaluation and enforce it for every protected operation.
6. **ADR-006 — Transactional outbox.** Persist state change and external-side-effect intent atomically, then deliver from the worker.
7. **ADR-007 — Provider adapters.** Keep provider SDKs outside the domain; use typed ports, verified callbacks, idempotency, and reconciliation.
8. **ADR-008 — Internal AI gateway.** Any future AI capability is mediated, audited, policy-controlled, and unavailable before G7.
9. **ADR-009 — Administration is not matter access.** Technical and support privileges do not grant substantive file visibility.
10. **ADR-010 — Immutable/versioned material history.** Use correction, supersession, versioning, and append-only events instead of destructive updates.
