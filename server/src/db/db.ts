import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { config } from "../../config/config";
import { logger } from "../logger";
import { DB } from "./schema";

const pool = new Pool({
  connectionString: config.PILOTAGE_POSTGRES_URI,
  ssl: config.PILOTAGE_POSTGRES_CA
    ? { rejectUnauthorized: false, ca: config.PILOTAGE_POSTGRES_CA }
    : undefined,
});

pool.on("error", (err) => {
  logger.error(err, "pg pool lost connexion with database");
});

export const kdb = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});
