import { brandTokens } from "@lexgate/brand/tokens";
import { describe, expect, it } from "vitest";
import type { Classification } from "./index.js";
import { classificationLabel } from "./index.js";

const classifications: readonly Classification[] = [
  "internal",
  "confidential",
  "restricted",
];

describe("classification labels", () => {
  it("names every classification distinctly", () => {
    const labels = classifications.map(classificationLabel);

    expect(new Set(labels).size).toBe(classifications.length);
    for (const label of labels) {
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });

  it("distinguishes restricted from confidential", () => {
    expect(classificationLabel("restricted")).toBe("Highly restricted");
    expect(classificationLabel("confidential")).toBe("Confidential");
    expect(classificationLabel("internal")).toBe("Internal");
  });
});

describe("no classification is expressible by colour alone (FR-008)", () => {
  it("gives every classification colour token a text label", () => {
    // LG-BRAND-001 forbids colour carrying meaning without text, icon, or
    // pattern reinforcement. Each classification that has a brand colour must
    // therefore also have a label available from this package.
    const classificationTokens = Object.keys(brandTokens).filter(
      (name): name is Classification =>
        (classifications as readonly string[]).includes(name),
    );

    expect(classificationTokens).toEqual(
      expect.arrayContaining(["confidential", "restricted"]),
    );

    for (const token of classificationTokens) {
      expect(
        classificationLabel(token).trim().length,
        `${token} has a brand colour but no text label`,
      ).toBeGreaterThan(0);
    }
  });
});
