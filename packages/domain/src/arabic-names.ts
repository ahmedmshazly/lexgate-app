/**
 * Arabic-aware name normalization and componentization.
 *
 * Framework-free and side-effect-free. This is the correctness floor for
 * conflict candidate detection: two spellings of the same name must compare
 * equal, or a real conflict is missed.
 *
 * Nothing here decides anything. It prepares names for comparison; the
 * decision of what a comparison means belongs to conflict-candidates, and the
 * decision of what to do about it belongs to a human.
 */

/**
 * Arabic orthography admits several valid renderings of what a writer
 * considers the same spelling. An exact string comparison treats these as
 * different names, which is the missed-conflict path.
 */
const ALEF_VARIANTS = /[أإآٱ]/g; // أ إ آ ٱ
const ALEF = "ا"; // ا
const TA_MARBUTA = /ة/g; // ة
const HA = "ه"; // ه
const ALEF_MAKSURA = /ى/g; // ى
const YA = "ي"; // ي
/** Tashkeel (diacritics) and the Quranic annotation range. */
const TASHKEEL = /[ً-ْٰۖ-ۭ]/g;
/** Tatweel (kashida), a purely decorative elongation. */
const TATWEEL = /ـ/g;

const ARABIC_SCRIPT = /[؀-ۿ]/;

/** Honorifics carry no identifying information and appear inconsistently. */
const HONORIFICS = new Set([
  "استاذ",
  "مستشار",
  "دكتور",
  "شيخ",
  "سيد",
  "سيده",
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
  "counselor",
  "counsellor",
  "eng",
]);

/**
 * Words that begin with the article's letters but are not articled. Stripping
 * ال from الله would leave له, which is a different word entirely.
 */
const ARTICLE_EXCEPTIONS = new Set(["الله"]);

/** Shortest stem left after removing ال before the removal is unsafe. */
const MIN_ARTICLE_STEM = 3;

/**
 * Removes the Arabic definite article ال from a token.
 *
 * Family and tribal names appear with and without it — الشريف and شريف are the
 * same name — so leaving it in place is a missed-conflict path. It is removed
 * per token rather than across the string, and only when a real stem remains,
 * because over-eager stripping corrupts short words.
 */
const stripArabicArticle = (token: string): string => {
  if (ARTICLE_EXCEPTIONS.has(token)) return token;
  if (!token.startsWith("ال")) return token;

  const stem = token.slice(2);
  return stem.length >= MIN_ARTICLE_STEM ? stem : token;
};

export const containsArabicScript = (value: string): boolean =>
  ARABIC_SCRIPT.test(value);

/**
 * Folds a name to a comparable form.
 *
 * Arabic: unifies alef, ta marbuta, and alef maksura variants, and strips
 * diacritics and tatweel. Latin: lowercases and strips punctuation. Both:
 * collapses whitespace and removes the definite article, which appears
 * with and without a separator and in several Latin renderings.
 */
export const normalizeNameText = (value: string): string => {
  let text = value.normalize("NFKC").trim();

  text = text
    .replace(TASHKEEL, "")
    .replace(TATWEEL, "")
    .replace(ALEF_VARIANTS, ALEF)
    .replace(TA_MARBUTA, HA)
    .replace(ALEF_MAKSURA, YA);

  text = text.toLowerCase();
  // Latin renderings of the definite article: Al-Sharif, El Sharif, al sharif.
  text = text.replace(/\b(al|el)[\s-]+/g, "");
  // Punctuation and separators, but never the Arabic letters themselves.
  text = text.replace(/[.,'"`’()[\]{}\\/_-]+/g, " ");

  return text
    .split(/\s+/)
    .map(stripArabicArticle)
    .filter((token) => token.length > 0)
    .join(" ")
    .trim();
};

/**
 * Splits a name into its parts.
 *
 * Egyptian naming commonly runs given → father → grandfather → family, so a
 * part's position carries meaning. Compound theophoric names such as
 * `عبد الله` are joined back together, because writing them spaced or joined
 * is a spelling choice rather than two separate parts — treating them as two
 * would shift every later part by one position and destroy the comparison.
 */
const COMPOUND_PREFIXES = new Set(["عبد", "ابو", "أبو", "ام", "بن", "ابن"]);

export const splitNameParts = (value: string): readonly string[] => {
  const normalized = normalizeNameText(value);
  if (normalized.length === 0) return [];

  const rawParts = normalized.split(" ").filter((part) => part.length > 0);
  const parts: string[] = [];

  for (let index = 0; index < rawParts.length; index += 1) {
    const part = rawParts[index] as string;
    if (HONORIFICS.has(part)) continue;

    const next = rawParts[index + 1];
    if (COMPOUND_PREFIXES.has(part) && next !== undefined) {
      parts.push(`${part}${next}`);
      index += 1;
      continue;
    }
    parts.push(part);
  }

  return parts;
};

/**
 * Latin renderings that denote the same Arabic given name.
 *
 * A curated table rather than a phonetic algorithm. Soundex and Metaphone are
 * tuned for English phonology and perform poorly on Arabic, so an unreviewed
 * algorithm would produce confident nonsense. This table is incomplete by
 * construction — its gaps are missed conflicts — but the gaps are visible and
 * correctable, which an algorithm's are not.
 */
const TRANSLITERATION_GROUPS: readonly (readonly string[])[] = [
  ["mohamed", "mohammed", "muhammad", "mohammad", "mohamad", "محمد"],
  ["ahmed", "ahmad", "احمد"],
  ["mahmoud", "mahmud", "محمود"],
  ["youssef", "yusuf", "yousef", "yousif", "joseph", "يوسف"],
  ["ali", "aly", "علي"],
  ["hassan", "hasan", "حسن"],
  ["hussein", "hussain", "husain", "حسين"],
  ["ibrahim", "ibraheem", "ابراهيم"],
  ["mariam", "maryam", "mariem", "مريم"],
  ["fatma", "fatima", "fatmah", "فاطمه"],
  ["aisha", "aysha", "عائشه", "عايشه"],
  ["khaled", "khalid", "خالد"],
  ["omar", "umar", "عمر"],
  ["salem", "salim", "saleem", "سالم"],
  ["said", "saeed", "sayed", "سعيد"],
  ["abdullah", "abdallah", "عبدالله"],
  ["sharif", "shareef", "شريف"],
  ["nile", "النيل", "نيل"],
];

const CANONICAL_BY_VARIANT = new Map<string, string>();
for (const group of TRANSLITERATION_GROUPS) {
  const canonical = group[0] as string;
  for (const variant of group) {
    CANONICAL_BY_VARIANT.set(normalizeNameText(variant), canonical);
  }
}

/** Maps a name part onto a canonical key shared by its known renderings. */
export const canonicalNamePart = (part: string): string => {
  const normalized = normalizeNameText(part);
  return CANONICAL_BY_VARIANT.get(normalized) ?? normalized;
};

export const canonicalNameParts = (value: string): readonly string[] =>
  splitNameParts(value).map(canonicalNamePart);

export type NamePartMatch = "exact" | "transliteration" | "none";

/** How two name parts correspond, if at all. */
export const compareNameParts = (
  left: string,
  right: string,
): NamePartMatch => {
  const leftNormalized = normalizeNameText(left);
  const rightNormalized = normalizeNameText(right);
  if (leftNormalized.length === 0 || rightNormalized.length === 0) {
    return "none";
  }
  if (leftNormalized === rightNormalized) return "exact";

  return canonicalNamePart(left) === canonicalNamePart(right)
    ? "transliteration"
    : "none";
};
