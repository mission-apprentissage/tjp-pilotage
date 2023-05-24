import { RawBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";

export const queryStatsForCadran = async ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const effectifAnnee = (annee: RawBuilder<unknown>) => {
    return sql`NULLIF((jsonb_extract_path("indicateurEntree"."effectifs",${annee})), 'null')::INT`;
  };

  const capaciteAnnee = (annee: RawBuilder<unknown>) => {
    return sql`NULLIF((jsonb_extract_path("indicateurEntree"."capacites",${annee})), 'null')::INT`;
  };

  const data = await kdb
    .selectFrom("formation")
    .innerJoin(
      "formationEtablissement",
      "formation.codeFormationDiplome",
      "formationEtablissement.cfd"
    )
    .innerJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .innerJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .innerJoin("indicateurSortie", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurSortie.formationEtablissementId"
        )
        .on("indicateurSortie.millesimeSortie", "=", millesimeSortie)
    )
    .select([
      sql<number>`(100* SUM("indicateurSortie"."nbPoursuiteEtudes") / SUM("indicateurSortie"."effectifSortie"))
    `.as("tauxPoursuiteEtudes"),
      sql<number>`(100 * SUM("indicateurSortie"."nbInsertion12mois") / SUM("indicateurSortie"."nbSortants"))
    `.as("tauxInsertion12mois"),
      sql<number>`(100 * sum(
        case when ${capaciteAnnee(sql`"anneeDebut"::text`)} is not null 
        then ${effectifAnnee(sql`"anneeDebut"::text`)} end)
        / NULLIF(sum(${capaciteAnnee(sql`"anneeDebut"::text`)}), 0))
      `.as("tauxRemplissage"),
    ])
    .where("codeRegion", "=", codeRegion)
    .groupBy(["codeRegion"])
    .executeTakeFirstOrThrow();

  return data;
};
