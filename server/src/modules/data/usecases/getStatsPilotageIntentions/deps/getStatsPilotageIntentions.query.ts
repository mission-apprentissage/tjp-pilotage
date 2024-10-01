import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE, ScopeEnum } from "shared";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { DemandeTypeEnum } from "../../../../../../../shared/enum/demandeTypeEnum";
import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import {
  countPlacesColorees,
  countPlacesColoreesQ4,
  countPlacesFermees,
  countPlacesFermeesApprentissage,
  countPlacesFermeesApprentissageQ4,
  countPlacesFermeesQ4,
  countPlacesFermeesScolaire,
  countPlacesFermeesScolaireQ4,
  countPlacesOuvertes,
  countPlacesOuvertesApprentissage,
  countPlacesOuvertesApprentissageQ1,
  countPlacesOuvertesQ1,
  countPlacesOuvertesScolaire,
  countPlacesOuvertesScolaireQ1,
  countPlacesOuvertesTransitionEcologique,
  countPlacesTransformeesParCampagne,
} from "../../../../utils/countCapacite";
import { isDemandeProjetOrValidee } from "../../../../utils/isDemandeProjetOrValidee";
import {
  isInPerimetreIJAcademie,
  isInPerimetreIJDepartement,
  isInPerimetreIJRegion,
} from "../../../utils/isInPerimetreIJ";
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
    withColoration,
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
      .select((eb) => [
        selectNbDemandes(eb).as("countDemande"),
        eb.fn
          .sum<number>(countPlacesOuvertesScolaire(eb))
          .as("placesOuvertesScolaire"),
        eb.fn
          .sum<number>(countPlacesFermeesScolaire(eb))
          .as("placesFermeesScolaire"),
        eb.fn
          .sum<number>(countPlacesOuvertesScolaireQ1(eb))
          .as("placesOuvertesScolaireQ1"),
        eb.fn
          .sum<number>(countPlacesFermeesScolaireQ4(eb))
          .as("placesFermeesScolaireQ4"),
        eb.fn
          .sum<number>(countPlacesOuvertesApprentissage(eb))
          .as("placesOuvertesApprentissage"),
        eb.fn
          .sum<number>(countPlacesFermeesApprentissage(eb))
          .as("placesFermeesApprentissage"),
        eb.fn
          .sum<number>(countPlacesOuvertesApprentissageQ1(eb))
          .as("placesOuvertesApprentissageQ1"),
        eb.fn
          .sum<number>(countPlacesFermeesApprentissageQ4(eb))
          .as("placesFermeesApprentissageQ4"),
        eb.fn.sum<number>(countPlacesOuvertes(eb)).as("placesOuvertes"),
        eb.fn.sum<number>(countPlacesFermees(eb)).as("placesFermees"),
        eb.fn.sum<number>(countPlacesOuvertesQ1(eb)).as("placesOuvertesQ1"),
        eb.fn.sum<number>(countPlacesFermeesQ4(eb)).as("placesFermeesQ4"),
        eb.fn
          .sum<number>(countPlacesOuvertesTransitionEcologique(eb))
          .as("placesOuvertesTransformationEcologique"),
        eb.fn.sum<number>(countPlacesColorees(eb)).as("placesColorees"),
        eb.fn.sum<number>(countPlacesColoreesQ4(eb)).as("placesColoreesQ4"),
        eb.fn
          .sum<number>(countPlacesTransformeesParCampagne(eb))
          .as("placesTransformees"),
      ])
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
      .$call((eb) => {
        if (campagne) return eb.where("campagne.annee", "=", campagne);
        return eb;
      })
      .$call((q) => {
        if (!secteur || secteur.length === 0) return q;
        return q.where("dataEtablissement.secteur", "in", secteur);
      })
      .$call((q) => {
        if (!statut || statut.length === 0) {
          return q.where(isDemandeProjetOrValidee);
        }
        return q.where("demande.statut", "in", statut);
      })
      .$call((q) => {
        if (!withColoration || withColoration === "false")
          return q.where((w) =>
            w.or([
              w("demande.coloration", "=", false),
              w("demande.typeDemande", "!=", DemandeTypeEnum["coloration"]),
            ])
          );
        return q;
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
    .select((eb) => [
      selectNbDemandes(eb).as("countDemande"),
      eb.fn
        .coalesce(eb.fn.sum<number>(countPlacesOuvertesScolaire(eb)), eb.val(0))
        .as("placesOuvertesScolaire"),
      eb.fn
        .coalesce(eb.fn.sum<number>(countPlacesFermeesScolaire(eb)), eb.val(0))
        .as("placesFermeesScolaire"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(countPlacesOuvertesScolaireQ1(eb)),
          eb.val(0)
        )
        .as("placesOuvertesScolaireQ1"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(countPlacesFermeesScolaireQ4(eb)),
          eb.val(0)
        )
        .as("placesFermeesScolaireQ4"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(countPlacesOuvertesApprentissage(eb)),
          eb.val(0)
        )
        .as("placesOuvertesApprentissage"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(countPlacesFermeesApprentissage(eb)),
          eb.val(0)
        )
        .as("placesFermeesApprentissage"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(countPlacesOuvertesApprentissageQ1(eb)),
          eb.val(0)
        )
        .as("placesOuvertesApprentissageQ1"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(countPlacesFermeesApprentissageQ4(eb)),
          eb.val(0)
        )
        .as("placesFermeesApprentissageQ4"),
      eb.fn
        .coalesce(eb.fn.sum<number>(countPlacesOuvertes(eb)), eb.val(0))
        .as("placesOuvertes"),
      eb.fn
        .coalesce(eb.fn.sum<number>(countPlacesFermees(eb)), eb.val(0))
        .as("placesFermees"),
      eb.fn
        .coalesce(eb.fn.sum<number>(countPlacesOuvertesQ1(eb)), eb.val(0))
        .as("placesOuvertesQ1"),
      eb.fn
        .coalesce(eb.fn.sum<number>(countPlacesFermeesQ4(eb)), eb.val(0))
        .as("placesFermeesQ4"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(
            countPlacesOuvertesTransitionEcologique({ eb: eb })
          ),
          eb.val(0)
        )
        .as("placesOuvertesTransformationEcologique"),
      eb.fn
        .coalesce(eb.fn.sum<number>(countPlacesColorees(eb)), eb.val(0))
        .as("placesColorees"),
      eb.fn
        .coalesce(eb.fn.sum<number>(countPlacesColoreesQ4(eb)), eb.val(0))
        .as("placesColoreesQ4"),
      eb.fn
        .coalesce(
          eb.fn.sum<number>(countPlacesTransformeesParCampagne(eb)),
          eb.val(0)
        )
        .as("placesTransformees"),
      genericOnConstatRentree(filters)()
        .select((eb) => sql<number>`SUM(${eb.ref("effectif")})`.as("effectif"))
        .as("effectif"),
      sql<string>`'national'`.as("code"),
      sql<string>`'national'`.as("libelle"),
    ])
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
    .$call((eb) => {
      if (filters.campagne)
        return eb.where("campagne.annee", "=", filters.campagne);
      return eb;
    })
    .$call((q) => {
      if (!filters.secteur || filters.secteur.length === 0) return q;
      return q.where("dataEtablissement.secteur", "in", filters.secteur);
    })
    .$call((q) => {
      if (!filters.statut || filters.statut.length === 0) {
        return q.where(isDemandeProjetOrValidee);
      }
      return q.where("demande.statut", "in", filters.statut);
    })
    .$call((q) => {
      if (!filters.withColoration || filters.withColoration === "false")
        return q.where((w) =>
          w.or([
            w("demande.coloration", "=", false),
            w("demande.typeDemande", "!=", DemandeTypeEnum["coloration"]),
          ])
        );
      return q;
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
          .select((eb) => [eb.ref("demande.codeRegion").as("codeRegion")])
          .groupBy(["demande.codeRegion"])
          .as("demandes"),
      (join) => join.onRef("demandes.codeRegion", "=", "region.codeRegion")
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((eb) => [
            eb.ref("dataEtablissement.codeRegion").as("codeRegion"),
            sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as(
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
      eb.fn.coalesce("countDemande", eb.val(0)).as("countDemande"),
      eb.fn
        .coalesce("placesOuvertesScolaire", eb.val(0))
        .as("placesOuvertesScolaire"),
      eb.fn
        .coalesce("placesFermeesScolaire", eb.val(0))
        .as("placesFermeesScolaire"),
      eb.fn
        .coalesce("placesOuvertesScolaireQ1", eb.val(0))
        .as("placesOuvertesScolaireQ1"),
      eb.fn
        .coalesce("placesFermeesScolaireQ4", eb.val(0))
        .as("placesFermeesScolaireQ4"),
      eb.fn
        .coalesce("placesOuvertesApprentissage", eb.val(0))
        .as("placesOuvertesApprentissage"),
      eb.fn
        .coalesce("placesFermeesApprentissage", eb.val(0))
        .as("placesFermeesApprentissage"),
      eb.fn
        .coalesce("placesOuvertesApprentissageQ1", eb.val(0))
        .as("placesOuvertesApprentissageQ1"),
      eb.fn
        .coalesce("placesFermeesApprentissageQ4", eb.val(0))
        .as("placesFermeesApprentissageQ4"),
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesOuvertesQ1", eb.val(0)).as("placesOuvertesQ1"),
      eb.fn.coalesce("placesFermeesQ4", eb.val(0)).as("placesFermeesQ4"),
      eb.fn
        .coalesce("placesOuvertesTransformationEcologique", eb.val(0))
        .as("placesOuvertesTransformationEcologique"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
    ])
    .where(isInPerimetreIJRegion)
    .execute()
    .then(cleanNull);
};

const getAcademieData = async (filters: Filters) => {
  return kdb
    .selectFrom("academie")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .select((eb) => [eb.ref("demande.codeAcademie").as("codeAcademie")])
          .groupBy(["demande.codeAcademie"])
          .as("demandes"),
      (join) =>
        join.onRef("demandes.codeAcademie", "=", "academie.codeAcademie")
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((eb) => [
            eb.ref("dataEtablissement.codeAcademie").as("codeAcademie"),
            sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as(
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
      eb.fn.coalesce("countDemande", eb.val(0)).as("countDemande"),
      eb.fn
        .coalesce("placesOuvertesScolaire", eb.val(0))
        .as("placesOuvertesScolaire"),
      eb.fn
        .coalesce("placesFermeesScolaire", eb.val(0))
        .as("placesFermeesScolaire"),
      eb.fn
        .coalesce("placesOuvertesScolaireQ1", eb.val(0))
        .as("placesOuvertesScolaireQ1"),
      eb.fn
        .coalesce("placesFermeesScolaireQ4", eb.val(0))
        .as("placesFermeesScolaireQ4"),
      eb.fn
        .coalesce("placesOuvertesApprentissage", eb.val(0))
        .as("placesOuvertesApprentissage"),
      eb.fn
        .coalesce("placesFermeesApprentissage", eb.val(0))
        .as("placesFermeesApprentissage"),
      eb.fn
        .coalesce("placesOuvertesApprentissageQ1", eb.val(0))
        .as("placesOuvertesApprentissageQ1"),
      eb.fn
        .coalesce("placesFermeesApprentissageQ4", eb.val(0))
        .as("placesFermeesApprentissageQ4"),
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesOuvertesQ1", eb.val(0)).as("placesOuvertesQ1"),
      eb.fn.coalesce("placesFermeesQ4", eb.val(0)).as("placesFermeesQ4"),
      eb.fn
        .coalesce("placesOuvertesTransformationEcologique", eb.val(0))
        .as("placesOuvertesTransformationEcologique"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
    ])
    .where(isInPerimetreIJAcademie)
    .execute()
    .then(cleanNull);
};

const getDepartementData = async (filters: Filters) => {
  return kdb
    .selectFrom("departement")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .select((eb) => [
            eb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
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
          .select((eb) => [
            eb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
            sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as(
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
      eb.fn.coalesce("countDemande", eb.val(0)).as("countDemande"),
      eb.fn
        .coalesce("placesOuvertesScolaire", eb.val(0))
        .as("placesOuvertesScolaire"),
      eb.fn
        .coalesce("placesFermeesScolaire", eb.val(0))
        .as("placesFermeesScolaire"),
      eb.fn
        .coalesce("placesOuvertesScolaireQ1", eb.val(0))
        .as("placesOuvertesScolaireQ1"),
      eb.fn
        .coalesce("placesFermeesScolaireQ4", eb.val(0))
        .as("placesFermeesScolaireQ4"),
      eb.fn
        .coalesce("placesOuvertesApprentissage", eb.val(0))
        .as("placesOuvertesApprentissage"),
      eb.fn
        .coalesce("placesFermeesApprentissage", eb.val(0))
        .as("placesFermeesApprentissage"),
      eb.fn
        .coalesce("placesOuvertesApprentissageQ1", eb.val(0))
        .as("placesOuvertesApprentissageQ1"),
      eb.fn
        .coalesce("placesFermeesApprentissageQ4", eb.val(0))
        .as("placesFermeesApprentissageQ4"),
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesOuvertesQ1", eb.val(0)).as("placesOuvertesQ1"),
      eb.fn.coalesce("placesFermeesQ4", eb.val(0)).as("placesFermeesQ4"),
      eb.fn
        .coalesce("placesOuvertesTransformationEcologique", eb.val(0))
        .as("placesOuvertesTransformationEcologique"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
    ])
    .where(isInPerimetreIJDepartement)
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
  withColoration,
}: Filters) => {
  switch (scope) {
    case ScopeEnum["académie"]:
      return getAcademieData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        campagne,
        scope,
        secteur,
        withColoration,
      });

    case ScopeEnum["département"]:
      return getDepartementData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        campagne,
        scope,
        secteur,
        withColoration,
      });
    case ScopeEnum["région"]:
      return getRegionData({
        statut,
        rentreeScolaire,
        codeNiveauDiplome,
        CPC,
        codeNsf,
        campagne,
        scope,
        secteur,
        withColoration,
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
        withColoration,
      });
  }
};
