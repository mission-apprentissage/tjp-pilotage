import { RawBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const getFormationsQuery = async ({
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  codeRegion,
  codeDiplome,
  effectifMin,
}: {
  rentreeScolaire?: string;
  millesimeSortie?: string;
  codeRegion?: string[];
  codeDiplome?: string[];
  effectifMin?: number;
} = {}) => {
  const effectifAnnee = (annee: RawBuilder<unknown>) => {
    return sql`NULLIF((jsonb_extract_path("indicateurEntree"."effectifs",${annee})), 'null')::INT`;
  };

  const capaciteAnnee = (annee: RawBuilder<unknown>) => {
    return sql`NULLIF((jsonb_extract_path("indicateurEntree"."capacites",${annee})), 'null')::INT`;
  };

  const premierVoeuxAnnee = (annee: RawBuilder<unknown>) => {
    return sql`NULLIF((jsonb_extract_path("indicateurEntree"."premiersVoeux",${annee})), 'null')::INT`;
  };

  const query = kdb
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
    .selectAll("formation")
    .select([
      sql<number>`COUNT(*) OVER()`.as("count"),
      "codeFormationDiplome",
      "libelleDiplome",
      "formationEtablissement.dispositifId",
      sql<number>`(100 * sum(
            case when ${capaciteAnnee(sql`"anneeDebut"::text`)} is not null 
            then ${effectifAnnee(sql`"anneeDebut"::text`)} end)
            / NULLIF(sum(${capaciteAnnee(sql`"anneeDebut"::text`)}), 0))
          `.as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee(sql`"anneeDebut"::text`)})`.as(
        "effectif"
      ),
      sql<number>`(100 * sum(
            case when ${capaciteAnnee(sql`"anneeDebut"::text`)} is not null 
            then ${premierVoeuxAnnee(sql`"anneeDebut"::text`)} end)
            / NULLIF(sum(${capaciteAnnee(sql`"anneeDebut"::text`)}), 0))
          `.as("tauxPression"),
      sql<number>`(100* SUM("indicateurSortie"."nbPoursuiteEtudes") / SUM("indicateurSortie"."effectifSortie"))
          `.as("tauxPoursuiteEtudes"),
      sql<number>`(100 * SUM("indicateurSortie"."nbInsertion12mois") / SUM("indicateurSortie"."nbSortants"))
          `.as("tauxInsertion12mois"),
    ])
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
    .$call((q) => {
      if (!effectifMin) return q;
      return q.having(
        sql<number>`SUM(${effectifAnnee(sql`"anneeDebut"::text`)})`,
        ">",
        effectifMin
      );
    })
    .groupBy([
      "formation.id",
      "indicateurEntree.rentreeScolaire",
      "formationEtablissement.dispositifId",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("etablissement.codeRegion", "in", codeRegion);
    })
    .$call((q) => {
      if (!codeDiplome) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeDiplome);
    });

  const res = await query.execute();

  return {
    count: res[0]?.count ?? 0,
    formations: res.map(cleanNull),
  };
};
