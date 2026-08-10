import type { InactiveOutboxDeliveryMode } from "@lexgate/events";
import type { Logger } from "@lexgate/observability";
import { createRedactingLogger } from "@lexgate/observability";

/**
 * Every payload passes through redaction. Serialising the context directly
 * would leave the redaction control unreachable, which is what it was before:
 * a hardened function with no production call site protects nothing.
 */
const logger: Logger = createRedactingLogger({
  info: (payload) => console.info(JSON.stringify(payload)),
  error: (payload) => console.error(JSON.stringify(payload)),
});

export const m0OutboxDeliveryMode: InactiveOutboxDeliveryMode = {
  enabled: false,
  reason: "No provider deliveries are enabled in the M0 foundation.",
};

export const startWorker = (
  activeLogger: Logger,
  correlationId: string = crypto.randomUUID(),
): void => {
  activeLogger.info(
    { correlationId, operation: "worker.start" },
    `Lex Gate worker foundation started; ${m0OutboxDeliveryMode.reason}`,
  );
};

if (process.env.NODE_ENV !== "test") {
  startWorker(logger);
}
