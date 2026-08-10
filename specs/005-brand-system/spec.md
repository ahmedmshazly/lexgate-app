# Feature Specification: Brand System Implementation

**Requirement IDs:** I18N-RTL-001, UX-PRT-001 (boundary only)
**Risk tier:** P1, advancing the P0 requirement I18N-RTL-001
**Release / validation gate:** M0; no gate is closed by this feature. ODR-002 continues to block all public marketing content.
**Data classification:** Internal; no personal, client, matter, or financial data is involved
**Legal/privacy validation:** not required
**Feature owner:** Design
**Status:** draft — proposed for approval
**Input:** Implement the approved brand system (LG-BRAND-001) in code: activate the five specified self-hosted typefaces for English and Arabic, make brand tokens a single source of truth, expose curated marks and fonts from `packages/brand`, and remove the duplicated application-local asset copy.

## User outcome and scope

`docs/brand/BRAND_SYSTEM.md` (LG-BRAND-001, v1.0.0, **Approved for M0 implementation**) already records every brand decision: the Portal mark, the colour tokens, the five typefaces, the accessibility safeguards, and the asset-provenance rule that curated assets are exposed by `packages/brand`. The document is approved; the code does not yet implement it. This feature closes that gap and introduces **no new visual design decision**.

The measurable outcome: a person opening either the English or the Arabic shell sees the firm's specified typography and colour system rendered from the repository's own assets, with the Arabic surface receiving typography chosen for Arabic rather than a Latin fallback.

**Actors**: any reader of the application shell in either language; the brand owner, who must be able to verify that a rendered asset traces to an approved source; an engineer adding a future surface, who must have exactly one place to obtain a brand value.

**In scope**

- Activating the five approved typefaces, self-hosted, for the correct language and role.
- Establishing one authoritative definition of each brand token, consumed by both stylesheet and TypeScript users.
- Exposing the curated marks and typography from `packages/brand` as the single supply point.
- Removing the duplicate mark copy that currently lives inside the application.
- Recording verifiable provenance for every curated asset.
- Accessibility and bilingual evidence for the resulting shells.

**Explicit exclusions — this feature must not**

- Introduce, alter, or reinterpret any brand decision not already approved in LG-BRAND-001.
- Add public marketing copy, outcome or success claims, testimonials, case studies, or lawyer profiles. These remain blocked by ODR-002.
- Add a route, authentication, intake path, client-facing data surface, or any personal-data collection.
- Load any asset or typeface from a third-party host.
- Introduce a legal, privacy, security, or records behaviour change of any kind.
- Commit unlicensed marks or typefaces, or alter approved vector geometry.

**Dependencies**: LG-BRAND-001 as the controlling design authority; the supplied brand source bundle as the provenance origin.

**Affected languages and RTL surfaces**: both the English (LTR) and Arabic (RTL) shells. Arabic is a first-class surface, not a translation of the English one.

## User scenarios and acceptance criteria

### Scenario 1 — A reader sees the firm's own typography in their own language (Priority: P1)

**Preconditions**: The application shell is served in either supported language.

**Successful outcome**: Each language renders the typeface approved for it, supplied by the application itself.

1. **Given** the English shell, **when** it renders, **then** interface text uses the approved English interface typeface and no generic system fallback.
2. **Given** the Arabic shell, **when** it renders, **then** interface text uses the approved Arabic interface typeface, and the page keeps its right-to-left direction and semantic language.
3. **Given** either shell, **when** it loads, **then** no request is made to any third-party font or asset host.
4. **Given** a typeface fails to load, **when** the shell renders, **then** text remains readable in a declared fallback of the same script rather than disappearing or reflowing into an unreadable state.

### Scenario 2 — An engineer obtains a brand value from exactly one place (Priority: P1)

**Preconditions**: A brand colour, radius, or typeface is needed by a new or existing surface.

**Successful outcome**: One authoritative definition serves every consumer, so a stylesheet value and a programmatic value can never disagree.

1. **Given** a brand token defined once, **when** it is consumed as a style value and as a programmatic value, **then** both resolve to the identical value.
2. **Given** a token is changed at its source, **when** consumers are rebuilt, **then** every consumer reflects the change with no second edit.
3. **Given** a brand value named in LG-BRAND-001, **when** an engineer looks for it, **then** it is present in the authoritative set.

### Scenario 3 — The brand owner verifies that a rendered asset is an approved one (Priority: P2)

**Preconditions**: A curated mark or typeface is present in the repository.

**Successful outcome**: Each curated asset traces to a named approved source and can be checked for alteration.

1. **Given** any curated mark, **when** its provenance is inspected, **then** it names its source file and a verifiable content checksum.
2. **Given** a curated mark is altered, **when** provenance is verified, **then** the alteration is detectable.
3. **Given** a typeface is redistributed, **when** its licence is inspected, **then** the licence and its attribution are recorded.

### Scenario 4 — The shells remain accessible in both languages (Priority: P1)

**Preconditions**: The brand system is applied to both shells.

**Successful outcome**: Applying brand typography and colour does not reduce accessibility.

1. **Given** either shell, **when** it is scanned for accessibility violations, **then** none are reported.
2. **Given** a reader navigating by keyboard, **when** an interactive element receives focus, **then** the focus treatment is visible and distinguishable in both languages.
3. **Given** a reader who has enlarged text, **when** the shell renders at double size, **then** content stays readable without loss of function.
4. **Given** a reader who prefers reduced motion, **when** the shell renders, **then** no non-essential motion is presented.

### Edge cases

- A typeface subset omits a character present in a mixed Arabic/Latin string, so a name renders with inconsistent glyphs.
- Arabic and Latin text appear in the same line, requiring correct direction handling within one run.
- A curated asset is replaced with a visually similar but unapproved derivative.
- A brand value is duplicated by hand into a new surface instead of being consumed from the authoritative set, allowing silent drift.
- Colour alone is relied on to communicate a classification, which LG-BRAND-001 forbids without text, icon, or pattern reinforcement.

## Requirements

- **FR-001**: Every typeface named in LG-BRAND-001 MUST be served from the application's own origin. No brand asset or typeface may be requested from a third-party host. **Negative case**: a build that references an external font host fails. **Bilingual impact**: applies equally to Latin and Arabic families. **Evidence**: no external asset host appears in a rendered shell's requests.
- **FR-002**: Each supported language MUST render the typeface that LG-BRAND-001 assigns to it for interface, display, and metadata roles. **Negative case**: the Arabic surface rendering a Latin-only family, or either surface rendering a generic system fallback, is a defect. **Evidence**: rendered computed font family per locale.
- **FR-003**: Every brand token named in LG-BRAND-001 MUST have exactly one authoritative definition, from which both style and programmatic consumers derive. A second hand-maintained copy of any token value MUST NOT exist. **Negative case**: a token present in one representation and absent or different in another. **Evidence**: an automated check comparing the representations.
- **FR-004**: `packages/brand` MUST be the single supply point for curated marks and typography. An application-local duplicate of a curated asset MUST NOT exist. **Negative case**: the same mark existing both inside the application and in the brand package.
- **FR-005**: Every curated asset MUST record its approved source filename and a verifiable content checksum, so alteration or substitution is detectable. **Evidence**: a provenance record plus a check that recomputes and compares checksums.
- **FR-006**: Every redistributed typeface MUST record its licence and required attribution. **Negative case**: a typeface without a recorded licence permitting self-hosting.
- **FR-007**: Applying the brand system MUST NOT introduce an accessibility violation, and MUST preserve a visible, distinguishable focus treatment in both languages. **Negative case**: an automated scan reporting any violation on either shell.
- **FR-008**: Where a brand colour communicates meaning, that meaning MUST also be carried by text, icon, or pattern. **Negative case**: a classification distinguishable only by hue.
- **FR-009**: This feature MUST NOT introduce public marketing copy, outcome or success claims, testimonials, case studies, or lawyer profiles, which remain blocked by ODR-002. **Evidence**: a regression check asserting the prohibited-content boundary.
- **FR-010**: Semantic language and direction MUST be preserved. Right-to-left rendering MUST NOT be achieved by visual reversal of a left-to-right layout. **Evidence**: existing locale shell checks continue to pass.
- **FR-011**: Automated accessibility scanning MUST be complemented by a manual assessment covering keyboard traversal and screen-reader output in both languages, and by narrow-viewport reflow. An automated pass alone MUST NOT be presented as accessibility evidence. **Negative case**: completion claimed on a scan result with no manual assessment recorded. **Evidence**: a manual assessment record in the verification record, naming what was exercised and what was found.
- **FR-012**: Every content fragment whose language differs from its page MUST carry its own language attribute. **Negative case**: an Arabic fragment inside an English page with no language attribute, which both breaks typeface selection and fails WCAG 3.1.2. **Bilingual impact**: this is the mechanism script-appropriate typography depends on, not an optional refinement.
- **FR-013**: Every text and essential non-text pairing drawn from the approved palette MUST meet WCAG 2.2 AA contrast: 4.5:1 for body text, 3:1 for large text and for meaningful non-text elements including the focus treatment. **Negative case**: an approved colour pairing admitted without a measured ratio. **Evidence**: a contrast check over the token pairings the shells actually use.

### Key entities

- **Brand token**: one named, approved brand value — colour, radius, or typographic role — with a single authoritative definition and one or more derived representations.
- **Curated asset**: an approved mark or typeface admitted into the repository, carrying its source reference, checksum, intended use, and licence where applicable.
- **Typography role assignment**: the binding of a language and a purpose to one approved typeface.

## Non-functional and quality profile

| Test / evidence layer                                                    | Status and rationale                                                                                                                                                    | Acceptance evidence                                                                                    |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Static, documentation, type, and lint                                    | **Required** — controlled documentation, token consistency, and provenance are statically checkable.                                                                    | `pnpm format:check`, `pnpm docs:validate`, `pnpm lint`, `pnpm typecheck`                               |
| Unit/domain invariant and negative behavior                              | **Required** — token single-source, provenance checksum, and prohibited-content invariants are unit-testable.                                                           | Token parity, checksum verification, and prohibited-content tests                                      |
| Database, migration, integration, contract, or provider                  | **Not applicable** — this feature introduces no persistence, no migration, no contract, and no provider. It is presentation-layer only.                                 | None; rationale recorded here and in the verification record                                           |
| Authorization, privacy, records, and security-negative                   | **Not applicable to new behaviour** — no protected object, personal data, record, or authorization path is introduced or altered. The existing boundary tests continue. | Existing foundation and gate-readiness boundary suites remain green                                    |
| Browser/E2E, accessibility, locale, and RTL                              | **Required** — this is browser-facing work on a bilingual surface, which the constitution requires browser and automated accessibility evidence for.                    | Automated accessibility scan on both locale shells, keyboard focus traversal, and RTL rendering checks |
| Performance, resilience, backup/restore, incident, or release validation | **Not applicable** — no runtime service, data path, or operational surface changes. Self-hosting removes a third-party request rather than adding one.                  | None; rationale recorded here and in the verification record                                           |

**Measurable outcomes**

- **SC-001**: Both shells render every typographic role using the typeface LG-BRAND-001 assigns to it, with zero roles falling back to a generic system font.
- **SC-002**: Zero requests to any third-party asset or font host from either shell.
- **SC-003**: 100% of brand tokens named in LG-BRAND-001 resolve identically through every representation, verified automatically rather than by inspection.
- **SC-004**: Zero WCAG 2.2 Level A and AA violations reported by the established automated rule set on both the English and Arabic shells, **and** a recorded manual assessment of keyboard traversal and screen-reader output in both languages. The automated result alone does not satisfy this criterion.
- **SC-005**: 100% of curated assets carry a source reference and a checksum that verifies against the file present.
- **SC-006**: Zero duplicate copies of any curated asset outside `packages/brand`.
- **SC-007**: Content remains readable and functional at 200% text size, and reflows without loss of content or function at a 320 CSS-pixel viewport width, in both languages.
- **SC-008**: Zero public marketing claims, testimonials, case studies, or lawyer profiles are introduced.
- **SC-009**: 100% of approved colour pairings used by the shells meet the WCAG AA contrast thresholds, measured rather than assumed.

## Risks, decisions, and safe interim behavior

| Risk                                                                                                                      | Owner  | Gate / decision                      | Safe interim behavior                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Brand typography could be read as public-facing marketing presentation.                                                   | Design | ODR-002 remains open                 | No marketing copy, claim, testimonial, or profile is added. Typography and colour only.                                       |
| Narrow font subsets may omit glyphs in mixed Arabic/Latin strings, degrading a person's or organisation's rendered name.  | Design | None; engineering control            | Declare a same-script fallback for each family so a missing glyph degrades legibly rather than silently.                      |
| No canonical requirement ID governs brand-token consistency or asset provenance; only `I18N-RTL-001` partially covers it. | Design | Sponsor decision, flagged for review | This feature anchors to `I18N-RTL-001` and LG-BRAND-001. A dedicated requirement ID may be added by a later sponsor decision. |
| A future surface may hand-copy a token value and drift from the approved system.                                          | Design | None; engineering control            | An automated parity check fails when representations disagree.                                                                |
| Self-hosted typefaces carry redistribution obligations.                                                                   | Design | None; licence control                | Only families whose licence permits self-hosting are admitted, with attribution recorded.                                     |

No release gate is closed by this feature. G1, ODR-003, ODR-004, and G2 are untouched and remain blocked.

## Verification record contract

`specs/005-brand-system/verification.md` must map every requirement (FR-001–FR-013) and every success criterion (SC-001–SC-009) to its implementation, tests, exact commands and results, review evidence, residual risk, and any approved exception. It must include the manual accessibility assessment record FR-011 requires, naming what was exercised in each language and what was found. It must state that no release gate was closed and no prohibited content was introduced. Missing required evidence blocks completion.
