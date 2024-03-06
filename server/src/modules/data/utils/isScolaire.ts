import { ExpressionBuilder } from "kysely";

import { DB } from "../../../db/db";

export const isScolaireFormationHistorique = (
  eb: ExpressionBuilder<DB, "formationHistorique">
) => {
  return eb("formationHistorique.voie", "=", "scolaire");
};

export const isScolaireFormationEtablissement = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb("formationEtablissement.voie", "=", "scolaire");
};

export const isScolaireIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">
) => {
  return eb("indicateurRegionSortie.voie", "=", "scolaire");
};
