import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findDiplomesProfessionnels = ({ offset, limit }: { offset: number; limit: number }) => {
  return getKbdClient()
    .selectFrom("diplomeProfessionnel")
    .select(["cfd", "voie"])
    .distinct()
    .offset(offset)
    .$call((q) => {
      if (!limit) return q;
      return q.limit(limit);
    })
    .orderBy("voie", "asc")
    .orderBy("cfd", "asc")
    .execute()
    .then(cleanNull);
};
