import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("job")
    .addColumn("name", "varchar")
    .addColumn("sub", "varchar")
    .addColumn("createdAt", "timestamptz", (c) => c.defaultTo(sql`NOW()`))
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("job").execute();
};
