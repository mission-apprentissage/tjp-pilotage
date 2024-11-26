import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("tauxIJNiveauDiplomeRegion")
    .addColumn("codeRegion", "varchar(2)", (c) => c.notNull())
    .addColumn("codeNiveauDiplome", "varchar(3)", (c) => c.notNull())
    .addColumn("millesimeSortie", "varchar(9)", (c) => c.notNull())
    .addColumn("tauxInsertion6mois", "float8", (c) => c.notNull())
    .addColumn("tauxPoursuite", "float8", (c) => c.notNull())
    .addColumn("tauxDevenirFavorable", "float8", (c) => c.notNull())
    .addUniqueConstraint("tauxIJNiveauDiplomeRegion_unique_constraint", [
      "codeNiveauDiplome",
      "codeRegion",
      "millesimeSortie",
    ])
    .addForeignKeyConstraint("tauxIJNiveauDiplomeRegion_codeRegion_fk", ["codeRegion"], "region", ["codeRegion"])
    .addForeignKeyConstraint("tauxIJNiveauDiplomeRegion_codeNiveauDiplome_fk", ["codeNiveauDiplome"], "niveauDiplome", [
      "codeNiveauDiplome",
    ])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("tauxIJNiveauDiplomeRegion").execute();
};
