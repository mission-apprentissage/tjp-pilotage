import { kdb } from "../../../../../db/db";
import { isIntentionCampagneEnCours } from "../../../../utils/isDemandeCampagneEnCours";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  await kdb
    .selectFrom("intention")
    .where(isIntentionCampagneEnCours)
    .where("numeroHistorique", "=", numero)
    .selectAll()
    .executeTakeFirst();
