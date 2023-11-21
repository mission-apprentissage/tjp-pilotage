import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findIndicateurRegionSortie = ({
  cfd,
  dispositifId,
  codeRegion,
  millesimeSortie,
}: {
  cfd: string;
  dispositifId: string;
  codeRegion: string;
  millesimeSortie: string;
}) =>
  kdb
    .selectFrom("indicateurRegionSortie")
    .selectAll()
    .where("cfd", "=", cfd)
    .where("dispositifId", "=", dispositifId)
    .where("codeRegion", "=", codeRegion)
    .where("millesimeSortie", "=", millesimeSortie)
    .executeTakeFirst()
    .then(cleanNull);
