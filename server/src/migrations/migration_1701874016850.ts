import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("demande")
    .addColumn("motifRefus", sql`varchar[]`)
    .addColumn("autreMotifRefus", "varchar")
    .execute();
};

export const down = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("demande")
    .dropColumn("autreMotifRefus")
    .dropColumn("motifRefus")
    .execute();
};
