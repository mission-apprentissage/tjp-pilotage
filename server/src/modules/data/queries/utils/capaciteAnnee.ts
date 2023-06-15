import { RawBuilder, sql } from "kysely";

export const capaciteAnnee = ({
  annee,
  alias: indicateurEntreeAlias,
}: {
  annee?: RawBuilder<unknown>;
  alias: string;
}) => {
  const processedAnnee =
    annee ?? sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`;

  return sql<number | null>`
NULLIF(
jsonb_extract_path(
  ${sql.table(indicateurEntreeAlias)}."capacites",${processedAnnee}
  ), 
'null'
)::INT`;
};
