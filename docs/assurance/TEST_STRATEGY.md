# Master Test Strategy

**Document ID:** LG-QA-001  
**Status:** Approved for M0  
**Owner:** Quality lead

## Test hierarchy

| Level                | Purpose                                                                                |
| -------------------- | -------------------------------------------------------------------------------------- |
| Static/documentation | Markdown links, document IDs, structured requirements, traceability, dependency rules. |
| Unit/domain          | Invariants, state transitions, rule-version selection, money/date behavior.            |
| Integration          | Database constraints, migrations, outbox atomicity, storage and provider adapters.     |
| Security             | Negative authorization, projections, secret/logging checks, webhook controls.          |
| Browser/E2E          | Accessible English/Arabic routes, RTL, core client/staff flows once released.          |
| Legal workflow       | Reviewer-approved scenarios and evidence, never generic happy paths alone.             |
| Operational          | Backup/restore, fault, performance, incident, and release evidence.                    |

## Quality gate

`pnpm verify` runs formatting/static checks, requirements validation, type checks, and tests. `pnpm verify:full` adds clean build, production-equivalent browser validation, and automated accessibility evidence. CI runs the full gate for every pull request. A P0/Q0 failure, unapproved test omission, or flaky test is a release blocker; no test may be removed to conceal a regression.

## Test selection and evidence

Every material feature declares the applicable rows of the quality engineering evidence matrix before implementation. Unit, integration, contract, authorization-negative, browser/E2E, accessibility, performance, resilience, backup/restore, and release validation are selected by risk and claim, not omitted because an implementation is inconvenient. A non-applicable layer requires written rationale in the feature verification record, and a missing required layer blocks handoff.

Automated accessibility scans cover machine-detectable WCAG defects only. Browser-facing releases also require proportional manual keyboard, screen-reader, and inclusive-user review evidence at their applicable validation gate.

## Fixture policy

Use clearly synthetic identities, Arabic and English test strings, safe fake files, and controlled clocks. Never use copied client facts, public case files, real national IDs, production credentials, or unredacted screenshots.
