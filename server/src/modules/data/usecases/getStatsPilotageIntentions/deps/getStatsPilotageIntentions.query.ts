import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE, ScopeEnum } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import {
  countDifferenceCapacite,
  countFermeturesApprentissage,
  countFermeturesApprentissageQ3Q4,
  countFermeturesSco,
  countFermeturesScoQ3Q4,
  countOuvertures,
  countOuverturesApprentissage,
  countOuverturesApprentissageQ1Q2,
  countOuverturesColorees,
  countOuverturesColoreesQ3Q4,
  countOuverturesSco,
  countOuverturesScoQ1Q2,
  countOuverturesTransitionEcologique,
} from "../../../../utils/countCapacite";
import { isDemandeProjetOrValidee } from "../../../../utils/isDemandeProjetOrValidee";
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
    secteur,
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
      .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
      .leftJoin(
        (seb) =>
          seb
            .selectFrom("formationRome")
            .leftJoin("rome", "rome.codeRome", "formationRome.codeRome")
            .select((sseb) => [
              "formationRome.cfd",
              sql<boolean>`bool_or(${sseb.ref(
                "rome.transitionEcologique"
              )})`.as("transitionEcologique"),
            ])
            .groupBy("cfd")
            .as("rome"),
        (join) => join.onRef("rome.cfd", "=", "demande.cfd")
      )
      .leftJoin("positionFormationRegionaleQuadrant", (join) =>
        join.on((eb) =>
          eb.and([
            eb(
              eb.ref("positionFormationRegionaleQuadrant.cfd"),
              "=",
              eb.ref("demande.cfd")
            ),
            eb(
              eb.ref("positionFormationRegionaleQuadrant.codeRegion"),
              "=",
              eb.ref("dataEtablissement.codeRegion")
            ),
            eb(
              eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
              "=",
              eb.val(
                getMillesimeFromRentreeScolaire({
                  rentreeScolaire: CURRENT_RENTREE,
                  offset: 0,
                })
              )
            ),
          ])
        )
      )
      .select((es) => [
        es.fn
          .coalesce(eb.fn.sum<number>(countOuverturesSco(es)), sql`0`)
          .as("placesOuvertesScolaire"),
        es.fn
          .coalesce(es.fn.sum<number>(countOuverturesScoQ1Q2(es)), sql`0`)
          .as("placesOuvertesScolaireQ1Q2"),
        es.fn
          .coalesce(eb.fn.sum<number>(countFermeturesSco(es)), sql`0`)
          .as("placesFermeesScolaire"),
        es.fn
          .coalesce(es.fn.sum<number>(countFermeturesScoQ3Q4(es)), sql`0`)
          .as("placesFermeesScolaireQ3Q4"),
        es.fn
          .coalesce(eb.fn.sum<number>(countOuverturesApprentissage(es)), sql`0`)
          .as("placesOuvertesApprentissage"),
        es.fn
          .coalesce(
            es.fn.sum<number>(countOuverturesApprentissageQ1Q2(es)),
            sql`0`
          )
          .as("placesOuvertesApprentissageQ1Q2"),
        es.fn
          .coalesce(es.fn.sum<number>(countOuvertures(es)), sql`0`)
          .as("placesOuvertes"),
        es.fn
          .coalesce(eb.fn.sum<number>(countFermeturesApprentissage(es)), sql`0`)
          .as("placesFermeesApprentissage"),
        es.fn
          .coalesce(
            es.fn.sum<number>(countFermeturesApprentissageQ3Q4(es)),
            sql`0`
          )
          .as("placesFermeesApprentissageQ3Q4"),
        es.fn
          .coalesce(eb.fn.sum<number>(countDifferenceCapacite(es)), sql`0`)
          .as("transformes"),
        es.fn
          .coalesce(es.fn.sum<number>(countOuverturesColorees(es)), sql`0`)
          .as("placesOuvertesColorees"),
        es.fn
          .coalesce(es.fn.sum<number>(countOuverturesColoreesQ3Q4(es)), sql`0`)
          .as("placesOuvertesColoreesQ3Q4"),
        es.fn
          .coalesce(
            es.fn.sum<number>(countOuverturesTransitionEcologique({ eb: es })),
            sql`0`
          )
          .as("placesOuvertesTransformationEcologique"),
        selectNbDemandes(es).as("countDemande"),
      ])
      .where(isDemandeProjetOrValidee)
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
        if (!statut || statut.length === 0) {
          return q.where("demande.statut", "in", [
            DemandeStatutEnum["demande validée"],
            DemandeStatutEnum["projet de demande"],
          ]);
        }
        return q.where("demande.statut", "=", statut);
      })
      .$call((q) => {
        if (!secteur || secteur.length === 0) return q;
        return q.where("dataEtablissement.secteur", "=", secteur);
      });

const getNationalData = async (filters: Filters) => {
  return kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (filters.campagne)
          return eb.on("campagne.annee", "=", filters.campagne);
        return eb;
      })
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin(
      (seb) =>
        seb
          .selectFrom("formationRome")
          .leftJoin("rome", "rome.codeRome", "formationRome.codeRome")
          .select((sseb) => [
            "formationRome.cfd",
            sql<boolean>`bool_or(${sseb.ref("rome.transitionEcologique")})`.as(
              "transitionEcologique"
            ),
          ])
          .groupBy("cfd")
          .as("rome"),
      (join) => join.onRef("rome.cfd", "=", "demande.cfd")
    )
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("positionFormationRegionaleQuadrant.cfd"),
            "=",
            eb.ref("demande.cfd")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeRegion"),
            "=",
            eb.ref("dataEtablissement.codeRegion")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
            "=",
            eb.val(
              getMillesimeFromRentreeScolaire({
                rentreeScolaire: CURRENT_RENTREE,
                offset: 0,
              })
            )
          ),
        ])
      )
    )
    .select((es) => [
      es.fn
        .coalesce(es.fn.sum<number>(countOuverturesSco(es)), sql`0`)
        .as("placesOuvertesScolaire"),
      es.fn
        .coalesce(es.fn.sum<number>(countOuverturesScoQ1Q2(es)), sql`0`)
        .as("placesOuvertesScolaireQ1Q2"),
      es.fn
        .coalesce(es.fn.sum<number>(countFermeturesSco(es)), sql`0`)
        .as("placesFermeesScolaire"),
      es.fn
        .coalesce(es.fn.sum<number>(countFermeturesScoQ3Q4(es)), sql`0`)
        .as("placesFermeesScolaireQ3Q4"),
      es.fn
        .coalesce(es.fn.sum<number>(countOuverturesApprentissage(es)), sql`0`)
        .as("placesOuvertesApprentissage"),
      es.fn
        .coalesce(
          es.fn.sum<number>(countOuverturesApprentissageQ1Q2(es)),
          sql`0`
        )
        .as("placesOuvertesApprentissageQ1Q2"),
      es.fn
        .coalesce(es.fn.sum<number>(countFermeturesApprentissage(es)), sql`0`)
        .as("placesFermeesApprentissage"),
      es.fn
        .coalesce(
          es.fn.sum<number>(countFermeturesApprentissageQ3Q4(es)),
          sql`0`
        )
        .as("placesFermeesApprentissageQ3Q4"),
      es.fn
        .coalesce(es.fn.sum<number>(countOuvertures(es)), sql`0`)
        .as("placesOuvertes"),
      es.fn
        .coalesce(es.fn.sum<number>(countOuverturesColorees(es)), es.val(0))
        .as("placeOuvertesColorees"),
      es.fn
        .coalesce(es.fn.sum<number>(countOuverturesColoreesQ3Q4(es)), es.val(0))
        .as("placesOuvertesColoreesQ3Q4"),
      es.fn
        .coalesce(es.fn.sum<number>(countDifferenceCapacite(es)), sql`0`)
        .as("transformes"),
      selectNbDemandes(es).as("countDemande"),
      es.fn
        .coalesce(
          es.fn.sum<number>(countOuverturesTransitionEcologique({ eb: es })),
          sql`0`
        )
        .as("placesOuvertesTransformationEcologique"),
      genericOnConstatRentree(filters)()
        .select((eb) => sql<number>`SUM(${eb.ref("effectif")})`.as("effectif"))
        .as("effectif"),
      sql<string>`'national'`.as("code"),
      sql<string>`'national'`.as("libelle"),
    ])
    .where(isDemandeProjetOrValidee)
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
      if (!filters.statut || filters.statut.length === 0) {
        return q.where("demande.statut", "in", [
          DemandeStatutEnum["demande validée"],
          DemandeStatutEnum["projet de demande"],
        ]);
      }
      return q.where("demande.statut", "=", filters.statut);
    })
    .$call((q) => {
      if (!filters.secteur || filters.secteur.length === 0) return q;
      return q.where("dataEtablissement.secteur", "=", filters.secteur);
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
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesScolaire"), eb.val(0))
        .as("placesOuvertesScolaire"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesScolaireQ1Q2"), eb.val(0))
        .as("placesOuvertesScolaireQ1Q2"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesScolaire"), eb.val(0))
        .as("placesFermeesScolaire"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesScolaireQ3Q4"), eb.val(0))
        .as("placesFermeesScolaireQ3Q4"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesApprentissage"), eb.val(0))
        .as("placesOuvertesApprentissage"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesApprentissageQ1Q2"), eb.val(0))
        .as("placesOuvertesApprentissageQ1Q2"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesApprentissage"), eb.val(0))
        .as("placesFermeesApprentissage"),
      eb.fn
        .coalesce(eb.ref("placesFermeesApprentissageQ3Q4"), eb.val(0))
        .as("placesFermeesApprentissageQ3Q4"),
      eb.fn
        .coalesce(eb.ref("placesOuvertesColorees"), eb.val(0))
        .as("placeOuvertesColorees"),
      eb.fn
        .coalesce(eb.ref("placesOuvertesColoreesQ3Q4"), eb.val(0))
        .as("placesOuvertesColoreesQ3Q4"),
      sql<number>`COALESCE(${eb.ref("demandes.transformes")}, 0)`.as(
        "transformes"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.countDemande")}, 0)`.as(
        "countDemande"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.placesOuvertes")}, 0)`.as(
        "placesOuvertes"
      ),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesOuvertesTransformationEcologique"
      )}, 0)`.as("placesOuvertesTransformationEcologique"),
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
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesScolaire"), eb.val(0))
        .as("placesOuvertesScolaire"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesScolaireQ1Q2"), eb.val(0))
        .as("placesOuvertesScolaireQ1Q2"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesScolaire"), eb.val(0))
        .as("placesFermeesScolaire"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesScolaireQ3Q4"), eb.val(0))
        .as("placesFermeesScolaireQ3Q4"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesApprentissage"), eb.val(0))
        .as("placesOuvertesApprentissage"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesApprentissageQ1Q2"), eb.val(0))
        .as("placesOuvertesApprentissageQ1Q2"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesApprentissage"), eb.val(0))
        .as("placesFermeesApprentissage"),
      eb.fn
        .coalesce(eb.ref("placesFermeesApprentissageQ3Q4"), eb.val(0))
        .as("placesFermeesApprentissageQ3Q4"),
      eb.fn
        .coalesce(eb.ref("placesOuvertesColorees"), eb.val(0))
        .as("placeOuvertesColorees"),
      eb.fn
        .coalesce(eb.ref("placesOuvertesColoreesQ3Q4"), eb.val(0))
        .as("placesOuvertesColoreesQ3Q4"),
      sql<number>`COALESCE(${eb.ref("demandes.transformes")}, 0)`.as(
        "transformes"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.countDemande")}, 0)`.as(
        "countDemande"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.placesOuvertes")}, 0)`.as(
        "placesOuvertes"
      ),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesOuvertesTransformationEcologique"
      )}, 0)`.as("placesOuvertesTransformationEcologique"),
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
      eb.ref("effectifs.effectif").as("effectif"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesScolaire"), eb.val(0))
        .as("placesOuvertesScolaire"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesScolaireQ1Q2"), eb.val(0))
        .as("placesOuvertesScolaireQ1Q2"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesScolaire"), eb.val(0))
        .as("placesFermeesScolaire"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesScolaireQ3Q4"), eb.val(0))
        .as("placesFermeesScolaireQ3Q4"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesApprentissage"), eb.val(0))
        .as("placesOuvertesApprentissage"),
      eb.fn
        .coalesce(eb.ref("demandes.placesOuvertesApprentissageQ1Q2"), eb.val(0))
        .as("placesOuvertesApprentissageQ1Q2"),
      eb.fn
        .coalesce(eb.ref("demandes.placesFermeesApprentissage"), eb.val(0))
        .as("placesFermeesApprentissage"),
      eb.fn
        .coalesce(eb.ref("placesFermeesApprentissageQ3Q4"), eb.val(0))
        .as("placesFermeesApprentissageQ3Q4"),
      eb.fn
        .coalesce(eb.ref("placesOuvertesColorees"), eb.val(0))
        .as("placeOuvertesColorees"),
      eb.fn
        .coalesce(eb.ref("placesOuvertesColoreesQ3Q4"), eb.val(0))
        .as("placesOuvertesColoreesQ3Q4"),
      sql<number>`COALESCE(${eb.ref("demandes.transformes")}, 0)`.as(
        "transformes"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.countDemande")}, 0)`.as(
        "countDemande"
      ),
      sql<number>`COALESCE(${eb.ref("demandes.placesOuvertes")}, 0)`.as(
        "placesOuvertes"
      ),
      sql<number>`COALESCE(${eb.ref(
        "demandes.placesOuvertesTransformationEcologique"
      )}, 0)`.as("placesOuvertesTransformationEcologique"),
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
  secteur,
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
        secteur,
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
        secteur,
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
        secteur,
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
        secteur,
      });
  }
};
