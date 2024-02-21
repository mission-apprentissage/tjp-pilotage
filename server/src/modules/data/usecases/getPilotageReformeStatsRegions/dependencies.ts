import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { DB, kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getMillesimeFromRentreeScolaire } from "../../services/getMillesime";
import { notAnneeCommuneIndicateurRegionSortie } from "../../utils/notAnneeCommune";
import {
  notHistoriqueFormation,
  notHistoriqueIndicateurRegionSortie,
} from "../../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";

/**
 * On prend le taux de chomage du dernier trimestre de l'année
 * définit le taux de chomage annuel. Or, à cette date (13/02/2024)
 * le taux de chomage du T4 n'est pas encore disponible, nous
 * prenons donc celui de 2022, et inscrivons la valeur en "dur".
 */
const dernierTauxDeChomage = (
  eb: ExpressionBuilder<DB, "indicateurRegion">
) => {
  return eb.or([
    eb("indicateurRegion.rentreeScolaire", "=", "2022"),
    eb("indicateurRegion.rentreeScolaire", "is", null),
  ])
}


const getStatsRegions = async ({
  codeNiveauDiplome,
  orderBy = { order: "asc", column: "libelleRegion" },
}: {
  codeNiveauDiplome?: string[];
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const rentreeScolaire = CURRENT_RENTREE;

  const statsRegions = await kdb
    .selectFrom("indicateurRegionSortie")
    .leftJoin(
      "formationView",
      "formationView.cfd",
      "indicateurRegionSortie.cfd"
    )
    .leftJoin(
      "indicateurRegion",
      "indicateurRegion.codeRegion",
      "indicateurRegionSortie.codeRegion"
    )
    .leftJoin(
      "region",
      "region.codeRegion",
      "indicateurRegionSortie.codeRegion"
    )
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .$call((q) => {
      if (!rentreeScolaire?.length) return q;
      return q.where(
        "indicateurRegionSortie.millesimeSortie",
        "=",
        getMillesimeFromRentreeScolaire({ rentreeScolaire, offset: 0 })
      );
    })
    .where("indicateurRegionSortie.cfdContinuum", "is", null)
    .where(notAnneeCommuneIndicateurRegionSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .where(dernierTauxDeChomage)
    .select([
      "indicateurRegionSortie.codeRegion",
      "region.libelleRegion",
      "indicateurRegion.tauxChomage",
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("insertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("poursuite"),
    ])
    .groupBy(["indicateurRegionSortie.codeRegion", "region.libelleRegion", "indicateurRegion.tauxChomage"])
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
    })
    .execute();

  return statsRegions.map(cleanNull);
};

const findFiltersInDb = async () => {
  const filtersBase = kdb
    .selectFrom("formationView")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .where(notHistoriqueFormation)
    .distinct()
    .$castTo<{ label: string; value: string }>();

  const diplomes = filtersBase
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where("niveauDiplome.codeNiveauDiplome", "in", ["500", "320", "400"])
    .execute();

  return {
    diplomes: (await diplomes).map(cleanNull),
  };
};

export const dependencies = {
  getStatsRegions,
  findFiltersInDb,
};
