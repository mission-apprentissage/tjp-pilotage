import { ExpressionBuilder } from "kysely";

import { DB } from "../../../db/schema";

export const notHistorique = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    eb.selectFrom("formationHistorique").distinct().select("ancienCFD")
  );
};

export const notHistoriqueIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">
) => {
  return eb(
    "indicateurRegionSortie.cfd",
    "not in",
    eb.selectFrom("formationHistorique").distinct().select("ancienCFD")
  );
};
