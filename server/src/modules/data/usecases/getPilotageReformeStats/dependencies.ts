import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getMillesimeFromRentreeScolaire } from "../../services/getMillesime";
import { getRentreeScolaire } from "../../services/getRentreeScolaire";
import { effectifAnnee } from "../../utils/effectifAnnee";
import {
  notHistorique,
  notHistoriqueFormation,
  notHistoriqueIndicateurRegionSortie,
} from "../../utils/notHistorique";
import {
  notSecondeCommune,
  notSecondeCommuneIndicateurRegionSortie,
} from "../../utils/notSecondeCommune";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";

export const getStats = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
}) => {
  const rentreeScolaire = "2022";

  const selectStatsEffectif = ({
    isFiltered = false,
    annee = 0,
  }: {
    isFiltered: boolean;
    annee: number;
  }) => {
    return kdb
      .selectFrom("formationEtablissement")
      .leftJoin(
        "formationView",
        "formationView.cfd",
        "formationEtablissement.cfd"
      )
      .innerJoin("indicateurEntree", (join) =>
        join
          .onRef(
            "formationEtablissement.id",
            "=",
            "indicateurEntree.formationEtablissementId"
          )
          .on(
            "indicateurEntree.rentreeScolaire",
            "=",
            getRentreeScolaire({ rentreeScolaire, offset: annee })
          )
      )
      .leftJoin(
        "etablissement",
        "etablissement.UAI",
        "formationEtablissement.UAI"
      )
      .$call((q) => {
        if (!isFiltered || !codeRegion) return q;
        return q.where("etablissement.codeRegion", "=", codeRegion);
      })
      .$call((q) => {
        if (!codeNiveauDiplome?.length) return q;
        return q.where(
          "formationView.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      })
      .where(notHistorique)
      .where(notSecondeCommune)
      .select([
        sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
          "nbFormations"
        ),
        sql<number>`COUNT(distinct "formationEtablissement"."UAI")`.as(
          "nbEtablissements"
        ),
        sql<number>`COALESCE(SUM(${effectifAnnee({
          alias: "indicateurEntree",
        })}),0)`.as("effectif"),
      ])
      .executeTakeFirstOrThrow();
  };

  const selectStatsSortie = ({
    isFiltered = false,
    annee = 0,
  }: {
    isFiltered: boolean;
    annee: number;
  }) =>
    kdb
      .selectFrom("indicateurRegionSortie")
      .leftJoin(
        "formationView",
        "formationView.cfd",
        "indicateurRegionSortie.cfd"
      )
      .$call((q) => {
        if (!isFiltered || !codeRegion) return q;
        return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
      })
      .$call((q) => {
        if (!codeNiveauDiplome?.length) return q;
        return q.where(
          "formationView.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      })
      .$call((q) =>
        q.where(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          getMillesimeFromRentreeScolaire({ rentreeScolaire, offset: annee })
        )
      )
      .where("indicateurRegionSortie.cfdContinuum", "is", null)
      .where(notSecondeCommuneIndicateurRegionSortie)
      .where(notHistoriqueIndicateurRegionSortie)
      .select([
        selectTauxInsertion6moisAgg("indicateurRegionSortie").as("insertion"),
        selectTauxPoursuiteAgg("indicateurRegionSortie").as("poursuite"),
      ])
      .executeTakeFirstOrThrow();

  return {
    anneeN: {
      filtered: {
        ...(await selectStatsEffectif({ isFiltered: true, annee: 0 })),
        ...(await selectStatsSortie({ isFiltered: true, annee: 0 })),
      },
      nationale: {
        ...(await selectStatsEffectif({ isFiltered: false, annee: 0 })),
        ...(await selectStatsSortie({ isFiltered: false, annee: 0 })),
      },
    },
    anneeNMoins1: {
      filtered: {
        ...(await selectStatsEffectif({ isFiltered: true, annee: -1 })),
        ...(await selectStatsSortie({ isFiltered: true, annee: -1 })),
      },
      nationale: {
        ...(await selectStatsEffectif({ isFiltered: false, annee: -1 })),
        ...(await selectStatsSortie({ isFiltered: false, annee: -1 })),
      },
    },
  };
};

const findFiltersInDb = async () => {
  const filtersBase = kdb
    .selectFrom("formationView")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .where(notHistoriqueFormation)
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const regions = filtersBase
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .execute();

  const diplomes = filtersBase
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where("niveauDiplome.codeNiveauDiplome", "in", ["500", "320", "400"])
    .execute();

  return {
    regions: (await regions).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
  };
};

export const dependencies = {
  getStats,
  findFiltersInDb,
};
