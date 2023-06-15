import { RawBuilder, sql } from "kysely";

export const effectifAnnee = ({
  annee,
  alias: indicateurEntreeAlias,
}: {
  annee?: RawBuilder<unknown>;
  alias: string;
}) => {
  const processedAnnee =
    annee ?? sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`;

  return sql`
NULLIF(
jsonb_extract_path(
  ${sql.table(indicateurEntreeAlias)}."effectifs",${processedAnnee}
), 
'null'
)::INT`;
};
