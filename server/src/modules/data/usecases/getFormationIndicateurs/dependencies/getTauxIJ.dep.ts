import { sql } from "kysely";

import { getKbdClient } from "@/db/db";
import { selectTauxDevenirFavorableAgg } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";

export const getTauxIJ = async ({ cfd, codeRegion }: { cfd: string; codeRegion?: string }) => {
  const indicateursIJ = await getKbdClient()
    .selectFrom("formationView as formation")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formation.codeNiveauDiplome")
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "formation.cfd")
        .onRef("indicateurRegionSortie.voie", "=", "formation.voie")
    )
    .where("formation.cfd", "=", cfd)
    .$call((q) => {
      if (!codeRegion) {
        return q;
      }

      return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
    })
    .select((sb) => [
      sb.ref("formation.cfd").as("cfd"),
      sb.ref("formation.voie").as("voie"),
      sb.ref("formation.libelleFormation").as("libelle"),
      sb.ref("indicateurRegionSortie.millesimeSortie").as("millesimeSortie"),
      sql<number>`round(${selectTauxPoursuiteAgg("indicateurRegionSortie")}, 4)`.as("tauxPoursuite"),
      sql<number>`round(${selectTauxInsertion6moisAgg("indicateurRegionSortie")}, 4)`.as("tauxInsertion"),
      sql<number>`round(${selectTauxDevenirFavorableAgg("indicateurRegionSortie")}, 4)`.as("tauxDevenirFavorable"),
    ])
    .groupBy([
      "formation.cfd",
      "formation.voie",
      "formation.libelleFormation",
      "indicateurRegionSortie.millesimeSortie",
    ])
    .orderBy("indicateurRegionSortie.millesimeSortie", "asc")
    .execute();

  return indicateursIJ;
};
