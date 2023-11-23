import { sql } from "kysely";

const seuil = 20;

export const selectDenominateurDecrochage = (
  indicateurRegionAlias: string
) => sql<number>`
    CASE WHEN
    ${sql.table(indicateurRegionAlias)}."nbDecrocheurs" IS NOT NULL
    THEN ${sql.table(indicateurRegionAlias)}."effectifDecrochage"
    END`;

export const selectTauxDecrochage = (
  indicateurRegionAlias: string
) => sql<number>`
    CASE WHEN
    ${selectDenominateurDecrochage(indicateurRegionAlias)} >= ${seuil}
    THEN ${sql.table(indicateurRegionAlias)}."tauxDecrochage"
    END`;

export const selectDenominateurDecrochageAgg = (
  indicateurRegionAlias: string
) => sql<number>`
    SUM(
      CASE WHEN
      ${sql.table(indicateurRegionAlias)}."nbDecrocheurs" IS NOT NULL
      THEN ${sql.table(indicateurRegionAlias)}."effectifDecrochage"
      END
    )`;

export const selectTauxDecrochageAgg = (
  indicateurRegionAlias: string
) => sql<number>`
    CASE WHEN
    ${selectDenominateurDecrochageAgg(indicateurRegionAlias)} >= ${seuil}
    THEN ROUND(AVG(${sql.table(indicateurRegionAlias)}."tauxDecrochage"))
    END`;

export const selectTauxDecrochageNatAgg = (
  indicateurRegionAlias: string
) => sql<number>`
    CASE WHEN
    ${selectDenominateurDecrochageAgg(indicateurRegionAlias)} >= ${seuil}
    THEN (100 * SUM(${sql.table(indicateurRegionAlias)}."nbDecrocheurs")
    / ${selectDenominateurDecrochageAgg(indicateurRegionAlias)})
    END`;
