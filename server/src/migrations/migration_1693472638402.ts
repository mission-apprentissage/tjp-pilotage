/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("indicateurRegionSortie")
    .addColumn("cfd", "varchar(8)", (c) => c.references("formation.codeFormationDiplome"))
    .addColumn("dispositifId", "varchar(3)", (c) => c.references("dispositif.codeDispositif"))
    .addColumn("codeRegion", "varchar(2)", (c) => c.references("region.codeRegion"))
    .addColumn("voie", "varchar")
    .addColumn("millesimeSortie", "varchar(9)")
    .addColumn("effectifSortie", "integer")
    .addColumn("nbSortants", "integer")
    .addColumn("nbPoursuiteEtudes", "integer")
    .addColumn("nbInsertion6mois", "integer")
    .addColumn("nbInsertion12mois", "integer")
    .addColumn("nbInsertion24mois", "integer")
    .addUniqueConstraint("indicateurRegionSortie_unique_constraint", [
      "cfd",
      "codeRegion",
      "dispositifId",
      "millesimeSortie",
      "voie",
    ])
    .execute();
};
export const down = async () => {};
