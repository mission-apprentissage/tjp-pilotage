import { RawBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const getFormationsQuery = async ({
  offset = 0,
  limit = 1000,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  codeRegion,
  codeDiplome,
  effectifMin,
}: {
  offset?: number;
  limit?: number;
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
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.dispositifId"
    )
    .leftJoin(
      "familleMetier",
      "familleMetier.cfdSpecialite",
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
      "libelleOfficielFamille",
      "dispositifId",
      "libelleDispositif",
      "libelleNiveauDiplome",
      sql<number>`COUNT(etablissement.*)`.as("nbEtablissement"),
      sql<number>`avg("indicateurEntree"."anneeDebut")`.as("anneeDebut"),
      sql<number>`(100 * sum(
            case when ${capaciteAnnee(sql`"anneeDebut"::text`)} is not null 
            then ${effectifAnnee(sql`"anneeDebut"::text`)} end)
            / NULLIF(sum(${capaciteAnnee(sql`"anneeDebut"::text`)}), 0))
          `.as("tauxRemplissage"),
      sql<number>`SUM(${effectifAnnee(sql`"anneeDebut"::text`)})`.as(
        "effectif"
      ),
      sql<number>`SUM(${effectifAnnee(sql`'0'`)})`.as("effectif1"),
      sql<number>`SUM(${effectifAnnee(sql`'1'`)})`.as("effectif2"),
      sql<number>`SUM(${effectifAnnee(sql`'2'`)})`.as("effectif3"),
      sql<number>`SUM(${capaciteAnnee(sql`"anneeDebut"::text`)})`.as(
        "capacite"
      ),
      sql<number>`SUM(${capaciteAnnee(sql`'0'`)})`.as("capacite1"),
      sql<number>`SUM(${capaciteAnnee(sql`'1'`)})`.as("capacite2"),
      sql<number>`SUM(${capaciteAnnee(sql`'2'`)})`.as("capacite3"),
      sql<number>`SUM(${premierVoeuxAnnee(sql`"anneeDebut"::text`)})`.as(
        "premiersVoeux"
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
      "dispositif.libelleDispositif",
      "formationEtablissement.dispositifId",
      "familleMetier.libelleOfficielFamille",
      "niveauDiplome.libelleNiveauDiplome",
    ])
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("etablissement.codeRegion", "in", codeRegion);
    })
    .$call((q) => {
      if (!codeDiplome) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeDiplome);
    })
    .offset(offset)
    .limit(limit);

  const res = await query.execute();

  return {
    count: res[0]?.count ?? 0,
    formations: res.map(cleanNull),
  };
};
