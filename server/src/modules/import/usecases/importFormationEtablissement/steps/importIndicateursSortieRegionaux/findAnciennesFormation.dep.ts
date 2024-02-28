import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findAnciennesFormation = ({
  cfd,
  voie,
}: {
  cfd: string;
  voie: string;
}) =>
  kdb
    .selectFrom("formationHistorique")
    .selectAll()
    .where("cfd", "=", cfd)
    .where("voie", "=", voie)
    .execute()
    .then(cleanNull);
