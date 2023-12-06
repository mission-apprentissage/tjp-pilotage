import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .addColumn("motifRefus", sql`varchar[]`)
    .addColumn("autreMotifRefus", "varchar")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .dropColumn("autreMotifRefus")
    .dropColumn("motifRefus")
    .execute();
};
