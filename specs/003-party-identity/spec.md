# Feature Specification: M2 Party Identity Foundation

**Requirement ID:** DAT-PRT-001  
**Feature Branch:** `003-party-identity`  
**Created:** 2026-08-10  
**Status:** Approved product boundary; reversible foundation only  
**Release / validation gate:** M2 / G2 Legal intake and conflicts  
**Input:** A professional, client-centred resolution of the party identity model.

## Client need and scope

Before a firm can screen a prospective instruction, communicate accurately, or identify who represents whom, it needs a reliable record of people and organizations. Names can appear in Arabic, English, transliteration, trade names, abbreviations, or prior forms. The same person may be a prospective client, a representative, an opposing party, or none of these depending on a later, separately controlled relationship.

This foundation gives internal staff one durable way to record a person or organization, its names and aliases, contact points, and a claimed representative relationship. It deliberately does **not** decide that someone is a client, accept representation, create an engagement or matter, clear a conflict, grant matter access, or make a legal identity-verification claim.

The approved M2 boundary is internal-only and synthetic until the applicable privacy and legal reviews are recorded. Every identity assertion records the safe synthetic privacy-handling metadata required by LG-PRV-001: purpose, classification, subject category, source, retention candidate, access boundary, and validation requirement. The design supports future intake and conflict work without forcing irreversible taxonomy, source-migration, or real-data processing decisions today.

## User scenarios and testing

### User story 1 — Record a prospective party accurately (Priority: P1)

An intake professional can create a neutral record for a person or organization before it becomes a client, engagement, or matter.

**Why this priority:** Correct identity capture is the minimum prerequisite for safe intake and later conflict screening.

**Independent test:** Using synthetic examples, a staff member can record either a person or organization with a primary name, contact point, and source context without creating any client, engagement, matter, or authorization record.

**Acceptance scenarios:**

1. **Given** a new prospective individual, **when** staff record the individual’s name and a contact point for a stated operational purpose with synthetic privacy-handling metadata, **then** the record remains a neutral party and is not treated as a client or represented person.
2. **Given** a new organization, **when** staff record its legal or commonly used name, **then** it remains distinct from any person, engagement, or matter.
3. **Given** incomplete identity information, **when** staff save a permitted partial record, **then** the record is visibly incomplete and cannot be represented as verified identity.

---

### User story 2 — Preserve Arabic and English identity variants (Priority: P1)

An intake professional can preserve the name forms by which a party may be known in Arabic and English, including transliterations and prior names, together with where each name came from.

**Why this priority:** Conflict screening and accurate communication fail when Arabic/English variants are lost or silently normalized into one assumed identity.

**Independent test:** Synthetic records retain a primary name and multiple aliases, with language, script, name type, source, and recording date for every form.

**Acceptance scenarios:**

1. **Given** an Arabic primary name and an English transliteration, **when** staff record both forms, **then** both remain attributable variants of the same recorded party without claiming legal equivalence.
2. **Given** a former, trading, abbreviated, or alternate name, **when** staff add it, **then** the name has its own provenance and does not overwrite the primary name.
3. **Given** two records that might refer to the same party, **when** staff identify the possible duplicate, **then** the system records a candidate relationship and does not automatically merge records or clear a conflict.

---

### User story 3 — Record representation without creating legal authority (Priority: P1)

An intake professional can record that one party claims to represent another while keeping that claim separate from engagement, matter access, professional authority, and legal validation.

**Why this priority:** Representatives are needed for practical intake, but a contact or representation claim must never silently establish legal representation.

**Independent test:** A synthetic representative relationship can be recorded with source and review state, while all client, engagement, matter, and authorization states remain absent.

**Acceptance scenarios:**

1. **Given** an organization and an individual contact, **when** staff record a representative relationship, **then** the relationship identifies its source and review state without granting authority.
2. **Given** an unreviewed representation claim, **when** a later workflow reads it, **then** the workflow treats it as unverified information rather than proof of engagement or authority.
3. **Given** a representation relationship changes, **when** staff correct it, **then** the original claim remains reviewable and the correction is separately attributable.

### Edge cases

- An Arabic and English name may be similar without identifying the same person; the system must preserve both records and require human review before any merge.
- A person may use only one known name, an organization may have no confirmed registration name, and either record may remain incomplete without receiving a false verification status.
- A contact point may be shared by more than one party; it is not proof of identity, authority, or household relationship.
- A representative claim may be disputed, expired, or withdrawn; it must not be used as legal authority until a later approved workflow validates it.
- An imported or historical source may be unavailable or unreliable; provenance must show the limitation rather than silently treating the data as confirmed.

## Requirements

### Functional requirements

- **FR-001:** The system MUST represent a person and an organization as distinct neutral party types, independently of prospect, client, engagement, matter, proceeding, or authorization state.
- **FR-002:** The system MUST allow each party to have a primary name and zero or more aliases. Each name form MUST retain its language, script where known, name type, source, recording date, review state, processing purpose, classification, subject category, retention candidate, access boundary, and validation requirement.
- **FR-003:** The system MUST preserve primary names and aliases as reviewable history; adding a new or corrected form MUST NOT silently overwrite the prior form.
- **FR-004:** The system MUST allow optional contact points only with a stated operational purpose and data-classification label. Each contact assertion MUST also retain subject category, source, retention candidate, access boundary, and validation requirement. A contact point MUST NOT prove identity, client status, authority, consent, or engagement.
- **FR-005:** The system MUST represent a claimed representative relationship between parties with source, effective status, review state, processing purpose, classification, subject category, retention candidate, access boundary, and validation requirement. It MUST NOT create legal representation, matter access, or professional authority.
- **FR-006:** The system MUST support a possible-duplicate indication with source, review state, and the same required privacy-handling metadata, without automatically merging parties, selecting a canonical identity, or clearing a conflict.
- **FR-007:** The system MUST retain the source, review state, and privacy-handling metadata for all identity, alias, contact, representation, and duplicate assertions so users can distinguish recorded information from verified information.
- **FR-008:** The system MUST use only synthetic data until ODR-003 privacy processing, ODR-004 source/migration, and G2 legal-intake validation are recorded. It MUST NOT import production records, national identifiers, identity documents, or client data in this feature.
- **FR-009:** The feature MUST NOT create a public intake route, client portal surface, conflict-clearing workflow, engagement, matter, identity-provider flow, or legal conclusion.
- **FR-010:** Every M2 read or mutation MUST authorize each party whose identity data is read or mutated using trusted server-side context. A representation claim or possible-duplicate cue MUST require authorization for both linked parties and return a generic denial without disclosing the other party when authorization is absent.

### Key entities

- **Party:** A neutral record representing either a person or organization; it is not a client, matter, or engagement.
- **Name form:** A primary, alternate, former, trading, abbreviated, transliterated, or other recorded name with language and provenance.
- **Contact point:** A purpose-limited way to contact a party, recorded separately from identity verification and authority.
- **Representation claim:** A sourced, reviewable assertion that one party represents another; it is not legal authority or an engagement.
- **Possible duplicate:** A human-review cue that two party records may refer to the same subject; it is not an automatic merge or conflict decision.
- **Privacy-handling metadata:** Purpose, classification, subject category, source, retention candidate, access boundary, and validation requirement recorded for the synthetic foundation; it is not a production privacy approval.

## Success criteria

### Measurable outcomes

- **SC-001:** In a synthetic intake exercise, an internal user can record a neutral person or organization with a primary name, an alias, and provenance in under two minutes without creating a client, engagement, matter, or authority record.
- **SC-002:** Every accepted synthetic name form retains a language, source, recording date, review state, and required privacy-handling metadata; no corrected or additional name silently replaces an earlier form.
- **SC-003:** In all defined duplicate, shared-contact, and unreviewed-representative scenarios, the system makes no automatic merge, conflict-clearance, engagement, or authorization decision.
- **SC-004:** A reviewer can distinguish a recorded assertion from a reviewed assertion for every identity, contact, and representation example used in acceptance testing.
- **SC-005:** Every synthetic identity, contact, representation, and duplicate assertion used in acceptance testing retains purpose, classification, subject category, source, retention candidate, access boundary, and validation requirement without claiming a production privacy approval.

## Assumptions and decision boundaries

- M1 supplies a separate trusted internal-actor boundary; this feature does not select an identity provider or expose a login experience.
- Product and legal-operations teams will later validate practice areas, matter taxonomy, expected volumes, current tools, and source migrations under ODR-004. Those decisions are intentionally excluded from this foundation.
- A lead practising Egyptian lawyer will validate real intake and conflict scenarios before G2 activation. This feature cannot make a legal identity, representation, or conflict determination.
- A privacy reviewer must approve real personal-data processing, retention, transfer, and rights handling before any non-synthetic party data is collected.
- The recommended resolution is suitable for reversible foundation work only. It does not approve production activation or replace any legal, privacy, security, or records review.
