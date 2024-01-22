/* eslint-disable-file @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("demande")
    .addColumn("libelleFCIL", "varchar")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.alterTable("demande").dropColumn("libelleFCIL").execute();
};
