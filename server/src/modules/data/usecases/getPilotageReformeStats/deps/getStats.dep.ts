import { sql } from "kysely";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";
import { getRentreeScolaire } from "shared/utils/getRentreeScolaire";

import { getKbdClient } from "@/db/db";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommune, notAnneeCommuneIndicateurRegionSortie } from "@/modules/data/utils/notAnneeCommune";
import { notHistorique, notHistoriqueIndicateurRegionSortie } from "@/modules/data/utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";

const getRentreesScolaires = async () => {
  return await getKbdClient()
    .selectFrom("indicateurEntree")
    .select("rentreeScolaire")
    .distinct()
    .orderBy("rentreeScolaire", "desc")
    .execute()
    .then((rentreesScolaireArray) => rentreesScolaireArray.map((rentreeScolaire) => rentreeScolaire.rentreeScolaire));
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

export const getStats = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string;
}) => {
  const rentreesScolaires = await getRentreesScolaires();
  const rentreeScolaire = rentreesScolaires[0];
  const millesimesSortie = await getMillesimesSortie();

  const selectStatsEffectif = async ({ isScoped = false, annee = 0 }: { isScoped: boolean; annee: number }) => {
    return getKbdClient()
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
      .executeTakeFirstOrThrow();
  };

  const selectStatsSortie = async ({ isScoped = false, annee = 0 }: { isScoped: boolean; annee: number }) =>
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
      .where(notHistoriqueIndicateurRegionSortie)
      .select([
        selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
        selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
      ])
      .executeTakeFirstOrThrow();

  const getStatsAnnee = async (millesimeSortie: string) => {
    // millesimeSortie est au format 2000_2001
    const finDanneeScolaireMillesime = parseInt(millesimeSortie.split("_")[1]);
    const rentree = parseInt(rentreeScolaire);
    const offset = finDanneeScolaireMillesime - rentree;

    return {
      annee: finDanneeScolaireMillesime,
      millesime: millesimeSortie.split("_"),
      scoped: {
        ...(await selectStatsEffectif({ isScoped: true, annee: offset })),
        ...(await selectStatsSortie({ isScoped: true, annee: offset + 1 })),
      },
      nationale: {
        ...(await selectStatsEffectif({ isScoped: false, annee: offset })),
        ...(await selectStatsSortie({ isScoped: false, annee: offset + 1 })),
      },
    };
  };

  const annees = await Promise.all(millesimesSortie.map(async (millesimeSortie) => getStatsAnnee(millesimeSortie)));

  return {
    annees,
  };
};
