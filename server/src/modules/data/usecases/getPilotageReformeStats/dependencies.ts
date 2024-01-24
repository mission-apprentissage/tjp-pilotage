import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getMillesimeFromRentreeScolaire } from "../../services/getMillesime";
import { getRentreeScolaire } from "../../services/getRentreeScolaire";
import { effectifAnnee } from "../../utils/effectifAnnee";
import {
  notHistorique,
  notHistoriqueIndicateurRegionSortie,
} from "../../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";


const getRentreesScolaires = async () => {
  return await kdb
    .selectFrom("indicateurEntree")
    .select("rentreeScolaire")
    .distinct()
    .orderBy("rentreeScolaire", "desc")
    .execute()
    .then(rentreesScolaireArray =>
      rentreesScolaireArray
        .map(rentreeScolaire => rentreeScolaire.rentreeScolaire)
    )
}

const getMillesimesSortie = async () => {
  return await kdb
    .selectFrom("indicateurRegionSortie")
    .select("millesimeSortie")
    .distinct()
    .orderBy("millesimeSortie", "desc")
    .execute()
    .then(millesimesSortieArray =>
      millesimesSortieArray
        .map(millesimeSortie => millesimeSortie.millesimeSortie)
    )
}

export const getStats = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
}) => {

  const rentreesScolaires = await getRentreesScolaires()
  const rentreeScolaire =  rentreesScolaires[0]
  const millesimesSortie = await getMillesimesSortie()

  const selectStatsEffectif = ({
    isScoped = false,
    annee = 0,
  }: {
    isScoped: boolean;
    annee: number;
  }) => {
    return kdb
      .selectFrom("formationEtablissement")
      .leftJoin(
        "formation",
        "formation.codeFormationDiplome",
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
        if (!isScoped || !codeRegion) return q;
        return q.where("etablissement.codeRegion", "=", codeRegion);
      })
      .$call((q) => {
        if (!codeNiveauDiplome?.length) return q;
        return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
      })
      .where(notHistorique)
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
    isScoped = false,
    annee = 0,
  }: {
    isScoped: boolean;
    annee: number;
  }) =>
    kdb
      .selectFrom("indicateurRegionSortie")
      .leftJoin(
        "formation",
        "formation.codeFormationDiplome",
        "indicateurRegionSortie.cfd"
      )
      .$call((q) => {
        if (!isScoped || !codeRegion) return q;
        return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
      })
      .$call((q) => {
        if (!codeNiveauDiplome?.length) return q;
        return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
      })
      .$call((q) =>
        q.where(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          getMillesimeFromRentreeScolaire({ rentreeScolaire, offset: annee })
        )
      )
      .where("indicateurRegionSortie.cfdContinuum", "is", null)
      .where(notHistoriqueIndicateurRegionSortie)
      .select([
        selectTauxInsertion6moisAgg("indicateurRegionSortie").as("insertion"),
        selectTauxPoursuiteAgg("indicateurRegionSortie").as("poursuite"),
      ])
      .executeTakeFirstOrThrow();

  const getStatsAnnee = async (millesimeSortie: string) => {
    // millesimeSortie est au format 2000_2001
    const finDanneeScolaireMillesime = parseInt(millesimeSortie.split('_')[1])
    const rentree = parseInt(rentreeScolaire)
    const offset = finDanneeScolaireMillesime - rentree

    return {
      annee: finDanneeScolaireMillesime,
      scoped: {
        ...(await selectStatsEffectif({ isScoped: true, annee: offset })),
        ...(await selectStatsSortie({ isScoped: true, annee: offset + 1 })),
      },
      nationale: {
        ...(await selectStatsEffectif({ isScoped: false, annee: offset })),
        ...(await selectStatsSortie({ isScoped: false, annee: offset + 1 })),
      },
    }
  }

  const annees = await Promise.all(millesimesSortie.map(millesimeSortie => getStatsAnnee(millesimeSortie)))

  return {
    annees
  };
};

const findFiltersInDb = async () => {
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
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .where((eb) =>
      eb(
        "codeFormationDiplome",
        "not in",
        eb.selectFrom("formationHistorique").distinct().select("ancienCFD")
      )
    )
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
