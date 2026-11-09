# Lex Gate Legal Practice Platform

Lex Gate is a private, Egypt-focused legal-practice platform. I'm building it as a controlled modular monolith that protects professional authority, client confidentiality, records integrity, and bilingual Arabic/English delivery.

> **Status:** Milestone M0 — engineering foundation. This repository does not yet implement legal workflows, client access, payments, or AI assistance.
>
> **This is a personal build and learning project.** It is engineered as though it were a real legal-practice platform, but its four accountable reviewers (security, privacy/DPO, legal operations, and a practising Egyptian lawyer) have not been engaged and may never be. Every release gate is shut and stays shut. Nothing here is production-ready for a real legal practice without the reviews that were never done.

## Start here

1. Read the [documentation index](docs/README.md) and [engineering constitution](CONSTITUTION.md).
2. Copy `.env.example` to `.env` and set local-only values.
3. Run `pnpm install`, `pnpm services:up`, `pnpm db:migrate`, then `pnpm dev`.
4. Before handoff, run `pnpm verify`; run `pnpm verify:full` for the complete M0 gate.

`pnpm verify` includes synthetic PostgreSQL integration coverage. Start the local
services and apply migrations first, CI provisions an equivalent PostgreSQL
service and runs the same migration step. Never substitute an external or
production database for this evidence.

If local port 5432 is already taken, set `POSTGRES_PORT=5433` for `pnpm services:up` and update the port in `DATABASE_URL` to match before running database commands.

## Repository map

- `apps/web`: Next.js App Router surface; internal reads stay server-side and mutations use explicit application commands.
- `apps/worker`: background outbox consumer and operational jobs.
- `packages/*`: bounded domain, application, persistence, integration, UI, localization, and quality foundations.
- `docs`: canonical controlled documentation. The original research set is immutable evidence under `docs/archive/`.

## Non-negotiable distinctions

Authentication is not authorization. Employment is not matter access. A prospect is not a client, an engagement is not a matter, a task is not a legal deadline, an uploaded file is not reviewed evidence, and AI output is never a lawyer decision.

## Delivery workflow

Every material feature goes through specify, clarify, plan, checklist, tasks, analyze and implement, followed by a convergence review until no gaps remain. See the [quality engineering standard](docs/development/QUALITY_ENGINEERING_STANDARD.md) for operating controls, evidence requirements, and the completion contract.

## Legal and privacy notice

The repository contains engineering controls and a public-source research register, not legal advice. Any requirement marked `legal_validation: required` remains inactive for production use until the assigned Egyptian professional reviewer approves it.
