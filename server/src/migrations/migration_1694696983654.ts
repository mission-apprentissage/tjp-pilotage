import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(sql`CREATE EXTENSION "unaccent";`.compile(db));
  await db.schema
    .alterTable("demande")
    .addUniqueConstraint("demande_unique_constraint", [
      "uai",
      "cfd",
      "dispositifId",
      "rentreeScolaire",
    ])
    .execute();

  await db.schema
    .alterTable("demande")
    .addColumn("capaciteScolaire", "integer")
    .addColumn("capaciteApprentissage", "integer")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.executeQuery(sql`DROP EXTENSION "unaccent";`.compile(db));
  await db.schema
    .alterTable("demande")
    .dropConstraint("demande_unique_constraint")
    .execute();
  await db.schema
    .alterTable("demande")
    .dropColumn("capaciteScolaire")
    .dropColumn("capaciteApprentissage")
    .execute();
};
