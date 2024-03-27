import { ExpressionBuilder, sql } from "kysely";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { DB } from "../../db/db";

export const isDemandeFromLatestCampagne = (
  eb: ExpressionBuilder<DB, "demande">,
  alias?: string
) => {
  const tableName = alias ? alias : "demande";

  return eb(
    sql<string>`${sql.table(tableName)}."campagneId"`,
    "=",
    eb
      .selectFrom("campagne")
      .select("id")
      .where("campagne.annee", "=", CURRENT_ANNEE_CAMPAGNE)
  );
};
