import { describe, expect, it } from "vitest";
import type { BrandTokenName } from "./tokens.js";
import { brandTokenValue } from "./tokens.js";

/** WCAG 2.2 relative luminance. */
const relativeLuminance = (hex: string): number => {
  const channels = [1, 3, 5].map((offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const contrastRatio = (
  foreground: BrandTokenName,
  background: BrandTokenName,
): number => {
  const first = relativeLuminance(brandTokenValue(foreground));
  const second = relativeLuminance(brandTokenValue(background));
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * The pairings the shells actually render, enumerated rather than inferred.
 * Analysis finding U2.
 */
const bodyTextPairings: readonly (readonly [BrandTokenName, BrandTokenName])[] =
  [
    ["ink", "warm-white"],
    ["ink", "ivory"],
    ["navy-950", "warm-white"],
    ["navy-900", "warm-white"],
    ["slate", "warm-white"],
    ["ivory", "navy-900"],
    ["warm-white", "navy-900"],
  ];

/**
 * Focus and meaningful non-text elements: the pairing that must carry the
 * contrast is the indicator's OUTERMOST edge against the ground it sits on.
 */
const nonTextPairings: readonly (readonly [BrandTokenName, BrandTokenName])[] =
  [
    ["navy-900", "warm-white"],
    ["gold-600", "navy-900"],
  ];

describe("approved colour contrast (FR-013, SC-009)", () => {
  it("meets 4.5:1 for every body-text pairing the shells use", () => {
    for (const [foreground, background] of bodyTextPairings) {
      const ratio = contrastRatio(foreground, background);

      expect(
        ratio,
        `${foreground} on ${background} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("meets 3:1 for focus and meaningful non-text pairings", () => {
    for (const [foreground, background] of nonTextPairings) {
      const ratio = contrastRatio(foreground, background);

      expect(
        ratio,
        `${foreground} on ${background} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("records why gold cannot be the outer edge of a focus indicator", () => {
    // Regression guard for the defect this suite found: the shell's focus ring
    // was 3px of gold-600 directly against warm-white. If a future change
    // makes gold the outermost edge again, this documented ratio explains why
    // that fails WCAG 2.2 SC 1.4.11.
    const ratio = contrastRatio("gold-600", "warm-white");

    expect(ratio).toBeLessThan(3);
    expect(ratio).toBeCloseTo(2.82, 2);
  });

  it("computes a known ratio correctly", () => {
    // Black on white is exactly 21:1, which pins the implementation itself.
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBe(1);
  });
});
