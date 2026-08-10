import type { BrandTokenName } from "./tokens.js";
import { brandTokens, customPropertyName } from "./tokens.js";

/**
 * Renders the committed `tokens.css` from the authoritative token record.
 *
 * Output is deterministic: declaration order follows the record's insertion
 * order, so regenerating always reproduces the same bytes. The parity test
 * compares this output against the committed stylesheet, which is what makes
 * "one source of truth" enforceable rather than aspirational.
 */
export const generateTokensCss = (): string => {
  const names = Object.keys(brandTokens) as BrandTokenName[];
  const declarations = names.map(
    (name) => `  ${customPropertyName(name)}: ${brandTokens[name].value};`,
  );
  return [
    "/* GENERATED from tokens.ts by generate-tokens-css.ts. Do not edit. */",
    ":root {",
    ...declarations,
    "}",
    "",
  ].join("\n");
};
