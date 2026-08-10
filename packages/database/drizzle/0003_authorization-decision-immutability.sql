-- Custom SQL migration file, put your code below! --
CREATE FUNCTION prevent_authorization_decision_mutation() RETURNS trigger AS $$
BEGIN
	RAISE EXCEPTION 'authorization_decisions are append-only';
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER authorization_decisions_append_only
BEFORE UPDATE OR DELETE ON authorization_decisions
FOR EACH ROW EXECUTE FUNCTION prevent_authorization_decision_mutation();
