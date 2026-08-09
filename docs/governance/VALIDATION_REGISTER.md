# Validation and Release-Gate Register

**Document ID:** LG-GOV-003  
**Status:** Active

| Gate                           | Applies to | Evidence required                                                                                         | Approval                          |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------- | --------------------------------- |
| G0 Foundation                  | M0         | Clean bootstrap, full CI evidence, complete traceability, production E2E, automated RTL/a11y shell checks | Engineering + quality leads       |
| G1 Identity and authorization  | M1         | Policy tests, negative access tests, MFA/provider review                                                  | Security + engineering leads      |
| G2 Legal intake/conflicts      | M2–M3      | Egyptian lawyer scenario validation and conflict evidence                                                 | Lead practising Egyptian lawyer   |
| G3 Matters/deadlines/documents | M4–M6      | SOP validation, rule-version review, custody and integrity tests                                          | Legal operations + legal reviewer |
| G4 Client portal               | M7         | Projection review, client authorization tests, privacy review                                             | Security + privacy reviewers      |
| G5 Finance and providers       | M8/M10     | Accountant, ETA/provider contracts, idempotency/reconciliation tests                                      | Finance owner                     |
| G6 Privacy and records         | M9         | Processing register, retention/legal-hold/destruction review                                              | Privacy/DPO reviewer              |
| G7 AI                          | M11        | Approved use case, provider review, adversarial and human-review evidence                                 | Sponsor + legal/privacy/security  |

A gate is passed only for the stated release scope. Passing a lower-risk gate does not imply approval of an adjacent feature.
