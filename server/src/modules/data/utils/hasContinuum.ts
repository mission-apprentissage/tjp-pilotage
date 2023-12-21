import { ExpressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { DB } from "../../../db/db";

type EbRef<EB extends ExpressionBuilder<DB, never>> = Parameters<EB["ref"]>[0];

export function hasContinuum<EB extends ExpressionBuilder<DB, never>>({
  eb,
  millesimeSortie,
  cfdRef,
  codeDispositifRef,
  codeRegionRef,
}: {
  eb: EB;
  millesimeSortie: string;
  cfdRef: EbRef<EB>;
  codeDispositifRef: EbRef<EB>;
  codeRegionRef: EbRef<EB>;
}) {
  return jsonObjectFrom(
    eb
      .selectFrom("indicateurRegionSortie as subIRS")
      .leftJoin(
        "formationView as subFormation",
        "subFormation.cfd",
        "subIRS.cfdContinuum"
      )
      .whereRef("subIRS.cfd", "=", cfdRef)
      .whereRef("subIRS.dispositifId", "=", codeDispositifRef)
      .whereRef(
        "subIRS.codeRegion",
        "=",
        sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
      )
      .where("subIRS.millesimeSortie", "=", millesimeSortie)
      .where("subIRS.cfdContinuum", "is not", null)
      .select("subIRS.cfdContinuum as cfd")
      .$narrowType<{ cfd: string }>()
      .select("subFormation.libelleFormation")
      .groupBy([
        "subIRS.codeRegion",
        "subIRS.cfdContinuum",
        "subFormation.libelleFormation",
      ])
      .limit(1)
  );
}
