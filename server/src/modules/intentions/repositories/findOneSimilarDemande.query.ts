import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findOneSimilarDemande = ({
  cfd,
  uai,
  dispositifId,
  rentreeScolaire,
  notId,
}: {
  cfd: string;
  uai: string;
  dispositifId: string;
  rentreeScolaire: number;
  notId?: string;
}) =>
  kdb
    .selectFrom("demande")
    .selectAll()
    .where("cfd", "=", cfd)
    .where("uai", "=", uai)
    .where("dispositifId", "=", dispositifId)
    .where("rentreeScolaire", "=", rentreeScolaire)
    .$call((q) => {
      if (!notId) return q;
      return q.where("id", "!=", notId);
    })
    .limit(1)
    .executeTakeFirst()
    .then(cleanNull);
