import { ExpressionBuilder, expressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { DB } from "../../../db/schema";

export function hasContinuum<
  EB extends
    | ExpressionBuilder<DB, "formationEtablissement" | "etablissement">
    | ExpressionBuilder<DB, "demande" | "dataEtablissement">,
>({
  millesimeSortie,
  cfdRef,
  dispositifIdRef,
  codeRegionRef,
}: {
  eb: EB;
  millesimeSortie: string;
  cfdRef: Parameters<EB["ref"]>[0];
  dispositifIdRef: Parameters<EB["ref"]>[0];
  codeRegionRef: Parameters<EB["ref"]>[0];
}) {
  const eb = expressionBuilder<DB, keyof DB>();
  return jsonObjectFrom(
    eb
      .selectFrom("indicateurRegionSortie as subIRS")
      .leftJoin(
        "formation as subFormation",
        "subFormation.codeFormationDiplome",
        "subIRS.cfdContinuum"
      )
      .whereRef("subIRS.cfd", "=", cfdRef)
      .whereRef("subIRS.dispositifId", "=", dispositifIdRef)
      .whereRef(
        "subIRS.codeRegion",
        "=",
        sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
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
