import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export { createMaterialTransitionPersistencePort } from "./material-transition.js";
export { createRestrictedResourceAuthorizationPort } from "./authorization.js";
export {
  AccessLifecycleConflictError,
  createAccessLifecycleApprovalPort,
  createAccessLifecyclePersistencePort,
  rebuildEffectiveAccessProjections,
} from "./access-lifecycle.js";
export { createPartyIdentityPersistencePort } from "./party-identity.js";

export const createDatabase = (connectionString: string) => {
  const client = postgres(connectionString, { max: 10 });
  return drizzle({ client });
};
