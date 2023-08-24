import { sql } from "kysely";

const seuil = 20;

export const selectDenominateurDecrochage = (
  indicateurRegionAlias: string
) => sql<number>`
    case when
    ${sql.table(indicateurRegionAlias)}."nbDecrocheurs" is not null
    then ${sql.table(indicateurRegionAlias)}."effectifDecrochage"
    end`;

export const selectTauxDecrochage = (
  indicateurRegionAlias: string
) => sql<number>`
    case when
    ${selectDenominateurDecrochage(indicateurRegionAlias)} >= ${seuil}
    then ${sql.table(indicateurRegionAlias)}."tauxDecrochage"
    end`;

export const selectDenominateurDecrochageAgg = (
  indicateurRegionAlias: string
) => sql<number>`
    SUM(
      case when
      ${sql.table(indicateurRegionAlias)}."nbDecrocheurs" is not null
      then ${sql.table(indicateurRegionAlias)}."effectifDecrochage"
      end
    )`;

export const selectTauxDecrochageAgg = (
  indicateurRegionAlias: string
) => sql<number>`
    case when
    ${selectDenominateurDecrochageAgg(indicateurRegionAlias)} >= ${seuil}
    then ROUND(AVG(${sql.table(indicateurRegionAlias)}."tauxDecrochage"))
    end`;

export const selectTauxDecrochageNatAgg = (
  indicateurRegionAlias: string
) => sql<number>`
    case when
    ${selectDenominateurDecrochageAgg(indicateurRegionAlias)} >= ${seuil}
    then (100 * SUM(${sql.table(indicateurRegionAlias)}."nbDecrocheurs")
    / ${selectDenominateurDecrochageAgg(indicateurRegionAlias)})
    end`;
