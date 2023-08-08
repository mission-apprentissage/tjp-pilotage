import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getMillesimeFromRentreeScolaire } from "../../services/inserJeunesApi/formatMillesime";
import { notHistoriqueIndicateurRegionSortie } from "../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../utils/tauxPoursuite";

export const getPilotageReformeStatsRegions = async ({
  codeNiveauDiplome,
  rentreeScolaire = "2022",
  libelleFiliere,
  orderBy,
}: {
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
  libelleFiliere?: string[];
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const statsRegions = await kdb
    .selectFrom("indicateurRegionSortie")
    .leftJoin(
      "formation",
      "formation.codeFormationDiplome",
      "indicateurRegionSortie.cfd"
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
      if (!libelleFiliere?.length) return q;
      return q.where("formation.libelleFiliere", "in", libelleFiliere);
    })
    .$call((q) => {
      if (!rentreeScolaire?.length) return q;
      return q.where(
        "indicateurRegionSortie.millesimeSortie",
        "=",
        getMillesimeFromRentreeScolaire(rentreeScolaire)
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
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formation.codeFormationDiplome"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formation.codeNiveauDiplome"
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "formationEtablissement.id"
    )
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
    .distinct()
    .$castTo<{ label: string; value: string }>();

  const diplomes = await filtersBase
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where("niveauDiplome.codeNiveauDiplome", "in", ["500", "320", "400"])
    .execute();

  const rentreesScolaires = await filtersBase
    .select([
      "indicateurEntree.rentreeScolaire as label",
      "indicateurEntree.rentreeScolaire as value",
    ])
    .where("indicateurEntree.rentreeScolaire", "is not", null)
    .execute();

  const libelleFilieres = filtersBase
    .select([
      "formation.libelleFiliere as label",
      "formation.libelleFiliere as value",
    ])
    .where("formation.libelleFiliere", "is not", null)
    .where((eb) =>
      eb.or([
        eb.and([]),
        libelleFiliere
          ? eb.cmpr("formation.libelleFiliere", "in", libelleFiliere)
          : sql`false`,
      ])
    )
    .execute();

  const filters = await {
    libelleFilieres: (await libelleFilieres).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
    rentreesScolaires: (await rentreesScolaires).map(cleanNull),
  };

  return {
    filters: filters,
    statsRegions: statsRegions.map(cleanNull),
  };
};
