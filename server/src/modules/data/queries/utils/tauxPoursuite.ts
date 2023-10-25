import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

const seuil = 20;

export const selectDenominateurPoursuiteAgg = (
  indicateurSortieAlias: string
) => sql<number>`
  SUM(
    case when
    ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes" is not null
    then ${sql.table(indicateurSortieAlias)}."effectifSortie"
    end
  )`;

export const selectTauxPoursuiteAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    case when
    ${selectDenominateurPoursuiteAgg(indicateurSortieAlias)} >= ${seuil}
    then (100 * SUM(${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes")
    / ${selectDenominateurPoursuiteAgg(indicateurSortieAlias)})
    end
  `;

export const selectDenominateurPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
  case when
  ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes" is not null
  then ${sql.table(indicateurSortieAlias)}."effectifSortie"
  end`;

export const selectTauxPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
    case when
    ${selectDenominateurPoursuite(indicateurSortieAlias)} >= ${seuil}
    then (100 * ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes"
    / ${selectDenominateurPoursuite(indicateurSortieAlias)})
    end
  `;

type EbRef<EB extends ExpressionBuilder<DB, never>> = Parameters<EB["ref"]>[0];

export function withPoursuiteReg<EB extends ExpressionBuilder<DB, never>>({
  eb,
  millesimeSortie,
  cfdRef,
  dispositifIdRef,
  codeRegionRef,
}: {
  eb: EB;
  millesimeSortie: string;
  cfdRef: EbRef<EB>;
  dispositifIdRef: EbRef<EB>;
  codeRegionRef: EbRef<EB>;
}) {
  return eb
    .selectFrom("indicateurRegionSortie as subIRS")
    .whereRef("subIRS.cfd", "=", cfdRef)
    .whereRef("subIRS.dispositifId", "=", dispositifIdRef)
    .where("subIRS.millesimeSortie", "=", millesimeSortie)
    .whereRef(
      "subIRS.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
    )
    .select([selectTauxPoursuiteAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.dispositifId"]);
}
