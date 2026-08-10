import { describe, expect, it, vi } from "vitest";
import { m0OutboxDeliveryMode, startWorker } from "./index.js";

describe("M0 worker boundary", () => {
  it("declares delivery inactive without registering a provider (INT-ADP-001)", () => {
    expect(m0OutboxDeliveryMode).toEqual({
      enabled: false,
      reason: "No provider deliveries are enabled in the M0 foundation.",
    });
  });

  it("logs only the typed inactive-delivery state at startup", () => {
    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    startWorker(logger, "synthetic-correlation-001");

    expect(logger.info).toHaveBeenCalledWith(
      {
        correlationId: "synthetic-correlation-001",
        operation: "worker.start",
      },
      "Lex Gate worker foundation started; No provider deliveries are enabled in the M0 foundation.",
    );
    expect(logger.error).not.toHaveBeenCalled();
  });
});
