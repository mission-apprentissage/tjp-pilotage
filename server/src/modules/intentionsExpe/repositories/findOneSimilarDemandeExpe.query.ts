import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findOneSimilarDemandeExpe = ({
  cfd,
  uai,
  codeDispositif,
  rentreeScolaire,
  campagneId,
  libelleFCIL,
  notNumero,
}: {
  cfd: string;
  uai: string;
  codeDispositif: string;
  rentreeScolaire: number;
  campagneId: string;
  libelleFCIL?: string;
  notNumero?: string;
}) =>
  kdb
    .selectFrom("latestDemandeExpeView as demandeExpe")
    .selectAll()
    .where("campagneId", "=", campagneId)
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
