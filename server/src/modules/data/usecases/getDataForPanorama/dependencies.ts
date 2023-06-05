import { RawBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

const effectifAnnee = (annee: RawBuilder<unknown>) => {
  return sql`NULLIF((jsonb_extract_path("indicateurEntree"."effectifs",${annee})), 'null')::INT`;
};

const capaciteAnnee = (annee: RawBuilder<unknown>) => {
  return sql`NULLIF((jsonb_extract_path("indicateurEntree"."capacites",${annee})), 'null')::INT`;
};

const premierVoeuxAnnee = (annee: RawBuilder<unknown>) => {
  return sql`NULLIF((jsonb_extract_path("indicateurEntree"."premiersVoeux",${annee})), 'null')::INT`;
};

const getBaseQuery = ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) =>
  kdb
    .selectFrom("formation")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formation.codeFormationDiplome"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formation.codeNiveauDiplome"
    )
    .leftJoin(
      "dispositif",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif"
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
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
    .where("etablissement.codeRegion", "=", codeRegion);

export const queryFormations = async ({
  codeRegion,
  UAI,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  UAI?: string[];
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const baseQuery = getBaseQuery({
    codeRegion,
    rentreeScolaire,
    millesimeSortie,
  });

  const formations = await baseQuery
    .leftJoin(
      "indicateurSortie as isp",
      "isp.formationEtablissementId",
      "formationEtablissement.id"
    )
    .leftJoin(
      "indicateurEntree as iep",
      "iep.formationEtablissementId",
      "formationEtablissement.id"
    )
    .select([
      "codeFormationDiplome",
      "libelleDiplome",
      "formationEtablissement.dispositifId",
      "libelleDispositif",
      "formation.codeNiveauDiplome",
      sql<number>`COUNT(etablissement.*)`.as("nbEtablissement"),
      sql<number>`(100 * sum(
              case when ${capaciteAnnee(
                sql`"indicateurEntree"."anneeDebut"::text`
              )} is not null 
              then ${effectifAnnee(
                sql`"indicateurEntree"."anneeDebut"::text`
              )} end)
              / NULLIF(sum(${capaciteAnnee(
                sql`"indicateurEntree"."anneeDebut"::text`
              )}), 0))
              `.as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee(
        sql`"indicateurEntree"."anneeDebut"::text`
      )})`.as("effectif"),
      sql<number>`SUM(NULLIF((jsonb_extract_path("iep"."effectifs","iep"."anneeDebut"::text)), 'null')::INT)`.as(
        "effectifPrecedent"
      ),
      sql<number>`(100 * sum(
              case when ${capaciteAnnee(
                sql`"indicateurEntree"."anneeDebut"::text`
              )} is not null 
              then ${premierVoeuxAnnee(
                sql`"indicateurEntree"."anneeDebut"::text`
              )} end)
              / NULLIF(sum(${capaciteAnnee(
                sql`"indicateurEntree"."anneeDebut"::text`
              )}), 0))
            `.as("tauxPression"),
      sql<number>`(100* SUM("indicateurSortie"."nbPoursuiteEtudes") / SUM("indicateurSortie"."effectifSortie"))
            `.as("tauxPoursuiteEtudes"),
      sql<number>`(100 * SUM("indicateurSortie"."nbInsertion12mois") / SUM("indicateurSortie"."nbSortants"))
            `.as("tauxInsertion12mois"),
      sql<number>`(100 * SUM("isp"."nbInsertion12mois") / SUM("isp"."nbSortants"))
            `.as("tauxInsertion12moisPrecedent"),
      sql<number>`(100 * SUM("isp"."nbPoursuiteEtudes") / SUM("isp"."effectifSortie"))
            `.as("tauxPoursuiteEtudesPrecedent"),
    ])
    .where("indicateurSortie.nbInsertion12mois", "is not", null)
    .where("indicateurSortie.nbPoursuiteEtudes", "is not", null)
    .having(
      UAI
        ? sql<boolean>`bool_or(etablissement."UAI" in (${sql.join(UAI)}))`
        : sql<boolean>`true`
    )
    .groupBy([
      "formation.id",
      "indicateurEntree.rentreeScolaire",
      "formationEtablissement.dispositifId",
      "dispositif.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .execute();

  return formations.map(cleanNull);
};

export const queryStatsForCadran = async ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const baseQuery = getBaseQuery({
    codeRegion,
    rentreeScolaire,
    millesimeSortie,
  });

  const stats = await baseQuery
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
    .groupBy(["codeRegion"])
    .executeTakeFirstOrThrow();

  return cleanNull(stats);
};
