import { Kysely, PostgresDialect } from "kysely";
import { Pool, types } from "pg";

import { config } from "../../config/config";
import { logger } from "../logger";
import { DB } from "./schema";

types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));

const pool = new Pool({
  connectionString: config.PILOTAGE_POSTGRES_URI,
  ssl: config.PILOTAGE_POSTGRES_CA
    ? { rejectUnauthorized: false, ca: config.PILOTAGE_POSTGRES_CA }
    : undefined,
});

pool.on("error", (error) => {
  try {
    console.error("lost connection with DB!");
    logger.error("pg pool lost connexion with database", { error });
    // eslint-disable-next-line no-empty
  } catch (e) {}
});

export const kdb = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
  log: (event) => {
    if (event.level === config.sql.logLevel) {
      console.log(`\n====================================\n`);
      console.log(event.query.sql);
      console.log({
        parameters: event.query.parameters
          .map((p, index) => `$${index + 1} = ${p}`)
          .join(", "),
      });
      console.log({ duration: event.queryDurationMillis });
    }
  },
});
