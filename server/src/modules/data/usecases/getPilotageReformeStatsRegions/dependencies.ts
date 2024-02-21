import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getMillesimeFromRentreeScolaire } from "../../services/getMillesime";
import { notAnneeCommuneIndicateurRegionSortie } from "../../utils/notAnneeCommune";
import { notApprentissageIndicateurRegionSortie } from "../../utils/notApprentissage";
import {
  notHistoriqueFormation,
  notHistoriqueIndicateurRegionSortie,
} from "../../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";

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
    .where(notApprentissageIndicateurRegionSortie)
    .select([
      "indicateurRegionSortie.codeRegion",
      "region.libelleRegion",
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("insertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("poursuite"),
    ])
    .groupBy(["indicateurRegionSortie.codeRegion", "region.libelleRegion"])
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
    .selectFrom("formationScolaireView as formationView")
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
