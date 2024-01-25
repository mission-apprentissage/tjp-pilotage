import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findIndicateurRegionSortie = ({
  cfd,
  codeDispositif,
  codeRegion,
  millesimeSortie,
}: {
  cfd: string;
  codeDispositif: string;
  codeRegion: string;
  millesimeSortie: string;
}) =>
  kdb
    .selectFrom("indicateurRegionSortie")
    .selectAll()
    .where("cfd", "=", cfd)
    .where("dispositifId", "=", codeDispositif)
    .where("codeRegion", "=", codeRegion)
    .where("millesimeSortie", "=", millesimeSortie)
    .executeTakeFirst()
    .then(cleanNull);
