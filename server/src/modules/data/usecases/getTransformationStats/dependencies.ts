import { ExpressionBuilder, sql } from "kysely";
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

const selectPlacesTransformees = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.sum<number>(
    sql`ABS(
        ${eb.ref("demande.capaciteScolaire")}
        -${eb.ref("demande.capaciteScolaireActuelle")})
        +GREATEST(${eb.ref("demande.capaciteApprentissage")}
        -${eb.ref("demande.capaciteApprentissageActuelle")}, 0)`
  );
const selectDifferenceScolaire = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  sql<number>`
${eb.fn.sum("demande.capaciteScolaire")}
-
${eb.fn.sum("demande.capaciteScolaireActuelle")}`;

const selectDifferenceApprentissage = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  sql<number>`
${eb.fn.sum("demande.capaciteApprentissage")}
-
${eb.fn.sum("demande.capaciteApprentissageActuelle")}`;

const selectPlacesOuvertesScolaire = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.sum<number>(
    sql`GREATEST(${eb.ref("demande.capaciteScolaire")}
        - ${eb.ref("demande.capaciteScolaireActuelle")}, 0)`
  );

const selectPlacesFermeesScolaire = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.sum<number>(
    sql`GREATEST(${eb.ref("demande.capaciteScolaireActuelle")}
      - ${eb.ref("demande.capaciteScolaire")}, 0)`
  );

const selectPlacesOuvertesApprentissage = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.sum<number>(
    sql`GREATEST(${eb.ref("demande.capaciteApprentissage")}
      - ${eb.ref("demande.capaciteApprentissageActuelle")}, 0)`
  );

const selectPlacesFermeesApprentissage = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) =>
  eb.fn.sum<number>(
    sql`GREATEST(${eb.ref("demande.capaciteApprentissageActuelle")}
    - ${eb.ref("demande.capaciteApprentissage")}, 0)`
  );

const selectNbDemandes = (
  eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">
) => eb.fn.count<number>("demande.id");

const getEffectif = async ({
  codeNiveauDiplome,
  CPC,
  filiere,
  scope,
}: {
  codeNiveauDiplome?: string[];
  CPC?: string[];
  filiere?: string[];
  scope: Scope;
}) => {
  return kdb
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
    })
    .select((es) => [
      scope === ScopeEnum.national
        ? sql<string>`'national'`.as("code")
        : es
            .ref(
              (
                {
                  [ScopeEnum.region]: "dataEtablissement.codeRegion",
                  [ScopeEnum.academie]: "dataEtablissement.codeAcademie",
                  [ScopeEnum.departement]: "dataEtablissement.codeDepartement",
                  [ScopeEnum.national]: "dataEtablissement.codeRegion",
                } as const
              )[scope]
            )
            .as("code"),
      sql<number>`SUM(${es.ref("constatRentree.effectif")})`.as("effectif"),
    ])
    .groupBy(["code"])
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
  return kdb
    .selectFrom("demande")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .select((eb) => [
      selectNbDemandes(eb).as("countDemande"),
      selectPlacesTransformees(eb).as("transformes"),
      selectDifferenceScolaire(eb).as("differenceCapaciteScolaire"),
      selectDifferenceApprentissage(eb).as("differenceCapaciteApprentissage"),
      selectPlacesOuvertesScolaire(eb).as("placesOuvertesScolaire"),
      selectPlacesFermeesScolaire(eb).as("placesFermeesScolaire"),
      selectPlacesOuvertesApprentissage(eb).as("placesOuvertesApprentissage"),
      selectPlacesFermeesApprentissage(eb).as("placesFermeesApprentissage"),
      scope === ScopeEnum.national
        ? sql<string>`'national'`.as("code")
        : eb
            .ref(
              (
                {
                  [ScopeEnum.region]: "dataEtablissement.codeRegion",
                  [ScopeEnum.academie]: "dataEtablissement.codeAcademie",
                  [ScopeEnum.departement]: "dataEtablissement.codeDepartement",
                } as const
              )[scope]
            )
            .as("code"),
      scope === ScopeEnum.national
        ? sql<string>`'National'`.as("libelle")
        : eb
            .ref(
              (
                {
                  [ScopeEnum.region]: "region.libelleRegion",
                  [ScopeEnum.academie]: "academie.libelle",
                  [ScopeEnum.departement]: "departement.libelle",
                } as const
              )[scope]
            )
            .as("libelle"),
    ])
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
    })
    .$call((q) => {
      switch (scope) {
        case ScopeEnum.region:
          return q.groupBy([
            "dataEtablissement.codeRegion",
            "region.libelleRegion",
          ]);
        case ScopeEnum.academie:
          return q.groupBy([
            "dataEtablissement.codeAcademie",
            "academie.libelle",
          ]);
        case ScopeEnum.departement:
          return q.groupBy([
            "dataEtablissement.codeDepartement",
            "departement.libelle",
          ]);
        default:
          return q;
      }
    })
    .where(isDemandeNotDeletedOrRefused)
    .execute()
    .then(cleanNull);
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

  const academiesFilters = await kdb
    .selectFrom("academie")
    .select((eb) => [
      eb.ref("academie.codeAcademie").as("value"),
      eb.ref("academie.libelle").as("label"),
    ])
    .where("academie.codeAcademie", "is not", null)
    .where(notPerimetreIJAcademie)
    .distinct()
    .orderBy("label", "asc")
    .execute();

  const departementsFilters = await kdb
    .selectFrom("departement")
    .select((eb) => [
      eb.ref("departement.codeDepartement").as("value"),
      eb.ref("departement.libelle").as("label"),
    ])
    .where("departement.codeDepartement", "is not", null)
    .where(notPerimetreIJDepartement)
    .distinct()
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

export const dependencies = {
  getFiltersQuery,
  getScopedData,
  getEffectif,
};
