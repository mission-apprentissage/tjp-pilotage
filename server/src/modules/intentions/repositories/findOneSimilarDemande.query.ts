import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";
import { isDemandeNotDeleted } from "../../utils/isDemandeSelectable";

export const findOneSimilarDemande = ({
  cfd,
  uai,
  codeDispositif,
  libelleFCIL,
  rentreeScolaire,
  notId,
}: {
  cfd: string;
  uai: string;
  codeDispositif: string;
  libelleFCIL?: string;
  rentreeScolaire: number;
  notId?: string;
}) =>
  kdb
    .selectFrom("demande")
    .selectAll()
    .where("cfd", "=", cfd)
    .where("uai", "=", uai)
    .where("dispositifId", "=", codeDispositif)
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
