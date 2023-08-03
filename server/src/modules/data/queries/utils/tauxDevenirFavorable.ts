import { sql } from "kysely";

const seuil = 20;

export const selectDenominateurDevenirFavorable = (
  indicateurSortieAlias: string
) => sql<number>`
    case when
    ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes" is not null
    and ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" is not null
    then ${sql.table(indicateurSortieAlias)}."effectifSortie"
    end`;

export const selectTauxDevenirFavorable = (
  indicateurSortieAlias: string
) => sql<number>`
    case when
    ${selectDenominateurDevenirFavorable(indicateurSortieAlias)} >= ${seuil}
    then (100 *
      (${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes"
      + ${sql.table(indicateurSortieAlias)}."nbInsertion6mois")
    / ${selectDenominateurDevenirFavorable(indicateurSortieAlias)})
    end`;
