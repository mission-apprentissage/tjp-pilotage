
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";
import { genericOnDemandes } from "@/modules/data/utils/onDemande";
import { selectPositionQuadrant } from "@/modules/data/utils/selectPositionQuadrant";
import { cleanNull } from "@/utils/noNull";

export const getNumerateurQuery = async ({ filters }: { filters: Filters }) => {
  return getKbdClient()
    .selectFrom(
      genericOnDemandes({...filters, avecColoration: filters.coloration !== "false"})
        .select((eb) => [
          eb.ref("campagne.annee").as("annee"),
          eb.ref("demande.rentreeScolaire").as("rentreeScolaire"),
          eb.ref("dataFormation.codeNsf").as("codeNsf"),
          eb.ref("dataFormation.codeNiveauDiplome").as("codeNiveauDiplome"),
          selectPositionQuadrant(eb).as("positionQuadrant"),
          eb.ref("dataEtablissement.codeRegion").as("codeRegion"),
          eb.ref("dataEtablissement.codeAcademie").as("codeAcademie"),
          eb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
          eb.ref("demande.statut").as("statut"),
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
          "demande.statut"
        ])
        .as("demandes")
    )
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "demandes.codeNiveauDiplome")
    .leftJoin("region", "region.codeRegion", "demandes.codeRegion")
    .leftJoin("departement", "departement.codeDepartement", "demandes.codeDepartement")
    .leftJoin("academie", "academie.codeAcademie", "demandes.codeAcademie")
    .leftJoin("nsf", "nsf.codeNsf", "demandes.codeNsf")
    .select((eb) => [
      "annee",
      "rentreeScolaire",
      "statut",
      "region.codeRegion",
      "region.libelleRegion",
      "positionQuadrant",
      "nsf.codeNsf",
      "nsf.libelleNsf",
      "niveauDiplome.codeNiveauDiplome",
      "niveauDiplome.libelleNiveauDiplome",
      "academie.codeAcademie",
      "academie.libelleAcademie",
      "departement.codeDepartement",
      "departement.libelleDepartement",
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesOuvertesQ1", eb.val(0)).as("placesOuvertesQ1"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesFermeesQ4", eb.val(0)).as("placesFermeesQ4"),
      eb.fn.coalesce("placesNonColoreesTransformees", eb.val(0)).as("placesNonColoreesTransformees"),
      eb.fn.coalesce("placesColoreesOuvertes", eb.val(0)).as("placesColoreesOuvertes"),
      eb.fn.coalesce("placesColoreesFermees", eb.val(0)).as("placesColoreesFermees"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
      eb.fn.coalesce("placesOuvertesTransformationEcologique", eb.val(0)).as("placesOuvertesTransformationEcologique"),
      eb.fn.coalesce("countDemande", eb.val(0)).as("countDemande"),
    ])
    .where("statut", "not in", [DemandeStatutEnum["brouillon"]])
    // .$call((eb) => {
    //   if(filters.coloration === "false") return eb.select((eb) => [
    //     sql<number>`0`.as("placesColoreesOuvertes"),
    //     sql<number>`0`.as("placesColoreesFermees"),
    //     sql<number>`0`.as("placesColorees"),
    //     sql<number>`0`.as("placesColoreesQ4"),
    //     eb.fn.coalesce("placesNonColoreesTransformees", eb.val(0)).as("placesTransformees"),
    //   ]);
    //   return eb.select((eb) => [
    //     eb.fn.coalesce("placesColoreesOuvertes", eb.val(0)).as("placesColoreesOuvertes"),
    //     eb.fn.coalesce("placesColoreesFermees", eb.val(0)).as("placesColoreesFermees"),
    //     eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
    //     eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
    //     eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
    //   ]);
    // })
    .execute()
    .then(cleanNull);
};
