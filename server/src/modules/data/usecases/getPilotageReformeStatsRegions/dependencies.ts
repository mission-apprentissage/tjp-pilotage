import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { getMillesimeFromRentreeScolaire } from "@/modules/data/services/getMillesime";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommuneIndicateurRegionSortie } from "@/modules/data/utils/notAnneeCommune";
import { notHistoriqueFormation, notHistoriqueIndicateurRegionSortie } from "@/modules/data/utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";
import { cleanNull } from "@/utils/noNull";

/**
 * On prend le taux de chomage du dernier trimestre de l'année
 * définit le taux de chomage annuel. Or, à cette date (13/02/2024)
 * le taux de chomage du T4 n'est pas encore disponible, nous
 * prenons donc celui de 2022, et inscrivons la valeur en "dur".
 */
const dernierTauxDeChomage = (eb: ExpressionBuilder<DB, "indicateurRegion">) => {
  return eb.or([
    eb("indicateurRegion.rentreeScolaire", "=", "2022"),
    eb("indicateurRegion.rentreeScolaire", "is", null),
  ]);
};

const getStatsRegions = async ({
  codeNiveauDiplome,
  orderBy = { order: "asc", column: "libelleRegion" },
}: {
  codeNiveauDiplome?: string[];
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const rentreeScolaire = CURRENT_RENTREE;

  const statsRegions = await getKbdClient()
    .selectFrom("indicateurRegionSortie")
    // @ts-expect-error TODO
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "indicateurRegionSortie.cfd")
    // @ts-expect-error TODO
    .leftJoin("indicateurRegion", "indicateurRegion.codeRegion", "indicateurRegionSortie.codeRegion")
    .leftJoin("region", "region.codeRegion", "indicateurRegionSortie.codeRegion")
    // @ts-expect-error TODO
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    // @ts-expect-error TODO
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
    .groupBy(["indicateurRegionSortie.codeRegion", "region.libelleRegion", "indicateurRegion.tauxChomage"])
    // @ts-expect-error TODO
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(sql.ref(orderBy.column), sql`${sql.raw(orderBy.order)} NULLS LAST`);
    })
    .execute();

  return statsRegions.map(cleanNull);
};

const findFiltersInDb = async () => {
  const filtersBase = getKbdClient()
    // @ts-expect-error TODO
    .selectFrom("formationScolaireView as formationView")
    // @ts-expect-error TODO
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    // @ts-expect-error TODO
    .where(notHistoriqueFormation)
    .distinct()
    .$castTo<{ label: string; value: string }>();

  const diplomes = filtersBase
    .select(["niveauDiplome.libelleNiveauDiplome as label", "niveauDiplome.codeNiveauDiplome as value"])
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
