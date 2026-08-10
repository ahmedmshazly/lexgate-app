# ODR-004 Migration Decision Pack

**Status:** Separately blocked future-decision template  
**Accountable approvers:** Product, legal operations, Privacy/DPO, Security/Engineering, and practising lawyer as applicable  
**Classification:** Internal metadata/redacted-reference template only  
**Boundary:** **No source extract or import is authorized.** **No approval recorded.** No real personal data, production export, client file, or credential belongs in this repository.

## Trigger and scope

This pack may be opened only after the Pilot Operating Profile identifies a bounded business need. It must state source owner, legal authority to extract, exact systems/date range, records in/out of scope, and the accountable migration lead. Manual re-keying is a migration and cannot bypass this pack.

## Required decision record

| Area                   | Required evidence / decision                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source and authority   | Source inventory; legal authority; source owner; authoritative-system decision; access groups; immutable source preservation                               |
| Data map               | Field-by-field mapping; excluded fields; provenance; categories/sensitivity; retention and legal-hold assessment                                           |
| Quality                | Redacted/synthetic profiling results for completeness, duplicates, Arabic/English/Latin variants, orphan rates, and approved thresholds                    |
| Legal/privacy/security | Privacy/DPO review; security/read-model/access review; lawyer validation of conflict/engagement implications; processor/transfer analysis where applicable |
| Controlled rehearsal   | Synthetic/redacted dry run; reconciliation plan; error queue; source provenance; acceptance thresholds; named owners                                       |
| Rollout/recovery       | Feature switch, bounded rollout, monitored reconciliation, and rollback that leaves source records unchanged rather than deleting/overwriting them         |
| Approvals              | Exact scope, evidence links, residual risks, conditions, compensating behavior, owner, expiry/review date, and release impact                              |

## Required non-activation controls

- Preserve the source unchanged. A rollback reverses the new reader/feature position; it does not delete or overwrite source history.
- No conflict clearance, engagement, authority, matter access, or financial/legal conclusion may be inferred from imported or mapped information.
- Reconciliation must distinguish accepted, rejected, unresolved, and duplicate candidates without exposing records to unauthorized users.
- G1, ODR-003, and G2 must be passed where their scope applies before a real-data migration can proceed.

## Current outcome

No migration scope, source, legal authority, mapping, quality profile, dry run, reconciliation, rollout, or approval exists. The greenfield/no-migration position remains in force.
