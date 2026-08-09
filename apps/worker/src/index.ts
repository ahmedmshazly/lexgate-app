import type { Logger } from "@lexgate/observability";

const logger: Logger = {
  info: (context, message) =>
    console.info(JSON.stringify({ level: "info", ...context, message })),
  error: (context, message, error) =>
    console.error(
      JSON.stringify({ level: "error", ...context, message, error }),
    ),
};

logger.info(
  { correlationId: crypto.randomUUID(), operation: "worker.start" },
  "Lex Gate worker foundation started; no provider deliveries are enabled.",
);
