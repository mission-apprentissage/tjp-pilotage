import { Kysely } from "kysely";

export const up = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("user")
    .addColumn("enabled", "boolean", (c) => c.notNull().defaultTo(true))
    .addColumn("sub", "text")
    .execute();
};

export const down = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("user")
    .dropColumn("enabled")
    .dropColumn("sub")
    .execute();
};
