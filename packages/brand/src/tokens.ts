/**
 * The authoritative definition of every brand token.
 *
 * `tokens.css` is GENERATED from this record by `generate-tokens-css.ts`.
 * Never hand-edit the stylesheet: a parity test regenerates it and fails on
 * any difference, which is what keeps the two representations from drifting.
 *
 * Every value here is quoted from `docs/brand/BRAND_SYSTEM.md` (LG-BRAND-001).
 * This package implements that document and holds no authority to decide a
 * brand question itself.
 */

export type BrandTokenGroup = "color" | "radius" | "font";

export type BrandTokenDefinition = Readonly<{
  value: string;
  group: BrandTokenGroup;
}>;

/**
 * Latin and Arabic each name their own approved family first, then the
 * approved family of the opposite script, then a generic of the correct
 * script. The opposite-script family sits before the generic deliberately: a
 * mixed Arabic/Latin string then resolves per glyph across approved faces
 * before it can ever reach a system font. The trailing generic is what makes
 * a failed face load degrade legibly instead of unreadably.
 */
const latinUi = `"Instrument Sans", "IBM Plex Sans Arabic", system-ui, sans-serif`;
const arabicUi = `"IBM Plex Sans Arabic", "Instrument Sans", system-ui, sans-serif`;
const latinDisplay = `"Newsreader", "Noto Naskh Arabic", Georgia, serif`;
const arabicDisplay = `"Noto Naskh Arabic", "Newsreader", Georgia, serif`;
const mono = `"IBM Plex Mono", ui-monospace, monospace`;

export const brandTokens = {
  "navy-950": { value: "#0a1524", group: "color" },
  "navy-900": { value: "#0e1c30", group: "color" },
  "navy-800": { value: "#14263f", group: "color" },
  "gold-700": { value: "#a07c2a", group: "color" },
  "gold-600": { value: "#b8913c", group: "color" },
  "gold-300": { value: "#dcc287", group: "color" },
  ink: { value: "#16171b", group: "color" },
  slate: { value: "#4a4e56", group: "color" },
  ivory: { value: "#f7f3ea", group: "color" },
  "warm-white": { value: "#fcfaf6", group: "color" },
  border: { value: "#e4ded2", group: "color" },
  confidential: { value: "#59304f", group: "color" },
  restricted: { value: "#42284a", group: "color" },
  success: { value: "#2f5d4a", group: "color" },
  warning: { value: "#8a6a22", group: "color" },
  critical: { value: "#7a2b2b", group: "color" },
  radius: { value: "0.5rem", group: "radius" },
  "font-ui": { value: latinUi, group: "font" },
  "font-display": { value: latinDisplay, group: "font" },
  "font-mono": { value: mono, group: "font" },
  "font-ui-arabic": { value: arabicUi, group: "font" },
  "font-display-arabic": { value: arabicDisplay, group: "font" },
} as const satisfies Record<string, BrandTokenDefinition>;

export type BrandTokenName = keyof typeof brandTokens;

/** The custom property a token is published as. */
export const customPropertyName = (name: BrandTokenName): string =>
  `--lg-${name}`;

/** The resolved value of a token, for a programmatic consumer. */
export const brandTokenValue = (name: BrandTokenName): string =>
  brandTokens[name].value;
