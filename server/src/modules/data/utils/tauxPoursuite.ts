import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../db/schema";

const seuil = 20;

export const selectDenominateurPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
    CASE WHEN ${sql.table(
      indicateurSortieAlias
    )}."nbPoursuiteEtudes" IS NOT NULL
    THEN ${sql.table(indicateurSortieAlias)}."effectifSortie"::FLOAT
    END`;

export const selectTauxPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
    CASE WHEN ${selectDenominateurPoursuite(indicateurSortieAlias)} >= ${seuil}
    THEN ROUND((100 * ${sql.table(
      indicateurSortieAlias
    )}."nbPoursuiteEtudes"::FLOAT
    / ${selectDenominateurPoursuite(indicateurSortieAlias)})::NUMERIC, 2)
    END`;

export const selectDenominateurPoursuiteAgg = (
  indicateurSortieAlias: string
) => sql<number>`
      SUM(
        CASE WHEN ${sql.table(
          indicateurSortieAlias
        )}."nbPoursuiteEtudes" IS NOT NULL
        THEN ${sql.table(indicateurSortieAlias)}."effectifSortie"
        END
      )::FLOAT`;

export const selectTauxPoursuiteAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    CASE WHEN ${selectDenominateurPoursuiteAgg(
      indicateurSortieAlias
    )} >= ${seuil}
    THEN ROUND((100 * SUM(${sql.table(
      indicateurSortieAlias
    )}."nbPoursuiteEtudes")
      / ${selectDenominateurPoursuiteAgg(indicateurSortieAlias)})::NUMERIC, 2)
    END`;

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
