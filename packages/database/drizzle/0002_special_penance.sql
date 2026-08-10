CREATE TABLE "authorization_decisions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"correlation_id" text NOT NULL,
	"account_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"operation" text NOT NULL,
	"outcome" text NOT NULL,
	"reason" text NOT NULL,
	"decided_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_memberships" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"system_role" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restricted_resource_access_grants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"operation" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"granted_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "organization_memberships_account_organization_unique" ON "organization_memberships" USING btree ("account_id","organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "restricted_resource_access_grants_exact_relationship_unique" ON "restricted_resource_access_grants" USING btree ("account_id","organization_id","resource_type","resource_id","operation");