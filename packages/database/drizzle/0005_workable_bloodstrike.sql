CREATE TABLE "parties" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"kind" text NOT NULL,
	"processing_purpose" text NOT NULL,
	"data_classification" text NOT NULL,
	"subject_category" text NOT NULL,
	"source" text NOT NULL,
	"retention_candidate" text NOT NULL,
	"access_boundary" text NOT NULL,
	"validation_requirement" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"created_by_account_id" text NOT NULL,
	CONSTRAINT "parties_organization_id_unique" UNIQUE("organization_id","id")
);
--> statement-breakpoint
CREATE TABLE "party_contact_assertions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"party_id" uuid NOT NULL,
	"contact_type" text NOT NULL,
	"value" text NOT NULL,
	"operational_purpose" text NOT NULL,
	"review_state" text NOT NULL,
	"processing_purpose" text NOT NULL,
	"data_classification" text NOT NULL,
	"subject_category" text NOT NULL,
	"source" text NOT NULL,
	"retention_candidate" text NOT NULL,
	"access_boundary" text NOT NULL,
	"validation_requirement" text NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	"recorded_by_account_id" text NOT NULL,
	"supersedes_contact_id" uuid
);
--> statement-breakpoint
CREATE TABLE "party_identity_audit_events" (
	"command_id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"actor_account_id" text NOT NULL,
	"correlation_id" text NOT NULL,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"assertion_id" uuid NOT NULL,
	"assertion_category" text NOT NULL,
	"command_fingerprint" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party_name_forms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"party_id" uuid NOT NULL,
	"value" text NOT NULL,
	"form_type" text NOT NULL,
	"language_tag" text NOT NULL,
	"script" text,
	"review_state" text NOT NULL,
	"processing_purpose" text NOT NULL,
	"data_classification" text NOT NULL,
	"subject_category" text NOT NULL,
	"source" text NOT NULL,
	"retention_candidate" text NOT NULL,
	"access_boundary" text NOT NULL,
	"validation_requirement" text NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	"recorded_by_account_id" text NOT NULL,
	"supersedes_name_form_id" uuid,
	CONSTRAINT "party_name_forms_scope_identity_unique" UNIQUE("organization_id","party_id","id")
);
--> statement-breakpoint
CREATE TABLE "party_possible_duplicate_flags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"first_party_id" uuid NOT NULL,
	"second_party_id" uuid NOT NULL,
	"review_state" text NOT NULL,
	"processing_purpose" text NOT NULL,
	"data_classification" text NOT NULL,
	"subject_category" text NOT NULL,
	"source" text NOT NULL,
	"retention_candidate" text NOT NULL,
	"access_boundary" text NOT NULL,
	"validation_requirement" text NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	"recorded_by_account_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party_primary_name_assignments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"party_id" uuid NOT NULL,
	"name_form_id" uuid NOT NULL,
	"supersedes_assignment_id" uuid,
	"recorded_at" timestamp with time zone NOT NULL,
	"recorded_by_account_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party_representation_claims" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"represented_party_id" uuid NOT NULL,
	"representative_party_id" uuid NOT NULL,
	"claim_state" text NOT NULL,
	"review_state" text NOT NULL,
	"processing_purpose" text NOT NULL,
	"data_classification" text NOT NULL,
	"subject_category" text NOT NULL,
	"source" text NOT NULL,
	"retention_candidate" text NOT NULL,
	"access_boundary" text NOT NULL,
	"validation_requirement" text NOT NULL,
	"effective_from" timestamp with time zone,
	"effective_until" timestamp with time zone,
	"recorded_at" timestamp with time zone NOT NULL,
	"recorded_by_account_id" text NOT NULL,
	"supersedes_claim_id" uuid
);
--> statement-breakpoint
ALTER TABLE "party_contact_assertions" ADD CONSTRAINT "party_contact_assertions_party_scope_fk" FOREIGN KEY ("organization_id","party_id") REFERENCES "public"."parties"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_identity_audit_events" ADD CONSTRAINT "party_identity_audit_events_resource_scope_fk" FOREIGN KEY ("organization_id","resource_id") REFERENCES "public"."parties"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_name_forms" ADD CONSTRAINT "party_name_forms_party_scope_fk" FOREIGN KEY ("organization_id","party_id") REFERENCES "public"."parties"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_possible_duplicate_flags" ADD CONSTRAINT "party_possible_duplicate_flags_first_scope_fk" FOREIGN KEY ("organization_id","first_party_id") REFERENCES "public"."parties"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_possible_duplicate_flags" ADD CONSTRAINT "party_possible_duplicate_flags_second_scope_fk" FOREIGN KEY ("organization_id","second_party_id") REFERENCES "public"."parties"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_primary_name_assignments" ADD CONSTRAINT "party_primary_name_assignments_party_scope_fk" FOREIGN KEY ("organization_id","party_id") REFERENCES "public"."parties"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_primary_name_assignments" ADD CONSTRAINT "party_primary_name_assignments_name_scope_fk" FOREIGN KEY ("organization_id","party_id","name_form_id") REFERENCES "public"."party_name_forms"("organization_id","party_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_representation_claims" ADD CONSTRAINT "party_representation_claims_represented_scope_fk" FOREIGN KEY ("organization_id","represented_party_id") REFERENCES "public"."parties"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_representation_claims" ADD CONSTRAINT "party_representation_claims_representative_scope_fk" FOREIGN KEY ("organization_id","representative_party_id") REFERENCES "public"."parties"("organization_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "party_contact_assertions_successor_unique" ON "party_contact_assertions" USING btree ("supersedes_contact_id");--> statement-breakpoint
CREATE UNIQUE INDEX "party_name_forms_successor_unique" ON "party_name_forms" USING btree ("supersedes_name_form_id");--> statement-breakpoint
CREATE UNIQUE INDEX "party_possible_duplicate_flags_pair_unique" ON "party_possible_duplicate_flags" USING btree ("organization_id","first_party_id","second_party_id");--> statement-breakpoint
CREATE UNIQUE INDEX "party_primary_name_assignments_successor_unique" ON "party_primary_name_assignments" USING btree ("supersedes_assignment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "party_representation_claims_successor_unique" ON "party_representation_claims" USING btree ("supersedes_claim_id");