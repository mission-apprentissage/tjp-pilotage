import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

export function hasContinuum({
  eb,
  millesimeSortie,
}: {
  eb: ExpressionBuilder<DB, "etablissement" | "formationEtablissement">;
  millesimeSortie: string;
}) {
  return eb
    .selectFrom("indicateurRegionSortie as subIRS")
    .whereRef("subIRS.cfd", "=", "formationEtablissement.cfd")
    .whereRef("subIRS.dispositifId", "=", "formationEtablissement.dispositifId")
    .whereRef(
      "subIRS.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref("etablissement.codeRegion")}))`
    )
    .where("subIRS.millesimeSortie", "=", millesimeSortie)
    .where("subIRS.cfdContinuum", "is not", null)
    .select("subIRS.cfdContinuum")
    .groupBy(["subIRS.codeRegion", "subIRS.cfdContinuum"])
    .limit(1);
}
