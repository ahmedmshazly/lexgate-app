# G1 Security and Engineering Review

**Feature**: Gate Readiness Programme  
**Status**: Evidence checklist — blocked pending accountable review  
**Classification**: Internal; synthetic evidence only

No sponsor, template, test result, or tool output passes G1.

| Review item                    | Required evidence                                                                                                                   | Accountable reviewer                            | Recorded outcome     |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------- |
| Access lifecycle               | Append-only grant/suspend/reinstate/revoke/correct/expire/offboard evidence, revision checks, and effective-access reader           | Security lead + Engineering lead                | No approval recorded |
| Negative authorization         | Role-only, cross-organization, self-expansion, browser, stale, replay, suspended/revoked/offboarded, and emergency denials          | Security lead                                   | No approval recorded |
| Identity and MFA/provider      | Approved provider, MFA/provider review, verified session, recovery, expiry, invalidation, provisioning, and deprovisioning evidence | Security lead + Architecture lead               | No approval recorded |
| Accessible identity operations | Accessible MFA/recovery/time-out approach and future browser evidence                                                               | Security lead + Accessibility reviewer          | No approval recorded |
| Threat model and findings      | Threat-model review, material-finding disposition, penetration approach, and exception register                                     | Security lead                                   | No approval recorded |
| Incident and recovery          | Access-review/offboarding procedure, emergency removal runbook, incident exercise, backup/recovery evidence                         | Engineering lead + Security lead                | No approval recorded |
| Matter-access legal boundary   | SEC-MAT-001 Egyptian-lawyer validation for real matter access; break-glass remains separate and unavailable                         | Security lead + Lead practising Egyptian lawyer | No approval recorded |

## Repository evidence available for review

- Synthetic lifecycle commands, immutable approvals/receipts/events, effective access projections, revision-aware authorization evidence, atomic audit/outbox writes, and a serializable revoke race are implemented and verified.
- The local migration is additive and its controlled synthetic legacy-row backfill was exercised. Legacy M1 rows remain immutable; a rollback cannot restore revoked effective access.
- A provider-neutral session-invalidation intent exists, but no provider, verified production session, MFA, recovery, provisioning, or deprovisioning integration exists.
- These are technical inputs for the named reviewers. They do not alter any row above or pass G1.

## Approval record

- **Security lead**: No approval recorded
- **Engineering lead**: No approval recorded
- **Scope of any future approval**: Must identify activated capability, evidence references, residual risk, compensating behavior, expiry/review date, and release impact.
- **Safe interim behavior**: Synthetic provider-neutral foundation only; no external identity provider, credential, login route, client data, real matter, or break-glass path.
