import { CURRENT_RENTREE } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { DemandeTypeEnum } from "../../../../../../../shared/enum/demandeTypeEnum";
import { kdb } from "../../../../../db/db";
import {
  countFermetures,
  countFermeturesApprentissage,
  countFermeturesSco,
  countOuvertures,
  countOuverturesApprentissage,
  countOuverturesSco,
  countPlacesColorees,
  countPlacesColoreesApprentissage,
  countPlacesColoreesSco,
  countPlacesTransformeesParCampagne,
} from "../../../../utils/countCapacite";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";

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
      "positionFormationRegionaleQuadrant.positionQuadrant",
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
      eb.fn
        .coalesce(countOuverturesSco(eb), eb.val(0))
        .as("placesOuvertesScolaire"),
      eb.fn
        .coalesce(countFermeturesSco(eb), eb.val(0))
        .as("placesFermeesScolaire"),
      eb.fn
        .coalesce(countPlacesColoreesSco(eb), eb.val(0))
        .as("placesColoreesScolaire"),
      eb.fn
        .coalesce(countOuverturesApprentissage(eb), eb.val(0))
        .as("placesOuvertesApprentissage"),
      eb.fn
        .coalesce(countFermeturesApprentissage(eb), eb.val(0))
        .as("placesFermeesApprentissage"),
      eb.fn
        .coalesce(countPlacesColoreesApprentissage(eb), eb.val(0))
        .as("placesColoreesApprentissage"),
      eb.fn.coalesce(countFermetures(eb), eb.val(0)).as("placesFermees"),
      eb.fn.coalesce(countOuvertures(eb), eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce(countPlacesColorees(eb), eb.val(0)).as("placesColorees"),
      eb.fn
        .coalesce(countPlacesTransformeesParCampagne(eb), eb.val(0))
        .as("placesTransformees"),
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
