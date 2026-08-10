-- The access lifecycle ledger is the only source of new authorization relationships.
-- Migration 0004 made the legacy M1 tables append-only, which still allowed an
-- insert to create access with no lifecycle event, approval record, requester, or
-- distinct approver. This freezes new writes so the legacy rows remain historical
-- evidence only, per FR-003 and the data model's rule that effective projections
-- own all future authorization reads.
CREATE FUNCTION prevent_legacy_authorization_relationship_write() RETURNS trigger AS $$
BEGIN
	RAISE EXCEPTION 'legacy authorization relationships are frozen; use an access lifecycle command';
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER organization_memberships_insert_frozen
BEFORE INSERT ON organization_memberships
FOR EACH ROW EXECUTE FUNCTION prevent_legacy_authorization_relationship_write();
--> statement-breakpoint
CREATE TRIGGER restricted_resource_access_grants_insert_frozen
BEFORE INSERT ON restricted_resource_access_grants
FOR EACH ROW EXECUTE FUNCTION prevent_legacy_authorization_relationship_write();
