# M0 Foundation Validation Guide

## Prerequisites

- Node 22 and pnpm 10.13.1.
- Docker available for local PostgreSQL.
- A local-only `.env` containing `DATABASE_URL`; never add credentials or real data to the repository.

## Clean local validation

1. Install exact workspace dependencies: `pnpm install --frozen-lockfile`.
2. Start local-only dependencies: `pnpm services:up`.
3. Generate and apply the inspected database schema: `pnpm db:generate` then `pnpm db:migrate`.
4. Run the minimum quality gate: `pnpm verify`.
5. Run the production-equivalent full gate: `pnpm verify:full`.
6. Stop local services when finished: `pnpm services:down`.

## Expected evidence

- Documentation validation accepts canonical requirement/traceability records.
- Lint and source tests reject prohibited domain/provider dependencies.
- The database integration test commits a synthetic audit/outbox pair and proves a duplicate event failure leaves no paired audit record.
- Browser checks cover English and Arabic semantic metadata, RTL, internal-only wording, visible keyboard focus, and automated accessibility.
- No output indicates a selected provider, public legal service, personal/client data path, payment, or AI capability.

## Manual assessment and gate

Perform keyboard-only navigation of `/en` and `/ar`, confirming the visible focus treatment and equivalent internal-foundation meaning. Record the assessor, date, and outcome in `verification.md`. G0 activation remains blocked until engineering and quality leads approve the complete evidence; this guide cannot confer that approval.
