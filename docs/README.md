# Lex Gate Documentation

This directory is the controlled, implementation-facing documentation set. It supersedes the numbered documents preserved under [`archive/pre-docs-2026-08-09`](archive/pre-docs-2026-08-09/README.md).

## Authority and reading order

1. [`requirements/MASTER_SRS.md`](requirements/MASTER_SRS.md) — canonical product and engineering requirements.
2. Structured requirement, traceability, capability, release, and validation records in `requirements/`.
3. Approved architecture decisions in `decisions/` and architecture documents in `architecture/`.
4. Assurance, delivery, and operating documentation.
5. Source material in `archive/` for provenance and rationale only.

## Documentation map

| Area            | Purpose                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `governance/`   | Document control, source policy, unresolved decisions, validation gates, bilingual terminology. |
| `product/`      | Product scope, discovery protocol, service model, and release model.                                                |
| `requirements/` | Canonical SRS and machine-readable requirement records.                                                             |
| `architecture/` | System, domain/data, API/integration, and operational architecture.                                                 |
| `assurance/`    | Security, privacy, records, test, and legal-workflow validation.                                                    |
| `delivery/`     | DevOps, reliability, release, and incident-readiness requirements.                                                  |
| `brand/`        | Visual system, tokens, asset provenance, and content safeguards.                                                    |
| `development/`  | Delivery workflow and quality-evidence standard. |
| `legal/`        | Public-source refresh register and legal-review protocol.                                                           |
| `archive/`      | Immutable legacy source evidence.                                                                                   |

## Status vocabulary

- **Approved** — decision or interpretation signed by the accountable owner.
- **Proposed** — intended baseline that may guide reversible foundation work.
- **Validated** — supported by recorded evidence for its stated scope.
- **Blocked** — cannot be implemented or activated until its validation gate passes.
- **Superseded** — retained only for traceability.

No status applies across legal, operational, and technical contexts unless the document explicitly says so.
