import { ExpressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { DB } from "../../../../db/schema";

export function hasContinuum({
  eb,
  millesimeSortie,
}: {
  eb: ExpressionBuilder<DB, "etablissement" | "formationEtablissement">;
  millesimeSortie: string;
}) {
  return jsonObjectFrom(
    eb
      .selectFrom("indicateurRegionSortie as subIRS")
      .leftJoin(
        "formation as subFormation",
        "subFormation.codeFormationDiplome",
        "subIRS.cfdContinuum"
      )
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
      .select("subIRS.cfdContinuum as cfd")
      .$narrowType<{ cfd: string }>()
      .select("subFormation.libelleDiplome as libelle")
      .groupBy([
        "subIRS.codeRegion",
        "subIRS.cfdContinuum",
        "subFormation.libelleDiplome",
      ])
      .limit(1)
  );
}
