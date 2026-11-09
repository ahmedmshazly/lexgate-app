# Lex Gate Engineering Constitution

Read `docs/README.md` and the task-relevant canonical requirement records before changing code or documentation. The repository is the durable source of truth, conversations are not.

## Authority

1. Controlling Arabic legal source and approved legal interpretation
2. `docs/requirements/MASTER_SRS.md` and structured requirement records
3. Approved ADRs and SOPs
4. This file and scoped instructions
5. Task plan and existing implementation conventions

Lower-priority material must not weaken a higher-priority control. Record unresolved material questions in `docs/governance/OPEN_DECISIONS.md`, then continue unrelated work where safe.

## Core invariants

- Authentication never implies authorization; authorize every protected object server-side.
- Employment, administration, or infrastructure access never grants automatic matter access.
- Prospect != client; payment != engagement; engagement != matter; matter != proceeding.
- Task != legal deadline; calculated deadline != lawyer-confirmed deadline.
- Uploaded != reviewed; draft != final; final != client-published; document != evidence.
- Never silently overwrite final legal, financial, custody, audit, or rule-version history.
- AI output is untrusted assistance, never a lawyer decision or legal conclusion.

## Engineering rules

- Use explicit commands for material transitions, and do not replace them with generic status PATCH routes.
- Keep domain rules independent from Next.js, databases, and provider SDKs.
- Use server-side projections for client-facing data. Browser field hiding is not authorization.
- Use synthetic fixtures only. Never commit credentials, national IDs, production exports, legal files, or client data.
- Do not introduce microservices, a cloud vendor, external identity, payment, AI, or legal-rule provider without an ADR and the applicable validation gate.

## Delivery quality and conduct

- Capability never lowers the delivery standard. An implementer who cannot meet it must reduce scope, collect more evidence, ask a targeted question, or record a blocker; they must not guess, skip an applicable control, weaken a test, or claim success without evidence.
- Treat material feature artifacts as durable, spec-anchored engineering records. Use the spec workflow, retain its specification, plan, tasks, and verification evidence, and update them when implementation or scope changes.
- Select every applicable test layer: static/documentation, domain, integration, authorization-negative, contract, browser/E2E, accessibility, operational, and release-gate validation. A test layer may be marked not applicable only with a concrete rationale in feature verification evidence.
- Use production-equivalent execution for browser acceptance checks in CI. Automated accessibility scans complement, but never replace, manual accessibility assessment and inclusive user review.
- A retry is diagnostic evidence, not permission to ignore flakiness. Focused, skipped, disabled, or weakened tests require an explicit, approved reason and an equivalent protection where applicable.
- Read `docs/development/QUALITY_ENGINEERING_STANDARD.md` before material implementation. It sets out the required evidence profile and the escalation path.

## Completion

Every change identifies requirement IDs, tests the affected behavior, updates traceability when required, and passes `pnpm verify`. Material runtime, dependency, database, UI, or delivery changes also pass `pnpm verify:full` and record the command results in feature verification evidence. Access-control changes also require negative authorization coverage. Do not claim completion while a required check fails, an applicable test is unexecuted, or a required review/gate remains open.
