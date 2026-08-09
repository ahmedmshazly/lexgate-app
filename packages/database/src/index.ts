import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const createDatabase = (connectionString: string) => {
  const client = postgres(connectionString, { max: 10 });
  return drizzle({ client });
};
