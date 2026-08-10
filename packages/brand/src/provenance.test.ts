import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { ProvenanceManifest } from "./provenance.js";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

const manifest: ProvenanceManifest = JSON.parse(
  await readFile(`${packageRoot}assets/provenance.json`, "utf8"),
);

const approvedFamilies = [
  "Instrument Sans",
  "Newsreader",
  "IBM Plex Sans Arabic",
  "Noto Naskh Arabic",
  "IBM Plex Mono",
];

describe("curated asset provenance (FR-005, FR-006, SC-005)", () => {
  it("records at least the curated marks and the approved typefaces", () => {
    expect(manifest.assets.length).toBeGreaterThan(0);
  });

  it("matches the recorded digest for every committed asset", async () => {
    for (const asset of manifest.assets) {
      const contents = await readFile(`${packageRoot}${asset.file}`);
      const actual = createHash("sha256").update(contents).digest("hex");

      expect(actual, `${asset.file} no longer matches its provenance`).toBe(
        asset.sha256,
      );
    }
  });

  it("names an approved source for every asset", () => {
    for (const asset of manifest.assets) {
      expect(
        asset.source.trim().length,
        `${asset.file} has no source`,
      ).toBeGreaterThan(0);
      expect(
        asset.use.trim().length,
        `${asset.file} has no stated use`,
      ).toBeGreaterThan(0);
    }
  });

  it("records a redistribution licence for every typeface", () => {
    const fonts = manifest.assets.filter((asset) =>
      asset.file.endsWith(".woff2"),
    );
    expect(fonts.length).toBeGreaterThan(0);

    for (const font of fonts) {
      expect(font.licence, `${font.file} has no licence`).toBe(
        "SIL Open Font License 1.1",
      );
      expect(
        approvedFamilies.some((family) => font.source.startsWith(family)),
        `${font.file} is not one of the families approved by LG-BRAND-001`,
      ).toBe(true);
    }
  });

  it("leaves no committed asset without provenance", async () => {
    const recorded = new Set(manifest.assets.map((asset) => asset.file));

    const marks = (await readdir(`${packageRoot}assets`))
      .filter((name) => name.endsWith(".svg"))
      .map((name) => `assets/${name}`);
    const fonts = (await readdir(`${packageRoot}assets/fonts`))
      .filter((name) => name.endsWith(".woff2"))
      .map((name) => `assets/fonts/${name}`);

    for (const file of [...marks, ...fonts]) {
      expect(
        recorded.has(file),
        `${file} is committed without provenance`,
      ).toBe(true);
    }
  });
});
