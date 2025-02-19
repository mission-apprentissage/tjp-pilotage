
import { sql } from "kysely";
import { rentreeScolaireCampagnes } from "shared/time/rentreeScolaireCampagnes";

import { getKbdClient } from "@/db/db";
import { effectifTauxTransformationCumule } from "@/modules/data/utils/effectifTauxTransformationCumule";
import { formatTauxTransformation } from "@/modules/data/utils/formatTauxTransformation";
import { genericOnDemandes } from "@/modules/data/utils/onDemande";
import logger from "@/services/logger";
import { cleanNull } from "@/utils/noNull";

export const getTauxTransformationCumulePrevisionnel = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string;
}) => {
  const tauxTransfoCumulePrevisionnelNational = await getKbdClient()
    .selectFrom(
      genericOnDemandes({
        codeRegion,
        rentreeScolaire: rentreeScolaireCampagnes(),
        codeNiveauDiplome: codeNiveauDiplome ? [codeNiveauDiplome] : undefined
      })
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
    .modifyEnd(sql.raw('\n-- Taux de transformation prévisionnel national'))
    .executeTakeFirst()
    .then(cleanNull);

  logger.info({ tauxTransfoCumulePrevisionnelNational });

  return {
    placesTransformees: tauxTransfoCumulePrevisionnelNational?.placesTransformees,
    effectifs: tauxTransfoCumulePrevisionnelNational?.effectifs,
    taux: formatTauxTransformation(
      tauxTransfoCumulePrevisionnelNational?.placesTransformees,
      tauxTransfoCumulePrevisionnelNational?.effectifs
    ),
  };
};
