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
    .select((eb) => [
      selectPlacesOuvertesScolaire(eb).as("placesOuvertesScolaire"),
      selectPlacesFermeesScolaire(eb).as("placesFermeesScolaire"),
      selectPlacesOuvertesApprentissage(eb).as("placesOuvertesApprentissage"),
      selectPlacesTransformees(eb).as("transformes"),
      selectPlacesFermeesApprentissage(eb).as("placesFermeesApprentissage"),
      eb.ref("academie.codeAcademie").as("code"),
      eb.ref("academie.libelle").as("libelle"),
      sql<number>`SUM(${eb.ref("constatRentree.effectifs")})`.as("effectifs"),
    ])
    .$call((q) => q.groupBy(["academie.codeAcademie", "academie.libelle"]))
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
    .leftJoin("constatRentree", (join) =>
      join.onRef("dataEtablissement.uai", "=", "constatRentree.uai")
    )
    .select((eb) => [
      selectPlacesOuvertesScolaire(eb).as("placesOuvertesScolaire"),
      selectPlacesFermeesScolaire(eb).as("placesFermeesScolaire"),
      selectPlacesOuvertesApprentissage(eb).as("placesOuvertesApprentissage"),
      selectPlacesTransformees(eb).as("transformes"),
      selectPlacesFermeesApprentissage(eb).as("placesFermeesApprentissage"),
      eb.ref("region.codeRegion").as("code"),
      eb.ref("region.libelleRegion").as("libelle"),
      sql<number>`SUM(${eb.ref("constatRentree.effectifs")})`.as("effectifs"),
    ])
    .$call((q) => q.groupBy(["region.codeRegion", "region.libelleRegion"]))
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
    .leftJoin("constatRentree", (join) =>
      join
        .onRef("dataEtablissement.uai", "=", "constatRentree.uai")
        .on("constatRentree.rentreeScolaire", "=", "2022")
        .on("constatRentree.anneeDispositif", "=", 1)
    )
    .select((eb) => [
      selectPlacesOuvertesScolaire(eb).as("placesOuvertesScolaire"),
      selectPlacesFermeesScolaire(eb).as("placesFermeesScolaire"),
      selectPlacesOuvertesApprentissage(eb).as("placesOuvertesApprentissage"),
      selectPlacesTransformees(eb).as("transformes"),
      selectPlacesFermeesApprentissage(eb).as("placesFermeesApprentissage"),
      eb.ref("departement.codeDepartement").as("code"),
      eb.ref("departement.libelle").as("libelle"),
      sql<number>`SUM(${eb.ref("constatRentree.effectifs")})`.as("effectifs"),
    ])
    .$call((q) =>
      q.groupBy(["departement.codeDepartement", "departement.libelle"])
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
    .execute()
    .then(cleanNull);
};

export type GetScopedTransformationStatsType = Awaited<
  ReturnType<typeof getRegionDatas>
>;

export const dependencies = {
  getAcademieDatas,
  getRegionDatas,
  getDepartementDatas,
};
