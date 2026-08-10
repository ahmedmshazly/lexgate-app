DROP INDEX "membership_lifecycle_events_scope_index";--> statement-breakpoint
DROP INDEX "restricted_resource_access_lifecycle_events_scope_index";--> statement-breakpoint
CREATE INDEX "membership_lifecycle_events_scope_index" ON "membership_lifecycle_events" USING btree ("organization_id","account_id","occurred_at");--> statement-breakpoint
CREATE INDEX "restricted_resource_access_lifecycle_events_scope_index" ON "restricted_resource_access_lifecycle_events" USING btree ("organization_id","account_id","resource_type","resource_id","operation","occurred_at");