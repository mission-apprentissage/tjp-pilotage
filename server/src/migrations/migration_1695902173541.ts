import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .addColumn("libelleFCIL", "varchar")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("demande").dropColumn("libelleFCIL").execute();
};
