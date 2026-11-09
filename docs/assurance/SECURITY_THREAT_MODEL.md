# Security Architecture and Threat Model

**Document ID:** LG-SEC-001  
**Status:** Proposed baseline; threat-model validation required  
**Owner:** Security lead

## Security objectives

Protect confidentiality, integrity, availability, accountability, and recoverability of client, prospect, employee, legal, financial, and operational information. Matter isolation comes before generic application convenience.

## Principal threats and controls

| Threat                        | Baseline control                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Unauthorized matter access    | Deny-by-default server-side policy evaluation, negative tests, explicit relationships, audited break-glass design. |
| Client-projection leakage     | Dedicated projections, contract tests, no browser-side redaction security model.                                   |
| Credential/secrets exposure   | Secret-free source, environment isolation, least privilege, rotation/runbook requirements.                         |
| Public confidential files     | Private object storage, authorized delivery paths, short-lived access only when approved.                          |
| Provider/webhook spoofing     | Verified signatures, replay protection, idempotency, source evidence, reconciliation.                              |
| History tampering             | Append-only audit/custody records, versioning, correction/supersession rather than overwrite.                      |
| Supply-chain compromise       | Locked dependencies, review, CI checks, vulnerability management, no unapproved provider SDKs.                     |
| Prompt injection or AI misuse | AI disabled by default; later gateway, context isolation, human approval, and audit required.                      |

## M0 controls

M0 implements safe environment handling, dependency boundaries, structured logging interfaces, test isolation, private storage adapters, and no production access paths. It does not claim production security certification. Threat modeling, penetration testing, incident exercises, and vendor review are release gates.
