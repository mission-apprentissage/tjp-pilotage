import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import { isDemandeCampagneEnCours } from "@/modules/utils/isDemandeCampagneEnCours";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  getKbdClient()
    .selectFrom(({ selectFrom }) =>
      selectFrom("latestDemandeView as demande")
        .where(isDemandeCampagneEnCours)
        .where("numeroHistorique", "=", numero)
        .selectAll()
        .as("latestDemandes")
    )
    .selectAll()
    .where("latestDemandes.statut", "<>", DemandeStatutEnum["supprimée"])
    .executeTakeFirst();
