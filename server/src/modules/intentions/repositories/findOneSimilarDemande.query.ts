import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findOneSimilarDemande = ({
  cfd,
  uai,
  codeDispositif,
  libelleFCIL,
  rentreeScolaire,
  notNumero,
}: {
  cfd: string;
  uai: string;
  codeDispositif: string;
  libelleFCIL?: string;
  rentreeScolaire: number;
  notNumero?: string;
}) =>
  kdb
    .selectFrom("latestDemandeView as demande")
    .selectAll()
    .where("cfd", "=", cfd)
    .where("uai", "=", uai)
    .where("codeDispositif", "=", codeDispositif)
    .$call((q) => {
      if (!libelleFCIL) return q;
      return q.where("libelleFCIL", "=", libelleFCIL);
    })
    .where("rentreeScolaire", "=", rentreeScolaire)
    .$call((q) => {
      if (!notNumero) return q;
      return q.where("numero", "!=", notNumero);
    })
    .limit(1)
    .executeTakeFirst()
    .then(cleanNull);
