import type { ExpressionBuilder } from "kysely";
import { expressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import type { DB } from "@/db/db";

export function hasContinuum<
  EB extends
    | ExpressionBuilder<DB, "formationEtablissement" | "etablissement">
    | ExpressionBuilder<DB, "demande" | "dataEtablissement">,
>({
  millesimeSortie,
  cfdRef,
  codeDispositifRef,
  codeRegionRef,
}: {
  eb: EB;
  millesimeSortie: string;
  cfdRef: Parameters<EB["ref"]>[0];
  codeDispositifRef: Parameters<EB["ref"]>[0];
  codeRegionRef: Parameters<EB["ref"]>[0];
}) {
  const eb = expressionBuilder<DB, keyof DB>();
  return jsonObjectFrom(
    eb
      .selectFrom("indicateurRegionSortie as subIRS")
      .innerJoin("dataFormation as subFormation", "subFormation.cfd", "subIRS.cfdContinuum")
      .whereRef("subIRS.cfd", "=", cfdRef)
      .whereRef("subIRS.codeDispositif", "=", codeDispositifRef)
      .whereRef("subIRS.codeRegion", "=", sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`)
      .where("subIRS.millesimeSortie", "=", millesimeSortie)
      .where("subIRS.voie", "=", "scolaire")
      .where("subIRS.cfdContinuum", "is not", null)
      .select(["subIRS.cfdContinuum as cfd", "subFormation.libelleFormation as libelleFormation"])
      .$narrowType<{ cfd: string; libelleFormation: string }>()
      .groupBy(["subIRS.codeRegion", "subIRS.cfdContinuum", "subFormation.libelleFormation"])
      .limit(1),
  );
}
