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

export function withInsertionReg({
  eb,
  millesimeSortie,
}: {
  eb: ExpressionBuilder<DB, "formationEtablissement" | "etablissement">;
  millesimeSortie: string;
}) {
  return eb
    .selectFrom("indicateurRegionSortie as subIRS")
    .whereRef("subIRS.cfd", "=", "formationEtablissement.cfd")
    .whereRef("subIRS.dispositifId", "=", "formationEtablissement.dispositifId")
    .where("subIRS.millesimeSortie", "=", millesimeSortie)

    .whereRef(
      "subIRS.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref("etablissement.codeRegion")}))`
    )
    .select([selectTauxInsertion6moisAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.dispositifId"]);
}
