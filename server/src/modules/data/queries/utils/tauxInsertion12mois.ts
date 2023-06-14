import { sql } from "kysely";

export const selectDenominateurInsertion12mois = (
  indicateurSortieAlias: string
) => sql<number>`
  SUM(
    case when 
    ${sql.table(indicateurSortieAlias)}."nbInsertion12mois" is not null 
    then ${sql.table(indicateurSortieAlias)}."nbSortants" 
    end
  )`;

export const selectTauxInsertion12mois = (
  indicateurSortieAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurInsertion12mois(indicateurSortieAlias)} >= 20
    then (100 * SUM(${sql.table(indicateurSortieAlias)}."nbInsertion12mois") 
    / ${selectDenominateurInsertion12mois(indicateurSortieAlias)})
    end
  `;
