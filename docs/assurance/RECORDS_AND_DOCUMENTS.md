# Records and Document Management Baseline

**Document ID:** LG-REC-001  
**Status:** Proposed; legal and operations validation required  
**Owner:** Records owner

## Record model

An immutable file object, logical document, version, derivative, record classification, publication state, and evidence item are separate concepts. Originals, scans, OCR, translations, redactions, signatures, and exported copies preserve provenance and never overwrite their source by default.

## Controls

- Record source, uploader/creator, timestamps, hash, classification, matter relation, review state, and retention candidate.
- Restrict client publication to an explicit authorized action and projection.
- Treat evidence custody as append-only and attributable; hash integrity never substitutes for authenticity review.
- Apply legal hold before ordinary disposal. Destruction requires an approved, logged workflow and must account for backup behavior.
- Keep physical record intake/scanning and external extraction distinct from native digital creation.

## M0 posture

M0 provides interface and storage foundations only. Document taxonomy, retention schedule, signature requirements, evidence classification, and destruction authority remain validation-gated.

## Erasure without destruction

Erasure is implemented as **key destruction, not record destruction**. Personal data is stored encrypted under a key belonging to its subject; erasing the subject destroys that key. The record survives with its append-only guarantees intact, satisfying ADR-010, and the personal data inside becomes permanently unreadable. It also reaches backups, which ordinary deletion cannot: a backup holding ciphertext is inert once its key is gone.

An active legal hold refuses erasure. That check is a domain invariant rather than an authorization check, because a hold a sufficiently privileged actor can override is a suggestion rather than a hold.

Record destruction itself is refused in every case while G6 is shut, with a reason distinguishing a hold from the absence of an approved retention schedule.

**Two limitations, recorded rather than solved.** The key is stored in the same database as the ciphertext, so anyone with database access holds both halves — this is an erasure mechanism, not a confidentiality control, and must not be described as encryption at rest. A separate managed key store depends on ODR-005. And encrypted values cannot be matched, so the future conflict-detection work must decrypt in memory rather than assume readable stored values.

See [specs/006-records-lifecycle](../../specs/006-records-lifecycle/spec.md).
