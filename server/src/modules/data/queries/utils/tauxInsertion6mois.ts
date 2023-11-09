import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

const seuil = 20;

export const selectDenominateurInsertion6moisAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    SUM(
      case when
      ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" is not null
      then ${sql.table(indicateurSortieAlias)}."nbSortants"
      end
    )`;

export const selectTauxInsertion6moisAgg = (
  indicateurSortieAlias: string
) => sql<number>`
      case when
      ${selectDenominateurInsertion6moisAgg(indicateurSortieAlias)} >= ${seuil}
      then (100 * SUM(${sql.table(indicateurSortieAlias)}."nbInsertion6mois")
      / ${selectDenominateurInsertion6moisAgg(indicateurSortieAlias)})
      end
    `;

export const selectDenominateurInsertion6mois = (
  indicateurSortieAlias: string
) => sql<number>`
    case when
    ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" is not null
    then ${sql.table(indicateurSortieAlias)}."nbSortants"
    end`;

export const selectTauxInsertion6mois = (
  indicateurSortieAlias: string
) => sql<number>`
          case when
          ${selectDenominateurInsertion6mois(indicateurSortieAlias)} >= ${seuil}
          then (100 * ${sql.table(indicateurSortieAlias)}."nbInsertion6mois"
          / ${selectDenominateurInsertion6mois(indicateurSortieAlias)})
          end
        `;

type EbRef<EB extends ExpressionBuilder<DB, never>> = Parameters<EB["ref"]>[0];
export function withInsertionReg<EB extends ExpressionBuilder<DB, never>>({
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
    .select([selectTauxInsertion6moisAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.dispositifId"]);
}
