# Feature Specification: Records Lifecycle — Retention, Legal Hold, and Erasure

**Requirement IDs:** REC-HLD-001 (primary), PRV-MIN-001 (boundary), REC-DOC-001 and REC-EVD-001 (out of scope, no documents exist yet)
**Risk tier:** P0
**Release / validation gate:** M9 / G6. **No gate is closed by this feature.** This is an M0 foundation built ahead of its gate, following the precedent set by the technical G1 increment in feature 004.
**Data classification:** Internal; synthetic fixtures only
**Legal/privacy validation:** required, and **blocked** — the Privacy/DPO reviewer for G6 has not been engaged
**Feature owner:** Records
**Status:** draft — proposed for approval
**Input:** Implement the approved REC-HLD-001. An active legal hold prevents ordinary retention destruction until released by authorised process, and a destruction command rejects held records. Erasure works by crypto-shredding a per-subject key so the append-only record survives while its personal data becomes unreadable.

## User outcome and scope

Every one of the repository's tables is insert-only, protected by append-only guards that block updates and deletions. Destruction is therefore impossible today — **but only by accident of implementation, not by design**. Nothing records that a hold applies, so a held record and an unheld one are indistinguishable: everything is equally undeletable for the wrong reason.

That is the problem this feature exists to fix, and the reason for its timing. **A legal hold cannot be safely retrofitted onto deletion logic built without it.** A hold introduced after destruction already works must prove it can stop logic designed with no notion of being stopped. The safest moment to build the hold is while destruction remains impossible.

`REC-HLD-001` is already approved: _"An active legal hold shall prevent ordinary retention destruction until released by authorized process"_, with the acceptance criterion _"destruction command rejects held records"_. This feature implements approved intent; it does not invent policy.

**The measurable outcome**: a records officer can place a hold that demonstrably refuses erasure and destruction, release it through a recorded act, and erase a subject's personal data in a way that leaves the history of what happened fully intact.

### Erasure without destruction

`ADR-010` is accepted and controlling: use _"correction, supersession, versioning, and append-only events instead of destructive updates"_. Erasure appears to contradict it.

It does not, if erasure destroys **the key rather than the record**. Personal data is held encrypted under a key belonging to its subject. Erasing the subject destroys that key: the row survives untouched, its append-only guarantees intact, and the personal data inside becomes permanently unreadable. Erasure genuinely works, and record destruction remains something the system will only ever decline.

This also reaches backups, which ordinary deletion never can — a backup holding ciphertext is inert once its key is gone.

**Actors**: a records officer placing or releasing holds; a privacy officer erasing a subject; any reader of an erased record, who must still be able to see what happened even though the content is gone.

**In scope**

- Legal holds that are placed, released, and reviewable, covering any kind of record.
- Refusal of erasure while a hold is active.
- Refusal of record destruction in every case, with a stated reason.
- Erasure of a subject's personal data by destroying its key.
- Attribution and reason for every hold, release, and erasure.

**Explicit exclusions — this feature must not**

- Close G6, or claim any privacy or records approval.
- Process real personal data. Every value remains synthetic.
- Destroy a record, drop an append-only guard, or introduce any destructive update.
- Run automated retention expiry, or act on a schedule. Every erasure is an explicit command.
- Decide _when_ a real subject may invoke erasure. That is a legal determination nobody here can make.
- Introduce a document, matter, or evidence record. Those arrive at M4–M6.

**Dependencies**: `REC-HLD-001` and `ADR-010` as controlling authority. `LEG-RUL-001` (versioned, reviewer-approved rules) governs any future retention schedule and is not satisfied. `ODR-005` governs where keys are ultimately held and is open.

**Affected languages and RTL surfaces**: none. This feature introduces no user-facing surface.

## User scenarios and acceptance criteria

### Scenario 1 — A hold refuses destruction (Priority: P1)

**Preconditions**: A record exists and a records officer has authority to place holds.

**Successful outcome**: While the hold is active, nothing can erase or destroy the record, and the refusal states why.

1. **Given** an active hold on a record, **when** erasure of that record's subject is requested, **then** it is refused and the refusal identifies the hold as the cause.
2. **Given** an active hold, **when** destruction of the record is requested, **then** it is refused.
3. **Given** no hold at all, **when** destruction is requested, **then** it is still refused, because no approved retention schedule exists and the records gate is shut.
4. **Given** a hold placed by one officer, **when** another attempts to erase the subject, **then** authority does not override the hold. A hold is not a permission that a sufficiently privileged actor can ignore.

### Scenario 2 — A hold is released by a recorded act (Priority: P1)

**Preconditions**: An active hold exists.

**Successful outcome**: Release is itself an attributable event, and the earlier hold remains visible afterwards.

1. **Given** an active hold, **when** it is released with an operator and a reason, **then** the release is recorded as a successor fact and the original hold remains readable.
2. **Given** a released hold, **when** the record's hold history is inspected, **then** both the placement and the release are present with their operators, times, and reasons.
3. **Given** a released hold, **when** erasure is requested, **then** it is no longer refused on the ground of that hold.
4. **Given** a hold that was never placed, **when** release is attempted, **then** it is refused rather than silently recorded.

### Scenario 3 — Erasure removes the content but not the history (Priority: P1)

**Preconditions**: A subject exists with recorded names and contact points, and no hold applies.

**Successful outcome**: The subject's personal data becomes unreadable while the record of what happened survives in full.

1. **Given** an erased subject, **when** their record is read, **then** every personal value is reported as erased rather than returned.
2. **Given** an erased subject, **when** their record is read, **then** the sequence of what was recorded and when, and by whom, remains fully readable.
3. **Given** an erased subject, **when** the underlying stored data is inspected directly, **then** no personal value is recoverable from it.
4. **Given** an erasure, **when** the erasure itself is inspected, **then** it names its operator, its reason, and its time.
5. **Given** an already-erased subject, **when** erasure is requested again, **then** the request resolves without error and without a second erasure being recorded as if it removed something.

### Scenario 4 — Nothing expires on its own (Priority: P2)

**Preconditions**: Records exist that a retention schedule would eventually cover.

**Successful outcome**: No record changes state without an explicit, attributable act.

1. **Given** any record of any age, **when** time passes, **then** nothing is erased or destroyed automatically.
2. **Given** a request to destroy a record, **when** it is evaluated, **then** the refusal reason distinguishes a hold from the absence of an approved schedule, so a reader can tell why it was refused.

### Edge cases

- A hold is placed on a record that does not exist, or on a kind of record the system does not yet hold.
- Two holds are placed on the same record for different reasons, and only one is released.
- Erasure is requested for a subject who has no personal data recorded.
- A hold is placed while an erasure is already being evaluated.
- A reader encounters a record whose key is gone but whose values are still stored.

## Requirements

- **FR-001**: Every hold and every release MUST record its operator, its reason, its time, and the record it covers. **Negative case**: an anonymous or unexplained hold is refused. **Evidence**: hold history for a covered record.
- **FR-002**: A release MUST be recorded as a successor fact. A hold record MUST NOT be edited or removed to represent release. **Negative case**: any attempt to alter a recorded hold. **Evidence**: the original hold remains readable after release.
- **FR-003**: While a hold is active, erasure of the covered subject MUST be refused, and the refusal MUST identify the hold as the cause. **Negative case**: an erasure that succeeds against a held record is a defect of the highest severity in this feature.
- **FR-004**: Operator authority MUST NOT override an active hold. **Negative case**: a privileged actor erasing a held subject.
- **FR-005**: Record destruction MUST be refused in every case while the records gate is shut, and the refusal MUST state a reason distinguishing a hold from the absence of an approved retention schedule. **Negative case**: any code path that destroys a record.
- **FR-006**: Erasure MUST operate by destroying the key that makes a subject's personal data readable, never by altering or removing the record itself. **Negative case**: a destructive update or deletion of any stored record.
- **FR-007**: After erasure, no personal value of that subject MUST be recoverable from stored data alone. **Evidence**: direct inspection of what is stored yields no readable personal value.
- **FR-008**: After erasure, the record of what happened — what was recorded, when, and by whom — MUST remain fully readable. **Negative case**: erasure that removes audit or lifecycle history.
- **FR-009**: Reading an erased subject MUST report each personal value as erased rather than failing. **Negative case**: an error or crash when reading an erased record.
- **FR-010**: No record MUST change state through the passage of time. Every erasure MUST be an explicit, attributable command. **Negative case**: any scheduled or automatic expiry.
- **FR-011**: Every value MUST remain synthetic. The existing synthetic-value control MUST continue to apply to personal data before it is made unreadable. **Negative case**: the control being bypassed because data is encrypted.
- **FR-012**: A retention schedule MUST NOT be activated by this feature. Any future schedule requires the versioned, reviewer-approved rule mechanism that `LEG-RUL-001` defines. **Evidence**: destruction refusal cites the absent schedule.
- **FR-013**: Repeating an erasure for an already-erased subject MUST resolve without error and MUST NOT record a second removal of something that no longer exists. **Negative case**: a duplicate erasure treated as a fresh one.

### Key entities

- **Legal hold**: a recorded statement that a specific record must not be erased or destroyed, carrying its operator, reason, time, and coverage. Released only by a successor fact.
- **Subject key**: the means by which a subject's personal data is readable. Its destruction is what erasure means.
- **Erasure record**: the attributable fact that a subject's personal data was made permanently unreadable, retained after the data itself is gone.
- **Destruction refusal**: the reasoned outcome of asking whether a record may be destroyed. It has no successful form while the records gate is shut.

## Non-functional and quality profile

| Test / evidence layer                                                    | Status and rationale                                                                                                                                                                                         | Acceptance evidence                                                                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Static, documentation, type, and lint                                    | **Required** — controlled documentation and strict types.                                                                                                                                                    | `pnpm format:check`, `pnpm docs:validate`, `pnpm lint`, `pnpm typecheck`                  |
| Unit/domain invariant and negative behavior                              | **Required** — hold transitions, release-as-successor, and every refusal are domain invariants.                                                                                                              | Hold transition and refusal tests                                                         |
| Database, migration, integration, contract                               | **Required** — this feature is chiefly a persistence and integrity guarantee. The decisive test crosses layers.                                                                                              | Hold-refuses-erasure, release-then-erase, unreadability after erasure, projection rebuild |
| Authorization, privacy, records, and security-negative                   | **Required** — a hold that authority can override, or an erasure that leaves data recoverable, are the two failures that matter most.                                                                        | Privileged-actor-cannot-override test; direct inspection of stored data after erasure     |
| Browser/E2E, accessibility, locale, and RTL                              | **Not applicable** — no route, view, or user-facing surface is introduced. The existing shell suites continue unchanged and would catch a regression.                                                        | Rationale recorded here and in the verification record                                    |
| Performance, resilience, backup/restore, incident, or release validation | **Not applicable to this increment** — no runtime service or operational surface changes, and no performance claim is made. Backup behaviour is discussed as a design consequence, not an operational claim. | Rationale recorded here and in the verification record                                    |

**Measurable outcomes**

- **SC-001**: 100% of record-destruction requests are refused, each with a stated reason.
- **SC-002**: Zero held subjects can be erased, including by an operator with full authority.
- **SC-003**: After erasure, zero personal values of that subject are recoverable from stored data alone.
- **SC-004**: After erasure, 100% of that subject's recorded history — what happened, when, and by whom — remains readable.
- **SC-005**: 100% of holds, releases, and erasures name an operator and a reason.
- **SC-006**: Zero records are destroyed, zero append-only guards are removed, and zero gates are closed.
- **SC-007**: Hold state is fully reconstructible from its recorded events, verified by rebuilding it.
- **SC-008**: Zero real personal data is processed at any point.

## Risks, decisions, and safe interim behavior

| Risk                                                                                                                                    | Owner    | Gate / decision           | Safe interim behavior                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Keys are stored alongside the data they protect, so anyone with access to stored data holds both halves.                                | Security | `ODR-005` open            | This is an **erasure** mechanism, not a confidentiality control, and is documented as such. A separate key store is required before real data. |
| Encrypted personal data cannot be matched, which constrains the future conflict-detection work where Arabic name variation is critical. | Records  | Affects M3                | Recorded now, before a matching engine is designed against an assumption of readable values.                                                   |
| Whether a real subject may invoke erasure over privileged material is an unanswered Egyptian legal question.                            | Privacy  | `ODR-003` and `G6` open   | The mechanism exists; its use against real data stays blocked. No erasure right is offered to anyone.                                          |
| A retention schedule could be inferred from this feature's existence.                                                                   | Records  | `LEG-RUL-001` unsatisfied | Destruction refusal explicitly cites the absent schedule, so the gap is visible rather than assumed filled.                                    |
| Building an M9 requirement at M0 could be read as advancing the release.                                                                | Records  | `G6` remains shut         | Framed as a foundation, exactly as feature 004's technical increment was for G1. No gate status changes.                                       |

## Verification record contract

`specs/006-records-lifecycle/verification.md` must map every requirement (FR-001–FR-013) and success criterion (SC-001–SC-008) to its implementation, tests, exact commands and results, residual risk, and any approved exception. It must state that G6 remains shut, that no record was destroyed, that no append-only guard was removed, and that no real personal data was processed. Missing required evidence blocks completion.
