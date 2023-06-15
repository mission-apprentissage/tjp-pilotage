import { sql } from "kysely";
import { SQL } from "zapatos/db";

import { kdb } from "../../../../db/db";
import { db, pool } from "../../../../db/zapatos";
import { cleanNull } from "../../../../utils/noNull";
import { capaciteAnnee } from "../../queries/utils/capaciteAnnee";
import { effectifAnnee } from "../../queries/utils/effectifAnnee";
import { withInsertionReg } from "../../queries/utils/tauxInsertion12mois";
import { withPoursuiteReg } from "../../queries/utils/tauxPoursuite";
import { withTauxPressionReg } from "../../queries/utils/tauxPression";
import { selectTauxRemplissage } from "../../queries/utils/tauxRemplissage";

const findEtablissementsInDb = async ({
  offset = 0,
  limit = 20,
  rentreeScolaire = ["2022"],
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
  uai,
  secteur,
}: {
  offset?: number;
  limit?: number;
  rentreeScolaire?: string[];
  millesimeSortie?: string;
  codeRegion?: string[];
  codeAcademie?: string[];
  codeDepartement?: string[];
  codeDiplome?: string[];
  codeDispositif?: string[];
  commune?: string[];
  cfd?: string[];
  cfdFamille?: string[];
  uai?: string[];
  secteur?: string[];
  orderBy?: { column: string; order: "asc" | "desc" };
} = {}) => {
  const result = await kdb
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
        .on("indicateurEntree.rentreeScolaire", "in", rentreeScolaire)
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
    .leftJoin("indicateurEtablissement", (join) =>
      join
        .onRef("etablissement.UAI", "=", "indicateurEtablissement.UAI")
        .on("indicateurEtablissement.millesime", "=", millesimeSortie)
    )
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "etablissement.codeDepartement"
    )
    .selectAll("etablissement")
    .selectAll("formation")
    .select([
      sql<number>`COUNT(*) OVER()`.as("count"),
      "departement.libelle as departement",
      "libelleOfficielFamille",
      "libelleDispositif",
      "dispositifId",
      "libelleNiveauDiplome",
      "indicateurEntree.rentreeScolaire",
      "indicateurEtablissement.valeurAjoutee",
      "anneeDebut",
      selectTauxRemplissage("indicateurEntree").as("tauxRemplissage"),
      effectifAnnee({ alias: "indicateurEntree" }).as("effectif"),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'0'` }).as(
        "effectif1"
      ),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'1'` }).as(
        "effectif2"
      ),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'2'` }).as(
        "effectif3"
      ),
      capaciteAnnee({ alias: "indicateurEntree" }).as("capacite"),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'0'` }).as(
        "capacite1"
      ),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'1'` }).as(
        "capacite2"
      ),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'2'` }).as(
        "capacite3"
      ),
    ])
    .select((eb) =>
      withTauxPressionReg({
        eb,
        codeRegion: "ref",
      }).as("tauxPression")
    )
    .select((eb) =>
      withInsertionReg({
        eb,
        millesimeSortie,
        codeRegion: "ref",
      }).as("tauxInsertion12mois")
    )
    .select((eb) =>
      withPoursuiteReg({
        eb,
        millesimeSortie,
        codeRegion: "ref",
      }).as("tauxPoursuiteEtudes")
    )
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
    .$call((q) => {
      if (!uai) return q;
      return q.where("etablissement.UAI", "in", uai);
    })
    .$call((q) => {
      if (!secteur) return q;
      return q.where("etablissement.secteur", "in", secteur);
    })
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
    .groupBy([
      "formation.id",
      "etablissement.id",
      "departement.codeDepartement",
      "libelleOfficielFamille",
      "indicateurEntree.rentreeScolaire",
      "indicateurEntree.formationEtablissementId",
      "indicateurSortie.formationEtablissementId",
      "formationEtablissement.id",
      "indicateurSortie.millesimeSortie",
      "dispositifId",
      "libelleDispositif",
      "libelleOfficielFamille",
      "libelleNiveauDiplome",
      "indicateurEtablissement.UAI",
      "indicateurEtablissement.millesime",
    ])
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
    })
    .orderBy("etablissement.libelleEtablissement", "asc")
    .orderBy("formation.libelleDiplome", "asc")
    .orderBy("libelleNiveauDiplome", "asc")
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    count: result[0]?.count ?? 0,
    etablissements: result.map(cleanNull),
  };
};

const findFiltersInDb = async ({
  codeRegion,
  codeAcademie,
  codeDepartement,
  commune,
  cfdFamille,
  codeDiplome,
  cfd,
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
  const from = db.sql`
    FROM "formation"
    LEFT JOIN "formationEtablissement"
        ON "formationEtablissement"."cfd" = "formation"."codeFormationDiplome"
    LEFT JOIN dispositif
        ON "dispositif"."codeDispositif" = "formationEtablissement"."dispositifId"
    LEFT JOIN "familleMetier" 
        ON "formation"."codeFormationDiplome" = "familleMetier"."cfdSpecialite"
    LEFT JOIN "niveauDiplome"
        ON "niveauDiplome"."codeNiveauDiplome" = formation."codeNiveauDiplome"
    LEFT JOIN "etablissement"
        ON "etablissement"."UAI" = "formationEtablissement"."UAI"
    LEFT JOIN "region"
        ON "etablissement"."codeRegion" = "region"."codeRegion"
    LEFT JOIN "departement"
        ON "etablissement"."codeDepartement" = "departement"."codeDepartement"
    LEFT JOIN "academie"
        ON "etablissement"."codeAcademie" = "academie"."codeAcademie"
    WHERE "codeFormationDiplome" NOT IN (SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`;

  const cfdFamilleCondition = cfdFamille && {
    cfdFamille: db.sql`"familleMetier"."cfdFamille" IN (${db.vals(
      cfdFamille
    )})`,
  };

  const codeAcademieConditon = codeAcademie && {
    codeAcademie: db.sql`"academie"."codeAcademie" IN (${db.vals(
      codeAcademie
    )})`,
  };

  const codeDepartementCondition = codeDepartement && {
    codeDepartement: db.sql`"departement"."codeDepartement" IN (${db.vals(
      codeDepartement
    )})`,
  };

  const communeConditon = commune && {
    commune: db.sql`"etablissement"."commune" IN (${db.vals(commune)})`,
  };

  const codeRegionConditon = codeRegion && {
    codeRegion: db.sql`"region"."codeRegion" IN (${db.vals(codeRegion)})`,
  };

  const cfdConditon = cfd && {
    cfd: db.sql`"formation"."codeFormationDiplome" IN (${db.vals(cfd)})`,
  };

  const codeDiplomeConditon = codeDiplome && {
    codeNiveauDiplome: db.sql`"formation"."codeNiveauDiplome" IN (${db.vals(
      codeDiplome
    )})`,
  };

  const regions = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "region"."libelleRegion" as label, "region"."codeRegion" as value
    ${from}
    AND ${{
      codeRegion: db.sql`"region"."codeRegion" IS NOT NULL`,
      ...codeAcademieConditon,
      ...codeDepartementCondition,
      ...communeConditon,
    }}
    ORDER BY "region"."libelleRegion" ASC`.run(pool);

  const academies = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "academie"."libelle" as label, "academie"."codeAcademie" as value
    ${from}
    AND ${{
      codeAcademie: db.sql`"academie"."codeAcademie" IS NOT NULL`,
      ...codeRegionConditon,
      ...codeDepartementCondition,
      ...(commune && {
        commune: db.sql`"etablissement"."commune" IN (${db.vals(commune)})`,
      }),
    }}
    ORDER BY "academie"."libelle" ASC`.run(pool);

  const departements = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "departement"."libelle" as label, "departement"."codeDepartement" as value
    ${from}
    AND ${{
      codeDepartement: db.sql`"departement"."codeDepartement" IS NOT NULL`,
      ...(codeRegion && {
        codeRegion: db.sql`"region"."codeRegion" IN (${db.vals(codeRegion)})`,
      }),
      ...codeAcademieConditon,
      ...communeConditon,
    }}
    ORDER BY "departement"."libelle" ASC`.run(pool);

  const communes = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "etablissement"."commune" as label, "etablissement"."commune" as value
    ${from}
    AND ${{
      commune: db.sql`"etablissement"."commune" IS NOT NULL`,
      ...codeRegionConditon,
      ...codeAcademieConditon,
      ...codeDepartementCondition,
    }}
    ORDER BY "etablissement"."commune" ASC`.run(pool);

  const etablissements = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "etablissement"."libelleEtablissement" as label, "etablissement"."UAI" as value
  ${from}
  AND ${{
    UAI: db.sql`"etablissement"."UAI" IS NOT NULL`,
    ...(cfdFamille && {
      cfdFamille: db.sql`"familleMetier"."cfdFamille" IN (${db.vals(
        cfdFamille
      )})`,
    }),
    ...codeRegionConditon,
    ...codeAcademieConditon,
    ...codeDepartementCondition,
    ...communeConditon,
  }}
  AND ${{ UAI: db.sql`"etablissement"."UAI" IS NOT NULL` }}
  ORDER BY "etablissement"."libelleEtablissement" ASC`.run(pool);

  const diplomes = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "niveauDiplome"."libelleNiveauDiplome" as label, "niveauDiplome"."codeNiveauDiplome" as value
    ${from}
    AND ${{
      codeNiveauDiplome: db.sql`"niveauDiplome"."codeNiveauDiplome" IS NOT NULL`,
      ...cfdFamilleCondition,
      ...cfdConditon,
    }}
    ORDER BY "niveauDiplome"."libelleNiveauDiplome" ASC`.run(pool);

  const familles = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "familleMetier"."libelleOfficielFamille" as label, "familleMetier"."cfdFamille" as "value"
    ${from}
    AND ${{
      cfdFamille: db.sql`"familleMetier"."cfdFamille" IS NOT NULL`,
      ...cfdConditon,
      ...codeDiplomeConditon,
    }}
    ORDER BY "familleMetier"."libelleOfficielFamille" ASC`.run(pool);

  const formations = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT ("formation"."libelleDiplome" || ' (' || "niveauDiplome"."libelleNiveauDiplome" || ')') as label, "formation"."codeFormationDiplome" as value
  ${from}
  AND ${{
    codeFormationDiplome: db.sql`"formation"."codeFormationDiplome" IS NOT NULL`,
    ...cfdFamilleCondition,
    ...codeDiplomeConditon,
  }}
  ORDER BY label ASC`.run(pool);

  return await {
    regions: (await regions).map(cleanNull),
    departements: (await departements).map(cleanNull),
    academies: (await academies).map(cleanNull),
    communes: (await communes).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
    familles: (await familles).map(cleanNull),
    formations: (await formations).map(cleanNull),
    etablissements: (await etablissements).map(cleanNull),
  };
};

export const dependencies = {
  findEtablissementsInDb,
  findFiltersInDb,
};
