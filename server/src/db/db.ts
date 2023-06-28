import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { config } from "../../config/config";
import { DB } from "./schema";
export const kdb = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.PILOTAGE_POSTGRES_URI,
      ssl: config.PILOTAGE_POSTGRES_CA
        ? { rejectUnauthorized: false, ca: config.PILOTAGE_POSTGRES_CA }
        : undefined,
    }),
  }),
});
