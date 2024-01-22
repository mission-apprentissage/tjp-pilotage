import { Kysely } from "kysely";

export const up = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("demande")
    .addColumn("libelleFCIL", "varchar")
    .execute();
};

export const down = async (db: Kysely<never>) => {
  await db.schema.alterTable("demande").dropColumn("libelleFCIL").execute();
};
