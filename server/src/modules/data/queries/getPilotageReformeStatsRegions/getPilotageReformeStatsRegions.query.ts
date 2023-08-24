import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getMillesimeFromRentreeScolaire } from "../../services/inserJeunesApi/formatMillesime";
import { notHistoriqueIndicateurRegionSortie } from "../utils/notHistorique";
import { selectTauxDecrochageAgg } from "../utils/tauxDecrochage";
import { selectTauxInsertion6moisAgg } from "../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../utils/tauxPoursuite";

export const getPilotageReformeStatsRegions = async ({
  codeNiveauDiplome,
  orderBy,
}: {
  codeNiveauDiplome?: string[];
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const rentreeScolaire = "2022";

  const statsRegions = await kdb
    .selectFrom("indicateurRegionSortie")
    .leftJoin(
      "formation",
      "formation.codeFormationDiplome",
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
      return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .$call((q) => {
      if (!rentreeScolaire?.length) return q;
      return q.where(
        "indicateurRegionSortie.millesimeSortie",
        "=",
        getMillesimeFromRentreeScolaire({ rentreeScolaire, offset: 0 })
      );
    })
    .where(notHistoriqueIndicateurRegionSortie)
    .select([
      "indicateurRegionSortie.codeRegion",
      "region.libelleRegion",
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as(
        "tauxInsertion6mois"
      ),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as(
        "tauxPoursuiteEtudes"
      ),
      selectTauxDecrochageAgg("indicateurRegion").as("tauxDecrochage"),
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

  const filtersBase = kdb
    .selectFrom("formation")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formation.codeNiveauDiplome"
    )
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
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

  const filters = {
    diplomes: (await diplomes).map(cleanNull),
  };

  return {
    filters: filters,
    statsRegions: statsRegions.map(cleanNull),
  };
};
