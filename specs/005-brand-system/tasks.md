# Tasks: Brand System Implementation

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [package contract](contracts/brand-package.md), [quickstart.md](quickstart.md)
**Prerequisites**: LG-BRAND-001 approved for M0. No release gate is closed by this feature.
**Tests**: Mandatory. The approved quality profile marks unit and browser/accessibility/locale layers **required**. Write each failing test before the behaviour it protects.
**Authority**: Every brand value is quoted from LG-BRAND-001. No task may introduce a new visual design decision, ODR-002 marketing content, a route, persistence, a provider, or personal data.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: May run in parallel because it touches independent files.
- **[US#]**: The user scenario the task advances, from spec.md.

---

## Phase 1: Reconnaissance and quality profile

**Purpose**: Establish the evidence shell before any brand surface changes.

- [x] T001 Create the requirement-coverage, test-layer, residual-risk, and no-gate-closed record in `specs/005-brand-system/verification.md`, with a row for every FR-001–FR-013 and SC-001–SC-009.
- [x] T002 [P] Add the prohibited-content regression covering ODR-002 marketing claims, testimonials, case studies, outcome language, and lawyer profiles on brand and shell surfaces, in `packages/testing/src/brand-boundaries.test.ts`, per FR-009 and SC-008.

**Checkpoint**: The feature has a truthful evidence record and an executable content boundary before any brand surface is touched.

---

## Phase 2: Tests and contracts before implementation

**Purpose**: Every behaviour below is pinned by a failing test first. No test may be weakened later to preserve a green build.

- [x] T003 [P] [US2] Write failing token-parity tests in `packages/brand/src/tokens.test.ts`: regenerating the stylesheet from the authoritative record reproduces `packages/brand/src/tokens.css` byte-for-byte, every token named in LG-BRAND-001 is present, and every typographic role stack terminates in a generic of its own script so a failed face load degrades legibly, per FR-003, SC-003, and Scenario 1.4. Analysis finding C2: the fallback scenario previously had implementation but no test.
- [x] T004 [P] [US3] Write failing provenance tests in `packages/brand/src/provenance.test.ts`: every manifest entry's recomputed SHA-256 matches its committed file, every entry names an approved source, and every typeface entry names a licence permitting self-hosting, per FR-005, FR-006, and SC-005.
- [x] T005 [P] [US4] Write failing contrast tests in `packages/brand/src/contrast.test.ts` asserting the WCAG AA thresholds for the enumerated pairings the shells actually use — ink on warm-white, ink on ivory, ivory on navy-900, gold-600 on navy-900, and the focus treatment against both grounds — at 4.5:1 for body text and 3:1 for large text and meaningful non-text, per FR-013 and SC-009. Analysis finding U2: the pairing set is named here rather than left to inference.
- [x] T006 [P] [US1] Write the failing browser suite in `tests/e2e/brand.spec.ts` covering, for both locales: zero WCAG 2.2 A/AA violations from the established rule set, an approved computed interface family with no generic system fallback, a visible focus treatment, readability at 200% text, reflow at a 320 CSS-pixel width, and zero requests to any host outside the application origin — per FR-001, FR-002, FR-007, SC-001, SC-002, SC-004, and SC-007.
- [x] T007 [P] [US1] Extend `tests/e2e/foundation.spec.ts` with a mixed Arabic/Latin fragment assertion proving a fragment whose language differs from its page carries its own language attribute and receives a script-appropriate family, per FR-012 and the mixed-script edge case.

**Checkpoint**: Every required behaviour fails for the right reason before implementation begins. Record the first-run failures in `verification.md`.

---

## Phase 3: User Story 2 — One authoritative token source (Priority: P1)

**Goal**: A brand value has exactly one definition, and the two representations cannot silently disagree.

**Independent Test**: Hand-editing the generated stylesheet fails the parity test.

- [x] T008 [US2] Define every LG-BRAND-001 token as a typed frozen record in `packages/brand/src/tokens.ts`, replacing the current four-value subset, per FR-003 and data-model "Brand token".
- [x] T009 [US2] Add the deterministic stylesheet generator in `packages/brand/src/generate-tokens-css.ts`, producing byte-reproducible output from the token record.
- [x] T010 [US2] Regenerate `packages/brand/src/tokens.css` from the record and mark it a generated artifact that must not be hand-edited.
- [x] T011 [US2] Add `packages/brand/src/index.ts` re-exporting the typed token surface, and declare the `.` export in `packages/brand/package.json`, per the package contract.

**Checkpoint**: T003 passes. Tokens have one source.

---

## Phase 4: User Story 1 — Approved typography in both languages (Priority: P1)

**Goal**: Each language renders its approved families, self-hosted, degrading legibly.

**Independent Test**: Both shells compute an approved interface family; no request leaves the application origin.

- [x] T012 [US1] Add typographic role tokens (`--lg-font-ui`, `--lg-font-display`, `--lg-font-mono`) to the token record with per-script ordered stacks, each terminating in a same-script generic and listing the opposite-script approved family before it, per FR-002, plan Decision 3, and data-model "Typography role assignment".
- [x] T013 [US1] Declare the `./fonts.css` export in `packages/brand/package.json` and confirm every `@font-face` in `packages/brand/assets/fonts/fonts.css` resolves to a committed `woff2` with `font-display: swap`, per FR-001 and plan Decision 2.
- [x] T014 [US1] Replace the `Arial` declaration in `apps/web/src/app/globals.css` with the role tokens, import `@lexgate/brand/fonts.css`, and select Arabic families with `:lang(ar)` rather than direction or a class, per FR-002 and FR-010.
- [x] T015 [US1] Ensure every rendered fragment whose language differs from its page carries its own `lang` attribute in `apps/web/src/app/[locale]/`, per FR-012.

**Checkpoint**: T006 and T007 pass. Both shells use approved families.

---

## Phase 5: User Story 3 — One verifiable supply point (Priority: P2)

**Goal**: Curated assets come only from `packages/brand`, and alteration is detectable.

**Independent Test**: Appending a byte to a committed asset fails the provenance test; no brand asset exists outside the package.

- [x] T016 [US3] Create `packages/brand/assets/provenance.json` recording file, approved source filename, SHA-256, intended use, and licence for every curated mark and every committed typeface, per FR-005, FR-006, and D-007.
- [x] T017 [US3] Declare the `./assets/*` export in `packages/brand/package.json`, per the package contract.
- [x] T018 [US3] Change `apps/web/src/components/portal-mark.tsx` to import the mark as a module from `@lexgate/brand` instead of the public string path, per FR-004 and plan Decision 4.
- [x] T019 [US3] Delete `apps/web/public/brand/` so no duplicate supply point remains, and update the mark assertion in `tests/e2e/foundation.spec.ts:20`, which pins the literal path `/brand/portal-gold.svg` and would otherwise fail, per FR-004 and SC-006. Analysis finding C1.

**Checkpoint**: T004 passes. One supply point, verifiable.

---

## Phase 6: User Story 4 — Accessibility evidence that is not automation alone (Priority: P1)

**Goal**: The brand system is proven accessible in both languages by machine **and** by hand.

**Independent Test**: The verification record contains a manual assessment naming what was exercised in each language and what was found.

- [x] T020 [US4] Add a guard in `packages/brand/src/contrast.test.ts` asserting that no classification is expressible by colour alone: every classification token has a corresponding text label available from `packages/ui`, per FR-008. Analysis finding U1: the classification tokens are currently used by no surface, so this is a standing guard against a future colour-only classification, not a change to existing markup. Record in `verification.md` that no such surface exists yet.
- [x] T021 [US4] Perform and record the manual accessibility assessment — keyboard traversal and screen-reader output in English and Arabic, plus narrow-viewport reflow — in `specs/005-brand-system/verification.md`, per FR-011 and SC-004. An automated pass alone must not be recorded as accessibility evidence.

**Checkpoint**: T005 passes and the manual record exists. SC-004 is satisfied by both halves, not one.

---

## Phase 7: Validation, review, and convergence

- [x] T022 [P] Update `docs/requirements/traceability.yaml` for `I18N-RTL-001` with this feature's evidence, without changing any gate status.
- [x] T023 Run `pnpm verify` and `pnpm verify:full`, recording exact commands, environment, date, results, and any diagnostic retry in `specs/005-brand-system/verification.md`, per the plan's completion commands.
- [x] T024 Run a cross-artifact analysis and resolve every material cross-artifact finding at its source.
- [x] T025 Run the convergence review, implement each appended task, and repeat until it reports convergence without misrepresenting any gate as passed.

---

## Dependencies and execution order

1. **Phase 1** may start immediately.
2. **Phase 2** must complete before any of Phases 3–6, because every behaviour is test-first.
3. **US2 (Phase 3)** blocks **US1 (Phase 4)**: role tokens are defined in the token record, so the authoritative record must exist first.
4. **US3 (Phase 5)** depends only on Phase 2 and may run in parallel with US1.
5. **US4 (Phase 6)** depends on US1, because accessibility is assessed against the rendered typography.
6. **Phase 7** requires all preceding phases.

## Parallel opportunities

- T003–T007 are independent test-first tasks across five separate files.
- T016–T017 may proceed while Phase 4 is in progress.
- T002 and T022 touch files no other task writes.

## Implementation strategy

**MVP — one honest source of truth**: Phases 1–3. Tokens stop being able to disagree. This is independently valuable even if typography slipped.

**Visible increment**: Phase 4. Both shells render the firm's approved typography, self-hosted.

**Integrity increment**: Phase 5. One supply point, with alteration detectable rather than merely discouraged.

**Evidence increment**: Phases 6–7. Accessibility proven by machine and by hand, then convergence.

## Notes

- Every task names a precise path and traces to a requirement ID.
- Tests fail first. No test may be weakened to preserve a prior green build.
- Completing every task closes no release gate. G1, ODR-003, ODR-004, and G2 remain blocked on their accountable reviewers, and ODR-002 continues to block public marketing content.

---

## Phase 8: Convergence

- [x] T026 Add a guard asserting that shell content carrying script-mixed text declares a language attribute for the differing fragment, in `packages/testing/src/brand-boundaries.test.ts`, per FR-012 (partial). The requirement is satisfied only vacuously today because no mixed-language fragment exists; without a guard it will break silently when bilingual party names are first rendered.
- [x] T027 Make `packages/brand/assets/provenance.json` the single authority for asset provenance and have `packages/brand/assets/README.md` reference it rather than restating it, per FR-005 (partial).
- [x] T028 Move `@lexgate/brand` from `dependencies` to `devDependencies` in `packages/ui/package.json`, since no production source imports it, per plan: affected packages (unrequested).
