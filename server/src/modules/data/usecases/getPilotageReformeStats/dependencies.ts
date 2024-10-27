// @ts-nocheck -- TODO

import { sql } from "kysely";
import { NEXT_RENTREE } from "shared/time/NEXT_RENTREE";

import { getKbdClient } from "@/db/db";
import { getMillesimeFromRentreeScolaire } from "@/modules/data/services/getMillesime";
import { getRentreeScolaire } from "@/modules/data/services/getRentreeScolaire";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommune, notAnneeCommuneIndicateurRegionSortie } from "@/modules/data/utils/notAnneeCommune";
import {
  notHistorique,
  notHistoriqueFormation,
  notHistoriqueIndicateurRegionSortie,
} from "@/modules/data/utils/notHistorique";
import { genericOnConstatRentree } from "@/modules/data/utils/onConstatDeRentree";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";
import { countPlacesTransformeesParCampagne } from "@/modules/utils/countCapacite";
import { isDemandeNotAjustementRentree, isDemandeNotDeletedOrRefused } from "@/modules/utils/isDemandeSelectable";
import { cleanNull } from "@/utils/noNull";

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
  codeNiveauDiplome?: string[];
}) => {
  const rentreesScolaires = await getRentreesScolaires();
  const rentreeScolaire = rentreesScolaires[0];
  const millesimesSortie = await getMillesimesSortie();

  const selectStatsEffectif = ({ isScoped = false, annee = 0 }: { isScoped: boolean; annee: number }) => {
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
        if (!codeNiveauDiplome?.length) return q;
        return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
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

  const selectStatsSortie = ({ isScoped = false, annee = 0 }: { isScoped: boolean; annee: number }) =>
    getKbdClient()
      .selectFrom("indicateurRegionSortie")
      .leftJoin("formationScolaireView as formationView", "formationView.cfd", "indicateurRegionSortie.cfd")
      .$call((q) => {
        if (!isScoped || !codeRegion) return q;
        return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
      })
      .$call((q) => {
        if (!codeNiveauDiplome?.length) return q;
        return q.where("formationView.codeNiveauDiplome", "in", codeNiveauDiplome);
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

const findFiltersInDb = async () => {
  const filtersBase = getKbdClient()
    .selectFrom("formationScolaireView as formationView")
    .leftJoin("formationEtablissement", "formationEtablissement.cfd", "formationView.cfd")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .leftJoin("etablissement", "etablissement.uai", "formationEtablissement.uai")
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
    .select(["niveauDiplome.libelleNiveauDiplome as label", "niveauDiplome.codeNiveauDiplome as value"])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where("niveauDiplome.codeNiveauDiplome", "in", ["500", "320", "400"])
    .execute();

  return {
    regions: (await regions).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
  };
};

const getTauxTransformationData = async (filters: { codeNiveauDiplome?: string[]; codeRegion?: string }) => {
  return getKbdClient()
    .selectFrom("latestDemandeIntentionView as demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("campagne", "campagne.id", "demande.campagneId")
    .select((eb) => [
      eb.fn.coalesce(eb.fn.sum<number>(countPlacesTransformeesParCampagne(eb)), sql`0`).as("transformes"),
      genericOnConstatRentree({ ...filters })
        .select((eb) => eb.fn.coalesce(eb.fn.sum<number>("effectif"), eb.val(0)).as("effectif"))
        .as("effectif"),
    ])
    .where(isDemandeNotDeletedOrRefused)
    .where(isDemandeNotAjustementRentree)
    .$call((eb) => {
      return eb.where("demande.rentreeScolaire", "in", [parseInt(NEXT_RENTREE)]);
    })
    .$call((eb) => {
      if (filters.codeNiveauDiplome)
        return eb.where("dataFormation.codeNiveauDiplome", "in", filters.codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeRegion) {
        return eb.where("dataEtablissement.codeRegion", "=", filters.codeRegion);
      }
      return eb;
    })
    .execute()
    .then(cleanNull);
};

export const dependencies = {
  getStats,
  findFiltersInDb,
  getTauxTransformationData,
};
