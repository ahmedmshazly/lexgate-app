import type { InactiveOutboxDeliveryMode } from "@lexgate/events";
import type { Logger } from "@lexgate/observability";

const logger: Logger = {
  info: (context, message) =>
    console.info(JSON.stringify({ level: "info", ...context, message })),
  error: (context, message, error) =>
    console.error(
      JSON.stringify({ level: "error", ...context, message, error }),
    ),
};

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
