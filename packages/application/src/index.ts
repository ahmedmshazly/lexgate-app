import type { DomainEvent } from "@lexgate/domain";
import type { OutboxPort } from "@lexgate/events";

export type Actor = Readonly<{
  accountId: string;
  organizationId: string;
}>;

export interface AuthorizationPort {
  assertAuthorized(input: {
    actor: Actor;
    action: string;
    resource: { type: string; id: string };
  }): Promise<void>;
}

export interface AuditPort {
  record(input: {
    actor: Actor;
    action: string;
    resource: { type: string; id: string };
    occurredAt: Date;
  }): Promise<void>;
}

export interface TransactionPort {
  inTransaction<T>(work: () => Promise<T>): Promise<T>;
}

export const recordMaterialTransition = async (input: {
  actor: Actor;
  action: string;
  resource: { type: string; id: string };
  event: DomainEvent;
  authorization: AuthorizationPort;
  audit: AuditPort;
  outbox: OutboxPort;
  transaction: TransactionPort;
}): Promise<void> => {
  await input.authorization.assertAuthorized({
    actor: input.actor,
    action: input.action,
    resource: input.resource,
  });

  await input.transaction.inTransaction(async () => {
    await input.audit.record({
      actor: input.actor,
      action: input.action,
      resource: input.resource,
      occurredAt: input.event.occurredAt,
    });
    await input.outbox.enqueue(input.event);
  });
};
