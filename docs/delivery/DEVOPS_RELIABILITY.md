# DevOps, Reliability, and Operational Baseline

**Document ID:** LG-OPS-002  
**Status:** Approved for M0; production topology pending  
**Owner:** Engineering lead

## Environment strategy

Local development uses Docker Compose with PostgreSQL, MinIO, and Mailpit. CI uses synthetic fixtures. Staging and production are separate, approval-gated environments with no shared secrets or data. Production provider and region selection are ODR-005 decisions.

## Delivery controls

- Versioned migrations with clean-database verification and no destructive history rewrite.
- Locked dependencies, repeatable pnpm installation, strict TypeScript, automated checks, and pull-request CI.
- Environment variables only for configuration/secrets; no secret appears in commits, logs, browser bundles, or documentation.
- Transactional outbox, retries with idempotency, correlation IDs, structured logs, and failure visibility.
- Release evidence records test results, migration status, unresolved risks, approved gate, rollback path, and owner.

## Reliability and recovery

Define measurable SLOs, RPO/RTO, backup retention, restoration testing, capacity, incident severity, and on-call ownership before production. A backup policy without a recorded restoration exercise is incomplete.
