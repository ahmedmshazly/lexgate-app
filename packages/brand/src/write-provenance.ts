import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { CuratedAsset } from "./provenance.js";

/**
 * Regenerates the provenance manifest. Run with `pnpm provenance:generate`
 * after admitting or replacing an approved asset.
 *
 * Generating the manifest is tautological at the moment it runs; its value is
 * that any LATER edit or substitution of a committed asset no longer matches
 * its recorded digest, which is what the provenance test detects.
 */
const assetsDirectory = fileURLToPath(new URL("../assets/", import.meta.url));
const manifestPath = fileURLToPath(
  new URL("../assets/provenance.json", import.meta.url),
);

/** Marks are firm-owned; their sources are recorded in assets/README.md. */
const markSources: Record<string, { source: string; use: string }> = {
  "portal-navy.svg": {
    source: "archive/01_Logos/SVG/LexGate_Mark-Portal_Navy.svg",
    use: "Default light-surface Portal mark",
  },
  "portal-gold.svg": {
    source: "archive/01_Logos/SVG/LexGate_Mark-Portal_Gold.svg",
    use: "Controlled dark-surface / accent use",
  },
  "lockup-horizontal.svg": {
    source: "archive/01_Logos/SVG/LexGate_Lockup-Horizontal_Navy-on-Ivory.svg",
    use: "Primary full lockup",
  },
};

/** The five families approved by LG-BRAND-001, all SIL OFL 1.1. */
const fontFamilies: readonly { prefix: string; family: string; use: string }[] =
  [
    {
      prefix: "instrument-sans",
      family: "Instrument Sans",
      use: "Application UI",
    },
    {
      prefix: "newsreader",
      family: "Newsreader",
      use: "English display / editorial",
    },
    {
      prefix: "ibm-plex-sans-arabic",
      family: "IBM Plex Sans Arabic",
      use: "Arabic UI",
    },
    {
      prefix: "noto-naskh-arabic",
      family: "Noto Naskh Arabic",
      use: "Arabic display / editorial",
    },
    { prefix: "ibm-plex-mono", family: "IBM Plex Mono", use: "Metadata" },
  ];

const openFontLicence = "SIL Open Font License 1.1";

const digest = async (path: string): Promise<string> =>
  createHash("sha256")
    .update(await readFile(path))
    .digest("hex");

const describeFont = (fileName: string): { family: string; use: string } => {
  // Longest prefix wins: "ibm-plex-sans-arabic" must beat "ibm-plex-mono".
  const match = [...fontFamilies]
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((candidate) => fileName.startsWith(candidate.prefix));
  if (!match) {
    throw new Error(
      `${fileName} does not belong to a family approved by LG-BRAND-001.`,
    );
  }
  return { family: match.family, use: match.use };
};

const assets: CuratedAsset[] = [];

for (const fileName of (await readdir(assetsDirectory)).sort()) {
  if (!fileName.endsWith(".svg")) continue;
  const mark = markSources[fileName];
  if (!mark) {
    throw new Error(`${fileName} has no recorded approved source.`);
  }
  assets.push({
    file: `assets/${fileName}`,
    source: mark.source,
    sha256: await digest(`${assetsDirectory}${fileName}`),
    use: mark.use,
    licence: null,
  });
}

const fontsDirectory = `${assetsDirectory}fonts/`;
for (const fileName of (await readdir(fontsDirectory)).sort()) {
  if (!fileName.endsWith(".woff2")) continue;
  const { family, use } = describeFont(fileName);
  assets.push({
    file: `assets/fonts/${fileName}`,
    source: `${family} (subset supplied by the approved font fetch)`,
    sha256: await digest(`${fontsDirectory}${fileName}`),
    use,
    licence: openFontLicence,
  });
}

await writeFile(
  manifestPath,
  `${JSON.stringify({ assets }, null, 2)}\n`,
  "utf8",
);
