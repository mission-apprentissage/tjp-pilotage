/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("demande")
    .addColumn("motifRefus", sql`varchar[]`)
    .addColumn("autreMotifRefus", "varchar")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.alterTable("demande").dropColumn("autreMotifRefus").dropColumn("motifRefus").execute();
};
