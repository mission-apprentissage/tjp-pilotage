import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { kdb } from "../../../../../db/db";
import { isDemandeCampagneEnCours } from "../../../../utils/isDemandeCampagneEnCours";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  kdb
    .selectFrom(({ selectFrom }) =>
      selectFrom("latestDemandeView as demande")
        .where(isDemandeCampagneEnCours)
        .where("numeroHistorique", "=", numero)
        .selectAll()
        .as("lastestDemandes")
    )
    .selectAll()
    .where("lastestDemandes.statut", "<>", DemandeStatutEnum["supprimée"])
    .executeTakeFirst();
