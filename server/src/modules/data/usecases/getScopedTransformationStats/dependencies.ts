import { ExpressionBuilder, expressionBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import { isDemandeNotDeletedOrRefused } from "../../../utils/isDemandeSelectable";
import {
  notPerimetreIJAcademie,
  notPerimetreIJDepartement,
  notPerimetreIJRegion,
} from "../../utils/notPerimetreIJ";
import { Scope } from "./getScopedTransformationStats.schema";

const selectPlacesTransformees = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.coalesce(
    eb.fn.sum<number>(
      sql`ABS(
          ${eb.ref("demande.capaciteScolaire")}
          -${eb.ref("demande.capaciteScolaireActuelle")})
          +GREATEST(${eb.ref("demande.capaciteApprentissage")}
          -${eb.ref("demande.capaciteApprentissageActuelle")}, 0)`
    ),
    sql`0`
  );

const selectPlacesOuvertesScolaire = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.coalesce(
    eb.fn.sum<number>(
      sql`GREATEST(${eb.ref("demande.capaciteScolaire")}
        - ${eb.ref("demande.capaciteScolaireActuelle")}, 0)`
    ),
    sql`0`
  );

const selectPlacesFermeesScolaire = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.coalesce(
    eb.fn.sum<number>(
      sql`GREATEST(${eb.ref("demande.capaciteScolaireActuelle")}
        - ${eb.ref("demande.capaciteScolaire")}, 0)`
    ),
    sql`0`
  );

const selectPlacesOuvertesApprentissage = (
  eb: ExpressionBuilder<DB, "demande">
) =>
  eb.fn.coalesce(
    eb.fn.sum<number>(
      sql`GREATEST(${eb.ref("demande.capaciteApprentissage")}
      - ${eb.ref("demande.capaciteApprentissageActuelle")}, 0)`
    ),
    sql`0`
  );

const selectPlacesFermeesApprentissage = (
  eb: ExpressionBuilder<DB, "demande">
) =>
  eb.fn.sum<number>(
    sql`GREATEST(${eb.ref("demande.capaciteApprentissageActuelle")}
      - ${eb.ref("demande.capaciteApprentissage")}, 0)`
  );

const genericOnConstatRentree =
  ({
    codeNiveauDiplome,
    CPC,
    filiere,
  }: {
    codeNiveauDiplome?: string[];
    CPC?: string[];
    filiere?: string[];
  }) =>
  () => {
    return expressionBuilder<DB, keyof DB>()
      .selectFrom("constatRentree")
      .leftJoin(
        "dataEtablissement",
        "dataEtablissement.uai",
        "constatRentree.uai"
      )
      .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
      .where("constatRentree.rentreeScolaire", "=", "2022")
      .where("constatRentree.anneeDispositif", "=", 1)
      .$call((eb) => {
        if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
        return eb;
      })
      .$call((eb) => {
        if (filiere)
          return eb.where("dataFormation.libelleFiliere", "in", filiere);
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
      });
  };

const genericOnDemandes =
  ({
    status,
    rentreeScolaire = "2024",
    codeNiveauDiplome,
    CPC,
    filiere,
  }: {
    status?: "draft" | "submitted";
    rentreeScolaire?: string;
    codeNiveauDiplome?: string[];
    CPC?: string[];
    filiere?: string[];
  }) =>
  (eb: ExpressionBuilder<DB, "region" | "academie" | "departement">) =>
    eb
      .selectFrom("demande")
      .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
      .select((es) => [
        selectPlacesOuvertesScolaire(es).as("placesOuvertesScolaire"),
        selectPlacesFermeesScolaire(es).as("placesFermeesScolaire"),
        selectPlacesOuvertesApprentissage(es).as("placesOuvertesApprentissage"),
        selectPlacesTransformees(es).as("transformes"),
        selectPlacesFermeesApprentissage(es).as("placesFermeesApprentissage"),
      ])
      .where(isDemandeNotDeletedOrRefused)
      .$call((eb) => {
        if (rentreeScolaire && !Number.isNaN(rentreeScolaire))
          return eb.where(
            "demande.rentreeScolaire",
            "=",
            parseInt(rentreeScolaire)
          );
        return eb;
      })
      .$call((eb) => {
        if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
        return eb;
      })
      .$call((eb) => {
        if (filiere)
          return eb.where("dataFormation.libelleFiliere", "in", filiere);
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
        if (!status) return q;
        return q.where("demande.status", "=", status);
      });

export const getRegionDatas = async (filters: {
  status?: "draft" | "submitted";
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  CPC?: string[];
  filiere?: string[];
}) => {
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
    ])
    .where(notPerimetreIJRegion)
    .execute()
    .then(cleanNull);
};

export const getAcademieDatas = async (filters: {
  status?: "draft" | "submitted";
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  CPC?: string[];
  filiere?: string[];
}) => {
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
      eb.ref("academie.libelle").as("libelle"),
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
    ])
    .where(notPerimetreIJAcademie)
    .execute()
    .then(cleanNull);
};

export const getDepartementDatas = async (filters: {
  status?: "draft" | "submitted";
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  CPC?: string[];
  filiere?: string[];
}) => {
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
    .select((eb) => [
      eb.ref("departement.codeDepartement").as("code"),
      eb.ref("departement.libelle").as("libelle"),
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
    ])
    .where(notPerimetreIJDepartement)
    .execute()
    .then(cleanNull);
};

const getScopedData = async ({
  status,
  rentreeScolaire = "2024",
  codeNiveauDiplome,
  CPC,
  filiere,
  scope,
}: {
  status?: "draft" | "submitted";
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  CPC?: string[];
  filiere?: string[];
  scope: Scope;
}) => {
  switch (scope) {
    case "academies":
      return getAcademieDatas({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });

    case "departements":
      return getDepartementDatas({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });
    case "regions":
    default:
      return getRegionDatas({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });
  }
};

export type GetScopedTransformationStatsType = Awaited<
  ReturnType<typeof getScopedData>
>;

export const dependencies = {
  getScopedData,
};
