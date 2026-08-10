# Quickstart: Validate the M2 Party Identity Foundation

## Purpose

Use this guide only with local, synthetic fixtures. It validates that a neutral party identity record can retain bilingual variants, contacts, representation claims, and duplicate cues without creating a client, engagement, matter, legal authority, conflict clearance, or public intake capability.

## Prerequisites

- Repository dependencies installed with `pnpm install`.
- Docker available for the disposable local PostgreSQL stack.
- No real names, contact details, documents, national identifiers, client records, or production database connection strings.
- The M1 authorization migrations and M2 migrations available in the working tree.

## Start the synthetic database and migrate

From the repository root, start the local stack on the non-default test port and migrate the empty synthetic database:

```sh
POSTGRES_PORT=55432 pnpm services:up
DATABASE_URL='postgresql://lexgate:lexgate@127.0.0.1:55432/lexgate' pnpm db:migrate
```

The migration must apply cleanly. Inspect the generated M2 schema migration and its custom append-only trigger migration before accepting this result.

## Run focused behavior checks

```sh
pnpm --filter @lexgate/domain test
pnpm --filter @lexgate/application test
DATABASE_URL='postgresql://lexgate:lexgate@127.0.0.1:55432/lexgate' pnpm --filter @lexgate/database test
```

The tests must demonstrate all of the following with synthetic values:

1. A trusted, explicitly authorized actor can create either a neutral person or organization with a primary Arabic or English name form and provenance.
2. A later transliteration, alias, former name, or corrected primary selection creates reviewable history instead of overwriting the earlier form.
3. Every party/assertion carries purpose, classification, subject category, source, retention candidate, access boundary, and validation requirement; a contact assertion still does not become proof of identity, consent, authority, client status, engagement, or matter access.
4. A representation claim can be recorded as an unverified assertion; it cannot grant access or establish legal representation.
5. A duplicate cue between two distinct parties remains a cue; no test exposes automatic merge, canonical selection, or conflict clearance.
6. Missing/role-only/cross-organization authorization, invalid lineage, same-party or reversed duplicate flag, direct update/delete of facts or party audit receipts, and a failed event write fail closed without partial state.

## Run repository gates

```sh
DATABASE_URL='postgresql://lexgate:lexgate@127.0.0.1:55432/lexgate' pnpm verify
DATABASE_URL='postgresql://lexgate:lexgate@127.0.0.1:55432/lexgate' pnpm verify:full
```

Record exact results in [verification.md](verification.md). `verify:full` is required because implementation changes the database/runtime packages, even though this M2 slice introduces no browser page.

## Shut down disposable services

```sh
POSTGRES_PORT=55432 pnpm services:down
```

Stopping the services does not remove any real data because this guide permits synthetic local data only. Do not use a production-like connection string in these commands.

## Interpretation of success

Passing these checks establishes only technical readiness of the synthetic, internal M2 foundation. G2 remains blocked until Egyptian-lawyer scenario validation; ODR-003 remains required before personal-data processing; and ODR-004 remains required before source migration or irreversible operating taxonomy. No check in this guide activates public intake, client/engagement/matter workflow, conflict clearance, or legal representation.
