CREATE FUNCTION prevent_party_identity_mutation() RETURNS trigger AS $$
BEGIN
	RAISE EXCEPTION '% are append-only', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER parties_append_only
BEFORE UPDATE OR DELETE ON parties
FOR EACH ROW EXECUTE FUNCTION prevent_party_identity_mutation();
--> statement-breakpoint
CREATE TRIGGER party_name_forms_append_only
BEFORE UPDATE OR DELETE ON party_name_forms
FOR EACH ROW EXECUTE FUNCTION prevent_party_identity_mutation();
--> statement-breakpoint
CREATE TRIGGER party_primary_name_assignments_append_only
BEFORE UPDATE OR DELETE ON party_primary_name_assignments
FOR EACH ROW EXECUTE FUNCTION prevent_party_identity_mutation();
--> statement-breakpoint
CREATE TRIGGER party_contact_assertions_append_only
BEFORE UPDATE OR DELETE ON party_contact_assertions
FOR EACH ROW EXECUTE FUNCTION prevent_party_identity_mutation();
--> statement-breakpoint
CREATE TRIGGER party_representation_claims_append_only
BEFORE UPDATE OR DELETE ON party_representation_claims
FOR EACH ROW EXECUTE FUNCTION prevent_party_identity_mutation();
--> statement-breakpoint
CREATE TRIGGER party_possible_duplicate_flags_append_only
BEFORE UPDATE OR DELETE ON party_possible_duplicate_flags
FOR EACH ROW EXECUTE FUNCTION prevent_party_identity_mutation();
--> statement-breakpoint
CREATE TRIGGER party_identity_audit_events_append_only
BEFORE UPDATE OR DELETE ON party_identity_audit_events
FOR EACH ROW EXECUTE FUNCTION prevent_party_identity_mutation();
--> statement-breakpoint
CREATE UNIQUE INDEX party_primary_name_assignments_root_unique
ON party_primary_name_assignments (organization_id, party_id)
WHERE supersedes_assignment_id IS NULL;
--> statement-breakpoint
ALTER TABLE party_representation_claims
ADD CONSTRAINT party_representation_claims_distinct_parties_check
CHECK (represented_party_id <> representative_party_id);
--> statement-breakpoint
ALTER TABLE party_possible_duplicate_flags
ADD CONSTRAINT party_possible_duplicate_flags_ordered_pair_check
CHECK (first_party_id::text < second_party_id::text);
