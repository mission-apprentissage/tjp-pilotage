import { ExpressionBuilder } from "kysely";

import { DB } from "../../../db/db";

export const notApprentissageFormationEtablissement = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb("formationEtablissement.voie", "<>", "apprentissage");
};

export const notApprentissageIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">
) => {
  return eb("indicateurRegionSortie.voie", "<>", "apprentissage");
};
