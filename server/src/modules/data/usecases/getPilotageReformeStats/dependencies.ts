import { sql } from "kysely";
import { NEXT_RENTREE } from "shared/time/NEXT_RENTREE";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { countDifferenceCapacite } from "../../../utils/countCapacite";
import {
  isDemandeNotAjustementRentree,
  isDemandeNotDeletedOrRefused,
} from "../../../utils/isDemandeSelectable";
import { getMillesimeFromRentreeScolaire } from "../../services/getMillesime";
import { getRentreeScolaire } from "../../services/getRentreeScolaire";
import { effectifAnnee } from "../../utils/effectifAnnee";
import { isScolaireIndicateurRegionSortie } from "../../utils/isScolaire";
import {
  notAnneeCommune,
  notAnneeCommuneIndicateurRegionSortie,
} from "../../utils/notAnneeCommune";
import {
  notHistorique,
  notHistoriqueFormation,
  notHistoriqueIndicateurRegionSortie,
} from "../../utils/notHistorique";
import { genericOnConstatRentree } from "../../utils/onConstatDeRentree";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";

const getRentreesScolaires = async () => {
  return await kdb
    .selectFrom("indicateurEntree")
    .select("rentreeScolaire")
    .distinct()
    .orderBy("rentreeScolaire", "desc")
    .execute()
    .then((rentreesScolaireArray) =>
      rentreesScolaireArray.map(
        (rentreeScolaire) => rentreeScolaire.rentreeScolaire
      )
    );
};

const getMillesimesSortie = async () => {
  return await kdb
    .selectFrom("indicateurRegionSortie")
    .select("millesimeSortie")
    .distinct()
    .orderBy("millesimeSortie", "desc")
    .execute()
    .then((millesimesSortieArray) =>
      millesimesSortieArray.map(
        (millesimeSortie) => millesimeSortie.millesimeSortie
      )
    );
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
        "formationScolaireView as formationView",
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
        if (!isScoped || !codeRegion) return q;
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
      .where(notAnneeCommune)
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
        "formationScolaireView as formationView",
        "formationView.cfd",
        "indicateurRegionSortie.cfd"
      )
      .$call((q) => {
        if (!isScoped || !codeRegion) return q;
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
      .where(isScolaireIndicateurRegionSortie)
      .where(notAnneeCommuneIndicateurRegionSortie)
      .where(notHistoriqueIndicateurRegionSortie)
      .select([
        selectTauxInsertion6moisAgg("indicateurRegionSortie").as(
          "tauxInsertion"
        ),
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

  const annees = await Promise.all(
    millesimesSortie.map((millesimeSortie) => getStatsAnnee(millesimeSortie))
  );

  return {
    annees,
  };
};

const findFiltersInDb = async () => {
  const filtersBase = kdb
    .selectFrom("formationScolaireView as formationView")
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

const getTauxTransformationData = async (filters: {
  codeNiveauDiplome?: string[];
  codeRegion?: string;
}) => {
  return kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .select((es) => [
      es.fn
        .coalesce(es.fn.sum<number>(countDifferenceCapacite(es)), sql`0`)
        .as("transformes"),
      genericOnConstatRentree({ ...filters })()
        .select((eb) => sql<number>`SUM(${eb.ref("effectif")})`.as("effectif"))
        .as("effectif"),
    ])
    .where(isDemandeNotDeletedOrRefused)
    .where(isDemandeNotAjustementRentree)
    .$call((eb) => {
      return eb.where("demande.rentreeScolaire", "in", [
        parseInt(NEXT_RENTREE),
      ]);
    })
    .$call((eb) => {
      if (filters.codeNiveauDiplome)
        return eb.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          filters.codeNiveauDiplome
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.codeRegion) {
        return eb.where(
          "dataEtablissement.codeRegion",
          "=",
          filters.codeRegion
        );
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
