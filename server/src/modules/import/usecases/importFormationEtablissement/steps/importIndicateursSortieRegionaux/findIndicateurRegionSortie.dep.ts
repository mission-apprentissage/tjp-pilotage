import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findIndicateurRegionSortie = ({
  cfd,
  codeDispositif,
  codeRegion,
  millesimeSortie,
}: {
  cfd: string;
  codeDispositif: string | null;
  codeRegion: string;
  millesimeSortie: string;
}) =>
  kdb
    .selectFrom("indicateurRegionSortie")
    .selectAll()
    .where("cfd", "=", cfd)
    .$call((eb) => {
      if (!codeDispositif) return eb.where("dispositifId", "is", null);
      return eb.where("dispositifId", "=", codeDispositif);
    })
    .where("codeRegion", "=", codeRegion)
    .where("millesimeSortie", "=", millesimeSortie)
    .executeTakeFirst()
    .then(cleanNull);
