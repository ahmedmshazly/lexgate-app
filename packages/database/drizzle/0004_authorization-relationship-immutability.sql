CREATE FUNCTION prevent_authorization_relationship_mutation() RETURNS trigger AS $$
BEGIN
	RAISE EXCEPTION 'authorization relationships are append-only';
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER organization_memberships_append_only
BEFORE UPDATE OR DELETE ON organization_memberships
FOR EACH ROW EXECUTE FUNCTION prevent_authorization_relationship_mutation();
--> statement-breakpoint
CREATE TRIGGER restricted_resource_access_grants_append_only
BEFORE UPDATE OR DELETE ON restricted_resource_access_grants
FOR EACH ROW EXECUTE FUNCTION prevent_authorization_relationship_mutation();
