ALTER TABLE party_name_forms
ADD CONSTRAINT party_name_forms_predecessor_not_self_check
CHECK (supersedes_name_form_id IS NULL OR supersedes_name_form_id <> id);
--> statement-breakpoint
ALTER TABLE party_primary_name_assignments
ADD CONSTRAINT party_primary_name_assignments_predecessor_not_self_check
CHECK (supersedes_assignment_id IS NULL OR supersedes_assignment_id <> id);
--> statement-breakpoint
ALTER TABLE party_contact_assertions
ADD CONSTRAINT party_contact_assertions_predecessor_not_self_check
CHECK (supersedes_contact_id IS NULL OR supersedes_contact_id <> id);
--> statement-breakpoint
ALTER TABLE party_representation_claims
ADD CONSTRAINT party_representation_claims_predecessor_not_self_check
CHECK (supersedes_claim_id IS NULL OR supersedes_claim_id <> id);
