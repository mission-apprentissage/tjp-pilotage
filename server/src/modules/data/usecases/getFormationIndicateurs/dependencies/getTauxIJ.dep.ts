import { sql } from "kysely";
import * as _ from "lodash-es";
import type { TauxIJKey, TauxIJValue } from "shared/routes/schemas/get.formation.cfd.indicators.schema";

import { getKbdClient } from "@/db/db";
import { selectTauxDevenirFavorableAgg } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";
import { cleanNull } from "@/utils/noNull";

function listUniqMillesimes(
  indicateurs: {
    millesimeSortie: string | null;
  }[],
) {
  return _.uniq(indicateurs.filter((i) => i.millesimeSortie).map((i) => i.millesimeSortie as string)).sort((a, z) =>
    a.localeCompare(z),
  );
}

export const getTauxIJ = async ({ cfd, codeRegion }: { cfd: string; codeRegion?: string }) => {
  const indicateursIJ = await getKbdClient()
    .selectFrom("formationView as formation")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formation.codeNiveauDiplome")
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "formation.cfd")
        .onRef("indicateurRegionSortie.voie", "=", "formation.voie"),
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

  const millesimes = listUniqMillesimes(indicateursIJ);

  const tauxIJ: Record<TauxIJKey, TauxIJValue[]> = {
    tauxPoursuite: [],
    tauxInsertion: [],
    tauxDevenirFavorable: [],
  };

  millesimes.forEach((millesime) => {
    const indicateurs = indicateursIJ.filter((i) => i.millesimeSortie === millesime);
    const tauxApprentissage = indicateurs.find((i) => i.voie === "apprentissage");
    const tauxScolaire = indicateurs.find((i) => i.voie === "scolaire");

    // Création de l'object tauxIJ, pour chaque taux, création d'un tableau contenant les valeurs
    // pour chaque années
    ["tauxPoursuite", "tauxInsertion", "tauxDevenirFavorable"].forEach((taux) => {
      tauxIJ[taux as TauxIJKey] = [
        ...tauxIJ[taux as TauxIJKey],
        {
          libelle: millesime.replace("_20", "+"),
          apprentissage: tauxApprentissage?.[taux as TauxIJKey],
          scolaire: tauxScolaire?.[taux as TauxIJKey],
        },
      ].map(cleanNull);
    });
  });

  return tauxIJ;
};
