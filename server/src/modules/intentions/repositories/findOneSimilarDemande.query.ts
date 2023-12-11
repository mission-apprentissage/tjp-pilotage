import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";
import { isDemandeNotDeleted } from "../../utils/isDemandeSelectable";

export const findOneSimilarDemande = ({
  cfd,
  uai,
  dispositifId,
  libelleFCIL,
  rentreeScolaire,
  notId,
}: {
  cfd: string;
  uai: string;
  dispositifId: string;
  libelleFCIL?: string;
  rentreeScolaire: number;
  notId?: string;
}) =>
  kdb
    .selectFrom("demande")
    .selectAll()
    .where("cfd", "=", cfd)
    .where("uai", "=", uai)
    .where("dispositifId", "=", dispositifId)
    .$call((q) => {
      if (!libelleFCIL) return q;
      return q.where("libelleFCIL", "=", libelleFCIL);
    })
    .where("rentreeScolaire", "=", rentreeScolaire)
    .$call((q) => {
      if (!notId) return q;
      return q.where("id", "!=", notId);
    })
    .limit(1)
    .where(isDemandeNotDeleted)
    .executeTakeFirst()
    .then(cleanNull);
