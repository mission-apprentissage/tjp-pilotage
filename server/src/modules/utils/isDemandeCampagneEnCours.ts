import { ExpressionBuilder, sql } from "kysely";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { DB } from "../../db/db";

export const isDemandeCampagneEnCours = (
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
      .where("campagne.statut", "=", CampagneStatutEnum["en cours"])
  );
};
