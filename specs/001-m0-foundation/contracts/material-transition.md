# Internal Contract: Material Transition Persistence

**Scope:** Internal application-to-database port; no HTTP route or provider API is exposed.

## Command contract

The application command accepts a synthetic-capable actor, action, opaque resource reference, and domain event. It first requires its authorization port to approve the action. It then delegates to one persistence port that atomically records the append-only audit event and provider-neutral outbox intent.

## Success

The command resolves only after both records commit. The audit event records actor, action, resource, and occurrence time. The outbox record retains the event identity, type, aggregate identifier, payload, and delivery bookkeeping defaults.

## Failure

- Authorization rejection prevents all persistence.
- Validation or database failure rejects the command and leaves neither new audit nor outbox record committed.
- A duplicate outbox event identifier is an idempotency conflict and rolls back the paired audit insertion.
- No provider delivery, callback, or reconciliation is attempted in M0.

## Concurrency and recovery

The database primary key makes event-identifier duplication deterministic. A future approved worker may update only outbox delivery bookkeeping. Audit/history records and event payloads remain append-only/immutable. Logs use correlation identifiers and redaction; event payloads must not be emitted in error messages.
