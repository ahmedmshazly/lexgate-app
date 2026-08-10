/**
 * The shape of the curated-asset provenance manifest.
 *
 * LG-BRAND-001 forbids altering approved vector geometry and forbids
 * unapproved derivatives. A prose table records that intent; a digest is what
 * actually detects an edited or substituted asset.
 */
export type CuratedAsset = Readonly<{
  /** Repository path, relative to the package root. */
  file: string;
  /** The approved file in the brand source bundle this was taken from. */
  source: string;
  /** SHA-256 of the committed file. */
  sha256: string;
  /** Intended context, quoted from LG-BRAND-001. */
  use: string;
  /** Required for a redistributed typeface; null for a firm-owned mark. */
  licence: string | null;
}>;

export type ProvenanceManifest = Readonly<{
  assets: readonly CuratedAsset[];
}>;
