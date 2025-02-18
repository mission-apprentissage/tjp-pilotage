import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { rentreeScolaireCampagnes } from "shared/time/rentreeScolaireCampagnes";

import { getKbdClient } from "@/db/db";
import { effectifTauxTransformationCumule } from "@/modules/data/utils/effectifTauxTransformationCumule";
import { formatTauxTransformation } from "@/modules/data/utils/formatTauxTransformation";
import { genericOnDemandes } from "@/modules/data/utils/onDemande";
import logger from "@/services/logger";
import { cleanNull } from "@/utils/noNull";


export const getTauxTransformationCumule = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string;
}) => {
  const tauxTransformationCumuleNational = await getKbdClient()
    .selectFrom(
      genericOnDemandes({
        codeRegion,
        rentreeScolaire: rentreeScolaireCampagnes(),
        codeNiveauDiplome: codeNiveauDiplome ? [codeNiveauDiplome] : undefined
      })
        .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
        .where("campagne.statut", "=", CampagneStatutEnum["terminée"])
        .select((eb) => [eb.ref("demande.codeRegion").as("codeRegion")])
        .groupBy(["demande.codeRegion"])
        .as("demandes")
    )
    .leftJoin(
      effectifTauxTransformationCumule({ codeRegion, codeNiveauDiplome }).as("effectifs"),
      (join) => join.onRef("demandes.codeRegion", "=", "effectifs.codeRegion")
    )
    .select((eb) => [
      eb.fn.sum("effectifs.effectif").as("effectifs"),
      eb.fn.sum("demandes.placesTransformees").as("placesTransformees"),
    ])
    .$castTo<{effectifs: number | null; placesTransformees: number | null;}>()
    .executeTakeFirst()
    .then(cleanNull);

  logger.info({ tauxTransformationCumuleNational });

  return {
    placesTransformees: tauxTransformationCumuleNational?.placesTransformees,
    effectifs: tauxTransformationCumuleNational?.effectifs,
    taux: formatTauxTransformation(
      tauxTransformationCumuleNational?.placesTransformees,
      tauxTransformationCumuleNational?.effectifs
    ),
  };
};

