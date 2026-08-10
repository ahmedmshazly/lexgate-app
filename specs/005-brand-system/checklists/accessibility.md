# Accessibility and Bilingual Requirements Quality Checklist: Brand System Implementation

**Purpose**: Validate that the accessibility and bilingual Arabic/English **requirements** in this feature are complete, unambiguous, measurable, and consistent — before implementation begins. This tests the requirements as written, not the eventual implementation.
**Created**: 2026-08-10
**Feature**: [spec.md](../spec.md)
**Depth**: Standard · **Audience**: Reviewer · **Focus**: WCAG A/AA and keyboard; bilingual RTL, mixed-script, and typography fallback

## Requirement Completeness

- [x] CHK001 Are accessibility requirements defined for every interactive element the feature touches? [Completeness, Spec §FR-007]
- [x] CHK002 Is a minimum text contrast ratio specified for the approved colour tokens against their intended grounds? [Gap]
- [x] CHK003 Are requirements defined for what happens when an approved typeface fails to load, beyond the acceptance scenario? [Gap, Spec §Scenario 1.4]
- [x] CHK004 Is a reduced-motion requirement stated as a requirement, or only as an acceptance scenario? [Consistency, Spec §Scenario 4.4]
- [x] CHK005 Are requirements defined for the language attribute on content fragments, given that typeface selection depends on it? [Gap]
- [x] CHK006 Is manual accessibility assessment required in addition to automated scanning, as the constitution demands? [Gap, Constitution VI]
- [x] CHK007 Are line-height, letter-spacing, or vertical-metric requirements specified for Arabic, which has different typographic needs from Latin? [Gap]

## Requirement Clarity

- [x] CHK008 Is "visible and distinguishable" focus treatment quantified, or left to interpretation? [Clarity, Spec §FR-007]
- [x] CHK009 Is "a generic of the same script" defined for Arabic, where generic family keywords behave less predictably than for Latin? [Clarity, Spec §Scenario 1.4]
- [x] CHK010 Does the specification state which approved family serves which role and script, or does it rely entirely on an external document? [Clarity, Spec §FR-002]
- [x] CHK011 Is "no generic system fallback" objectively determinable by a reviewer, given that a computed family list always terminates in a generic? [Measurability, Spec §SC-001]

## Scenario and Edge Case Coverage

- [x] CHK012 Are requirements defined for a mixed Arabic/Latin string within a single text run, or only for a whole-page language? [Coverage, Spec §FR-002]
- [x] CHK013 Are reflow requirements specified for narrow viewports, distinct from the text-resize requirement? [Gap, Spec §SC-007]
- [x] CHK014 Are requirements defined for the case where a narrow font subset omits a character present in a rendered name? [Coverage, Spec §Edge cases]
- [x] CHK015 Are keyboard traversal requirements defined for both reading directions, given that focus order follows direction? [Coverage, Spec §FR-007]

## Requirement Consistency

- [x] CHK016 Do the typography requirements and the accessibility requirements agree on what happens when a face is unavailable? [Consistency, Spec §FR-002, §FR-007]
- [x] CHK017 Is the prohibition on colour-only meaning consistent with the classification colours the brand system defines? [Consistency, Spec §FR-008]
- [x] CHK018 Are the bilingual requirements consistent with the existing `I18N-RTL-001` acceptance criteria, so this feature cannot regress them? [Consistency, Traceability]

## Acceptance Criteria Quality

- [x] CHK019 Can every success criterion be verified without reading the implementation? [Measurability, Spec §SC-001–SC-008]
- [x] CHK020 Is the accessibility success criterion bounded to a named conformance level and rule set, rather than "zero violations" in the abstract? [Clarity, Spec §SC-004]

## Notes — resolutions

This checklist found **five genuine defects** in the specification. All were corrected before task generation; the boxes above are ticked against the corrected specification.

1. **CHK006 — manual accessibility assessment was missing (most serious).** The specification relied on automated scanning alone, while Constitution VI and `CONSTITUTION.md` both state that automated scans complement but never replace manual assessment and inclusive user review. Resolved by adding **FR-011** requiring manual keyboard and screen-reader assessment in both languages, recorded in the verification record, and by qualifying SC-004.
2. **CHK005 — language of parts was unspecified.** Decision 3 of the plan selects typefaces with `:lang()`, which silently fails when a fragment carries no language attribute. The requirement that made the design work was never written down. Resolved by adding **FR-012**, which also satisfies WCAG 3.1.2.
3. **CHK002 — no contrast requirement existed.** The brand palette was admitted with no stated minimum ratio, so a compliant-looking scan could still pass with an unreadable pairing outside the tested surface. Resolved by adding **FR-013** with the WCAG AA thresholds.
4. **CHK013 — reflow was conflated with text resize.** SC-007 covered 200% text but not narrow-viewport reflow, which is a separate AA criterion. Resolved by extending SC-007 and noting reflow in FR-011's evidence.
5. **CHK020 — "zero violations" was unbounded.** Resolved by naming the conformance level and rule set in SC-004.

CHK010 was reviewed and deliberately left as-is: the specification defers role-to-family assignment to LG-BRAND-001 on purpose, because duplicating the mapping would create the second source of truth this feature exists to eliminate. CHK009 and CHK011 are addressed in the plan's Decision 3 rather than the specification, which is the correct altitude for them.
