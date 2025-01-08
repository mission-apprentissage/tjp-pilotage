import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import { isIntentionCampagneEnCours } from "@/modules/utils/isDemandeCampagneEnCours";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  getKbdClient()
    .selectFrom(({ selectFrom }) =>
      selectFrom("latestIntentionView as intention")
        .where(isIntentionCampagneEnCours)
        .where("numeroHistorique", "=", numero)
        .selectAll()
        .as("latestIntentions"),
    )
    .selectAll()
    .where("latestIntentions.statut", "<>", DemandeStatutEnum["supprimée"])
    .executeTakeFirst();
