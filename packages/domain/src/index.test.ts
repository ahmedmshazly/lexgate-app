import { describe, expect, it } from "vitest";
import {
  assertDeadlineCanBeConfirmed,
  assertDerivedIsReviewed,
} from "./index.js";

describe("foundation invariants", () => {
  it("does not treat unreviewed derived information as verified", () => {
    expect(() =>
      assertDerivedIsReviewed({ value: "OCR text", reviewState: "unreviewed" }),
    ).toThrow("before review");
  });

  it("requires a rule version and reviewer before confirming a deadline", () => {
    expect(() =>
      assertDeadlineCanBeConfirmed({
        state: "calculated",
        ruleVersionId: undefined,
        reviewerId: undefined,
      }),
    ).toThrow("source rule version");
  });
});
