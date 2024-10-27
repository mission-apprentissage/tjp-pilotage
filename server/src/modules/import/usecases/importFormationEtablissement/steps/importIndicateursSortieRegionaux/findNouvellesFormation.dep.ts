import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findNouvellesFormation = ({ cfd, voie }: { cfd: string; voie: string }) =>
  getKbdClient()
    .selectFrom("formationHistorique")
    .selectAll()
    .where("ancienCFD", "=", cfd)
    .where("voie", "=", voie)
    .execute()
    .then(cleanNull);
