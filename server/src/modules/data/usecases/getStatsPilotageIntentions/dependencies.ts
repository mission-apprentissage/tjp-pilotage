import { ExpressionBuilder, expressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE, RENTREE_INTENTIONS, Scope, ScopeEnum } from "shared";

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
    codeNsf,
  }: {
    codeNiveauDiplome?: string[];
    CPC?: string[];
    codeNsf?: string[];
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
      });
  };

interface GenericFilter {
  statut?: "draft" | "submitted";
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  CPC?: string[];
  codeNsf?: string[];
  anneeCampagne: string;
}

const selectNbDemandes = (eb: ExpressionBuilder<DB, "demande">) =>
  eb.fn.count<number>("demande.numero");

const genericOnDemandes =
  ({
    statut,
    rentreeScolaire = RENTREE_INTENTIONS,
    codeNiveauDiplome,
    CPC,
    codeNsf,
    anneeCampagne,
  }: GenericFilter) =>
  (eb: ExpressionBuilder<DB, "region" | "academie" | "departement">) =>
    eb
      .selectFrom("latestDemandeView as demande")
      .innerJoin("campagne", (join) =>
        join
          .onRef("campagne.id", "=", "demande.campagneId")
          .on("campagne.annee", "=", anneeCampagne)
      )
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

const getNationalData = async (filters: GenericFilter) => {
  return kdb
    .selectFrom("latestDemandeView as demande")
    .innerJoin("campagne", (join) =>
      join
        .onRef("campagne.id", "=", "demande.campagneId")
        .on("campagne.annee", "=", filters.anneeCampagne)
    )
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

const getRegionData = async (filters: GenericFilter) => {
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

const getAcademieData = async (filters: GenericFilter) => {
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

const getDepartementData = async (filters: GenericFilter) => {
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

const getStatsPilotageIntentionsQuery = async ({
  statut,
  rentreeScolaire = RENTREE_INTENTIONS,
  codeNiveauDiplome,
  CPC,
  codeNsf,
  scope,
  anneeCampagne,
}: {
  statut?: "draft" | "submitted";
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  CPC?: string[];
  codeNsf?: string[];
  scope: Scope;
  anneeCampagne: string;
}) => {
  switch (scope) {
    case ScopeEnum.academie:
      return getAcademieData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        anneeCampagne,
      });

    case ScopeEnum.departement:
      return getDepartementData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        anneeCampagne,
      });
    case ScopeEnum.region:
      return getRegionData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        anneeCampagne,
      });
    case ScopeEnum.national:
    default:
      return getNationalData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        anneeCampagne,
      });
  }
};

const getFiltersQuery = async ({
  statut,
  rentreeScolaire = RENTREE_INTENTIONS,
  codeNiveauDiplome,
  CPC,
  nsf,
  anneeCampagne,
}: {
  statut?: "draft" | "submitted";
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  CPC?: string[];
  nsf?: string[];
  anneeCampagne: string;
}) => {
  const inStatus = (eb: ExpressionBuilder<DB, "demande">) => {
    if (!statut || statut === undefined) return sql<true>`true`;
    return eb("demande.statut", "=", statut);
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
    if (!nsf) return sql<true>`true`;
    return eb("dataFormation.codeNsf", "in", nsf);
  };

  const inCampagne = (eb: ExpressionBuilder<DB, "campagne">) => {
    if (!nsf) return sql<true>`true`;
    return eb("campagne.annee", "=", anneeCampagne);
  };

  const base = kdb
    .selectFrom("latestDemandeView as demande")
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
    .leftJoin("campagne", "campagne.id", "demande.campagneId")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .where(isDemandeNotDeletedOrRefused)
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const campagnesFilters = await kdb
    .selectFrom("campagne")
    .select(["campagne.annee as label", "campagne.annee as value"])
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc")
    .where("campagne.annee", "is not", null)
    .execute();

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
        inCampagne(eb),
      ])
    )
    .execute();

  const libellesNsf = await base
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .select(["nsf.libelleNsf as label", "nsf.codeNsf as value"])
    .where("dataFormation.codeNsf", "is not", null)
    .where((eb) =>
      eb.and([
        inStatus(eb),
        inRentreeScolaire(eb),
        inCodeNiveauDiplome(eb),
        inCPC(eb),
        inCampagne(eb),
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
      eb.and([
        inStatus(eb),
        inRentreeScolaire(eb),
        inCPC(eb),
        inFiliere(eb),
        inCampagne(eb),
      ])
    )
    .union(
      kdb
        .selectFrom("constatRentree")
        .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
        .leftJoin(
          "niveauDiplome",
          "niveauDiplome.codeNiveauDiplome",
          "dataFormation.codeNiveauDiplome"
        )
        .select([
          "niveauDiplome.libelleNiveauDiplome as label",
          "niveauDiplome.codeNiveauDiplome as value",
        ])
        .distinct()
        .where("niveauDiplome.codeNiveauDiplome", "is not", null)
        .where("constatRentree.rentreeScolaire", "=", CURRENT_RENTREE)
        .where((eb) => eb.and([inCPC(eb), inFiliere(eb)]))
        .$castTo<{ label: string; value: string }>()
    )
    .execute();

  return {
    campagnes: campagnesFilters.map(cleanNull),
    rentreesScolaires: rentreesScolairesFilters.map(cleanNull),
    regions: regionsFilters.map(cleanNull),
    academies: academiesFilters.map(cleanNull),
    departements: departementsFilters.map(cleanNull),
    CPCs: CPCFilters.map(cleanNull),
    libellesNsf: libellesNsf.map(cleanNull),
    diplomes: diplomesFilters.map(cleanNull),
  };
};

export type GetScopedStatsPilotageIntentionsType = Awaited<
  ReturnType<typeof getStatsPilotageIntentionsQuery>
>;

export const dependencies = {
  getStatsPilotageIntentionsQuery,
  getFiltersQuery,
};
