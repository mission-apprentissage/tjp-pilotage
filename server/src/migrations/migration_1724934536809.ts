import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("positionFormationRegionaleQuadrant")
    .addColumn("cfd", "varchar", (c) => c.notNull())
    .addColumn("codeRegion", "varchar(2)", (c) => c.notNull())
    .addColumn("codeNiveauDiplome", "varchar(3)", (c) => c.notNull())
    .addColumn("positionQuadrant", "varchar", (c) => c.notNull())
    .addColumn("millesimeSortie", "varchar(9)", (c) => c.notNull())
    .addColumn("moyenneInsertionCfdRegion", "float8")
    .addColumn("moyennePoursuiteEtudeCfdRegion", "float8")
    .addUniqueConstraint("positionFormationRegionaleQuadrant_unique_constraint", [
      "cfd",
      "codeRegion",
      "millesimeSortie",
      "codeNiveauDiplome",
    ])
    .addForeignKeyConstraint("positionFormationRegionaleQuadrant_codeRegion_fk", ["codeRegion"], "region", [
      "codeRegion",
    ])
    .addForeignKeyConstraint("positionFormationRegionaleQuadrant_cfd_fk", ["cfd"], "dataFormation", ["cfd"])
    .addForeignKeyConstraint(
      "positionFormationRegionaleQuadrant_codeNiveauDiplome_fk",
      ["codeNiveauDiplome"],
      "niveauDiplome",
      ["codeNiveauDiplome"],
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("positionFormationRegionaleQuadrant").execute();
};
