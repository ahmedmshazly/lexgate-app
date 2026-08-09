export type LogContext = Readonly<{
  correlationId: string;
  operation: string;
}>;

export interface Logger {
  info(context: LogContext, message: string): void;
  error(context: LogContext, message: string, error?: Error): void;
}

export const redactForLog = (
  value: Record<string, unknown>,
): Record<string, unknown> => {
  const restrictedKeys = new Set([
    "password",
    "token",
    "secret",
    "nationalId",
    "document",
  ]);
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      restrictedKeys.has(key) ? "[REDACTED]" : item,
    ]),
  );
};
