# M0 Foundation Requirements Checklist: M0 Controlled Foundation

**Purpose**: Review the completeness, clarity, consistency, and measurability of the M0 foundation requirements before task generation.  
**Created**: 2026-08-09  
**Feature**: [spec.md](../spec.md) and [plan.md](../plan.md)  
**Audience / depth**: Engineering and quality reviewers; formal M0 release-gate readiness.

## Requirement completeness

- [x] CHK001 Are all six canonical M0 requirement IDs explicitly represented with observable behavior and evidence? [Completeness, Spec §Requirements]
- [x] CHK002 Are prohibited M1–M11 legal, client, payment, provider, and AI capabilities explicitly excluded from M0 scope? [Completeness, Spec §User outcome and scope]
- [x] CHK003 Are audit/outbox records, their allowed fields, and the absence of legal entities clearly bounded? [Completeness, Data model §Scope boundary]
- [x] CHK004 Are the G0 approval owners, required evidence, and non-self-approvable activation condition documented? [Completeness, Spec §Risks; Plan §Delivery and verification]

## Requirement clarity and consistency

- [x] CHK005 Is the distinction between an explicit transition-recording command and a prohibited generic status update unambiguous? [Clarity, Spec FR-002; Plan §Architecture and commands]
- [x] CHK006 Are atomic commit and rollback criteria stated in a way that identifies what is committed and what must remain absent on failure? [Clarity, Contract material-transition §Success and §Failure]
- [x] CHK007 Are immutable audit/event facts and mutable outbox delivery bookkeeping consistently separated? [Consistency, Data model §Relationship and atomicity]
- [x] CHK008 Are provider-adapter requirements consistent with the M0 prohibition on provider activation and credentials? [Consistency, Spec FR-003; Research provider decision]
- [x] CHK009 Are local-only synthetic-data restrictions consistent across feature scope, fixtures, quickstart, and open-decision safe behavior? [Consistency, Spec §User outcome and scope; Quickstart §Prerequisites]

## Scenario and negative-path coverage

- [x] CHK010 Are English, Arabic, RTL, unsupported-locale, automated accessibility, and keyboard-focus scenarios specified for the shell? [Coverage, Spec Scenario 1; Contract foundation-shell]
- [x] CHK011 Are authorization rejection, duplicate-event rollback, and no-provider-delivery outcomes explicitly specified for the internal persistence contract? [Coverage, Spec Scenario 2; Contract material-transition]
- [x] CHK012 Are incomplete-P0-record and missing-evidence outcomes specified without reclassifying a required quality layer as passing? [Coverage, Spec Scenario 3]

## Non-functional and evidence quality

- [x] CHK013 Are each applicable test layer and each genuinely non-applicable/blocked layer accompanied by a concrete rationale? [Completeness, Spec §Non-functional and quality profile]
- [x] CHK014 Are production, backup/restore, incident, vendor, and provider assertions explicitly deferred rather than implied by M0 evidence? [Scope, Plan §Test and evidence design]
- [x] CHK015 Are automated accessibility checks distinguished from the required manual keyboard and G0 review evidence? [Clarity, Quickstart §Manual assessment and gate]
- [x] CHK016 Can every stated M0 outcome be objectively mapped to a command, deterministic test, or named review record? [Measurability, Plan §Test and evidence design]

## Notes

All items were independently reviewed against the controlled M0 requirement, architecture, assurance, and validation records. No requirement-quality gap remains. This checklist assesses written requirements only; implementation evidence is recorded separately in `verification.md`.
