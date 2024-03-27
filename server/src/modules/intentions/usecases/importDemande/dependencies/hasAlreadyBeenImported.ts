import { kdb } from "../../../../../db/db";
import { isDemandeFromLatestCampagne } from "../../../../utils/isDemandeFromLatestCampagne.query";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  await kdb
    .selectFrom("demande")
    .where(isDemandeFromLatestCampagne)
    .where("numeroHistorique", "=", numero)
    .selectAll()
    .executeTakeFirst();
