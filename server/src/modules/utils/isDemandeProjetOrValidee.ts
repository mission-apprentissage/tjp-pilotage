import type { ExpressionBuilder } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import type { DB } from "@/db/schema";

export const isDemandeProjetOrValidee = (eb: ExpressionBuilder<DB, "demande">) =>
  eb("demande.statut", "in", [DemandeStatutEnum["projet de demande"], DemandeStatutEnum["demande validée"]]);
