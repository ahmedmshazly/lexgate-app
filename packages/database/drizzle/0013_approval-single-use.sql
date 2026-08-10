-- An approval authorises one access expansion, not an unlimited series.
--
-- Migration 0009 created a UNIQUE scope index on access_lifecycle_approvals;
-- 0010 relaxed it to non-unique so a subject could be re-approved after a
-- revocation. Nothing replaced the single-use property it had been carrying,
-- so one approval could back unlimited granted, reinstated, and corrected
-- events for the same subject and scope until the approval itself expired.
--
-- These partial unique indexes bind an approval to at most one lifecycle
-- event of each kind. Re-granting after a revocation still works — it needs a
-- fresh approval, which is what a reviewing approver believes they are giving.
CREATE UNIQUE INDEX "membership_lifecycle_events_approval_single_use"
ON "membership_lifecycle_events" ("approval_id")
WHERE "approval_id" IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX "restricted_resource_access_lifecycle_events_approval_single_use"
ON "restricted_resource_access_lifecycle_events" ("approval_id")
WHERE "approval_id" IS NOT NULL;
