import { expressionBuilder, sql } from "kysely";
import { VoieEnum } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import type { TypeFormationSpecifiqueType } from "shared/enum/formationSpecifiqueEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
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
import { isDemandeNotAjustementRentree } from "@/modules/utils/isDemandeSelectable";

import { isInPerimetreIJDataEtablissement } from "./isInPerimetreIJ";


const CURRENT_ANNEE_CAMPAGNE = "2025";

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
  avecColoration,
  formationSpecifique,
  withAjustementRentree = true,
}: {
  statut?: DemandeStatutType[];
  rentreeScolaire?: string[];
  codeNiveauDiplome?: string[];
  CPC?: string[];
  codeNsf?: string[];
  campagne?: string;
  secteur?: string[];
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
  avecColoration?: boolean;
  formationSpecifique?: Array<TypeFormationSpecifiqueType>;
  withAjustementRentree?: boolean;
}) =>
  expressionBuilder<DB, keyof DB>()
    .selectFrom("latestDemandeView as demande")
    .innerJoin("campagne", (join) =>
      join.onRef("campagne.id", "=", "demande.campagneId").$call((eb) => {
        if (campagne) return eb.on("campagne.annee", "=", campagne);
        return eb;
      })
    )
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("formationView", (join) =>
      join.onRef("formationView.cfd", "=", "demande.cfd").on("formationView.voie", "=", VoieEnum.scolaire)
    )
    .leftJoin("actionPrioritaire", (join) =>
      join
        .onRef("actionPrioritaire.cfd", "=", "demande.cfd")
        .onRef("actionPrioritaire.codeDispositif", "=", "demande.codeDispositif")
        .onRef("actionPrioritaire.codeRegion", "=", "demande.codeRegion")
    )
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(eb.ref("positionFormationRegionaleQuadrant.cfd"), "=", eb.ref("demande.cfd")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeDispositif"), "=", eb.ref("demande.codeDispositif")),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeRegion"), "=", eb.ref("dataEtablissement.codeRegion")),
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
      eb.fn.sum<number>(countPlacesOuvertesScolaire({eb, avecColoration})).as("placesOuvertesScolaire"),
      eb.fn.sum<number>(countPlacesFermeesScolaire({eb, avecColoration})).as("placesFermeesScolaire"),
      eb.fn.sum<number>(countPlacesOuvertesScolaireQ1({eb, avecColoration})).as("placesOuvertesScolaireQ1"),
      eb.fn.sum<number>(countPlacesFermeesScolaireQ4({eb, avecColoration})).as("placesFermeesScolaireQ4"),
      eb.fn.sum<number>(countPlacesOuvertesApprentissage({eb, avecColoration})).as("placesOuvertesApprentissage"),
      eb.fn.sum<number>(countPlacesFermeesApprentissage({eb, avecColoration})).as("placesFermeesApprentissage"),
      eb.fn.sum<number>(countPlacesOuvertesApprentissageQ1({eb, avecColoration})).as("placesOuvertesApprentissageQ1"),
      eb.fn.sum<number>(countPlacesFermeesApprentissageQ4({eb, avecColoration})).as("placesFermeesApprentissageQ4"),
      eb.fn.sum<number>(countPlacesOuvertes({eb, avecColoration})).as("placesOuvertes"),
      eb.fn.sum<number>(countPlacesFermeesParCampagne({eb, avecColoration})).as("placesFermees"),
      eb.fn.sum<number>(countPlacesOuvertesQ1({eb, avecColoration})).as("placesOuvertesQ1"),
      eb.fn.sum<number>(countPlacesFermeesQ4ParCampagne({eb, avecColoration})).as("placesFermeesQ4"),
      eb.fn.sum<number>(countPlacesNonColoreesTransformees({eb, avecColoration})).as("placesNonColoreesTransformees"),
      eb.fn.sum<number>(countPlacesOuvertesTransitionEcologique({eb, avecColoration})).as("placesOuvertesTransformationEcologique"),
      eb.fn.sum<number>(countPlacesColorees({eb, avecColoration})).as("placesColorees"),
      eb.fn.sum<number>(countPlacesColoreesQ4({eb, avecColoration})).as("placesColoreesQ4"),
      eb.fn.sum<number>(countPlacesColoreesOuvertes({eb, avecColoration})).as("placesColoreesOuvertes"),
      eb.fn.sum<number>(countPlacesColoreesFermees({eb, avecColoration})).as("placesColoreesFermees"),
      eb.fn.sum<number>(countPlacesColoreesOuvertesQ4({eb, avecColoration})).as("placesColoreesOuvertesQ4"),
      eb.fn.sum<number>(countPlacesTransformeesParCampagne({eb, avecColoration})).as("placesTransformees"),
    ])
    .where(isInPerimetreIJDataEtablissement)
    .$if(withAjustementRentree, (eb) => eb.where(isDemandeNotAjustementRentree))
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
      if (formationSpecifique?.length) {
        return eb.where((w) =>
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
      return eb;
    });
