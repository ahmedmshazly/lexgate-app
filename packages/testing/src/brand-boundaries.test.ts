import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));

const shellSurfaces = [
  "apps/web/src/app/[locale]/page.tsx",
  "apps/web/src/app/[locale]/layout.tsx",
  "apps/web/src/app/globals.css",
  "apps/web/src/components/portal-mark.tsx",
];

/**
 * ODR-002 keeps professional authority and public-marketing interpretation
 * with the lead practising Egyptian lawyer. Until that decision is recorded,
 * no brand or shell surface may carry an outcome claim, a testimonial, a case
 * study, or a lawyer profile — brand typography and colour only.
 */
const prohibitedEnglish = [
  "best lawyer",
  "top-rated",
  "award-winning",
  "guaranteed",
  "we win",
  "success rate",
  "testimonial",
  "case study",
  "our clients say",
  "years of experience",
  "no win no fee",
  "free consultation",
];

const prohibitedArabic = [
  "أفضل محام",
  "مضمون",
  "نسبة نجاح",
  "استشارة مجانية",
  "شهادات العملاء",
];

const readSurface = async (path: string): Promise<string> =>
  readFile(`${repositoryRoot}${path}`, "utf8");

describe("brand surfaces carry no ODR-002 content (FR-009, SC-008)", () => {
  it("states no outcome, success, or marketing claim in either language", async () => {
    for (const surface of shellSurfaces) {
      const contents = (await readSurface(surface)).toLowerCase();

      for (const phrase of prohibitedEnglish) {
        expect(
          contents.includes(phrase),
          `${surface} contains the prohibited claim "${phrase}"`,
        ).toBe(false);
      }
      for (const phrase of prohibitedArabic) {
        expect(
          contents.includes(phrase),
          `${surface} contains the prohibited Arabic claim "${phrase}"`,
        ).toBe(false);
      }
    }
  });

  it("introduces no lawyer profile or named practitioner on a brand surface", async () => {
    for (const surface of shellSurfaces) {
      const contents = await readSurface(surface);

      expect(contents).not.toMatch(/\bpartner at\b/i);
      expect(contents).not.toMatch(/\bLL\.?M\b/);
      expect(contents).not.toMatch(/\bbar association\b/i);
      expect(contents).not.toMatch(/\badmitted to practice\b/i);
    }
  });

  it("keeps the shell explicitly internal rather than client-facing", async () => {
    const page = await readSurface("apps/web/src/app/[locale]/page.tsx");

    expect(page).toMatch(/Internal engineering environment/);
    expect(page).toMatch(/بيئة هندسية داخلية/);
  });
});

describe("brand assets stay inside their approved supply point (FR-004, SC-006)", () => {
  it("keeps no duplicate mark in the application public directory", async () => {
    const { existsSync } = await import("node:fs");

    expect(
      existsSync(`${repositoryRoot}apps/web/public/brand`),
      "a duplicate brand supply point has reappeared under apps/web/public",
    ).toBe(false);
  });

  it("references no hand-written public brand path", async () => {
    for (const surface of shellSurfaces) {
      const contents = await readSurface(surface);

      expect(
        contents.includes('"/brand/'),
        `${surface} references a public brand path instead of the package`,
      ).toBe(false);
    }
  });
});

describe("no third-party asset host is referenced (FR-001, SC-002)", () => {
  it("declares every font from the repository's own package", async () => {
    const globals = await readSurface("apps/web/src/app/globals.css");
    const fonts = await readFile(
      `${repositoryRoot}packages/brand/assets/fonts/fonts.css`,
      "utf8",
    );

    expect(globals).toContain("@lexgate/brand/fonts.css");
    for (const source of [globals, fonts]) {
      expect(source).not.toMatch(/https?:\/\//);
      expect(source).not.toMatch(/fonts\.googleapis\.com/);
      expect(source).not.toMatch(/fonts\.gstatic\.com/);
    }
  });
});
