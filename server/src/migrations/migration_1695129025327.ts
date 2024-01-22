import { Kysely } from "kysely";

export const up = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("user")
    .addColumn("codeRegion", "varchar(2)")
    .execute();
};

export const down = async (db: Kysely<never>) => {
  await db.schema.alterTable("user").dropColumn("codeRegion").execute();
};
