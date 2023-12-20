import { ExpressionBuilder, sql } from "kysely";
import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import { isDemandeNotDeletedOrRefused } from "../../../utils/isDemandeSelectable";
import { Scope } from "./getScopedTransformationStats.schema";

const selectPlacesTransformees = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
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

const selectPlacesOuvertesScolaire = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.coalesce(
    eb.fn.sum<number>(
      sql`GREATEST(${eb.ref("demande.capaciteScolaire")}
        - ${eb.ref("demande.capaciteScolaireActuelle")}, 0)`
    ),
    sql`0`
  );

const selectPlacesFermeesScolaire = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.coalesce(
    eb.fn.sum<number>(
      sql`GREATEST(${eb.ref("demande.capaciteScolaireActuelle")}
        - ${eb.ref("demande.capaciteScolaire")}, 0)`
    ),
    sql`0`
  );

const selectPlacesOuvertesApprentissage = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.coalesce(
    eb.fn.sum<number>(
      sql`GREATEST(${eb.ref("demande.capaciteApprentissage")}
      - ${eb.ref("demande.capaciteApprentissageActuelle")}, 0)`
    ),
    sql`0`
  );

const selectPlacesFermeesApprentissage = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.sum<number>(
    sql`GREATEST(${eb.ref("demande.capaciteApprentissageActuelle")}
      - ${eb.ref("demande.capaciteApprentissage")}, 0)`
  );

export const getAcademieDatas = async ({
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
  console.log("Region");
  return await kdb
    .selectFrom("academie")
    .leftJoin(
      "dataEtablissement",
      "dataEtablissement.codeAcademie",
      "academie.codeAcademie"
    )
    .leftJoin("demande", (join) => {
      join = join.onRef("demande.uai", "=", "dataEtablissement.uai");

      if (rentreeScolaire && !Number.isNaN(rentreeScolaire)) {
        join = join.on(
          "demande.rentreeScolaire",
          "=",
          parseInt(rentreeScolaire)
        );
      }

      if (status) {
        join = join.on("demande.status", "=", status);
      }

      return join;
    })
    .leftJoin("dataFormation", (join) => {
      join = join.onRef("dataFormation.cfd", "=", "demande.cfd");

      if (filiere) {
        join = join.on("dataFormation.libelleFiliere", "in", filiere);
      }

      if (codeNiveauDiplome) {
        join = join.on(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      }

      return join;
    })
    .leftJoin("constatRentree", (join) =>
      join.onRef("dataEtablissement.uai", "=", "constatRentree.uai")
    )
    .leftJoin(
      (eb) =>
        eb
          .selectFrom("academie")
          .leftJoin(
            "dataEtablissement",
            "dataEtablissement.codeAcademie",
            "academie.codeAcademie"
          )
          .leftJoin(
            "constatRentree",
            "constatRentree.uai",
            "dataEtablissement.uai"
          )
          .select((es) => [
            es.ref("academie.codeAcademie").as("codeAcademie"),
            sql<number>`SUM(${es.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .where("constatRentree.rentreeScolaire", "=", "2022")
          .where("constatRentree.anneeDispositif", "=", 1)
          .groupBy("academie.codeAcademie")
          .as("effectifsParAcademie"),
      (join) =>
        join.onRef(
          "effectifsParAcademie.codeAcademie",
          "=",
          "academie.codeAcademie"
        )
    )
    .select((eb) => [
      selectPlacesOuvertesScolaire(eb).as("placesOuvertesScolaire"),
      selectPlacesFermeesScolaire(eb).as("placesFermeesScolaire"),
      selectPlacesOuvertesApprentissage(eb).as("placesOuvertesApprentissage"),
      selectPlacesTransformees(eb).as("transformes"),
      selectPlacesFermeesApprentissage(eb).as("placesFermeesApprentissage"),
      eb.ref("academie.codeAcademie").as("code"),
      eb.ref("academie.libelle").as("libelle"),
      eb.ref("effectifsParAcademie.effectif").as("effectif"),
    ])
    .$call((q) =>
      q.groupBy([
        "academie.codeAcademie",
        "academie.libelle",
        "effectifsParAcademie.effectif",
      ])
    )
    .$call((eb) => {
      if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
      return eb;
    })
    .$call((eb) => {
      if (filiere)
        return eb.where("dataFormation.libelleFiliere", "in", filiere);
      return eb;
    })
    .where(isDemandeNotDeletedOrRefused)
    .where("constatRentree.rentreeScolaire", "=", "2022")
    .where("constatRentree.anneeDispositif", "=", 1)
    .execute()
    .then(cleanNull);
};

export const getRegionDatas = async ({
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
  return await kdb
    .selectFrom("region")
    .leftJoin(
      "dataEtablissement",
      "dataEtablissement.codeRegion",
      "region.codeRegion"
    )
    .leftJoin("demande", (join) => {
      join = join.onRef("demande.uai", "=", "dataEtablissement.uai");

      if (rentreeScolaire && !Number.isNaN(rentreeScolaire)) {
        join = join.on(
          "demande.rentreeScolaire",
          "=",
          parseInt(rentreeScolaire)
        );
      }

      if (status) {
        join = join.on("demande.status", "=", status);
      }

      return join;
    })
    .leftJoin("dataFormation", (join) => {
      join = join.onRef("dataFormation.cfd", "=", "demande.cfd");

      if (filiere) {
        join = join.on("dataFormation.libelleFiliere", "in", filiere);
      }

      if (codeNiveauDiplome) {
        join = join.on(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      }

      return join;
    })
    .leftJoin(
      (eb) =>
        eb
          .selectFrom("region")
          .leftJoin(
            "dataEtablissement",
            "dataEtablissement.codeRegion",
            "region.codeRegion"
          )
          .leftJoin(
            "constatRentree",
            "constatRentree.uai",
            "dataEtablissement.uai"
          )
          .select((es) => [
            es.ref("region.codeRegion").as("codeRegion"),
            sql<number>`SUM(${es.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .where("constatRentree.rentreeScolaire", "=", "2022")
          .where("constatRentree.anneeDispositif", "=", 1)
          .groupBy("region.codeRegion")
          .as("effectifsParRegion"),
      (join) =>
        join.onRef("effectifsParRegion.codeRegion", "=", "region.codeRegion")
    )
    .select((eb) => [
      selectPlacesOuvertesScolaire(eb).as("placesOuvertesScolaire"),
      selectPlacesFermeesScolaire(eb).as("placesFermeesScolaire"),
      selectPlacesOuvertesApprentissage(eb).as("placesOuvertesApprentissage"),
      selectPlacesTransformees(eb).as("transformes"),
      selectPlacesFermeesApprentissage(eb).as("placesFermeesApprentissage"),
      eb.ref("region.codeRegion").as("code"),
      eb.ref("region.libelleRegion").as("libelle"),
      eb.ref("effectifsParRegion.effectif").as("effectif"),
    ])
    .$call((q) =>
      q.groupBy([
        "region.codeRegion",
        "region.libelleRegion",
        "effectifsParRegion.effectif",
      ])
    )
    .where(isDemandeNotDeletedOrRefused)
    .execute()
    .then(cleanNull);
};

export const getDepartementDatas = async ({
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
  return await kdb
    .selectFrom("departement")
    .leftJoin(
      "dataEtablissement",
      "dataEtablissement.codeDepartement",
      "departement.codeDepartement"
    )
    .leftJoin("demande", (join) => {
      join = join.onRef("demande.uai", "=", "dataEtablissement.uai");

      if (rentreeScolaire && !Number.isNaN(rentreeScolaire)) {
        join = join.on(
          "demande.rentreeScolaire",
          "=",
          parseInt(rentreeScolaire)
        );
      }

      if (status) {
        join = join.on("demande.status", "=", status);
      }

      return join;
    })
    .leftJoin("dataFormation", (join) => {
      join = join.onRef("dataFormation.cfd", "=", "demande.cfd");

      if (filiere) {
        join = join.on("dataFormation.libelleFiliere", "in", filiere);
      }

      if (codeNiveauDiplome) {
        join = join.on(
          "dataFormation.codeNiveauDiplome",
          "in",
          codeNiveauDiplome
        );
      }

      return join;
    })
    .leftJoin(
      (eb) =>
        eb
          .selectFrom("departement")
          .leftJoin(
            "dataEtablissement",
            "dataEtablissement.codeDepartement",
            "departement.codeDepartement"
          )
          .leftJoin(
            "constatRentree",
            "constatRentree.uai",
            "dataEtablissement.uai"
          )
          .select((es) => [
            es.ref("departement.codeDepartement").as("codeDepartement"),
            sql<number>`SUM(${es.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .where("constatRentree.rentreeScolaire", "=", "2022")
          .where("constatRentree.anneeDispositif", "=", 1)
          .$call((eb) => {
            if (codeNiveauDiplome)
              eb = eb.where(
                "dataFormation.codeNiveauDiplome",
                "in",
                codeNiveauDiplome
              );

            if (CPC) {
              eb = eb.where("dataFormation.cpc", "in", CPC);
            }
            return eb;
          })
          .groupBy("departement.codeDepartement")
          .as("effectifsParDepartement"),
      (join) =>
        join.onRef(
          "effectifsParDepartement.codeDepartement",
          "=",
          "departement.codeDepartement"
        )
    )
    .select((eb) => [
      selectPlacesOuvertesScolaire(eb).as("placesOuvertesScolaire"),
      selectPlacesFermeesScolaire(eb).as("placesFermeesScolaire"),
      selectPlacesOuvertesApprentissage(eb).as("placesOuvertesApprentissage"),
      selectPlacesTransformees(eb).as("transformes"),
      selectPlacesFermeesApprentissage(eb).as("placesFermeesApprentissage"),
      eb.ref("departement.codeDepartement").as("code"),
      eb.ref("departement.libelle").as("libelle"),
      eb.ref("effectifsParDepartement.effectif").as("effectif"),
    ])
    .$call((q) =>
      q.groupBy([
        "departement.codeDepartement",
        "departement.libelle",
        "effectifsParDepartement.effectif",
      ])
    )
    .where(isDemandeNotDeletedOrRefused)
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
      return await getAcademieData({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });

    case "departements":
      return await getDepartementData({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });
    case "regions":
    default:
      return await getRegionData({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });
  }
};

export type GetScopedTransformationStatsType = Awaited<
  ReturnType<typeof getRegionDatas>
>;

export const dependencies = {
  getAcademieDatas,
  getRegionDatas,
  getDepartementDatas,
};
