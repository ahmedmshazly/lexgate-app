# Domain and Data Architecture

**Document ID:** LG-DOM-001  
**Status:** Proposed canonical D10 replacement; field validation required  
**Owner:** Architecture and legal-operations leads

## Aggregate boundaries

| Aggregate                        | Responsibility                                                | Key separation                                 |
| -------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| Identity / Membership            | Account, membership, credential and authority references      | System role != professional authority          |
| Party                            | Person/organization, names, aliases, contacts, representation | Prospect/client/matter roles are relationships |
| Enquiry / Conflict review        | Intake evidence, search candidates, legal reviewer decision   | Candidate match != cleared conflict            |
| Engagement                       | Accepted scope, terms, signatories, versions                  | Payment != engagement                          |
| Matter                           | Legal work container, team, restrictions, lifecycle           | Matter != proceeding                           |
| Proceeding                       | Jurisdictional/procedural stream within a matter              | Submission != official acceptance              |
| Deadline / Hearing / Task        | Rule-versioned deadlines, events, operational work            | Task != deadline                               |
| Document / Version / File object | Logical document, immutable file, derivatives, publication    | Final != client visible                        |
| Evidence item                    | Classification and custody                                    | Document != evidence                           |
| Communication                    | Content class, delivery, acknowledgement                      | Delivery attempt != informed client            |
| Finance                          | Invoice, payment, allocation, reconciliation                  | Payment != legal state                         |
| Privacy / Records                | Processing, consent, hold, retention, destruction             | Archive != destruction                         |

## Data principles

Use opaque immutable identifiers, separate human business references, UTC instants with an explicitly modeled legal/local date where needed, currency-safe money values, append-only audit/custody history, and effective-dated rule versions. Sensitive or legal material is classified at collection and restricted by purpose and access policy.

## Material commands

Future modules use commands like `CompleteConflictReview`, `ActivateEngagement`, `OpenMatter`, `ConfirmLegalDeadline`, `PublishDocumentToClient`, `IssueInvoice`, `CloseMatter`, and `ApproveRecordDestruction`. Generic status update endpoints are prohibited for those transitions.

## M0 data boundary

M0 creates database connection, migration, outbox, audit interfaces, and synthetic seed conventions only. It does not create production entity tables or legal rule values before their release gates.
