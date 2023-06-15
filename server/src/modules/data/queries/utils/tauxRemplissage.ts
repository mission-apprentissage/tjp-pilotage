import { sql } from "kysely";

import { capaciteAnnee } from "./capaciteAnnee";
import { effectifAnnee } from "./effectifAnnee";

export const selectNumerateurRemplissage = (
  indicateurEntreeAlias: string
) => sql<number>`
case when 
${capaciteAnnee({ alias: indicateurEntreeAlias })} is not null 
then ${effectifAnnee({ alias: indicateurEntreeAlias })}
end`;

export const selectDenominateurRemplissageAgg = (
  indicateurEntreeAlias: string
) => sql<number>`
  SUM(
    case when 
    ${effectifAnnee({ alias: indicateurEntreeAlias })} is not null 
    then ${capaciteAnnee({ alias: indicateurEntreeAlias })}
    end
  )`;

export const selectTauxRemplissageAgg = (
  indicateurEntreeAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurRemplissageAgg(indicateurEntreeAlias)} >= 20
    then (100 * SUM(${selectNumerateurRemplissage(indicateurEntreeAlias)}) 
    / ${selectDenominateurRemplissageAgg(indicateurEntreeAlias)})
    end
  `;

export const selectDenominateurRemplissage = (
  indicateurEntreeAlias: string
) => sql<number>`
case when 
${effectifAnnee({ alias: indicateurEntreeAlias })} is not null 
then ${capaciteAnnee({ alias: indicateurEntreeAlias })}
end`;

export const selectTauxRemplissage = (
  indicateurEntreeAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurRemplissage(indicateurEntreeAlias)} >= 20
    then (100 * ${effectifAnnee({ alias: indicateurEntreeAlias })}
    / ${selectDenominateurRemplissage(indicateurEntreeAlias)})
    end
  `;
