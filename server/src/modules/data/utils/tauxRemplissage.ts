import { sql } from "kysely";

import { capaciteAnnee } from "./capaciteAnnee";
import { effectifAnnee } from "./effectifAnnee";

export const selectNumerateurRemplissage = (indicateurEntreeAlias: string) => sql<number>`
    CASE WHEN ${capaciteAnnee({ alias: indicateurEntreeAlias })} IS NOT NULL
    THEN ${effectifAnnee({ alias: indicateurEntreeAlias })}::FLOAT
    END`;

export const selectDenominateurRemplissageAgg = (indicateurEntreeAlias: string) => sql<number>`
    SUM(
      CASE WHEN ${effectifAnnee({ alias: indicateurEntreeAlias })} IS NOT NULL
      THEN ${capaciteAnnee({ alias: indicateurEntreeAlias })}::FLOAT
      END
    )`;

export const selectTauxRemplissageAgg = (indicateurEntreeAlias: string) => sql<number>`
    CASE WHEN ${selectDenominateurRemplissageAgg(indicateurEntreeAlias)} >= 0
    THEN (SUM(${selectNumerateurRemplissage(indicateurEntreeAlias)})
    / ${selectDenominateurRemplissageAgg(indicateurEntreeAlias)})::NUMERIC
    END  `;

export const selectDenominateurRemplissage = (indicateurEntreeAlias: string) => sql<number>`
    CASE WHEN ${effectifAnnee({ alias: indicateurEntreeAlias })} IS NOT NULL
    THEN ${capaciteAnnee({ alias: indicateurEntreeAlias })}::FLOAT
    END`;

export const selectTauxRemplissage = (indicateurEntreeAlias: string) => sql<number>`
    CASE WHEN ${selectDenominateurRemplissage(indicateurEntreeAlias)} >= 0
    THEN (${effectifAnnee({ alias: indicateurEntreeAlias })}
    / ${selectDenominateurRemplissage(indicateurEntreeAlias)})::NUMERIC
    END`;
