import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findNouvellesFormation = ({ cfd }: { cfd: string }) =>
  kdb
    .selectFrom("formationHistorique")
    .selectAll()
    .where("ancienCFD", "=", cfd)
    .execute()
    .then(cleanNull);
