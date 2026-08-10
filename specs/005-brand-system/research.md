# Research: Brand System Implementation

No `NEEDS CLARIFICATION` marker survived specification: LG-BRAND-001 is approved and decides every brand question. The research below resolves the remaining _engineering_ choices.

## R1 — Direction of token generation

**Decision**: TypeScript is authoritative; CSS is generated from it and committed; a test asserts the committed CSS matches a fresh generation.

**Rationale**: It gives one definition, static types, and — critically — an automated contradiction check. FR-003 demands that representations cannot disagree; only a generated-and-verified artifact makes that enforceable rather than aspirational. Committing the generated stylesheet keeps consumers on a plain `@import` with no build step.

**Alternatives considered**

- _CSS authoritative, TS derived_: would require parsing CSS to recover types, producing weaker guarantees for the same effort.
- _TS exports `var(--lg-*)` references only_: eliminates duplication but leaves no way to read a real value programmatically, and leaves the stylesheet itself untested.
- _A neutral JSON source generating both_: an extra artifact and an extra generation step, with no benefit over a typed source that is already the repository's idiom.

## R2 — How self-hosted typefaces are declared

**Decision**: `@font-face` declarations in a package-level `fonts.css`, exported from `packages/brand` and imported alongside `tokens.css`.

**Rationale**: Keeps the brand package framework-neutral, matching `ARC-MOD-001` and the constitution's separation rule. Any future consumer — a document renderer, an email template, a design-system preview — can use the same stylesheet. It also mirrors the existing `tokens.css` import, so there is one pattern to learn.

**Alternatives considered**

- _`next/font/local`_: gives automatic preload hints and a zero-layout-shift guarantee, but binds the brand system to Next.js and makes the package unusable outside the web application. The performance benefit is not claimed by this feature, so the coupling is not justified.
- _A third-party font CDN_: prohibited by FR-001, and it would leak reader IP addresses to a third party — unacceptable for a law firm's surface.

## R3 — Selecting a typeface for the right script

**Decision**: Ordered family stacks bound to typographic role tokens, selected by `:lang(ar)`.

**Rationale**: `:lang()` follows the semantic language of the content, so an Arabic fragment inside an English page is still typeset with an Arabic face. Keying off `dir` or a body class would get the page right and the fragment wrong. Listing the opposite-script approved family before any generic means a mixed Arabic/Latin string resolves per glyph across approved faces, which is the specification's stated edge case.

**Alternatives considered**

- _Direction-based or class-based selection_: fails for mixed-language fragments.
- _One superfamily for both scripts_: no approved family covers both, and LG-BRAND-001 assigns distinct families per script.
- _`unicode-range` splitting_: achieves per-glyph routing but hard-codes script ranges into the brand package, duplicating information the font subsets already carry.

## R4 — Supplying curated marks

**Decision**: Export marks from the package and import them as modules; delete the application's public copy.

**Rationale**: One supply point, enforced by construction rather than by convention. The bundler fingerprints the emitted asset, and an unreferenced mark cannot linger unnoticed in a public directory. `transpilePackages` already includes `@lexgate/brand`, so no new build configuration is needed.

**Alternatives considered**

- _Keep the public copy and delete the package copy_: contradicts LG-BRAND-001's asset-provenance section, which names `packages/brand` as the supply point.
- _Copy assets into the application at build time_: reintroduces duplication with an extra moving part.

## R5 — Making provenance verifiable

**Decision**: A checksum manifest with a test that recomputes each digest from the committed file.

**Rationale**: A prose provenance table records intent; a digest detects a substituted or edited vector. LG-BRAND-001 forbids altering approved geometry and forbids unapproved derivatives, and a digest is the only mechanism that actually catches either.

**Alternatives considered**

- _Prose table only_ (the current state): documents provenance but cannot detect alteration.
- _Committing the full 31 MB source bundle for byte comparison_: permanent repository weight, including caches and a nested archive, for assets that are never built or served. Recorded as decision D-007.

## R6 — Whether an accessibility regression is detectable

**Finding**: The repository already runs `@axe-core/playwright` with the WCAG A/AA tag set against both locale shells, so the harness for FR-007 exists and needs extending rather than building.

**Consequence**: Brand-specific browser assertions — computed family per locale, focus visibility, 200% text, and the absence of any third-party asset request — are added to the same production-equivalent run, reusing the established tag set rather than introducing a second accessibility mechanism.
