import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findDiplomesProfessionnels = ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  return kdb
    .selectFrom("diplomeProfessionnel")
    .selectAll()
    .offset(offset)
    .$call((q) => {
      if (!limit) return q;
      return q.limit(limit);
    })
    .where("voie", "=", "apprentissage")
    .execute()
    .then(cleanNull);
};
