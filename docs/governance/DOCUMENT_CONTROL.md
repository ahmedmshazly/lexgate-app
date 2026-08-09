# Document Control Standard

**Document ID:** LG-GOV-001  
**Status:** Approved for Milestone M0  
**Owner:** Project Sponsor  
**Review cadence:** At every release gate and at least quarterly

## Required front matter

Every canonical Markdown document must declare its document ID, title, owner, status, version, classification, effective date, review date, and authoritative dependencies. Requirements and ADRs use their respective structured schemas instead of duplicating those fields in prose.

## Change control

Material changes require: a concise rationale; affected requirement IDs; affected source IDs; risk tier; approving owner; validation impact; and a traceability update. A source refresh does not itself approve a legal interpretation or production activation.

## Classification

| Classification        | Handling                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Public                | May be published after content approval.                                                                                |
| Internal              | Project team only.                                                                                                      |
| Confidential          | Need-to-know staff and approved suppliers.                                                                              |
| Strictly confidential | Legal, client, security, privacy, or restricted operational information; no external sharing without recorded approval. |

Do not place real client information, credentials, private legal advice, or production exports in repository documentation.

## Authority hierarchy

Controlling Arabic legal source → approved legal interpretation → canonical SRS and structured records → approved ADR/SOP → implementation documentation. Conflicts are recorded, not resolved by convenience.
