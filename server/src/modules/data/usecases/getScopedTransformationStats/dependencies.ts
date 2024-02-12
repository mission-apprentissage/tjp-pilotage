import { ExpressionBuilder, expressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE,Scope, ScopeEnum } from "shared";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import { isDemandeNotDeletedOrRefused } from "../../../utils/isDemandeSelectable";
import {
  notPerimetreIJAcademie,
  notPerimetreIJDepartement,
  notPerimetreIJRegion,
} from "../../utils/notPerimetreIJ";

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
      .where("constatRentree.rentreeScolaire", "=", CURRENT_RENTREE)
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

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.count<number>("demande.id");

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
        selectNbDemandes(es).as("countDemande"),
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

const getNationalData = async (filters: {
  status?: "draft" | "submitted";
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  CPC?: string[];
  filiere?: string[];
}) => {
  return kdb
    .selectFrom("demande")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .select((es) => [
      selectPlacesOuvertesScolaire(es).as("placesOuvertesScolaire"),
      selectPlacesFermeesScolaire(es).as("placesFermeesScolaire"),
      selectPlacesOuvertesApprentissage(es).as("placesOuvertesApprentissage"),
      selectPlacesTransformees(es).as("transformes"),
      selectPlacesFermeesApprentissage(es).as("placesFermeesApprentissage"),
      selectNbDemandes(es).as("countDemande"),
      genericOnConstatRentree(filters)()
        .select((eb) => sql<number>`SUM(${eb.ref("effectif")})`.as("effectif"))
        .as("effectif"),
      sql<string>`'national'`.as("code"),
      sql<string>`'national'`.as("libelle"),
    ])
    .where(isDemandeNotDeletedOrRefused)
    .$call((eb) => {
      if (filters.rentreeScolaire && !Number.isNaN(filters.rentreeScolaire))
        return eb.where(
          "demande.rentreeScolaire",
          "=",
          parseInt(filters.rentreeScolaire)
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.CPC) return eb.where("dataFormation.cpc", "in", filters.CPC);
      return eb;
    })
    .$call((eb) => {
      if (filters.filiere)
        return eb.where("dataFormation.libelleFiliere", "in", filters.filiere);
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
      if (!filters.status) return q;
      return q.where("demande.status", "=", filters.status);
    })
    .execute()
    .then(cleanNull);
};

const getRegionData = async (filters: {
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
      sql<number>`COALESCE(${eb.ref("demandes.countDemande")}, 0)`.as(
        "countDemande"
      ),
    ])
    .where(notPerimetreIJRegion)
    .execute()
    .then(cleanNull);
};

const getAcademieData = async (filters: {
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

const getDepartementData = async (filters: {
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
    case ScopeEnum.academie:
      return getAcademieData({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });

    case ScopeEnum.departement:
      return getDepartementData({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });
    case ScopeEnum.region:
      return getRegionData({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });
    case ScopeEnum.national:
    default:
      return getNationalData({
        status,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        filiere,
      });
  }
};

const getFiltersQuery = async ({
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
}) => {
  const inStatus = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!status || status === undefined) return sql<true>`true`;
    return eb("demande.status", "=", status);
  };

  const inRentreeScolaire = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!rentreeScolaire || Number.isNaN(rentreeScolaire))
      return sql<true>`true`;
    return eb("demande.rentreeScolaire", "=", parseInt(rentreeScolaire));
  };

  const inCodeNiveauDiplome = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!codeNiveauDiplome) return sql<true>`true`;
    return eb("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
  };

  const inCPC = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!CPC) return sql<true>`true`;
    return eb("dataFormation.cpc", "in", CPC);
  };

  const inFiliere = (eb: ExpressionBuilder<DB, "dataFormation">) => {
    if (!filiere) return sql<true>`true`;
    return eb("dataFormation.libelleFiliere", "in", filiere);
  };

  const base = kdb
    .selectFrom("demande")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .innerJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .innerJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const rentreesScolairesFilters = await base
    .select([
      "demande.rentreeScolaire as value",
      "demande.rentreeScolaire as label",
    ])
    .where("demande.rentreeScolaire", "is not", null)
    .execute();

  const regionsFilters = await kdb
    .selectFrom("region")
    .select((eb) => [
      eb.ref("region.codeRegion").as("value"),
      eb.ref("region.libelleRegion").as("label"),
    ])
    .where("region.codeRegion", "is not", null)
    .where(notPerimetreIJRegion)
    .distinct()
    .orderBy("label", "asc")
    .execute();

  const academiesFilters = await base
    .select([
      "academie.codeAcademie as value",
      "academie.libelleAcademie as label",
    ])
    .select((eb) => [
      eb.ref("academie.codeAcademie").as("value"),
      eb.ref("academie.libelleAcademie").as("label"),
    ])
    .where("academie.codeAcademie", "is not", null)
    .where(notPerimetreIJAcademie)
    .orderBy("label", "asc")
    .execute();

  const departementsFilters = await base
    .select([
      "departement.codeDepartement as value",
      "departement.libelleDepartement as label",
    ])
    .where("departement.codeDepartement", "is not", null)
    .where(notPerimetreIJDepartement)
    .orderBy("label", "asc")
    .execute();

  const CPCFilters = await base
    .select(["dataFormation.cpc as label", "dataFormation.cpc as value"])
    .where("dataFormation.cpc", "is not", null)
    .where((eb) =>
      eb.and([
        inStatus(eb),
        inRentreeScolaire(eb),
        inCodeNiveauDiplome(eb),
        inFiliere(eb),
      ])
    )
    .execute();

  const filieresFilters = await base
    .select([
      "dataFormation.libelleFiliere as label",
      "dataFormation.libelleFiliere as value",
    ])
    .where("dataFormation.libelleFiliere", "is not", null)
    .where((eb) =>
      eb.and([
        inStatus(eb),
        inRentreeScolaire(eb),
        inCodeNiveauDiplome(eb),
        inCPC(eb),
      ])
    )
    .execute();

  const diplomesFilters = await base
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where((eb) =>
      eb.and([inStatus(eb), inRentreeScolaire(eb), inCPC(eb), inFiliere(eb)])
    )
    .execute();

  return {
    rentreesScolaires: rentreesScolairesFilters.map(cleanNull),
    regions: regionsFilters.map(cleanNull),
    academies: academiesFilters.map(cleanNull),
    departements: departementsFilters.map(cleanNull),
    CPCs: CPCFilters.map(cleanNull),
    filieres: filieresFilters.map(cleanNull),
    diplomes: diplomesFilters.map(cleanNull),
  };
};

export type GetScopedTransformationStatsType = Awaited<
  ReturnType<typeof getScopedData>
>;

export const dependencies = {
  getScopedData,
  getFiltersQuery,
};
