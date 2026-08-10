# Implementation Plan: Brand System Implementation

## Context and requirement coverage

**Canonical requirement IDs**: `I18N-RTL-001` (Arabic and RTL foundation, P0, M0, owner design, sourced from LG-BRAND-001). `UX-PRT-001` appears as a boundary only: this feature adds no client projection and must not weaken the existing one.

**Source and design authority**: [`docs/brand/BRAND_SYSTEM.md`](../../docs/brand/BRAND_SYSTEM.md) (LG-BRAND-001 v1.0.0, Approved for M0 implementation) is controlling. Every colour, typeface, mark, and safeguard implemented here is quoted from it. This plan decides _how_, never _what_.

**Release gate**: M0. No gate is closed. G1, ODR-003, ODR-004, and G2 are untouched. ODR-002 continues to block public marketing content, so no such content is added.

**Data classification**: Internal. No personal, client, matter, financial, or evidentiary data is read, written, or rendered.

**Affected packages and routes**: `packages/brand` (tokens, curated assets, typography, provenance); `packages/ui` (consumes tokens only); `apps/web` (`src/app/globals.css`, `src/components/portal-mark.tsx`, removal of `public/brand/`); `tests/e2e`. Both `/[locale]` shells are affected.

**Reviewed current implementation**

- `packages/brand/src/tokens.css` declares 17 custom properties; `packages/brand/src/tokens.ts` declares 4 literal values. The two overlap and can drift. `tokens.ts` currently has no consumer.
- `packages/brand/package.json` exports only `./tokens.css` and `./tokens`. The curated marks and the newly supplied typefaces are not exported, so they cannot be consumed as the approved supply point requires.
- `apps/web/src/app/globals.css` sets `font-family: Arial, "IBM Plex Sans Arabic", sans-serif`. None of the five approved families is active, and Arial is not an approved family.
- `apps/web/public/brand/portal-gold.svg` duplicates `packages/brand/assets/portal-gold.svg`. `portal-mark.tsx` renders the application-local copy by string path.
- `packages/brand/assets/fonts/` holds the five approved families as subset `woff2` with a generated `fonts.css` and a licence record, but nothing imports them.
- `packages/brand` has no `src/index.ts` and no tests.

**Scope exclusions**: no new visual design, no route, no persistence, no provider, no authentication, no personal data, no marketing content, no change to authorization or records behaviour.

**Approved exceptions**: none requested.

## Bounded design

### Decision 1 — TypeScript is the authoritative token source; CSS is generated

`packages/brand/src/tokens.ts` becomes the single definition of every brand token named in LG-BRAND-001, as a typed frozen record. `packages/brand/src/tokens.css` becomes a **generated artifact** produced from it by a small script in the package, and remains committed so consumers keep a plain CSS import with no build step.

A unit test regenerates the stylesheet from the token source and asserts the committed file matches byte-for-byte. That is the automated parity check FR-003 requires: the two representations cannot silently disagree, because disagreement fails a test.

_Alternatives rejected_: CSS as the source would require parsing CSS to type it, giving weaker guarantees. TS exporting `var(--lg-*)` strings instead of values would remove duplication but leaves no way to obtain a real value programmatically, and still leaves the CSS untested.

### Decision 2 — Typography is supplied as package CSS, not through the framework's font loader

The approved families are imported through `@lexgate/brand/fonts.css`, a package export sitting beside `tokens.css`, which declares `@font-face` for each family with relative `url()` references to the committed `woff2` files.

The framework's own local-font loader is deliberately **not** used. It would bind the brand system to Next.js, contradicting `ARC-MOD-001` and the constitution's rule that framework dependencies stay outside shared rules, and would make the brand package unusable by any non-Next consumer such as a future document renderer or email template. The cost is that automatic preload hints are not generated; this is accepted because `font-display: swap` plus a same-script fallback already satisfies the specification's readability requirement, and no measured performance claim is being made.

### Decision 3 — Typographic roles are tokens; script selection is semantic

Role tokens (`--lg-font-ui`, `--lg-font-display`, `--lg-font-mono`) resolve to ordered family stacks. Ordering is per script, and selection is driven by `:lang(ar)` rather than by direction or a class, so the correct family follows the semantic language of the content — including for an Arabic fragment inside an English page.

Each stack lists the approved family, then the other approved family of the same role in the opposite script, then a generic of the same script. A mixed Arabic/Latin string therefore resolves per glyph across approved families before ever reaching a system font, which is the edge case the specification calls out. If a face fails to load, text degrades to a declared same-script generic rather than disappearing.

### Decision 4 — Curated assets are consumed as modules, not as public paths

`packages/brand` gains an `./assets/*` export. `portal-mark.tsx` imports the mark as a module so the bundler emits and fingerprints it, and `apps/web/public/brand/` is deleted. This makes the brand package the only supply point, removes the duplicate, and means an unreferenced mark cannot silently rot in the application's public directory.

### Decision 5 — Provenance is a checksum manifest, not prose

`packages/brand/assets/provenance.json` records, for every curated mark and typeface, its filename, its approved source filename in the brand bundle, its SHA-256, and its licence where applicable. A unit test recomputes each digest from the committed file and fails on any mismatch, so alteration or substitution of an approved asset is detectable rather than merely discouraged.

The 31 MB source bundle itself is not committed; the manifest carries the verifiable link to it. This is recorded as decision D-007.

### Boundaries, failure, and rollback

Domain, application, and persistence layers are untouched; `packages/brand` holds no logic beyond token definition and generation. There is no command, query, migration, projection, outbox event, authorization path, or external contract in this feature, so idempotency and concurrency do not arise.

Failure behaviour is limited to asset loading: a missing typeface degrades to a declared same-script generic; a missing mark renders its empty accessible name without breaking layout, since the mark is decorative and already carries `alt=""`. Rollback is a revert of the commit, with no data or schema consequence. Manual fallback is not required because no operational workflow depends on this feature.

### Arabic and RTL implications

Arabic is a first-class surface. Direction and language remain semantic (`lang` and `dir` attributes), never visual reversal, so the existing locale shell behaviour is preserved. Typography selection keys off `:lang`, so an Arabic name rendered inside an English page still receives an Arabic face. Font subsets are narrow by design, which is why the per-glyph fallback ordering in Decision 3 is a correctness requirement rather than an optimisation.

## Test and evidence design

| Layer                                  | Target behaviour                                                                                                                                                                                | Prohibited behaviour                                                                                    | Fixtures and location                                                                                        | Command                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Static, documentation, type, lint      | Controlled documentation, strict types, formatting.                                                                                                                                             | An unformatted or type-unsafe brand surface.                                                            | Repository-wide.                                                                                             | `pnpm format:check && pnpm docs:validate && pnpm lint && pnpm typecheck` |
| Unit — token parity                    | Regenerating the stylesheet from the token source reproduces the committed file exactly; every token named in LG-BRAND-001 is present.                                                          | A token defined twice, or present in one representation only.                                           | `packages/brand/src/tokens.test.ts`, deterministic, no I/O beyond reading two committed files.               | `pnpm --filter @lexgate/brand test`                                      |
| Unit — provenance                      | Every manifest entry's recomputed SHA-256 matches the committed asset; every entry names a source; every typeface names a licence.                                                              | An asset present without provenance, or a digest that no longer matches.                                | `packages/brand/src/provenance.test.ts` over the committed asset files.                                      | `pnpm --filter @lexgate/brand test`                                      |
| Unit — prohibited content              | The brand surface introduces no marketing claim, testimonial, case study, outcome language, or lawyer profile.                                                                                  | Any ODR-002-gated content reaching a brand or shell surface.                                            | Extends the existing boundary suite in `packages/testing/src/`.                                              | `pnpm --filter @lexgate/testing test`                                    |
| Browser/E2E, WCAG A/AA, locale and RTL | Both shells expose zero axe violations; each locale computes an approved family for interface text; focus stays visible; content survives 200% text size; no third-party asset request is made. | A generic system font in either locale; any external font or asset host; a new accessibility violation. | `tests/e2e/brand.spec.ts`, production-equivalent build, reusing the existing `AxeBuilder` WCAG A/AA tag set. | `pnpm e2e`                                                               |

Two evidence items are **not** automatable and are recorded rather than asserted by a test:

- **Manual accessibility assessment (FR-011)**: keyboard traversal and screen-reader output exercised in both languages, plus narrow-viewport reflow. The constitution is explicit that an automated scan complements but never replaces this. The outcome, including anything found, is written into the verification record. An automated pass alone is not accessibility evidence.
- **Contrast measurement (FR-013, SC-009)**: the token pairings the shells actually use are measured against the WCAG AA thresholds. This is partly automatable through the accessibility rule set, but pairings not present on a rendered surface are not covered by a scan and are measured directly from the token values.

**Layers genuinely not applicable**

- _Database, migration, integration, contract, provider_: the feature adds no persistence, no schema, no boundary crossing, and no provider. There is nothing to migrate or contract against. Asserting otherwise would be metric theatre.
- _Authorization, privacy, records, security-negative_: no protected object, personal data, record, or authorization path is introduced or altered. The existing foundation and gate-readiness boundary suites continue to run unchanged and would catch a regression.
- _Performance, resilience, backup/restore, incident, release validation_: no runtime service, data path, or operational surface changes, and the feature makes no performance claim. Self-hosting removes a third-party request rather than adding one.

Every test is deterministic and synthetic. The provenance and parity tests read only committed files, so they cannot flake. A retry never substitutes for a passing first attempt.

## Delivery and verification

**Phase 1 — token single source.** Author the authoritative token record and the generator, generate the stylesheet, and add the parity test. Test first: the parity test fails before the generator exists.

**Phase 2 — typography.** Add the `fonts.css` package export, the role tokens with per-script ordering, and the `:lang` selection. Replace the Arial declaration in the application.

**Phase 3 — assets and provenance.** Add the `./assets/*` export and the provenance manifest with its verification test, switch the mark component to a module import, and delete `apps/web/public/brand/`.

**Phase 4 — bilingual accessibility evidence.** Add the browser suite covering axe A/AA on both locales, computed families, focus visibility, 200% text, and the no-third-party-host assertion.

**Phase 5 — verification and convergence.** Record evidence, then run convergence until it reports no remaining gap.

**Rollout**: no feature flag. The change is presentation-only, fully reversible by revert, and carries no data or migration consequence, so a flag would add indirection without reducing risk.

**Independent review**: not required by the constitution for this risk tier. This feature touches no P0 authorization, records, privacy, legal-rule, provider, or AI control. The sponsor reviews it through the decision record.

**Release-gate evidence**: none produced and none claimed. This feature closes no gate.

**Completion commands**: `pnpm verify` for the repository gate, and `pnpm verify:full` because this is a material UI and delivery change requiring production build and browser validation. `specs/005-brand-system/verification.md` must record requirement coverage for FR-001–FR-010 and SC-001–SC-008, exact commands and results, residual risk, and an explicit statement that no release gate was closed and no ODR-002 content was introduced.
