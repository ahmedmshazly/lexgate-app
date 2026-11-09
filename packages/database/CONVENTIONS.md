# Database package guidance

This file supplements the repository-level `CONSTITUTION.md` for `packages/database`.

- `src/schema.ts` is the source of truth. Generate, inspect, and commit Drizzle migrations for every schema change, and do not hand-edit a generated migration unless the change is recorded and reviewed.
- Never use development credentials, secrets, or live personal data in migrations, fixtures, tests, or documentation.
- Preserve tenant scoping, immutable audit evidence, outbox delivery records, classification, retention metadata, and idempotency controls. Cross-tenant access is a security defect.
- Prefer additive, backward-compatible migrations. Document a rollback or recovery approach before destructive data changes are approved.
- Run `pnpm db:generate`, `pnpm typecheck`, and the relevant migration validation before handoff. Drizzle commands read `DATABASE_URL` from the repository `.env` file.
