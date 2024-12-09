import { expressionBuilder, sql } from "kysely";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";
import type { TypeFormationSpecifiqueType } from "shared/enum/formationSpecifiqueEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import type { DB } from "@/db/db";
import {
  countPlacesColorees,
  countPlacesColoreesFermees,
  countPlacesColoreesOuvertes,
  countPlacesColoreesOuvertesQ4,
  countPlacesColoreesQ4,
  countPlacesFermeesApprentissage,
  countPlacesFermeesApprentissageQ4,
  countPlacesFermeesParCampagne,
  countPlacesFermeesQ4ParCampagne,
  countPlacesFermeesScolaire,
  countPlacesFermeesScolaireQ4,
  countPlacesNonColoreesTransformees,
  countPlacesOuvertes,
  countPlacesOuvertesApprentissage,
  countPlacesOuvertesApprentissageQ1,
  countPlacesOuvertesQ1,
  countPlacesOuvertesScolaire,
  countPlacesOuvertesScolaireQ1,
  countPlacesOuvertesTransitionEcologique,
  countPlacesTransformeesParCampagne,
} from "@/modules/utils/countCapacite";

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
  formationSpecifique,
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
  formationSpecifique?: Array<TypeFormationSpecifiqueType>;
}) =>
  expressionBuilder<DB, keyof DB>()
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("campagne", "campagne.id", "demande.campagneId")
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .leftJoin("actionPrioritaire", (join) =>
      join
        .onRef("actionPrioritaire.cfd", "=", "demande.cfd")
        .onRef("actionPrioritaire.codeDispositif", "=", "demande.codeDispositif")
        .onRef("actionPrioritaire.codeRegion", "=", "demande.codeRegion")
    )
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join
        .onRef("positionFormationRegionaleQuadrant.cfd", "=", "demande.cfd")
        .onRef("positionFormationRegionaleQuadrant.codeDispositif", "=", "demande.codeDispositif")
        .onRef("positionFormationRegionaleQuadrant.codeRegion", "=", "dataEtablissement.codeRegion")
        .on((eb) =>
          eb(
            "positionFormationRegionaleQuadrant.millesimeSortie",
            "=",
            eb.val(getMillesimeFromCampagne(campagne ?? CURRENT_ANNEE_CAMPAGNE))
          )
        )
    )
    .select((eb) => [
      eb.fn.count<number>("numero").as("countDemande"),
      eb.fn.sum<number>(countPlacesOuvertesScolaire(eb)).as("placesOuvertesScolaire"),
      eb.fn.sum<number>(countPlacesFermeesScolaire(eb)).as("placesFermeesScolaire"),
      eb.fn.sum<number>(countPlacesOuvertesScolaireQ1(eb)).as("placesOuvertesScolaireQ1"),
      eb.fn.sum<number>(countPlacesFermeesScolaireQ4(eb)).as("placesFermeesScolaireQ4"),
      eb.fn.sum<number>(countPlacesOuvertesApprentissage(eb)).as("placesOuvertesApprentissage"),
      eb.fn.sum<number>(countPlacesFermeesApprentissage(eb)).as("placesFermeesApprentissage"),
      eb.fn.sum<number>(countPlacesOuvertesApprentissageQ1(eb)).as("placesOuvertesApprentissageQ1"),
      eb.fn.sum<number>(countPlacesFermeesApprentissageQ4(eb)).as("placesFermeesApprentissageQ4"),
      eb.fn.sum<number>(countPlacesOuvertes(eb)).as("placesOuvertes"),
      eb.fn.sum<number>(countPlacesFermeesParCampagne(eb)).as("placesFermees"),
      eb.fn.sum<number>(countPlacesOuvertesQ1(eb)).as("placesOuvertesQ1"),
      eb.fn.sum<number>(countPlacesFermeesQ4ParCampagne(eb)).as("placesFermeesQ4"),
      eb.fn.sum<number>(countPlacesNonColoreesTransformees(eb)).as("placesNonColoreesTransformees"),
      eb.fn.sum<number>(countPlacesOuvertesTransitionEcologique(eb)).as("placesOuvertesTransformationEcologique"),
      eb.fn.sum<number>(countPlacesColorees(eb)).as("placesColorees"),
      eb.fn.sum<number>(countPlacesColoreesQ4(eb)).as("placesColoreesQ4"),
      eb.fn.sum<number>(countPlacesColoreesOuvertes(eb)).as("placesColoreesOuvertes"),
      eb.fn.sum<number>(countPlacesColoreesFermees(eb)).as("placesColoreesFermees"),
      eb.fn.sum<number>(countPlacesColoreesOuvertesQ4(eb)).as("placesColoreesOuvertesQ4"),
      eb.fn.sum<number>(countPlacesTransformeesParCampagne(eb)).as("placesTransformees"),
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
      if (codeRegion) return eb.where("dataEtablissement.codeRegion", "=", codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (codeAcademie) return eb.where("dataEtablissement.codeAcademie", "=", codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (codeDepartement) return eb.where("dataEtablissement.codeDepartement", "=", codeDepartement);
      return eb;
    })
    .$call((eb) => {
      if (codeNiveauDiplome) return eb.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
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
    .$call((eb) => {
      if (secteur) return eb.where("dataEtablissement.secteur", "in", secteur);
      return eb;
    })
    .$call((eb) => {
      if (statut) return eb.where("demande.statut", "in", statut);
      return eb;
    })
    .$call((eb) => {
      if (withColoration === undefined) return eb;
      if (withColoration === "false")
        return eb.where((w) =>
          w.or([w("demande.coloration", "=", false), w("demande.typeDemande", "!=", DemandeTypeEnum["coloration"])])
        );
      return eb;
    })
    .$call((q) => {
      if (formationSpecifique?.length) {
        return q.where((w) =>
          w.or([
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Action prioritaire"])
              ? w("actionPrioritaire.cfd", "is not", null)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition écologique"])
              ? w("formationView.isTransitionEcologique", "=", true)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition démographique"])
              ? w("formationView.isTransitionDemographique", "=", true)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition numérique"])
              ? w("formationView.isTransitionNumerique", "=", true)
              : sql.val(false),
          ])
        );
      }
      return q;
    });
