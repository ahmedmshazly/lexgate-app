# Quickstart: Validating the Brand System Implementation

How to prove this feature works end to end. See [plan.md](plan.md) for design decisions and [contracts/brand-package.md](contracts/brand-package.md) for the package surface.

## Prerequisites

```sh
pnpm install
```

No database, service, or provider is needed. This feature is presentation-only, so `pnpm services:up` and `DATABASE_URL` are irrelevant to the checks below — unlike the repository-wide gate, which still needs them.

## 1. Token single source of truth

```sh
pnpm --filter @lexgate/brand test
```

**Expected**: the parity test regenerates the stylesheet from the authoritative token record and finds it byte-identical to the committed file, and every token named in LG-BRAND-001 is present.

**To see it fail honestly**: edit a value in the generated `tokens.css` by hand. The test fails, because the stylesheet no longer matches its source. Revert.

## 2. Provenance

```sh
pnpm --filter @lexgate/brand test
```

**Expected**: every curated mark and typeface has a manifest entry whose recomputed SHA-256 matches the committed file, every entry names its approved source, and every typeface names a licence permitting self-hosting.

**To see it fail honestly**: append a byte to a committed asset. The digest no longer matches and the test fails, which is exactly the substitution LG-BRAND-001 forbids. Revert.

## 3. Typography in both languages

```sh
pnpm --filter @lexgate/web dev
```

Open `http://localhost:3000/en` and `http://localhost:3000/ar`.

**Expected**:

- English interface text renders in the approved English interface family; Arabic in the approved Arabic one.
- Neither shell falls back to a generic system font.
- The Arabic shell keeps `dir="rtl"` and `lang="ar"`; nothing is visually mirrored to fake direction.
- The browser network panel shows **no** request to any host other than the application's own origin.

Confirm the computed family in devtools rather than judging by eye — two of the approved families are visually close at small sizes.

## 4. Accessibility and bilingual browser evidence

```sh
pnpm build && pnpm e2e
```

**Expected**: the brand suite passes against a production-equivalent build, covering zero axe WCAG A/AA violations on both locale shells, an approved computed family per locale, a visible focus treatment, readable content at 200% text size, and no third-party asset request.

`pnpm e2e` runs against a production build, so run `pnpm build` first or the suite validates stale output.

## 5. No duplicate supply point

```sh
test ! -d apps/web/public/brand && echo "no application-local brand copy"
```

**Expected**: the directory is gone. Marks are consumed from `@lexgate/brand` as modules.

## 6. Full repository gate

```sh
pnpm services:up
set -a; . ./.env; set +a
pnpm verify:full
```

**Expected**: format, documentation, lint, types, every package suite, production build, and the browser suite all pass. `DATABASE_URL` must be exported — the database integration suites read it directly and do not load `.env` themselves.

## What this feature does not prove

No release gate is closed. G1, ODR-003, ODR-004, and G2 remain blocked pending their accountable reviewers. No marketing claim, testimonial, case study, or lawyer profile is introduced; those stay blocked by ODR-002. Passing every check above means the approved brand system is correctly implemented, and nothing more.
