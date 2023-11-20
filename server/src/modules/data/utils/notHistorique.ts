import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../db/schema";

export const notHistorique = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
  );
};

export const notHistoriqueIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">
) => {
  return eb(
    "indicateurRegionSortie.cfd",
    "not in",
    sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
  );
};
