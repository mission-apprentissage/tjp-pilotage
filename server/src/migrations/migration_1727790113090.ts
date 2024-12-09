import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("constatRentree").addColumn("codeDispositif", "varchar(3)").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("constatRentree").dropColumn("codeDispositif").execute();
};
