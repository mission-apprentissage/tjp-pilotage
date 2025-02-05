import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import { effectifTauxTransformationCumule } from "@/modules/data/utils/effectifTauxTransformationCumule";
import { formatTauxTransformation } from "@/modules/data/utils/formatTauxTransformation";
import { genericOnDemandes } from "@/modules/data/utils/onDemande";
import { cleanNull } from "@/utils/noNull";


export const getTauxTransformationCumule = async ({
  rentreesScolaire,
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string;
  rentreesScolaire: string[];
}) => {
  const tauxTransformationCumuleNational = await getKbdClient()
    .selectFrom(
      genericOnDemandes({
        codeRegion,
        rentreeScolaire: rentreesScolaire,
        codeNiveauDiplome: codeNiveauDiplome ? [codeNiveauDiplome] : undefined,
        statut: [DemandeStatutEnum["demande validée"]]
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
    .modifyEnd(sql.raw(`\n-- Taux de transformation cumulé national`))
    .executeTakeFirst()
    .then(cleanNull);

  return {
    placesTransformees: tauxTransformationCumuleNational?.placesTransformees,
    effectifs: tauxTransformationCumuleNational?.effectifs,
    taux: formatTauxTransformation(
      tauxTransformationCumuleNational?.placesTransformees,
      tauxTransformationCumuleNational?.effectifs
    ),
  };
};

