import type { Kysely } from "kysely";

import type { DB } from "@/db/schema";

export const up = async (db: Kysely<DB>) => {
  await db.deleteFrom("positionFormationRegionaleQuadrant").execute();
  await db.schema
    .alterTable("positionFormationRegionaleQuadrant")
    .dropConstraint("positionFormationRegionaleQuadrant_unique_constraint")
    .execute();

  await db.schema.alterTable("positionFormationRegionaleQuadrant").addColumn("codeDispositif", "varchar(3)").execute();

  await db.schema
    .alterTable("positionFormationRegionaleQuadrant")
    .addForeignKeyConstraint("fk_positionFormationRegionaleQuadrant_codeDispositif", ["codeDispositif"], "dispositif", [
      "codeDispositif",
    ])
    .execute();

  await db.schema
    .alterTable("positionFormationRegionaleQuadrant")
    .addUniqueConstraint("positionFormationRegionaleQuadrant_unique_constraint", [
      "cfd",
      "codeRegion",
      "millesimeSortie",
      "codeNiveauDiplome",
      "codeDispositif",
    ])
    .execute();
};

export const down = async (db: Kysely<DB>) => {
  await db.deleteFrom("positionFormationRegionaleQuadrant").execute();

  await db.schema
    .alterTable("positionFormationRegionaleQuadrant")
    .dropConstraint("positionFormationRegionaleQuadrant_unique_constraint")
    .execute();

  await db.schema
    .alterTable("positionFormationRegionaleQuadrant")
    .dropConstraint("fk_positionFormationRegionaleQuadrant_codeDispositif")
    .execute();

  await db.schema.alterTable("positionFormationRegionaleQuadrant").dropColumn("codeDispositif").execute();

  await db.schema
    .alterTable("positionFormationRegionaleQuadrant")
    .addUniqueConstraint("positionFormationRegionaleQuadrant_unique_constraint", [
      "cfd",
      "codeRegion",
      "millesimeSortie",
      "codeNiveauDiplome",
    ])
    .execute();
};
