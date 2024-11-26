import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("indicateurRegion")
    .dropColumn("nbDecrocheurs")
    .dropColumn("effectifDecrochage")
    .dropColumn("tauxDecrochage")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("indicateurRegion")
    .addColumn("nbDecrocheurs", "int4")
    .addColumn("effectifDecrochage", "int4")
    .addColumn("tauxDecrochage", "int4")
    .execute();
};
