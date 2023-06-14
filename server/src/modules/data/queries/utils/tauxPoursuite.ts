import { sql } from "kysely";

export const selectDenominateurPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
  SUM(
    case when 
    ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes" is not null 
    then ${sql.table(indicateurSortieAlias)}."effectifSortie" 
    end
  )`;

export const selectTauxPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurPoursuite(indicateurSortieAlias)} >= 20
    then (100 * SUM(${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes") 
    / ${selectDenominateurPoursuite(indicateurSortieAlias)})
    end
  `;
