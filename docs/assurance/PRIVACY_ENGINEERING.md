# Privacy Engineering Baseline

**Document ID:** LG-PRV-001  
**Status:** Proposed; Egyptian privacy review required  
**Owner:** Privacy/DPO reviewer

## Principles

Purpose specificity, data minimization, source and accuracy visibility, controlled access, retention limitation, demonstrable processing, human review, and legal-professional confidentiality apply by design.

## Engineering requirements

- Every new personal-data field records purpose, classification, subject category, source, retention candidate, access boundary, and validation requirement.
- Public enquiry and marketing forms collect only minimal data. Sensitive information is not requested unless a validated workflow requires it.
- Processing, consent, rights request, retention, legal hold, destruction, transfer, and breach records are separate controlled workflows.
- Analytics, monitoring, support, exports, screenshots, and test data are assessed as processing contexts; synthetic fixtures are mandatory in development.
- Cross-border hosting or provider use is blocked until its legal and privacy gate is approved.

## M0 posture

M0 stores only synthetic local development data. It establishes the data-classification vocabulary, privacy review fields in the spec templates, and provider/collection guardrails. It does not activate a privacy notice, consent collection, data-subject requests, retention schedules, or production transfers.
