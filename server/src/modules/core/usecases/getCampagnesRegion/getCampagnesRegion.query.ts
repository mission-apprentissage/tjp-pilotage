import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { cleanNull } from "@/utils/noNull";

export const getCampagnesRegion = async (user: RequestUser) => {
  return getKbdClient()
    .selectFrom("campagneRegion")
    .innerJoin("region", "region.codeRegion", "campagneRegion.codeRegion")
    .innerJoin("campagne", "campagne.id", "campagneRegion.campagneId")
    .selectAll("campagneRegion")
    .select(["campagne.annee as annee", "region.libelleRegion as region"])
    .$call((q) => {
      if (user.codeRegion) {
        return q.where("region.codeRegion", "=", user.codeRegion);
      }
      return q;
    })
    .orderBy("annee desc")
    .execute()
    .then((campagnes) =>
      cleanNull(
        campagnes.map((campagne) => ({
          ...campagne,
          dateDebut: campagne.dateDebut?.toISOString(),
          dateFin: campagne.dateFin?.toISOString(),
          dateVote: campagne.dateVote ? campagne.dateVote?.toISOString() : undefined,
        }))
      )
    );
};
