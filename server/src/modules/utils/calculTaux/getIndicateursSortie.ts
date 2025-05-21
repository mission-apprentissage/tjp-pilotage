import {sql} from 'kysely';


export const selectNbInsertion6mois = (indicateurSortieAlias: string) =>
  sql<number>`${sql.table(indicateurSortieAlias)}."nbInsertion6mois"`;

export const selectNbSortants = (indicateurSortieAlias: string) =>
  sql<number>`${sql.table(indicateurSortieAlias)}."nbSortants"`;

export const selectNbPoursuite = (indicateurSortieAlias: string) =>
  sql<number>`${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes"`;

export const selectEffectifSortie = (indicateurSortieAlias: string) =>
  sql<number>`${sql.table(indicateurSortieAlias)}."effectifSortie"`;

export const getSommeInsertion6mois = (indicateurSortieAlias: string) =>
  sql<number>`SUM(${selectNbInsertion6mois(indicateurSortieAlias)})`;

export const getSommeNbSortants = (indicateurSortieAlias: string) =>
  sql<number>`SUM(${selectNbSortants(indicateurSortieAlias)})`;

export const getSommePoursuite = (indicateurSortieAlias: string) =>
  sql<number>`SUM(${selectNbPoursuite(indicateurSortieAlias)})`;

export const getSommeEffectifSortie = (indicateurSortieAlias: string) =>
  sql<number>`SUM(${selectEffectifSortie(indicateurSortieAlias)})`;

