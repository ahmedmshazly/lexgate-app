ALTER TABLE "outbox_events" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "outbox_events" ADD COLUMN "last_attempted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "outbox_events" ADD COLUMN "last_error" text;