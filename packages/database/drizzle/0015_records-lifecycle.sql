CREATE TABLE "legal_hold_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"hold_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"event_type" text NOT NULL,
	"prior_revision" integer,
	"revision" integer NOT NULL,
	"operator_account_id" text NOT NULL,
	"reason_code" text NOT NULL,
	"correlation_id" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	CONSTRAINT "legal_hold_events_revision_unique" UNIQUE("hold_id","revision")
);
--> statement-breakpoint
CREATE TABLE "effective_legal_holds" (
	"hold_id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"state" text NOT NULL,
	"revision" integer NOT NULL,
	"placed_at" timestamp with time zone NOT NULL,
	"released_at" timestamp with time zone,
	"last_event_id" uuid NOT NULL
);
--> statement-breakpoint
-- Destroying the key IS erasure, so this is the one table whose value is
-- nulled in place. It carries no append-only trigger for that reason; the
-- erasure event is recorded immutably in audit_events instead.
CREATE TABLE "subject_encryption_keys" (
	"subject_id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"key_material" text,
	"created_at" timestamp with time zone NOT NULL,
	"shredded_at" timestamp with time zone,
	"shredded_by_account_id" text,
	"shred_reason_code" text,
	CONSTRAINT "subject_encryption_keys_shred_complete" CHECK (
		("shredded_at" IS NULL AND "shredded_by_account_id" IS NULL AND "shred_reason_code" IS NULL AND "key_material" IS NOT NULL)
		OR ("shredded_at" IS NOT NULL AND "shredded_by_account_id" IS NOT NULL AND "shred_reason_code" IS NOT NULL AND "key_material" IS NULL)
	)
);
--> statement-breakpoint
CREATE INDEX "legal_hold_events_resource_index" ON "legal_hold_events" USING btree ("organization_id","resource_type","resource_id","occurred_at");--> statement-breakpoint
CREATE INDEX "effective_legal_holds_resource_index" ON "effective_legal_holds" USING btree ("organization_id","resource_type","resource_id","state");--> statement-breakpoint
-- The hold ledger is evidence. A release must be a successor event, never an
-- edit of the placement it supersedes.
CREATE FUNCTION prevent_legal_hold_event_mutation() RETURNS trigger AS $$
BEGIN
	RAISE EXCEPTION 'legal hold events are append-only';
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER legal_hold_events_append_only
BEFORE UPDATE OR DELETE ON legal_hold_events
FOR EACH ROW EXECUTE FUNCTION prevent_legal_hold_event_mutation();
