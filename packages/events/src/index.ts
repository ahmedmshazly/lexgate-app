import type { DomainEvent } from "@lexgate/domain";

export type OutboxRecord = Readonly<{
  id: string;
  event: DomainEvent;
  occurredAt: Date;
  attempts: number;
}>;

export interface OutboxPort {
  enqueue(event: DomainEvent): Promise<void>;
}

export interface EventPublisher {
  publish(record: OutboxRecord): Promise<void>;
}
