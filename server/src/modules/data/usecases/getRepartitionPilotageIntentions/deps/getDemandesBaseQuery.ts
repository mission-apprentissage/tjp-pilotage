import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { DemandeTypeEnum } from "../../../../../../../shared/enum/demandeTypeEnum";
import { DB, kdb } from "../../../../../db/db";
import {
  countPlacesColorees,
  countPlacesColoreesQ3Q4,
  countPlacesFermees,
  countPlacesFermeesApprentissage,
  countPlacesFermeesApprentissageQ3Q4,
  countPlacesFermeesQ3Q4,
  countPlacesFermeesScolaire,
  countPlacesFermeesScolaireQ3Q4,
  countPlacesOuvertes,
  countPlacesOuvertesApprentissage,
  countPlacesOuvertesApprentissageQ1Q2,
  countPlacesOuvertesQ1Q2,
  countPlacesOuvertesScolaire,
  countPlacesOuvertesScolaireQ1Q2,
  countPlacesOuvertesTransitionEcologique,
  countPlacesTransformeesParCampagne,
} from "../../../../utils/countCapacite";
import { isDemandeProjetOrValidee } from "../../../../utils/isDemandeProjetOrValidee";
import { isInPerimetreIJDataEtablissement } from "../../../utils/isInPerimetreIJ";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";

// TO DO : rm query ?

export const getDemandesBaseQuery = ({ ...filters }: Filters) => {
  return kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("dataFormation", "demande.cfd", "dataFormation.cfd")
    .innerJoin("dataEtablissement", "demande.uai", "dataEtablissement.uai")
    .innerJoin(
      "niveauDiplome",
      "dataFormation.codeNiveauDiplome",
      "niveauDiplome.codeNiveauDiplome"
    )
    .innerJoin("nsf", "dataFormation.codeNsf", "nsf.codeNsf")
    .innerJoin("region", "dataEtablissement.codeRegion", "region.codeRegion")
    .innerJoin(
      "academie",
      "dataEtablissement.codeAcademie",
      "academie.codeAcademie"
    )
    .innerJoin(
      "departement",
      "dataEtablissement.codeDepartement",
      "departement.codeDepartement"
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
    .innerJoin("campagne", "demande.campagneId", "campagne.id")
    .select((eb) => [
      sql<number>`COALESCE(
        ${eb.ref("positionFormationRegionaleQuadrant.positionQuadrant")},
        ${eb.val(PositionQuadrantEnum["Hors quadrant"])}
      )`.as("positionQuadrant"),
      "rentreeScolaire",
      "campagne.annee",
      "nsf.libelleNsf",
      "nsf.codeNsf",
      "niveauDiplome.libelleNiveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "region.libelleRegion",
      "region.codeRegion",
      "academie.libelleAcademie",
      "academie.codeAcademie",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      "demande.cfd",
      "demande.typeDemande",
      "demande.statut",
      eb.fn.coalesce(countPlacesFermees(eb), eb.val(0)).as("placesFermees"),
      eb.fn.coalesce(countPlacesOuvertes(eb), eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce(countPlacesColorees(eb), eb.val(0)).as("placesColorees"),
    ])
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
      if (filters.codeRegion)
        return eb.where(
          "dataEtablissement.codeRegion",
          "=",
          filters.codeRegion
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.codeDepartement)
        return eb.where(
          "dataEtablissement.codeDepartement",
          "=",
          filters.codeDepartement
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.codeAcademie)
        return eb.where(
          "dataEtablissement.codeAcademie",
          "=",
          filters.codeAcademie
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.campagne)
        return eb.where("campagne.annee", "=", filters.campagne);
      return eb;
    })
    .$call((q) => {
      if (!filters.statut || filters.statut.length === 0) {
        return q.where("demande.statut", "in", [
          DemandeStatutEnum["demande validée"],
          DemandeStatutEnum["projet de demande"],
        ]);
      }
      return q.where("demande.statut", "in", filters.statut);
    })
    .$call((q) => {
      if (!filters.secteur || filters.secteur.length === 0) return q;
      return q.where("dataEtablissement.secteur", "in", filters.secteur);
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
    });
};

export const genericOnDemandes =
  ({
    statut,
    rentreeScolaire,
    codeNiveauDiplome,
    CPC,
    codeNsf,
    campagne,
    secteur,
    codeRegion,
    codeAcademie,
    codeDepartement,
    withColoration,
  }: Filters) =>
  (
    eb: ExpressionBuilder<
      DB,
      | "region"
      | "academie"
      | "departement"
      | "nsf"
      | "niveauDiplome"
      | "positionFormationRegionaleQuadrant"
    >
  ) =>
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
        eb.fn
          .sum<number>(countPlacesOuvertesScolaire(eb))
          .as("placesOuvertesScolaire"),
        eb.fn
          .sum<number>(countPlacesFermeesScolaire(eb))
          .as("placesFermeesScolaire"),
        eb.fn
          .sum<number>(countPlacesOuvertesScolaireQ1Q2(eb))
          .as("placesOuvertesScolaireQ1Q2"),
        eb.fn
          .sum<number>(countPlacesFermeesScolaireQ3Q4(eb))
          .as("placesFermeesScolaireQ3Q4"),
        eb.fn
          .sum<number>(countPlacesOuvertesApprentissage(eb))
          .as("placesOuvertesApprentissage"),
        eb.fn
          .sum<number>(countPlacesFermeesApprentissage(eb))
          .as("placesFermeesApprentissage"),
        eb.fn
          .sum<number>(countPlacesOuvertesApprentissageQ1Q2(eb))
          .as("placesOuvertesApprentissageQ1Q2"),
        eb.fn
          .sum<number>(countPlacesFermeesApprentissageQ3Q4(eb))
          .as("placesFermeesApprentissageQ3Q4"),
        eb.fn.sum<number>(countPlacesOuvertes(eb)).as("placesOuvertes"),
        eb.fn.sum<number>(countPlacesFermees(eb)).as("placesFermees"),
        eb.fn.sum<number>(countPlacesOuvertesQ1Q2(eb)).as("placesOuvertesQ1Q2"),
        eb.fn.sum<number>(countPlacesFermeesQ3Q4(eb)).as("placesFermeesQ3Q4"),
        eb.fn
          .sum<number>(countPlacesOuvertesTransitionEcologique(eb))
          .as("placesOuvertesTransformationEcologique"),
        eb.fn.sum<number>(countPlacesColorees(eb)).as("placesColorees"),
        eb.fn.sum<number>(countPlacesColoreesQ3Q4(eb)).as("placesColoreesQ3Q4"),
        eb.fn
          .sum<number>(countPlacesTransformeesParCampagne(eb))
          .as("placesTransformees"),
      ])
      .where(isInPerimetreIJDataEtablissement)
      .$call((eb) => {
        if (campagne) return eb.where("campagne.annee", "=", campagne);
        return eb;
      })
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
        if (codeRegion)
          return eb.where("dataEtablissement.codeRegion", "=", codeRegion);
        return eb;
      })
      .$call((eb) => {
        if (codeAcademie)
          return eb.where("dataEtablissement.codeAcademie", "=", codeAcademie);
        return eb;
      })
      .$call((eb) => {
        if (codeDepartement)
          return eb.where(
            "dataEtablissement.codeDepartement",
            "=",
            codeDepartement
          );
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
        if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
        return eb;
      })
      .$call((eb) => {
        if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
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
        if (withColoration === undefined) return q;
        if (withColoration === "false")
          return q.where((w) =>
            w.or([
              w("demande.coloration", "=", false),
              w("demande.typeDemande", "!=", DemandeTypeEnum["coloration"]),
            ])
          );
        return q;
      });
