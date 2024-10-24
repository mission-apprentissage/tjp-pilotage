import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { genericOnDemandes } from "../../../utils/onDemande";
import { selectPositionQuadrant } from "../../../utils/positionFormationRegionaleQuadrant";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";

export const getNumerateurQuery = async ({ filters }: { filters: Filters }) => {
  return kdb
    .selectFrom(
      genericOnDemandes(filters)
        .select((eb) => [
          eb.ref("campagne.annee").as("annee"),
          eb.ref("demande.rentreeScolaire").as("rentreeScolaire"),
          eb.ref("dataFormation.codeNsf").as("codeNsf"),
          eb.ref("dataFormation.codeNiveauDiplome").as("codeNiveauDiplome"),
          selectPositionQuadrant(eb).as("positionQuadrant"),
          eb.ref("dataEtablissement.codeRegion").as("codeRegion"),
          eb.ref("dataEtablissement.codeAcademie").as("codeAcademie"),
          eb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
        ])
        .groupBy([
          "annee",
          "rentreeScolaire",
          "dataEtablissement.codeRegion",
          "positionQuadrant",
          "dataFormation.codeNsf",
          "dataFormation.codeNiveauDiplome",
          "dataFormation.typeFamille",
          "dataEtablissement.codeAcademie",
          "dataEtablissement.codeDepartement",
        ])
        .as("demandes")
    )
    .innerJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "demandes.codeNiveauDiplome"
    )
    .innerJoin("region", "region.codeRegion", "demandes.codeRegion")
    .innerJoin(
      "departement",
      "departement.codeDepartement",
      "demandes.codeDepartement"
    )
    .innerJoin("academie", "academie.codeAcademie", "demandes.codeAcademie")
    .innerJoin("nsf", "nsf.codeNsf", "demandes.codeNsf")
    .select((eb) => [
      "annee",
      "rentreeScolaire",
      "region.codeRegion",
      "region.libelleRegion",
      "positionQuadrant",
      // "cfd",
      "nsf.codeNsf",
      "nsf.libelleNsf",
      "niveauDiplome.codeNiveauDiplome",
      "niveauDiplome.libelleNiveauDiplome",
      "academie.codeAcademie",
      "academie.libelleAcademie",
      "departement.codeDepartement",
      "departement.libelleDepartement",
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
    ])
    .where("demandes.codeNsf", "is not", null)
    .where("demandes.codeNiveauDiplome", "is not", null)
    .execute()
    .then(cleanNull);
};
