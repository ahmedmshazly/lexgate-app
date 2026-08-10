# Quickstart: M1 Authorization Policy Foundation Validation

## Purpose

Validate the non-activated, synthetic authorization foundation without using credentials, personal data, a provider, or a user-facing login route.

## Prerequisites

- Node and pnpm versions supported by the repository.
- Local Docker available for the synthetic PostgreSQL service.
- No production environment, credentials, or external provider configuration.

## Validation flow

1. Start only the repository’s synthetic local services on an unused local port.
2. Set `DATABASE_URL` to that synthetic PostgreSQL instance.
3. Generate and apply the additive migration.
4. Run focused domain, application, boundary, and database authorization tests.
5. Run `pnpm verify`, then the production-equivalent full gate.

Expected outcomes:

- A matching active membership and explicit exact grant permits only its approved operation.
- Role-only, browser-asserted, missing, malformed, cross-organization, different-resource, unavailable-break-glass, and duplicate-evidence paths deny or fail closed.
- Decision evidence, membership history, and grant history are append-only; an attempted update or delete fails.
- No test makes a network request to an identity provider or uses real data.

## Review and activation boundary

Record every command and result in `verification.md`. Technical validation does not pass G1. Before activation, obtain the required legal validation for SEC-MAT-001 and G1 Security/Engineering plus MFA/provider review evidence.
