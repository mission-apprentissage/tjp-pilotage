import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findAnciennesFormation = ({ cfd }: { cfd: string }) =>
  kdb
    .selectFrom("formationHistorique")
    .selectAll()
    .where("cfd", "=", cfd)
    .execute()
    .then(cleanNull);
