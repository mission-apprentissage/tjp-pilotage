import { kdb } from "../../../../../db/db";
import { isDemandeExpeCampagneEnCours } from "../../../../utils/isDemandeCampagneEnCours";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  await kdb
    .selectFrom("demandeExpe")
    .where(isDemandeExpeCampagneEnCours)
    .where("numeroHistorique", "=", numero)
    .selectAll()
    .executeTakeFirst();
