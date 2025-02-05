
import { rentreeScolaireCampagnes } from "shared/time/rentreeScolaireCampagnes";

import { getKbdClient } from "@/db/db";
import { effectifTauxTransformationCumule } from "@/modules/data/utils/effectifTauxTransformationCumule";
import { formatTauxTransformation } from "@/modules/data/utils/formatTauxTransformation";
import { genericOnDemandes } from "@/modules/data/utils/onDemande";
import { cleanNull } from "@/utils/noNull";

export const getTauxTransformationCumulePrevisionnel = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string;
}) => {
  const tauxTransfoCumulePrevisionnel = await getKbdClient()
    .selectFrom(
      genericOnDemandes({ codeRegion, rentreeScolaire: rentreeScolaireCampagnes() })
        .select((eb) => [eb.ref("demande.codeRegion").as("codeRegion")])
        .groupBy(["demande.codeRegion"])
        .as("demandes")
    )
    .leftJoin(
      effectifTauxTransformationCumule({ codeRegion, codeNiveauDiplome }).as("effectifs"),
      (join) => join.onRef("demandes.codeRegion", "=", "effectifs.codeRegion")
    )
    .select((eb) => [
      eb.ref("demandes.codeRegion").as("codeRegion"),
      eb.fn.coalesce("effectifs.effectif", eb.val(0)).as("effectif"),
      eb.fn.coalesce("demandes.placesTransformees", eb.val(0)).as("placesTransformees"),
    ])
    .$castTo<{codeRegion: string; effectif: number; placesTransformees: number;}>()
    .execute()
    .then(cleanNull);

  const tauxTransfoCumulePrevisionnelNational = tauxTransfoCumulePrevisionnel.reduce((prev, curr) => {
    prev.effectifs += Number(curr.effectif);
    prev.placesTransformees += curr.placesTransformees;
    return prev;
  }, {effectifs: 0, placesTransformees: 0});

  return formatTauxTransformation(
    tauxTransfoCumulePrevisionnelNational.placesTransformees,
    tauxTransfoCumulePrevisionnelNational.effectifs
  );
};
