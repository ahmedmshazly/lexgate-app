# Quickstart: Validating the Records Lifecycle

How to prove this feature works. See [plan.md](plan.md) for design decisions and [contracts/records-lifecycle.md](contracts/records-lifecycle.md) for the interface guarantees.

## Prerequisites

```sh
pnpm install
pnpm services:up
set -a; . ./.env; set +a
pnpm db:migrate
```

`DATABASE_URL` must be exported — the database suites read it directly and do not load `.env` themselves.

## 1. The decisive test

```sh
pnpm --filter @lexgate/database exec vitest run --no-file-parallelism src/records-lifecycle.integration.test.ts
```

**Expected**, in this order:

1. A hold is placed over a synthetic party.
2. Erasure of that party is **refused**, and the refusal names the hold.
3. The hold is released as a successor fact; the original placement is still readable.
4. Erasure now succeeds.
5. The party's names and contacts read back as erased.
6. The party's event history — what was recorded, when, by whom — is **still fully readable**.

Step 2 is the one that matters. If it ever passes an erasure, `REC-HLD-001` is not satisfied regardless of what else works.

## 2. Prove the data is genuinely unreadable

Rather than trusting the read path, look at what is actually stored:

```sh
docker exec compose-postgres-1 psql -U lexgate -d lexgate \
  -c "select value from party_name_forms limit 5;"
```

**Expected**: encrypted envelopes, not readable names. After a subject is erased, nothing in that output can be turned back into a name by anyone holding this database — because the key that would do it is gone.

## 3. Prove a privileged actor cannot override a hold

```sh
pnpm --filter @lexgate/domain exec vitest run src/records-lifecycle.test.ts
```

**Expected**: the erasure decision refuses a held subject. Note what the test _cannot_ do — pass an operator identity that changes the answer. Authority is not an input to that decision, so there is no privileged path to test around. That is the design, not an omission.

## 4. Prove destruction is never permitted

**Expected**: every destruction evaluation returns a refusal — `held`, `gate_g6_closed`, or `no_approved_retention_schedule`. There is no successful branch to exercise, and a test asserting one would be asserting a capability this feature deliberately does not have.

## 5. Prove hold state is reconstructible

**Expected**: rebuilding the hold projection from its ledger reproduces the same state, and the rebuild itself requires an attributable operator and leaves an audit record.

## 6. Full gate

```sh
pnpm verify:full
```

**Expected**: format, documentation, lint, types, every package suite, production build, and the browser suite. Then confirm the clean-database path CI uses:

```sh
docker exec compose-postgres-1 psql -U lexgate -d postgres -c "CREATE DATABASE ci_check;"
DATABASE_URL="postgresql://lexgate:lexgate@localhost:55432/ci_check" pnpm db:migrate
DATABASE_URL="postgresql://lexgate:lexgate@localhost:55432/ci_check" pnpm --filter @lexgate/database test
docker exec compose-postgres-1 psql -U lexgate -d postgres -c "DROP DATABASE ci_check;"
```

## What this does not prove

G6 remains shut. Passing every check above means the mechanism works against synthetic data — it does **not** mean anyone is authorised to erase a real person's data, or that the retention schedule question has been answered. No record was destroyed, no append-only guard was removed, and no gate moved.

The keys live in the same database as the data they protect, so this is an erasure mechanism, not a confidentiality control. A separate key store is required before any real personal data exists, and that depends on `ODR-005`.
