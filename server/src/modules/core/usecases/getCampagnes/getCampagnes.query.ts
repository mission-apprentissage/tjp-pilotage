import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const getCampagnes = async () => {
  return getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .orderBy("annee desc")
    .execute()
    .then((campagnes) =>
      cleanNull(
        campagnes.map((campagne) => ({
          ...campagne,
          dateDebut: campagne.dateDebut?.toISOString(),
          dateFin: campagne.dateFin?.toISOString(),
        })),
      ),
    );
};
