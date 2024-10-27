import type { RawBuilder } from "kysely";
import { sql } from "kysely";

export const effectifAnnee = ({
  annee,
  alias: indicateurEntreeAlias,
}: {
  annee?: RawBuilder<unknown>;
  alias: string;
}) => {
  const processedAnnee = annee ?? sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`;

  return sql<number | null>`
  NULLIF(
    jsonb_extract_path(${sql.table(indicateurEntreeAlias)}."effectifs",${processedAnnee}),
    'null'
  )::INT`;
};
