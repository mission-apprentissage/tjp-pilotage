import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

export function hasContinuums({
  eb,
  millesimeSortie,
}: {
  eb: ExpressionBuilder<DB, "etablissement" | "formationEtablissement">;
  millesimeSortie: string;
}) {
  return eb
    .exists(
      eb
        .selectFrom("indicateurRegionSortie as subIRS")
        .whereRef("subIRS.cfd", "=", "formationEtablissement.cfd")
        .whereRef(
          "subIRS.dispositifId",
          "=",
          "formationEtablissement.dispositifId"
        )
        .whereRef(
          "subIRS.codeRegion",
          "=",
          sql`ANY(array_agg(${eb.ref("etablissement.codeRegion")}))`
        )
        .where("subIRS.millesimeSortie", "=", millesimeSortie)
        .where("subIRS.cfdContinuum", "is not", null)
        .select(sql`true`.as("true"))
        .groupBy("subIRS.codeRegion")
    )
    .$castTo<boolean>();
}
