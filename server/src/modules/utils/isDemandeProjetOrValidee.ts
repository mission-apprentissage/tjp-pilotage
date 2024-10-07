import { ExpressionBuilder } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { DB } from "../../db/schema";

export const isDemandeProjetOrValidee = (
  eb: ExpressionBuilder<DB, "demande">
) =>
  eb("demande.statut", "in", [
    DemandeStatutEnum["projet de demande"],
    DemandeStatutEnum["demande validée"],
  ]);
