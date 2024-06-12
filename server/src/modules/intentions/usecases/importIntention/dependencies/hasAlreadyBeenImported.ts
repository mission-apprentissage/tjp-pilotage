import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { kdb } from "../../../../../db/db";
import { isIntentionCampagneEnCours } from "../../../../utils/isDemandeCampagneEnCours";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  kdb
    .selectFrom(({ selectFrom }) =>
      selectFrom("latestIntentionView as intention")
        .where(isIntentionCampagneEnCours)
        .where("numeroHistorique", "=", numero)
        .selectAll()
        .as("latestIntentions")
    )
    .selectAll()
    .where("latestIntentions.statut", "<>", DemandeStatutEnum["supprimée"])
    .executeTakeFirst();
