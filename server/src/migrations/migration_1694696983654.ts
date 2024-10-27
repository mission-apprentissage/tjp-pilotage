/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.executeQuery(sql`CREATE EXTENSION "unaccent";`.compile(db));
  await db.schema
    .alterTable("demande")
    .addUniqueConstraint("demande_unique_constraint", ["uai", "cfd", "dispositifId", "rentreeScolaire"])
    .execute();

  await db.schema
    .alterTable("demande")
    .addColumn("capaciteScolaire", "integer")
    .addColumn("capaciteScolaireActuelle", "integer")
    .addColumn("capaciteScolaireColoree", "integer")
    .addColumn("capaciteApprentissage", "integer")
    .addColumn("capaciteApprentissageActuelle", "integer")
    .addColumn("capaciteApprentissageColoree", "integer")
    .addColumn("mixte", "boolean")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.executeQuery(sql`DROP EXTENSION "unaccent";`.compile(db));
  await db.schema.alterTable("demande").dropConstraint("demande_unique_constraint").execute();
  await db.schema
    .alterTable("demande")
    .dropColumn("capaciteScolaire")
    .dropColumn("capaciteScolaireActuelle")
    .dropColumn("capaciteScolaireColoree")
    .dropColumn("capaciteApprentissage")
    .dropColumn("capaciteApprentissageActuelle")
    .dropColumn("capaciteApprentissageColoree")
    .dropColumn("mixte")
    .execute();
};
