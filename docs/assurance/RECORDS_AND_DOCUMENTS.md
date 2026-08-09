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
