import { ExpressionBuilder, RawBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";

const findFormationsInDb = async ({
  offset = 0,
  limit = 20,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
  codeRegion,
  codeAcademie,
  codeDepartement,
  codeDiplome,
  codeDispositif,
  commune,
  cfd,
  cfdFamille,
  orderBy,
}: {
  offset?: number;
  limit?: number;
  rentreeScolaire?: string;
  millesimeSortie?: string;
  codeRegion?: string[];
  codeAcademie?: string[];
  codeDepartement?: string[];
  codeDiplome?: string[];
  codeDispositif?: string[];
  commune?: string[];
  cfd?: string[];
  cfdFamille?: string[];
  orderBy?: { column: string; order: "asc" | "desc" };
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

  const res = await kdb
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
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .leftJoin("indicateurSortie", (join) =>
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
      if (!codeAcademie) return q;
      return q.where("etablissement.codeAcademie", "in", codeAcademie);
    })
    .$call((q) => {
      if (!codeDepartement) return q;
      return q.where("etablissement.codeDepartement", "in", codeDepartement);
    })
    .$call((q) => {
      if (!cfd) return q;
      return q.where("formation.codeFormationDiplome", "in", cfd);
    })
    .$call((q) => {
      if (!commune) return q;
      return q.where("etablissement.commune", "in", commune);
    })
    .$call((q) => {
      if (!codeDispositif) return q;
      return q.where("dispositif.codeDispositif", "in", codeDispositif);
    })
    .$call((q) => {
      if (!codeDiplome) return q;
      return q.where("dispositif.codeNiveauDiplome", "in", codeDiplome);
    })
    .$call((q) => {
      if (!cfdFamille) return q;
      return q.where("familleMetier.cfdFamille", "in", cfdFamille);
    })
    .$call((query) => {
      if (!orderBy) return query;
      return query.orderBy(orderBy.column as any, orderBy.order);
    })
    .orderBy("libelleDiplome", "asc")
    .orderBy("libelleNiveauDiplome", "asc")
    .orderBy("libelleDispositif", "asc")
    .orderBy("nbEtablissement", "asc")
    .orderBy("codeFormationDiplome", "asc")
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    count: res[0]?.count ?? 0,
    formations: res.map(cleanNull),
  };
};

const findFiltersInDb = async ({
  codeRegion,
  codeAcademie,
  codeDepartement,
  commune,
  cfdFamille,
  cfd,
  codeDiplome,
}: {
  codeRegion?: string[];
  codeAcademie?: string[];
  codeDepartement?: string[];
  codeDiplome?: string[];
  codeDispositif?: string[];
  commune?: string[];
  cfd?: string[];
  cfdFamille?: string[];
}) => {
  const base = kdb
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
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "etablissement.codeDepartement"
    )
    .leftJoin("academie", "academie.codeAcademie", "etablissement.codeAcademie")
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const inCodeAcademie = (eb: ExpressionBuilder<DB, "academie">) => {
    if (!codeAcademie) return sql<true>`true`;
    return eb.and([eb.cmpr("academie.codeAcademie", "in", codeAcademie)]);
  };
  const inCodeDepartement = (eb: ExpressionBuilder<DB, "departement">) => {
    if (!codeDepartement) return sql<true>`true`;
    return eb.and([
      eb.cmpr("departement.codeDepartement", "in", codeDepartement),
    ]);
  };

  const inCommune = (eb: ExpressionBuilder<DB, "etablissement">) => {
    if (!commune) return sql<true>`true`;
    return eb.and([eb.cmpr("etablissement.commune", "in", commune)]);
  };

  const inCodeRegion = (eb: ExpressionBuilder<DB, "region">) => {
    if (!codeRegion) return sql<true>`true`;
    return eb.and([eb.cmpr("region.codeRegion", "in", codeRegion)]);
  };

  const inCfdFamille = (eb: ExpressionBuilder<DB, "familleMetier">) => {
    if (!cfdFamille) return sql<true>`true`;
    return eb.and([eb.cmpr("familleMetier.cfdFamille", "in", cfdFamille)]);
  };

  const inCfd = (eb: ExpressionBuilder<DB, "formation">) => {
    if (!cfd) return sql<true>`true`;
    return eb.and([eb.cmpr("formation.codeFormationDiplome", "in", cfd)]);
  };

  const inCodeDiplome = (eb: ExpressionBuilder<DB, "formation">) => {
    if (!codeDiplome) return sql<true>`true`;
    return eb.and([eb.cmpr("formation.codeNiveauDiplome", "in", codeDiplome)]);
  };

  const regions = await base
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .where(inCodeAcademie)
    .where(inCodeDepartement)
    .where(inCommune)
    .execute();

  const academies = await base
    .select(["academie.libelle as label", "academie.codeAcademie as value"])
    .where("academie.codeAcademie", "is not", null)
    .where(inCodeRegion)
    .where(inCodeDepartement)
    .where(inCommune)
    .execute();

  const departements = await base
    .select([
      "departement.libelle as label",
      "departement.codeDepartement as value",
    ])
    .where("departement.codeDepartement", "is not", null)
    .where(inCodeRegion)
    .where(inCodeAcademie)
    .where(inCommune)
    .execute();

  const communes = await base
    .select([
      "etablissement.commune as label",
      "etablissement.commune as value",
    ])
    .where("etablissement.commune", "is not", null)
    .where(inCodeRegion)
    .where(inCodeAcademie)
    .where(inCodeDepartement)
    .execute();

  const diplomes = await base
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where(inCfdFamille)
    .where(inCfd)
    .execute();

  const familles = await base
    .select([
      "familleMetier.libelleOfficielFamille as label",
      "familleMetier.cfdFamille as value",
    ])
    .where("familleMetier.cfdFamille", "is not", null)
    .where(inCfd)
    .where(inCodeDiplome)
    .execute();

  const formations = await base
    .select([
      "formation.libelleDiplome as label",
      "formation.codeFormationDiplome as value",
    ])
    .where("formation.codeFormationDiplome", "is not", null)
    .where(inCfdFamille)
    .where(inCodeDiplome)
    .execute();

  return await {
    regions: (await regions).map(cleanNull),
    departements: (await departements).map(cleanNull),
    academies: (await academies).map(cleanNull),
    communes: (await communes).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
    familles: (await familles).map(cleanNull),
    formations: (await formations).map(cleanNull),
  };
};

const findReferencesInDb = async ({ codeRegion }: { codeRegion: string[] }) => {
  return await kdb
    .selectFrom("formation")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formation.codeFormationDiplome"
    )
    .innerJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formation.codeNiveauDiplome"
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin("indicateurSortie", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurSortie.formationEtablissementId"
        )
        .on("indicateurSortie.millesimeSortie", "=", "2020_2021")
    )
    .select([
      "niveauDiplome.codeNiveauDiplome",
      sql<number>`(100 * SUM("indicateurSortie"."nbPoursuiteEtudes") / SUM("indicateurSortie"."effectifSortie"))
      `.as("tauxPoursuiteEtudes"),
      sql<number>`(100 * SUM("indicateurSortie"."nbInsertion12mois") / SUM("indicateurSortie"."nbSortants"))
      `.as("tauxInsertion12mois"),
    ])
    .where("etablissement.codeRegion", "=", codeRegion)
    .groupBy("niveauDiplome.codeNiveauDiplome")
    .execute();
};

export const dependencies = {
  findFormationsInDb,
  findFiltersInDb,
  findReferencesInDb,
};
