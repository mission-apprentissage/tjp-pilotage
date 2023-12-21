import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../db/db";

export const notSecondeCommuneFormationEtablissement = (
  eb: ExpressionBuilder<DB, "formationEtablissement">
) => {
  return eb(
    "formationEtablissement.cfd",
    "not in",
    sql`(SELECT DISTINCT "cfdFamille" FROM "familleMetier")`
  );
};
export const notSecondeCommune = (
  eb: ExpressionBuilder<DB, "formationView">
) => {
  return eb.or([
    eb("formationView.typeFamille", "<>", "2nde_commune"),
    eb("formationView.typeFamille", "is", null),
  ]);
};

export const notSecondeCommuneIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">
) => {
  return eb(
    "indicateurRegionSortie.cfd",
    "not in",
    sql`(SELECT DISTINCT "cfdFamille" FROM "familleMetier")`
  );
};
