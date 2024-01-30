import { ExpressionBuilder } from "kysely";

import { DB } from "../../../db/db";

export const notApprentissage = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    eb.selectFrom("familleMetier").distinct().select("cfdFamille")
  );
};
