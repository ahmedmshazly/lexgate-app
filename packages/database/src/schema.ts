import {
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const outboxEvents = pgTable("outbox_events", {
  id: uuid("id").primaryKey(),
  type: text("type").notNull(),
  aggregateId: text("aggregate_id").notNull(),
  payload: jsonb("payload").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  attempts: integer("attempts").notNull().default(0),
  lastAttemptedAt: timestamp("last_attempted_at", {
    withTimezone: true,
  }),
  lastError: text("last_error"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey(),
  actorAccountId: text("actor_account_id").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
});

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").primaryKey(),
    accountId: text("account_id").notNull(),
    organizationId: text("organization_id").notNull(),
    systemRole: text("system_role").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("organization_memberships_account_organization_unique").on(
      table.accountId,
      table.organizationId,
    ),
  ],
);

export const restrictedResourceAccessGrants = pgTable(
  "restricted_resource_access_grants",
  {
    id: uuid("id").primaryKey(),
    accountId: text("account_id").notNull(),
    organizationId: text("organization_id").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    operation: text("operation").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex(
      "restricted_resource_access_grants_exact_relationship_unique",
    ).on(
      table.accountId,
      table.organizationId,
      table.resourceType,
      table.resourceId,
      table.operation,
    ),
  ],
);

export const authorizationDecisions = pgTable("authorization_decisions", {
  id: uuid("id").primaryKey(),
  correlationId: text("correlation_id").notNull(),
  accountId: text("account_id").notNull(),
  organizationId: text("organization_id").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  operation: text("operation").notNull(),
  outcome: text("outcome").notNull(),
  reason: text("reason").notNull(),
  membershipRelationshipId: uuid("membership_relationship_id"),
  membershipRevision: integer("membership_revision"),
  grantRelationshipId: uuid("grant_relationship_id"),
  grantRevision: integer("grant_revision"),
  decidedAt: timestamp("decided_at", { withTimezone: true }).notNull(),
});

/**
 * Reviewer-authored approval evidence for an access expansion. This is
 * deliberately distinct from a lifecycle event: an approval authorizes a
 * bounded command, but never grants access by itself.
 */
export const accessLifecycleApprovals = pgTable(
  "access_lifecycle_approvals",
  {
    id: uuid("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    requesterAccountId: text("requester_account_id").notNull(),
    approverAccountId: text("approver_account_id").notNull(),
    subjectAccountId: text("subject_account_id").notNull(),
    relationshipKind: text("relationship_kind").notNull(),
    resourceType: text("resource_type"),
    resourceId: text("resource_id"),
    operation: text("operation"),
    approvedAt: timestamp("approved_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    correlationId: text("correlation_id").notNull(),
    reasonCode: text("reason_code").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("access_lifecycle_approvals_scope_index").on(
      table.organizationId,
      table.subjectAccountId,
      table.relationshipKind,
      table.resourceType,
      table.resourceId,
      table.operation,
    ),
  ],
);

export const membershipLifecycleEvents = pgTable(
  "membership_lifecycle_events",
  {
    id: uuid("id").primaryKey(),
    relationshipId: uuid("relationship_id").notNull(),
    commandId: uuid("command_id").notNull(),
    organizationId: text("organization_id").notNull(),
    accountId: text("account_id").notNull(),
    eventType: text("event_type").notNull(),
    resultingState: text("resulting_state").notNull(),
    priorRevision: integer("prior_revision"),
    revision: integer("revision").notNull(),
    operatorAccountId: text("operator_account_id").notNull(),
    requesterAccountId: text("requester_account_id"),
    approverAccountId: text("approver_account_id"),
    approvalId: uuid("approval_id"),
    correlationId: text("correlation_id").notNull(),
    reasonCode: text("reason_code").notNull(),
    effectiveAt: timestamp("effective_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    unique("membership_lifecycle_events_revision_unique").on(
      table.relationshipId,
      table.revision,
    ),
    index("membership_lifecycle_events_scope_index").on(
      table.organizationId,
      table.accountId,
      table.occurredAt,
    ),
  ],
);

export const restrictedResourceAccessLifecycleEvents = pgTable(
  "restricted_resource_access_lifecycle_events",
  {
    id: uuid("id").primaryKey(),
    relationshipId: uuid("relationship_id").notNull(),
    commandId: uuid("command_id").notNull(),
    organizationId: text("organization_id").notNull(),
    accountId: text("account_id").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    operation: text("operation").notNull(),
    eventType: text("event_type").notNull(),
    resultingState: text("resulting_state").notNull(),
    priorRevision: integer("prior_revision"),
    revision: integer("revision").notNull(),
    operatorAccountId: text("operator_account_id").notNull(),
    requesterAccountId: text("requester_account_id"),
    approverAccountId: text("approver_account_id"),
    approvalId: uuid("approval_id"),
    correlationId: text("correlation_id").notNull(),
    reasonCode: text("reason_code").notNull(),
    effectiveAt: timestamp("effective_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    unique("restricted_resource_access_lifecycle_events_revision_unique").on(
      table.relationshipId,
      table.revision,
    ),
    index("restricted_resource_access_lifecycle_events_scope_index").on(
      table.organizationId,
      table.accountId,
      table.resourceType,
      table.resourceId,
      table.operation,
      table.occurredAt,
    ),
  ],
);

export const effectiveOrganizationMemberships = pgTable(
  "effective_organization_memberships",
  {
    relationshipId: uuid("relationship_id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    accountId: text("account_id").notNull(),
    systemRole: text("system_role").notNull(),
    state: text("state").notNull(),
    revision: integer("revision").notNull(),
    effectiveAt: timestamp("effective_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    lastEventId: uuid("last_event_id").notNull(),
  },
  (table) => [
    uniqueIndex("effective_organization_memberships_scope_unique").on(
      table.organizationId,
      table.accountId,
    ),
  ],
);

export const effectiveRestrictedResourceAccessGrants = pgTable(
  "effective_restricted_resource_access_grants",
  {
    relationshipId: uuid("relationship_id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    accountId: text("account_id").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    operation: text("operation").notNull(),
    state: text("state").notNull(),
    revision: integer("revision").notNull(),
    effectiveAt: timestamp("effective_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    lastEventId: uuid("last_event_id").notNull(),
  },
  (table) => [
    uniqueIndex("effective_restricted_resource_access_scope_unique").on(
      table.organizationId,
      table.accountId,
      table.resourceType,
      table.resourceId,
      table.operation,
    ),
  ],
);

export const accessLifecycleCommandReceipts = pgTable(
  "access_lifecycle_command_receipts",
  {
    commandId: uuid("command_id").primaryKey(),
    commandFingerprint: text("command_fingerprint").notNull(),
    relationshipId: uuid("relationship_id").notNull(),
    eventId: uuid("event_id").notNull(),
    revision: integer("revision").notNull(),
    state: text("state").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("access_lifecycle_command_receipts_event_unique").on(
      table.eventId,
    ),
  ],
);

export const parties = pgTable(
  "parties",
  {
    id: uuid("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    kind: text("kind").notNull(),
    processingPurpose: text("processing_purpose").notNull(),
    dataClassification: text("data_classification").notNull(),
    subjectCategory: text("subject_category").notNull(),
    source: text("source").notNull(),
    retentionCandidate: text("retention_candidate").notNull(),
    accessBoundary: text("access_boundary").notNull(),
    validationRequirement: text("validation_requirement").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    createdByAccountId: text("created_by_account_id").notNull(),
  },
  (table) => [
    unique("parties_organization_id_unique").on(table.organizationId, table.id),
  ],
);

export const partyNameForms = pgTable(
  "party_name_forms",
  {
    id: uuid("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    partyId: uuid("party_id").notNull(),
    value: text("value").notNull(),
    formType: text("form_type").notNull(),
    languageTag: text("language_tag").notNull(),
    script: text("script"),
    reviewState: text("review_state").notNull(),
    processingPurpose: text("processing_purpose").notNull(),
    dataClassification: text("data_classification").notNull(),
    subjectCategory: text("subject_category").notNull(),
    source: text("source").notNull(),
    retentionCandidate: text("retention_candidate").notNull(),
    accessBoundary: text("access_boundary").notNull(),
    validationRequirement: text("validation_requirement").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
    recordedByAccountId: text("recorded_by_account_id").notNull(),
    supersedesNameFormId: uuid("supersedes_name_form_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId, table.partyId],
      foreignColumns: [parties.organizationId, parties.id],
      name: "party_name_forms_party_scope_fk",
    }),
    unique("party_name_forms_scope_identity_unique").on(
      table.organizationId,
      table.partyId,
      table.id,
    ),
    foreignKey({
      columns: [
        table.organizationId,
        table.partyId,
        table.supersedesNameFormId,
      ],
      foreignColumns: [table.organizationId, table.partyId, table.id],
      name: "party_name_forms_predecessor_scope_fk",
    }),
    uniqueIndex("party_name_forms_successor_unique").on(
      table.supersedesNameFormId,
    ),
  ],
);

export const partyPrimaryNameAssignments = pgTable(
  "party_primary_name_assignments",
  {
    id: uuid("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    partyId: uuid("party_id").notNull(),
    nameFormId: uuid("name_form_id").notNull(),
    supersedesAssignmentId: uuid("supersedes_assignment_id"),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
    recordedByAccountId: text("recorded_by_account_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId, table.partyId],
      foreignColumns: [parties.organizationId, parties.id],
      name: "party_primary_name_assignments_party_scope_fk",
    }),
    foreignKey({
      columns: [table.organizationId, table.partyId, table.nameFormId],
      foreignColumns: [
        partyNameForms.organizationId,
        partyNameForms.partyId,
        partyNameForms.id,
      ],
      name: "party_primary_name_assignments_name_scope_fk",
    }),
    unique("party_primary_name_assignments_scope_identity_unique").on(
      table.organizationId,
      table.partyId,
      table.id,
    ),
    foreignKey({
      columns: [
        table.organizationId,
        table.partyId,
        table.supersedesAssignmentId,
      ],
      foreignColumns: [table.organizationId, table.partyId, table.id],
      name: "party_primary_name_assignments_predecessor_scope_fk",
    }),
    uniqueIndex("party_primary_name_assignments_successor_unique").on(
      table.supersedesAssignmentId,
    ),
  ],
);

export const partyContactAssertions = pgTable(
  "party_contact_assertions",
  {
    id: uuid("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    partyId: uuid("party_id").notNull(),
    contactType: text("contact_type").notNull(),
    value: text("value").notNull(),
    operationalPurpose: text("operational_purpose").notNull(),
    reviewState: text("review_state").notNull(),
    processingPurpose: text("processing_purpose").notNull(),
    dataClassification: text("data_classification").notNull(),
    subjectCategory: text("subject_category").notNull(),
    source: text("source").notNull(),
    retentionCandidate: text("retention_candidate").notNull(),
    accessBoundary: text("access_boundary").notNull(),
    validationRequirement: text("validation_requirement").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
    recordedByAccountId: text("recorded_by_account_id").notNull(),
    supersedesContactId: uuid("supersedes_contact_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId, table.partyId],
      foreignColumns: [parties.organizationId, parties.id],
      name: "party_contact_assertions_party_scope_fk",
    }),
    unique("party_contact_assertions_scope_identity_unique").on(
      table.organizationId,
      table.partyId,
      table.id,
    ),
    foreignKey({
      columns: [table.organizationId, table.partyId, table.supersedesContactId],
      foreignColumns: [table.organizationId, table.partyId, table.id],
      name: "party_contact_assertions_predecessor_scope_fk",
    }),
    uniqueIndex("party_contact_assertions_successor_unique").on(
      table.supersedesContactId,
    ),
  ],
);

export const partyRepresentationClaims = pgTable(
  "party_representation_claims",
  {
    id: uuid("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    representedPartyId: uuid("represented_party_id").notNull(),
    representativePartyId: uuid("representative_party_id").notNull(),
    claimState: text("claim_state").notNull(),
    reviewState: text("review_state").notNull(),
    processingPurpose: text("processing_purpose").notNull(),
    dataClassification: text("data_classification").notNull(),
    subjectCategory: text("subject_category").notNull(),
    source: text("source").notNull(),
    retentionCandidate: text("retention_candidate").notNull(),
    accessBoundary: text("access_boundary").notNull(),
    validationRequirement: text("validation_requirement").notNull(),
    effectiveFrom: timestamp("effective_from", { withTimezone: true }),
    effectiveUntil: timestamp("effective_until", { withTimezone: true }),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
    recordedByAccountId: text("recorded_by_account_id").notNull(),
    supersedesClaimId: uuid("supersedes_claim_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId, table.representedPartyId],
      foreignColumns: [parties.organizationId, parties.id],
      name: "party_representation_claims_represented_scope_fk",
    }),
    foreignKey({
      columns: [table.organizationId, table.representativePartyId],
      foreignColumns: [parties.organizationId, parties.id],
      name: "party_representation_claims_representative_scope_fk",
    }),
    unique("party_representation_claims_represented_scope_identity_unique").on(
      table.organizationId,
      table.representedPartyId,
      table.id,
    ),
    foreignKey({
      columns: [
        table.organizationId,
        table.representedPartyId,
        table.supersedesClaimId,
      ],
      foreignColumns: [
        table.organizationId,
        table.representedPartyId,
        table.id,
      ],
      name: "party_representation_claims_predecessor_scope_fk",
    }),
    uniqueIndex("party_representation_claims_successor_unique").on(
      table.supersedesClaimId,
    ),
  ],
);

export const partyPossibleDuplicateFlags = pgTable(
  "party_possible_duplicate_flags",
  {
    id: uuid("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    firstPartyId: uuid("first_party_id").notNull(),
    secondPartyId: uuid("second_party_id").notNull(),
    reviewState: text("review_state").notNull(),
    // Why this pair was raised. Without it every flag looks identical to a
    // reviewer, whatever prompted it.
    matchRationale: text("match_rationale").notNull(),
    // What the reviewer concluded, distinct from whether they looked. A
    // "reviewed" flag with no disposition cannot tell a careful judgement
    // from a click-through under alert fatigue.
    disposition: text("disposition"),
    processingPurpose: text("processing_purpose").notNull(),
    dataClassification: text("data_classification").notNull(),
    subjectCategory: text("subject_category").notNull(),
    source: text("source").notNull(),
    retentionCandidate: text("retention_candidate").notNull(),
    accessBoundary: text("access_boundary").notNull(),
    validationRequirement: text("validation_requirement").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
    recordedByAccountId: text("recorded_by_account_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId, table.firstPartyId],
      foreignColumns: [parties.organizationId, parties.id],
      name: "party_possible_duplicate_flags_first_scope_fk",
    }),
    foreignKey({
      columns: [table.organizationId, table.secondPartyId],
      foreignColumns: [parties.organizationId, parties.id],
      name: "party_possible_duplicate_flags_second_scope_fk",
    }),
    uniqueIndex("party_possible_duplicate_flags_pair_unique").on(
      table.organizationId,
      table.firstPartyId,
      table.secondPartyId,
    ),
  ],
);

export const partyIdentityAuditEvents = pgTable(
  "party_identity_audit_events",
  {
    commandId: uuid("command_id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    actorAccountId: text("actor_account_id").notNull(),
    correlationId: text("correlation_id").notNull(),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: uuid("resource_id").notNull(),
    assertionId: uuid("assertion_id").notNull(),
    assertionCategory: text("assertion_category").notNull(),
    commandFingerprint: text("command_fingerprint").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId, table.resourceId],
      foreignColumns: [parties.organizationId, parties.id],
      name: "party_identity_audit_events_resource_scope_fk",
    }),
  ],
);

/**
 * Append-only ledger of every legal hold placement and release. A release is a
 * successor event; a placement is never edited to represent release.
 */
export const legalHoldEvents = pgTable(
  "legal_hold_events",
  {
    id: uuid("id").primaryKey(),
    holdId: uuid("hold_id").notNull(),
    organizationId: text("organization_id").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    eventType: text("event_type").notNull(),
    priorRevision: integer("prior_revision"),
    revision: integer("revision").notNull(),
    operatorAccountId: text("operator_account_id").notNull(),
    reasonCode: text("reason_code").notNull(),
    correlationId: text("correlation_id").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    unique("legal_hold_events_revision_unique").on(
      table.holdId,
      table.revision,
    ),
    index("legal_hold_events_resource_index").on(
      table.organizationId,
      table.resourceType,
      table.resourceId,
      table.occurredAt,
    ),
  ],
);

/** Rebuildable projection answering "is this held right now?" in one read. */
export const effectiveLegalHolds = pgTable(
  "effective_legal_holds",
  {
    holdId: uuid("hold_id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    state: text("state").notNull(),
    revision: integer("revision").notNull(),
    placedAt: timestamp("placed_at", { withTimezone: true }).notNull(),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    lastEventId: uuid("last_event_id").notNull(),
  },
  (table) => [
    index("effective_legal_holds_resource_index").on(
      table.organizationId,
      table.resourceType,
      table.resourceId,
      table.state,
    ),
  ],
);

/**
 * One key per subject. Destroying the key IS erasure — this is the single
 * table where a value is nulled in place, and it deliberately carries no
 * append-only trigger for that reason. The erasure event itself is recorded
 * immutably in audit_events, so the act stays evidenced after the key is gone.
 */
export const subjectEncryptionKeys = pgTable("subject_encryption_keys", {
  subjectId: uuid("subject_id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  keyMaterial: text("key_material"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  shreddedAt: timestamp("shredded_at", { withTimezone: true }),
  shreddedByAccountId: text("shredded_by_account_id"),
  shredReasonCode: text("shred_reason_code"),
});
