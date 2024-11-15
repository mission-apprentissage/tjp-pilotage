import { expressionBuilder, sql } from "kysely";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { DemandeStatutType } from "../../../../../shared/enum/demandeStatutEnum";
import { DemandeTypeEnum } from "../../../../../shared/enum/demandeTypeEnum";
import { DB } from "../../../db/db";
import {
  countPlacesColorees,
  countPlacesColoreesQ4,
  countPlacesFermeesApprentissage,
  countPlacesFermeesApprentissageQ4,
  countPlacesFermeesParCampagne,
  countPlacesFermeesQ4ParCampagne,
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
} from "../../utils/countCapacite";
import { isDemandeProjetOrValidee } from "../../utils/isDemandeProjetOrValidee";
import { isInPerimetreIJDataEtablissement } from "./isInPerimetreIJ";

export const genericOnDemandes = ({
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
}: {
  statut?: Array<DemandeStatutType>;
  rentreeScolaire?: string[];
  codeNiveauDiplome?: string[];
  CPC?: string[];
  codeNsf?: string[];
  campagne?: string;
  secteur?: string[];
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
  withColoration?: string;
}) =>
  expressionBuilder<DB, keyof DB>()
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
            eb.ref("positionFormationRegionaleQuadrant.codeDispositif"),
            "=",
            eb.ref("demande.codeDispositif")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeRegion"),
            "=",
            eb.ref("dataEtablissement.codeRegion")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
            "=",
            eb.val(getMillesimeFromCampagne(campagne ?? CURRENT_ANNEE_CAMPAGNE))
          ),
        ])
      )
    )
    .select((eb) => [
      eb.fn.count<number>("numero").as("countDemande"),
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
      eb.fn.sum<number>(countPlacesFermeesParCampagne(eb)).as("placesFermees"),
      eb.fn.sum<number>(countPlacesOuvertesQ1(eb)).as("placesOuvertesQ1"),
      eb.fn
        .sum<number>(countPlacesFermeesQ4ParCampagne(eb))
        .as("placesFermeesQ4"),
      eb.fn
        .sum<number>(countPlacesOuvertesTransitionEcologique(eb))
        .as("placesOuvertesTransformationEcologique"),
      eb.fn.sum<number>(countPlacesColorees(eb)).as("placesColorees"),
      eb.fn.sum<number>(countPlacesColoreesQ4(eb)).as("placesColoreesQ4"),
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
