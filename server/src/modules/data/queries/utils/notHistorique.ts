import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

export const notHistorique = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb.cmpr(
    "formationEtablissement.cfd",
    "not in",
    sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
  );
};
