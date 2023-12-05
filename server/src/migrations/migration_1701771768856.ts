import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("user").addColumn("uai", "varchar(8)").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("user").dropColumn("uai").execute();
};
