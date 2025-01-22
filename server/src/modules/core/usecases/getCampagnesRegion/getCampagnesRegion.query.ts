import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const getCampagnesRegion = async () => {
  return getKbdClient()
    .selectFrom("campagneRegion")
    .innerJoin("region", "region.codeRegion", "campagneRegion.codeRegion")
    .innerJoin("campagne", "campagne.id", "campagneRegion.campagneId")
    .selectAll("campagneRegion")
    .select(["campagne.annee as annee", "region.libelleRegion as region"])
    .orderBy("annee desc")
    .execute()
    .then((campagnes) =>
      cleanNull(
        campagnes.map((campagne) => ({
          ...campagne,
          dateDebut: campagne.dateDebut?.toISOString(),
          dateFin: campagne.dateFin?.toISOString(),
        }))
      )
    );
};
