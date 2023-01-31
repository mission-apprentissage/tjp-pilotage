import pg from "pg";
import * as db from "zapatos/db";
import { conditions } from "zapatos/db";
import type * as schema from "zapatos/schema";

import { config } from "./../../config/config";

const pool = new pg.Pool({
  connectionString: config.PILOTAGE_POSTGRES_URI,
});

pool.on("error", (err) => console.error(err)); // don't let a pg restart kill your app

db.setConfig({
  castArrayParamsToJson: true,
});

export { db, conditions, pool, schema };
