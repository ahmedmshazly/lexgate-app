CREATE TABLE "access_lifecycle_approvals" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"requester_account_id" text NOT NULL,
	"approver_account_id" text NOT NULL,
	"subject_account_id" text NOT NULL,
	"relationship_kind" text NOT NULL,
	"resource_type" text,
	"resource_id" text,
	"operation" text,
	"approved_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"correlation_id" text NOT NULL,
	"reason_code" text NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "access_lifecycle_command_receipts" (
	"command_id" uuid PRIMARY KEY NOT NULL,
	"command_fingerprint" text NOT NULL,
	"relationship_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"revision" integer NOT NULL,
	"state" text NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "effective_organization_memberships" (
	"relationship_id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"account_id" text NOT NULL,
	"system_role" text NOT NULL,
	"state" text NOT NULL,
	"revision" integer NOT NULL,
	"effective_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"last_event_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "effective_restricted_resource_access_grants" (
	"relationship_id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"account_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"operation" text NOT NULL,
	"state" text NOT NULL,
	"revision" integer NOT NULL,
	"effective_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"last_event_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership_lifecycle_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"relationship_id" uuid NOT NULL,
	"command_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"account_id" text NOT NULL,
	"event_type" text NOT NULL,
	"resulting_state" text NOT NULL,
	"prior_revision" integer,
	"revision" integer NOT NULL,
	"operator_account_id" text NOT NULL,
	"requester_account_id" text,
	"approver_account_id" text,
	"approval_id" uuid,
	"correlation_id" text NOT NULL,
	"reason_code" text NOT NULL,
	"effective_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"occurred_at" timestamp with time zone NOT NULL,
	CONSTRAINT "membership_lifecycle_events_revision_unique" UNIQUE("relationship_id","revision")
);
--> statement-breakpoint
CREATE TABLE "restricted_resource_access_lifecycle_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"relationship_id" uuid NOT NULL,
	"command_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"account_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"operation" text NOT NULL,
	"event_type" text NOT NULL,
	"resulting_state" text NOT NULL,
	"prior_revision" integer,
	"revision" integer NOT NULL,
	"operator_account_id" text NOT NULL,
	"requester_account_id" text,
	"approver_account_id" text,
	"approval_id" uuid,
	"correlation_id" text NOT NULL,
	"reason_code" text NOT NULL,
	"effective_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"occurred_at" timestamp with time zone NOT NULL,
	CONSTRAINT "restricted_resource_access_lifecycle_events_revision_unique" UNIQUE("relationship_id","revision")
);
--> statement-breakpoint
ALTER TABLE "authorization_decisions" ADD COLUMN "membership_relationship_id" uuid;--> statement-breakpoint
ALTER TABLE "authorization_decisions" ADD COLUMN "membership_revision" integer;--> statement-breakpoint
ALTER TABLE "authorization_decisions" ADD COLUMN "grant_relationship_id" uuid;--> statement-breakpoint
ALTER TABLE "authorization_decisions" ADD COLUMN "grant_revision" integer;--> statement-breakpoint
CREATE UNIQUE INDEX "access_lifecycle_approvals_scope_index" ON "access_lifecycle_approvals" USING btree ("organization_id","subject_account_id","relationship_kind","resource_type","resource_id","operation");--> statement-breakpoint
CREATE UNIQUE INDEX "access_lifecycle_command_receipts_event_unique" ON "access_lifecycle_command_receipts" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "effective_organization_memberships_scope_unique" ON "effective_organization_memberships" USING btree ("organization_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "effective_restricted_resource_access_scope_unique" ON "effective_restricted_resource_access_grants" USING btree ("organization_id","account_id","resource_type","resource_id","operation");--> statement-breakpoint
CREATE UNIQUE INDEX "membership_lifecycle_events_scope_index" ON "membership_lifecycle_events" USING btree ("organization_id","account_id","occurred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "restricted_resource_access_lifecycle_events_scope_index" ON "restricted_resource_access_lifecycle_events" USING btree ("organization_id","account_id","resource_type","resource_id","operation","occurred_at");
--> statement-breakpoint
-- Controlled legacy backfill: M1 rows remain untouched immutable evidence.
-- Every legacy relationship becomes one non-command provenance event and an
-- effective projection; inactive rows continue to deny and cannot reactivate.
INSERT INTO "membership_lifecycle_events" (
	"id", "relationship_id", "command_id", "organization_id", "account_id",
	"event_type", "resulting_state", "prior_revision", "revision",
	"operator_account_id", "requester_account_id", "approver_account_id",
	"approval_id", "correlation_id", "reason_code", "effective_at",
	"expires_at", "occurred_at"
)
SELECT
	"id", "id", "id", "organization_id", "account_id",
	'legacy_backfill', CASE WHEN "is_active" THEN 'active' ELSE 'revoked' END,
	NULL, 1, 'legacy_m1_backfill', NULL, NULL, NULL,
	'legacy-m1-backfill:' || "id"::text, 'legacy_m1_backfill', "created_at",
	NULL, "created_at"
FROM "organization_memberships"
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "effective_organization_memberships" (
	"relationship_id", "organization_id", "account_id", "system_role", "state",
	"revision", "effective_at", "expires_at", "last_event_id"
)
SELECT
	"id", "organization_id", "account_id", "system_role",
	CASE WHEN "is_active" THEN 'active' ELSE 'revoked' END,
	1, "created_at", NULL, "id"
FROM "organization_memberships"
ON CONFLICT ("organization_id", "account_id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "restricted_resource_access_lifecycle_events" (
	"id", "relationship_id", "command_id", "organization_id", "account_id",
	"resource_type", "resource_id", "operation", "event_type", "resulting_state",
	"prior_revision", "revision", "operator_account_id", "requester_account_id",
	"approver_account_id", "approval_id", "correlation_id", "reason_code",
	"effective_at", "expires_at", "occurred_at"
)
SELECT
	"id", "id", "id", "organization_id", "account_id", "resource_type",
	"resource_id", "operation", 'legacy_backfill',
	CASE WHEN "is_active" THEN 'active' ELSE 'revoked' END,
	NULL, 1, 'legacy_m1_backfill', NULL, NULL, NULL,
	'legacy-m1-backfill:' || "id"::text, 'legacy_m1_backfill', "granted_at",
	NULL, "granted_at"
FROM "restricted_resource_access_grants"
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "effective_restricted_resource_access_grants" (
	"relationship_id", "organization_id", "account_id", "resource_type", "resource_id",
	"operation", "state", "revision", "effective_at", "expires_at", "last_event_id"
)
SELECT
	"id", "organization_id", "account_id", "resource_type", "resource_id",
	"operation", CASE WHEN "is_active" THEN 'active' ELSE 'revoked' END,
	1, "granted_at", NULL, "id"
FROM "restricted_resource_access_grants"
ON CONFLICT ("organization_id", "account_id", "resource_type", "resource_id", "operation") DO NOTHING;
--> statement-breakpoint
CREATE FUNCTION prevent_access_lifecycle_evidence_mutation() RETURNS trigger AS $$
BEGIN
	RAISE EXCEPTION 'access lifecycle approvals, events, and receipts are append-only';
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER access_lifecycle_approvals_append_only
BEFORE UPDATE OR DELETE ON "access_lifecycle_approvals"
FOR EACH ROW EXECUTE FUNCTION prevent_access_lifecycle_evidence_mutation();
--> statement-breakpoint
CREATE TRIGGER membership_lifecycle_events_append_only
BEFORE UPDATE OR DELETE ON "membership_lifecycle_events"
FOR EACH ROW EXECUTE FUNCTION prevent_access_lifecycle_evidence_mutation();
--> statement-breakpoint
CREATE TRIGGER restricted_resource_access_lifecycle_events_append_only
BEFORE UPDATE OR DELETE ON "restricted_resource_access_lifecycle_events"
FOR EACH ROW EXECUTE FUNCTION prevent_access_lifecycle_evidence_mutation();
--> statement-breakpoint
CREATE TRIGGER access_lifecycle_command_receipts_append_only
BEFORE UPDATE OR DELETE ON "access_lifecycle_command_receipts"
FOR EACH ROW EXECUTE FUNCTION prevent_access_lifecycle_evidence_mutation();
