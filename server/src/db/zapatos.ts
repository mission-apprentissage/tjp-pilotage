import pg from "pg";
import * as db from "zapatos/db";
import { conditions } from "zapatos/db";
import type * as schema from "zapatos/schema";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:password@localhost:5432/postgres",
});
pool.on("error", (err) => console.error(err)); // don't let a pg restart kill your app

db.setConfig({
  castArrayParamsToJson: true,
});

export { db, conditions, pool, schema };
