import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { generateTokensCss } from "./generate-tokens-css.js";
import type { BrandTokenName } from "./tokens.js";
import { brandTokens, brandTokenValue, customPropertyName } from "./tokens.js";

const tokensCssPath = fileURLToPath(new URL("./tokens.css", import.meta.url));

/**
 * Quoted from docs/brand/BRAND_SYSTEM.md (LG-BRAND-001) "Core tokens". If the
 * approved document changes, this list changes with it — never the reverse.
 */
const tokensNamedInBrandSystem: readonly (readonly [BrandTokenName, string])[] =
  [
    ["navy-900", "#0e1c30"],
    ["navy-950", "#0a1524"],
    ["gold-700", "#a07c2a"],
    ["gold-600", "#b8913c"],
    ["ivory", "#f7f3ea"],
    ["warm-white", "#fcfaf6"],
    ["ink", "#16171b"],
    ["confidential", "#59304f"],
    ["restricted", "#42284a"],
  ];

describe("brand token single source of truth (FR-003, SC-003)", () => {
  it("regenerates the committed stylesheet byte-for-byte", async () => {
    const committed = await readFile(tokensCssPath, "utf8");

    expect(generateTokensCss()).toBe(committed);
  });

  it("defines every token named in LG-BRAND-001 with its approved value", () => {
    for (const [name, value] of tokensNamedInBrandSystem) {
      expect(brandTokenValue(name)).toBe(value);
    }
  });

  it("publishes each token under its documented custom property name", () => {
    expect(customPropertyName("navy-900")).toBe("--lg-navy-900");
    expect(customPropertyName("font-ui")).toBe("--lg-font-ui");
  });

  it("states every colour in lowercase hexadecimal so generation is stable", () => {
    for (const [name, definition] of Object.entries(brandTokens)) {
      if (definition.group !== "color") continue;
      expect(definition.value, `${name} is not lowercase hex`).toMatch(
        /^#[0-9a-f]{6}$/,
      );
    }
  });
});

describe("typographic role fallback (Scenario 1.4)", () => {
  const roleTokens = Object.entries(brandTokens).filter(
    ([, definition]) => definition.group === "font",
  );

  it("terminates every role stack in a generic family", () => {
    expect(roleTokens.length).toBeGreaterThan(0);

    for (const [name, definition] of roleTokens) {
      const last = definition.value.split(",").at(-1)?.trim();
      expect(
        ["sans-serif", "serif", "monospace"],
        `${name} must degrade to a generic family`,
      ).toContain(last);
    }
  });

  it("lists the opposite-script approved family before any generic", () => {
    // A mixed Arabic/Latin string must resolve per glyph across approved
    // faces before it can fall through to a system font.
    const arabicFamily = '"IBM Plex Sans Arabic"';
    const latinFamily = '"Instrument Sans"';

    const latinStack = brandTokenValue("font-ui");
    const arabicStack = brandTokenValue("font-ui-arabic");

    expect(latinStack.indexOf(arabicFamily)).toBeGreaterThan(
      latinStack.indexOf(latinFamily),
    );
    expect(latinStack.indexOf(arabicFamily)).toBeLessThan(
      latinStack.indexOf("system-ui"),
    );
    expect(arabicStack.indexOf(latinFamily)).toBeGreaterThan(
      arabicStack.indexOf(arabicFamily),
    );
    expect(arabicStack.indexOf(latinFamily)).toBeLessThan(
      arabicStack.indexOf("system-ui"),
    );
  });

  it("names only families approved by LG-BRAND-001", () => {
    const approved = [
      "Instrument Sans",
      "Newsreader",
      "IBM Plex Sans Arabic",
      "Noto Naskh Arabic",
      "IBM Plex Mono",
    ];

    for (const [name, definition] of roleTokens) {
      const quoted = definition.value.match(/"([^"]+)"/g) ?? [];
      for (const family of quoted) {
        expect(approved, `${name} names an unapproved family`).toContain(
          family.replaceAll('"', ""),
        );
      }
    }
  });
});
