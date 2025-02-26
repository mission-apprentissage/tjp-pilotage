import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getFinDanneeScolaireMillesime } from "shared/time/millesimes";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";
import { getRentreeScolaire } from "shared/utils/getRentreeScolaire";

import { getKbdClient } from "@/db/db";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommune, notAnneeCommuneIndicateurRegionSortie } from "@/modules/data/utils/notAnneeCommune";
import { notHistorique } from "@/modules/data/utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";
import { cleanNull } from "@/utils/noNull";

const getDerniereRentreeScolaireIndicateurEntree = async () => {
  return await getKbdClient()
    .selectFrom("indicateurEntree")
    .select("rentreeScolaire")
    .distinct()
    .orderBy("rentreeScolaire", "desc")
    .executeTakeFirst()
    .then((result) => result?.rentreeScolaire ?? CURRENT_RENTREE);
};

const getMillesimesSortie = async () => {
  return await getKbdClient()
    .selectFrom("indicateurRegionSortie")
    .select("millesimeSortie")
    .distinct()
    .orderBy("millesimeSortie", "desc")
    .execute()
    .then((millesimesSortieArray) => millesimesSortieArray.map((millesimeSortie) => millesimeSortie.millesimeSortie));
};

const selectStatsEffectif = async (
  { isScoped = false, annee = 0, rentreeScolaire, codeRegion, codeNiveauDiplome }:
  { isScoped: boolean; annee: number, rentreeScolaire: string, codeRegion?: string, codeNiveauDiplome?: string }) => getKbdClient()
  .selectFrom("formationEtablissement")
  .leftJoin("formationScolaireView as formationView", "formationView.cfd", "formationEtablissement.cfd")
  .innerJoin("indicateurEntree", (join) =>
    join
      .onRef("formationEtablissement.id", "=", "indicateurEntree.formationEtablissementId")
      .on("indicateurEntree.rentreeScolaire", "=", getRentreeScolaire({ rentreeScolaire, offset: annee }))
  )
  .leftJoin("etablissement", "etablissement.uai", "formationEtablissement.uai")
  .$call((q) => {
    if (!isScoped || !codeRegion) return q;
    return q.where("etablissement.codeRegion", "=", codeRegion);
  })
  .$call((q) => {
    if (!codeNiveauDiplome) return q;
    return q.where("formationView.codeNiveauDiplome", "=", codeNiveauDiplome);
  })
  .where(notHistorique)
  .where(notAnneeCommune)
  .select([
    sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."codeDispositif"))`.as(
      "nbFormations"
    ),
    sql<number>`COUNT(distinct "formationEtablissement"."uai")`.as("nbEtablissements"),
    sql<number>`COALESCE(SUM(${effectifAnnee({
      alias: "indicateurEntree",
    })}),0)`.as("effectif"),
  ])
  .executeTakeFirstOrThrow()
  .then(cleanNull);

const selectStatsSortie = async ({ isScoped = false, annee = 0, rentreeScolaire, codeRegion, codeNiveauDiplome }:
  { isScoped: boolean; annee: number, rentreeScolaire: string, codeRegion?: string, codeNiveauDiplome?: string }) =>
  getKbdClient()
    .selectFrom("indicateurRegionSortie")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "indicateurRegionSortie.cfd")
    .$call((q) => {
      if (!isScoped || !codeRegion) return q;
      return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!codeNiveauDiplome) return q;
      return q.where("formationView.codeNiveauDiplome", "=", codeNiveauDiplome);
    })
    .$call((q) =>
      q.where(
        "indicateurRegionSortie.millesimeSortie",
        "=",
        getMillesimeFromRentreeScolaire({ rentreeScolaire, offset: annee })
      )
    )
    .where("indicateurRegionSortie.cfdContinuum", "is", null)
    .where(isScolaireIndicateurRegionSortie)
    .where(notAnneeCommuneIndicateurRegionSortie)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ])
    .executeTakeFirstOrThrow()
    .then(cleanNull);

export const getStats = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string;
}) => {
  const rentreeScolaire = await getDerniereRentreeScolaireIndicateurEntree();
  const millesimesSortie = await getMillesimesSortie();

  const getStatsAnnee = async (millesimeSortie: string) => {
    // millesimeSortie est au format 2000_2001
    const finDanneeScolaireMillesime = getFinDanneeScolaireMillesime(millesimeSortie);
    const rentree = parseInt(rentreeScolaire);
    const offset = finDanneeScolaireMillesime - rentree;

    return {
      annee: finDanneeScolaireMillesime,
      millesime: millesimeSortie.split("_"),
      scoped: {
        ...(await selectStatsEffectif({ isScoped: true, annee: offset, rentreeScolaire, codeRegion, codeNiveauDiplome })),
        ...(await selectStatsSortie({ isScoped: true, annee: offset + 1, rentreeScolaire, codeRegion, codeNiveauDiplome })),
      },
      nationale: {
        ...(await selectStatsEffectif({ isScoped: false, annee: offset, rentreeScolaire, codeRegion, codeNiveauDiplome })),
        ...(await selectStatsSortie({ isScoped: false, annee: offset + 1, rentreeScolaire, codeRegion, codeNiveauDiplome })),
      },
    };
  };

  const annees = await Promise.all(millesimesSortie.map(async (millesimeSortie) => getStatsAnnee(millesimeSortie)));

  return {
    annees,
  };
};
