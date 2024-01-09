import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../db/db";

export const notHistorique = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
  );
};

export const notHistoriqueFormation = (
  eb: ExpressionBuilder<DB, "formationView">
) => {
  return eb(
    "formationView.cfd",
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

export const notHistoriqueCoExistence = (
  eb: ExpressionBuilder<DB, "formationView">
) => {
  return eb.and([
    eb("formationView.dateFermeture", "is not", null),
    eb("formationView.dateFermeture", "<", sql`NOW()`),
  ]);
};
