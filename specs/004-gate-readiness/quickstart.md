# Quickstart: Gate Readiness Validation

## Preconditions

- Work only with local disposable services and synthetic fixtures.
- Keep real client, employee, identity, matter, legal, credential, and provider data out of the repository and test environment.
- Do not set a gate to passed without the accountable reviewer evidence described in [spec.md](spec.md).

## Start the disposable validation environment

From the repository root, start the local PostgreSQL service using the repository’s documented Compose workflow. Set the local synthetic `DATABASE_URL` required by the database package; never use a production connection.

Apply the generated additive migrations to the empty disposable database. The migration must succeed from a clean state before focused tests run.

## Validate the G1 technical foundation

1. Run focused domain tests for lifecycle grant, suspend, reinstate, revoke, correction, expiry, and offboarding transitions.
2. Run application/contract tests for trusted actor use, requester/approver separation, stale revisions, exact idempotent replay, generic denials, and the browser-assertion prohibition.
3. Run database integration tests for immutable ledger/receipt guards, projection rebuild, transactional event/audit/outbox writes, migration/backfill parity, failed-command rollback, and concurrent revoke-versus-authorize behaviour.
4. Confirm the M1 and M2 regression tests still deny role-only, cross-organization, unapproved-emergency, suspended, revoked, expired, and offboarded access.

Expected result: an exact active effective relationship can allow its exact approved operation; every prohibited or stale case denies without exposing restricted-resource existence. The result is _technical evidence only_ and does not pass G1.

## Validate review packets

1. Check that the privacy/DPO Processing Review packet is complete for each proposed workflow and still labels real-data processing as blocked.
2. Check that the Pilot Operating Profile records all required operating topics and the greenfield/no-migration decision, with no client data embedded.
3. Check that the lawyer packet includes all nine synthetic scenario families, a safe system outcome, a prohibited automated outcome, and an empty reviewer-outcome field until the practising lawyer completes it.
4. Check that the migration-decision pack is absent or explicitly blocked unless its separate source/privacy/security/legal approvals exist.

Expected result: packets are ready for reviewer use but no placeholder, template, or sponsor approval is mistaken for legal/privacy/operational sign-off.

## Run repository evidence

Run the following from the repository root after focused checks:

```text
pnpm db:generate
pnpm db:migrate
pnpm verify
pnpm verify:full
```

Record command, date, disposable environment, result, relevant test counts, migration outcome, residual risk, and reviewer status in `verification.md`. A failed, skipped, or unexecuted required check blocks completion; a retry supplies diagnosis only.

## Manual gate evidence still required

- **G1:** Security and Engineering review, access-administration authority model, MFA/provider decision, accessible recovery/session evidence, threat-model/penetration/incident/recovery evidence, and SEC-MAT legal validation for real matter access.
- **ODR-003:** Privacy/DPO and Egyptian legal review of the actual legal entity, processing record, DPO, sensitive-data, processor, transfer, rights, retention, and breach position.
- **ODR-004:** Product and legal-operations approval of a completed Pilot Operating Profile.
- **G2:** Lead practising Egyptian lawyer approval of scenario outcomes plus completed M3 conflict evidence.
