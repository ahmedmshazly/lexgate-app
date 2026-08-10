-- A duplicate flag must record why it was raised and what a reviewer
-- concluded.
--
-- Every flag previously looked identical: no rationale, no score, and a
-- reviewState vocabulary (unreviewed | reviewed | rejected) shared with name
-- forms and contact assertions. A "rejected" flag produced by alert fatigue
-- was therefore indistinguishable in the audit trail from one produced by
-- careful analysis. Egyptian patronymic naming makes unrelated people sharing
-- a full tripartite name the normal case rather than the edge case, so a high
-- and undifferentiated flag rate is the expected condition, not a remote risk.
ALTER TABLE "party_possible_duplicate_flags"
ADD COLUMN "match_rationale" text NOT NULL DEFAULT 'unspecified_legacy_flag';
--> statement-breakpoint
ALTER TABLE "party_possible_duplicate_flags"
ALTER COLUMN "match_rationale" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "party_possible_duplicate_flags"
ADD COLUMN "disposition" text;
--> statement-breakpoint
-- A disposition is a reviewer's conclusion. It may only be one of the three
-- outcomes a human can actually reach, and never an automatic clearance.
ALTER TABLE "party_possible_duplicate_flags"
ADD CONSTRAINT "party_possible_duplicate_flags_disposition_check"
CHECK (
  "disposition" IS NULL
  OR "disposition" IN (
    'confirmed_same_party',
    'confirmed_distinct_parties',
    'insufficient_information'
  )
);
