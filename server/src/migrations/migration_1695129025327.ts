import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("user")
    .addColumn("codeRegion", "varchar(2)")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("user").dropColumn("codeRegion").execute();
};
