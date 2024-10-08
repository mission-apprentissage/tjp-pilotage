import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { kdb } from "../../../../../db/db";
import { DB } from "../../../../../db/schema";
import { cleanNull } from "../../../../../utils/noNull";
import { isScolaireIndicateurRegionSortie } from "../../../utils/isScolaire";
import { notAnneeCommuneIndicateurRegionSortie } from "../../../utils/notAnneeCommune";
import { notHistoriqueIndicateurRegionSortie } from "../../../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../../utils/tauxPoursuite";

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
  ]);
};

export const getStats = async ({
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
      "formationScolaireView as formationView",
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
    .where(isScolaireIndicateurRegionSortie)
    .where(dernierTauxDeChomage)
    .select([
      "indicateurRegionSortie.codeRegion",
      "region.libelleRegion",
      "indicateurRegion.tauxChomage",
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ])
    .groupBy([
      "indicateurRegionSortie.codeRegion",
      "region.libelleRegion",
      "indicateurRegion.tauxChomage",
    ])
    .$call((q) => {
      if (orderBy && orderBy.column !== "tauxTransformation") {
        return q.orderBy(
          sql.ref(orderBy.column),
          sql`${sql.raw(orderBy.order)} NULLS LAST`
        );
      }

      return q;
    })
    .execute();

  return statsRegions.map(cleanNull);
};
