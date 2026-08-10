# Contract: `@lexgate/brand` public surface

`packages/brand` is the single supply point for approved brand material, per LG-BRAND-001's asset-provenance section. This contract defines what it exposes and what consumers may rely on. It is an internal workspace contract; the package is private and unpublished.

## Exports

| Export         | Kind       | Purpose                                                                                  |
| -------------- | ---------- | ---------------------------------------------------------------------------------------- |
| `./tokens`     | TypeScript | The authoritative typed token record. The source of every brand value.                   |
| `./tokens.css` | Stylesheet | Custom-property declarations, **generated** from `./tokens`. Never hand-edited.          |
| `./fonts.css`  | Stylesheet | `@font-face` declarations for the five approved families, referencing committed `woff2`. |
| `./assets/*`   | Asset      | Curated marks, consumed as bundler modules rather than public paths.                     |
| `.`            | TypeScript | Package index re-exporting the typed token surface.                                      |

## Guarantees to consumers

1. **One definition per value.** A token read through `./tokens` and the corresponding custom property from `./tokens.css` resolve to the identical value. This is enforced by a parity test, not by convention.
2. **Complete coverage.** Every token named in LG-BRAND-001 is present in `./tokens`.
3. **Self-contained.** Importing `./fonts.css` or `./tokens.css` causes no request to any host outside the application's own origin.
4. **Legible degradation.** Every typographic role token terminates in a generic family of the correct script, so a failed face load never leaves text unreadable.
5. **Verifiable provenance.** Every asset reachable through `./assets/*`, and every font file referenced by `./fonts.css`, has a manifest entry whose SHA-256 matches the committed file.
6. **Framework neutrality.** Nothing in the package imports a framework, a provider SDK, or a runtime dependency. It is consumable by any bundler or renderer.

## Consumer obligations

- Obtain brand values from this package. Do not hand-copy a colour, radius, or family name into another surface; a copied value is invisible to the parity test and will drift.
- Do not add an application-local copy of a curated asset. The duplicate becomes a second, unverified supply point.
- Do not edit `tokens.css`. It is generated; an edit is overwritten and fails the parity test.
- Do not alter approved vector geometry, or add a derivative mark, without amending LG-BRAND-001 first.
- Where a brand colour carries meaning, reinforce it with text, icon, or pattern. Colour alone is prohibited by LG-BRAND-001 and by the accessibility requirement.

## Stability

The token record's shape is stable within M0. Adding a token is additive and non-breaking. Removing or renaming a token, or changing an approved value, requires amending LG-BRAND-001 first, because this package implements that document and holds no authority to decide brand questions itself.
