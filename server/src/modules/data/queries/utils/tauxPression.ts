import { RawBuilder, sql } from "kysely";

const capaciteAnnee = (
  annee: RawBuilder<unknown>,
  indicateurEntreeAlias: string
) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(
    indicateurEntreeAlias
  )}."capacites",${annee})), 'null')::INT`;
};

const premierVoeuxAnnee = (
  annee: RawBuilder<unknown>,
  indicateurEntreeAlias: string
) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(
    indicateurEntreeAlias
  )}."premiersVoeux",${annee})), 'null')::INT`;
};

export const selectDenominateurPression = (
  indicateurEntreeAlias: string
) => sql<number>`
  SUM(
    case when 
    ${capaciteAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )} is not null 
    then ${capaciteAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )}
    end
  )`;

export const selectTauxPression = (
  indicateurEntreeAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurPression(indicateurEntreeAlias)} >= 20
    then (100 * SUM(${premierVoeuxAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )}) 
    / ${selectDenominateurPression(indicateurEntreeAlias)})
    end
  `;
