# Legal Workflow Validation Plan

**Document ID:** LG-LEG-VAL-001  
**Status:** Required before relevant activation  
**Owner:** Lead practising Egyptian lawyer

## Purpose

Prevent technically coherent workflows from being presented as legally or professionally correct without qualified Egyptian review.

## Review packet

Each gated feature provides the relevant source IDs and Arabic source excerpts/locations, proposed requirement IDs, state diagram, authorization matrix, screen/API evidence, negative cases, data/retention consequences, and unresolved interpretation questions.

## Required scenario families

Conflict and non-engagement; engagement and representative authority; matter/proceeding boundaries; deadline calculation/confirmation and transition rules; client reporting; documents/evidence; public content; closure/retention; privacy rights; finance and electronic-tax/signature integration.

The reviewer records approved, conditionally approved, rejected, or deferred status. Conditional approval must identify the exact scope, compensating behavior, owner, expiry/review date, and release impact.

## Conflict candidate detection

Name matching surfaces **candidates for human review** and cannot clear a conflict. `evaluateNameCandidate` has no clearing branch, and an empty result means only that no stored name resembled the subject — a fact about strings, never an assertion about the parties. Searches are recorded whether or not they find something, so silence is distinguishable from never having looked.

**The tier thresholds are engineering defaults, not legal ones.** No practising Egyptian lawyer has set what constitutes a candidate, or reviewed whether strong/moderate/weak match how a firm would actually triage. Nothing in the system acts on a tier; it exists so a reviewer can prioritise, and so a rejected weak cue stays distinguishable from a rejected strong one in the audit trail.

Accuracy is measured against an adversarial synthetic corpus rather than asserted, because the two failure modes pull against each other: a missed conflict is the obvious harm, but Egyptian patronymic naming makes unrelated people sharing a full tripartite name the normal case, so a matcher that flags constantly trains staff to dismiss without reading.

Known limits: the transliteration table is incomplete by construction and its gaps are missed conflicts; matching is linear in a tenant's readable names; an erased subject is absent from matching entirely; and organisational naming — trading names, branches, corporate groups — is not modelled.

See [specs/007-conflict-candidates](../../specs/007-conflict-candidates/spec.md).
