import { ExpressionBuilder, sql } from "kysely";
import { ScopeEnum } from "shared";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import {
  countDifferenceCapacite,
  countFermeturesApprentissage,
  countFermeturesSco,
  countOuverturesApprentissage,
  countOuverturesSco,
} from "../../../../utils/countCapacite";
import { isDemandeNotDeletedOrRefused } from "../../../../utils/isDemandeSelectable";
import {
  notPerimetreIJAcademie,
  notPerimetreIJDepartement,
  notPerimetreIJRegion,
} from "../../../utils/notPerimetreIJ";
import { genericOnConstatRentree } from "../../../utils/onConstatDeRentree";
import { Filters } from "../getStatsPilotageIntentions.usecase";

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.count<number>("demande.numero");

const genericOnDemandes =
  ({
    statut,
    rentreeScolaire,
    codeNiveauDiplome,
    CPC,
    codeNsf,
    campagne,
  }: Filters) =>
  (eb: ExpressionBuilder<DB, "region" | "academie" | "departement">) =>
    eb
      .selectFrom("latestDemandeIntentionView as demande")
      .innerJoin("campagne", (join) =>
        join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
          if (campagne) return eb.on("campagne.annee", "=", campagne);
          return eb;
        })
      )
      .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
      .select((es) => [
        es.fn
          .coalesce(eb.fn.sum<number>(countOuverturesSco(es)), sql`0`)
          .as("placesOuvertesScolaire"),
        es.fn
          .coalesce(eb.fn.sum<number>(countFermeturesSco(es)), sql`0`)
          .as("placesFermeesScolaire"),
        es.fn
          .coalesce(eb.fn.sum<number>(countOuverturesApprentissage(es)), sql`0`)
          .as("placesOuvertesApprentissage"),
        es.fn
          .coalesce(eb.fn.sum<number>(countFermeturesApprentissage(es)), sql`0`)
          .as("placesFermeesApprentissage"),
        es.fn
          .coalesce(eb.fn.sum<number>(countDifferenceCapacite(es)), sql`0`)
          .as("transformes"),
        selectNbDemandes(es).as("countDemande"),
      ])
      .where(isDemandeNotDeletedOrRefused)
      .$call((eb) => {
        if (rentreeScolaire)
          return eb.where(
            "demande.rentreeScolaire",
            "in",
            rentreeScolaire.map((rentree) => parseInt(rentree))
          );
        return eb;
      })
      .$call((eb) => {
        if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
        return eb;
      })
      .$call((eb) => {
        if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
        return eb;
      })
      .$call((eb) => {
        if (codeNiveauDiplome)
          return eb.where(
            "dataFormation.codeNiveauDiplome",
            "in",
            codeNiveauDiplome
          );
        return eb;
      })
      .$call((q) => {
        if (!statut) return q;
        return q.where("demande.statut", "=", statut);
      });

const getNationalData = async (filters: Filters) => {
  return kdb
    .selectFrom("latestDemandeView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (filters.campagne)
          return eb.on("campagne.annee", "=", filters.campagne);
        return eb;
      })
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .select((es) => [
      es.fn
        .coalesce(es.fn.sum<number>(countOuverturesSco(es)), sql`0`)
        .as("placesOuvertesScolaire"),
      es.fn
        .coalesce(es.fn.sum<number>(countFermeturesSco(es)), sql`0`)
        .as("placesFermeesScolaire"),
      es.fn
        .coalesce(es.fn.sum<number>(countOuverturesApprentissage(es)), sql`0`)
        .as("placesOuvertesApprentissage"),
      es.fn
        .coalesce(es.fn.sum<number>(countFermeturesApprentissage(es)), sql`0`)
        .as("placesFermeesApprentissage"),
      es.fn
        .coalesce(es.fn.sum<number>(countDifferenceCapacite(es)), sql`0`)
        .as("transformes"),
      selectNbDemandes(es).as("countDemande"),
      genericOnConstatRentree(filters)()
        .select((eb) => sql<number>`SUM(${eb.ref("effectif")})`.as("effectif"))
        .as("effectif"),
      sql<string>`'national'`.as("code"),
      sql<string>`'national'`.as("libelle"),
    ])
    .where(isDemandeNotDeletedOrRefused)
    .$call((eb) => {
      if (filters.rentreeScolaire)
        return eb.where(
          "demande.rentreeScolaire",
          "in",
          filters.rentreeScolaire.map((rentree) => parseInt(rentree))
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.CPC) return eb.where("dataFormation.cpc", "in", filters.CPC);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeNsf)
        return eb.where("dataFormation.codeNsf", "in", filters.codeNsf);
      return eb;
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
    .$call((q) => {
      if (!filters.statut) return q;
      return q.where("demande.statut", "=", filters.statut);
    })
    .execute()
    .then(cleanNull);
};

const getRegionData = async (filters: Filters) => {
  return kdb
    .selectFrom("region")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .select((es) => [es.ref("demande.codeRegion").as("codeRegion")])
          .groupBy(["demande.codeRegion"])
          .as("demandes"),
      (join) => join.onRef("demandes.codeRegion", "=", "region.codeRegion")
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((es) => [
            es.ref("dataEtablissement.codeRegion").as("codeRegion"),
            sql<number>`SUM(${es.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .groupBy(["dataEtablissement.codeRegion"])
          .as("effectifs"),
      (join) => join.onRef("effectifs.codeRegion", "=", "region.codeRegion")
    )
    .select((eb) => [
      eb.ref("region.codeRegion").as("code"),
      eb.ref("region.libelleRegion").as("libelle"),
      eb.ref("effectifs.effectif").as("effectif"),
      sql<number>`COALESCE(${eb.ref("demandes.placesOuvertesScolaire")}, 0)`.as(
        "placesOuvertesScolaire"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.placesFermeesScolaire")}, 0)`.as(
        "placesFermeesScolaire"
      ),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesOuvertesApprentissage"
      )}, 0)`.as("placesOuvertesApprentissage"),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesFermeesApprentissage"
      )}, 0)`.as("placesFermeesApprentissage"),
      sql<number>`COALESCE(${eb.ref("demandes.transformes")}, 0)`.as(
        "transformes"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.countDemande")}, 0)`.as(
        "countDemande"
      ),
    ])
    .where(notPerimetreIJRegion)
    .execute()
    .then(cleanNull);
};

const getAcademieData = async (filters: Filters) => {
  return kdb
    .selectFrom("academie")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .select((es) => [es.ref("demande.codeAcademie").as("codeAcademie")])
          .groupBy(["demande.codeAcademie"])
          .as("demandes"),
      (join) =>
        join.onRef("demandes.codeAcademie", "=", "academie.codeAcademie")
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((es) => [
            es.ref("dataEtablissement.codeAcademie").as("codeAcademie"),
            sql<number>`SUM(${es.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .groupBy(["dataEtablissement.codeAcademie"])
          .as("effectifs"),
      (join) =>
        join.onRef("effectifs.codeAcademie", "=", "academie.codeAcademie")
    )
    .select((eb) => [
      eb.ref("academie.codeAcademie").as("code"),
      eb.ref("academie.libelleAcademie").as("libelle"),
      eb.ref("effectifs.effectif").as("effectif"),
      sql<number>`COALESCE(${eb.ref("demandes.placesOuvertesScolaire")}, 0)`.as(
        "placesOuvertesScolaire"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.placesFermeesScolaire")}, 0)`.as(
        "placesFermeesScolaire"
      ),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesOuvertesApprentissage"
      )}, 0)`.as("placesOuvertesApprentissage"),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesFermeesApprentissage"
      )}, 0)`.as("placesFermeesApprentissage"),
      sql<number>`COALESCE(${eb.ref("demandes.transformes")}, 0)`.as(
        "transformes"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.countDemande")}, 0)`.as(
        "countDemande"
      ),
    ])
    .where(notPerimetreIJAcademie)
    .execute()
    .then(cleanNull);
};

const getDepartementData = async (filters: Filters) => {
  return kdb
    .selectFrom("departement")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
          .select((es) => [
            es.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
          ])
          .groupBy(["dataEtablissement.codeDepartement"])
          .as("demandes"),
      (join) =>
        join.onRef(
          "demandes.codeDepartement",
          "=",

          "departement.codeDepartement"
        )
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((es) => [
            es.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
            sql<number>`SUM(${es.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .groupBy(["dataEtablissement.codeDepartement"])
          .as("effectifs"),
      (join) =>
        join.onRef(
          "effectifs.codeDepartement",
          "=",
          "departement.codeDepartement"
        )
    )
    .leftJoin("academie", "academie.codeAcademie", "departement.codeAcademie")
    .select((eb) => [
      eb.ref("departement.codeDepartement").as("code"),
      eb.ref("departement.libelleDepartement").as("libelle"),
      eb.ref("academie.libelleAcademie").as("libelleAcademie"),
      eb.ref("effectifs.effectif").as("effectif"),
      sql<number>`COALESCE(${eb.ref("demandes.placesOuvertesScolaire")}, 0)`.as(
        "placesOuvertesScolaire"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.placesFermeesScolaire")}, 0)`.as(
        "placesFermeesScolaire"
      ),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesOuvertesApprentissage"
      )}, 0)`.as("placesOuvertesApprentissage"),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesFermeesApprentissage"
      )}, 0)`.as("placesFermeesApprentissage"),
      sql<number>`COALESCE(${eb.ref("demandes.transformes")}, 0)`.as(
        "transformes"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.countDemande")}, 0)`.as(
        "countDemande"
      ),
    ])
    .where(notPerimetreIJDepartement)
    .execute()
    .then(cleanNull);
};

export const getStatsPilotageIntentionsQuery = async ({
  statut,
  rentreeScolaire,
  codeNiveauDiplome,
  CPC,
  codeNsf,
  scope,
  campagne,
}: Filters) => {
  switch (scope) {
    case ScopeEnum.academie:
      return getAcademieData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        campagne,
        scope,
      });

    case ScopeEnum.departement:
      return getDepartementData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        campagne,
        scope,
      });
    case ScopeEnum.region:
      return getRegionData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        campagne,
        scope,
      });
    case ScopeEnum.national:
    default:
      return getNationalData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        campagne,
        scope,
      });
  }
};
