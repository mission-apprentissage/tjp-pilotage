import { kdb } from "../../../../../db/db";
import { isDemandeCampagneEnCours } from "../../../../utils/isDemandeCampagneEnCours";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  await kdb
    .selectFrom("demande")
    .where(isDemandeCampagneEnCours)
    .where("numeroHistorique", "=", numero)
    .selectAll()
    .executeTakeFirst();
