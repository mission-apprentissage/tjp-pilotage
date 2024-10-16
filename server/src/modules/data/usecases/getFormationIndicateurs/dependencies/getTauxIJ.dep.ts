import { sql } from "kysely";
import * as _ from "lodash";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { selectTauxDevenirFavorableAgg } from "../../../utils/tauxDevenirFavorable";
import { selectTauxInsertion6moisAgg } from "../../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../../utils/tauxPoursuite";
import { TauxIJKey, TauxIJValue } from "../getFormationIndicateurs.schema";

export const getTauxIJ = async ({
  cfd,
  codeRegion,
}: {
  cfd: string;
  codeRegion?: string;
}) => {
  const indicateursIJ = await kdb
    .selectFrom("formationView as formation")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formation.codeNiveauDiplome"
    )
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
      sql<number>`round(${selectTauxPoursuiteAgg(
        "indicateurRegionSortie"
      )}, 4)`.as("tauxPoursuite"),
      sql<number>`round(${selectTauxInsertion6moisAgg(
        "indicateurRegionSortie"
      )}, 4)`.as("tauxInsertion"),
      sql<number>`round(${selectTauxDevenirFavorableAgg(
        "indicateurRegionSortie"
      )}, 4)`.as("tauxDevenirFavorable"),
    ])
    .groupBy([
      "formation.cfd",
      "formation.voie",
      "formation.libelleFormation",
      "indicateurRegionSortie.millesimeSortie",
    ])
    .execute();

  const millesimes = _.uniq(
    indicateursIJ
      .filter((i) => i.millesimeSortie)
      .map((i) => i.millesimeSortie as string)
  );

  const tauxIJ: Record<TauxIJKey, TauxIJValue[]> = {
    tauxPoursuite: [],
    tauxInsertion: [],
    tauxDevenirFavorable: [],
  };

  millesimes.forEach((millesime) => {
    const indicateurs = indicateursIJ.filter(
      (i) => i.millesimeSortie === millesime
    );

    const tauxApprentissage = indicateurs.find(
      (i) => i.voie === "apprentissage"
    );
    const tauxScolaire = indicateurs.find((i) => i.voie === "scolaire");

    ["tauxPoursuite", "tauxInsertion", "tauxDevenirFavorable"].forEach(
      (taux) => {
        tauxIJ[taux as TauxIJKey] = [
          ...tauxIJ[taux as TauxIJKey],
          {
            libelle: millesime.replace("_20", "+"),
            apprentissage: tauxApprentissage?.[taux as TauxIJKey],
            scolaire: tauxScolaire?.[taux as TauxIJKey],
          },
        ].map(cleanNull);
      }
    );
  });

  return tauxIJ;
};
