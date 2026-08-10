import type { DomainEvent } from "@lexgate/domain";

export type OutboxRecord = Readonly<{
  id: string;
  event: DomainEvent;
  occurredAt: Date;
  attempts: number;
  lastAttemptedAt: Date | null;
  lastError: string | null;
  publishedAt: Date | null;
}>;

export interface OutboxPort {
  enqueue(event: DomainEvent): Promise<void>;
}

export interface EventPublisher {
  publish(record: OutboxRecord): Promise<void>;
}

/**
 * M0 keeps delivery intentionally inactive until a provider-specific gate is
 * approved. The future worker contract remains provider-neutral.
 */
export type InactiveOutboxDeliveryMode = Readonly<{
  enabled: false;
  reason: string;
}>;
