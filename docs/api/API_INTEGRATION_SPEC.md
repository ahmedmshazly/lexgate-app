# API and Integration Specification

**Document ID:** LG-API-001  
**Status:** Approved interface principles; provider contracts pending  
**Owner:** Architecture lead

## Interface policy

Internal web mutations call application commands through server actions. Route handlers are used for webhooks, explicitly versioned HTTP APIs, and cacheable external reads; they validate input, authenticate callers, authorize resources, set safe errors, and never expose internal aggregate serialization.

## Required interface controls

- Typed request/response contracts and domain-specific errors.
- Idempotency keys for externally repeatable mutation requests.
- Optimistic concurrency where conflicting edits could compromise a material state.
- Signature verification, replay protection, and durable event evidence for webhooks.
- Provider adapters that normalize provider data without treating it as canonical legal state.
- Pagination, filtering, and search limits that avoid unauthorized enumeration.
- Correlation IDs and privacy-preserving structured logs.

## Provider posture

Email, SMS, messaging, payment, ETA, e-signature, court/government, analytics, search, and AI integrations are adapter interfaces until a vendor, contract, privacy posture, operational owner, and test plan are approved.
