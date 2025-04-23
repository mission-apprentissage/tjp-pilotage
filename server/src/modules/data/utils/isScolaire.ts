import type { ExpressionBuilder } from "kysely";
import { VoieEnum } from "shared";

import type { DB } from "@/db/db";

export const isScolaireFormationHistorique = (eb: ExpressionBuilder<DB, "formationHistorique">) => {
  return eb("formationHistorique.voie", "=", VoieEnum.scolaire);
};

export const isScolaireFormationEtablissement = (eb: ExpressionBuilder<DB, "formationEtablissement">) => {
  return eb("formationEtablissement.voie", "=", VoieEnum.scolaire);
};

export const isScolaireIndicateurRegionSortie = (eb: ExpressionBuilder<DB, "indicateurRegionSortie">) => {
  return eb("indicateurRegionSortie.voie", "=", VoieEnum.scolaire);
};
