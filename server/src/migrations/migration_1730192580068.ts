import { Kysely } from "kysely";

import { DB } from "../db/schema";

export const up = async (db: Kysely<DB>) => {
  return await db.schema
    .alterTable("user")
    .addColumn("fonction", "varchar")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  return await db.schema.alterTable("user").dropColumn("fonction").execute();
};
