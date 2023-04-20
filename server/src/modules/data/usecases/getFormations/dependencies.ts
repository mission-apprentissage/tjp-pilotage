import { SQL } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { schema } from "../../../../db/zapatos.schema";
import { cleanNull } from "../../../../utils/noNull";
import { Formation } from "../../entities/Formation";

const findFormationsInDb = async ({
  offset = 0,
  limit = 20,
  millesimeEntree = "2022",
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
  millesimeEntree?: string;
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
} = {}): Promise<{
  count: number;
  formations: (Formation & {
    libelleDispositif: string;
    libelleNiveauDiplome: string;
    nbEtablissement: number;
    effectif: number;
    tauxInsertion12mois: number;
    tauxPoursuiteEtudes: number;
  })[];
}> => {
  const query = await db.sql<
    SQL,
    (schema.formation.Selectable & {
      count: number;
      libelleOfficielFamille?: string;
      libelleDispositif: string;
      libelleNiveauDiplome: string;
      nbEtablissement: number;
      effectif: number;
      tauxInsertion12mois: number;
      tauxPoursuiteEtudes: number;
    })[]
  >`
    SELECT
        COUNT(*) OVER() as count,
        "formation".*, 
        "libelleOfficielFamille",
        "dispositifId",
        "libelleDispositif",
        "libelleNiveauDiplome",
        COUNT(etablissement.*) as "nbEtablissement", 
        SUM("indicateurEntree"."effectifEntree") as effectif,
        (100* SUM("indicateurSortie"."nbPoursuiteEtudes") / SUM("indicateurSortie"."effectifSortie")) as "tauxPoursuiteEtudes",
        (100 * SUM("indicateurSortie"."nbInsertion12mois") / SUM("indicateurSortie"."nbSortants")) as "tauxInsertion12mois"
    FROM "formation"
    LEFT JOIN "formationEtablissement"
        ON "formationEtablissement"."cfd" = "formation"."codeFormationDiplome"
    LEFT JOIN dispositif
        ON "dispositif"."codeDispositif" = "formationEtablissement"."dispositifId"
    LEFT JOIN "familleMetier" 
        ON "formation"."codeFormationDiplome" = "familleMetier"."cfdSpecialite"
    LEFT JOIN "niveauDiplome"
        ON "niveauDiplome"."codeNiveauDiplome" = formation."codeNiveauDiplome"
    LEFT JOIN "indicateurEntree"
        ON "indicateurEntree"."formationEtablissementId" = "formationEtablissement"."id" 
        AND "indicateurEntree"."millesimeEntree" = ${db.param(millesimeEntree)}
    LEFT JOIN "indicateurSortie"
        ON "indicateurSortie"."formationEtablissementId" = "formationEtablissement"."id" 
        AND "indicateurSortie"."millesimeSortie" = ${db.param(millesimeSortie)}
    LEFT JOIN "etablissement"
        ON "etablissement"."UAI" = "formationEtablissement"."UAI"
    WHERE 
        ${
          codeRegion
            ? db.sql`"etablissement"."codeRegion" IN (${db.vals(codeRegion)})`
            : {}
        } 
        AND ${
          codeAcademie
            ? db.sql`"etablissement"."codeAcademie" IN (${db.vals(
                codeAcademie
              )})`
            : {}
        } 
        AND ${
          codeDepartement
            ? db.sql`"etablissement"."codeDepartement" IN (${db.vals(
                codeDepartement
              )})`
            : {}
        } 
        AND ${
          cfd
            ? db.sql`"formation"."codeFormationDiplome" IN (${db.vals(cfd)})`
            : {}
        } 
        AND ${
          commune
            ? db.sql`"etablissement"."commune" IN (${db.vals(commune)})`
            : {}
        } 
        AND ${
          codeDispositif
            ? db.sql`"dispositif"."codeDispositif" IN (${db.vals(
                codeDispositif
              )})`
            : {}
        } 
        AND ${
          codeDiplome
            ? db.sql`"dispositif"."codeNiveauDiplome" IN (${db.vals(
                codeDiplome
              )})`
            : {}
        } 
        AND ${
          cfdFamille
            ? db.sql`"familleMetier"."cfdFamille" IN (${db.vals(cfdFamille)})`
            : {}
        }
        AND "codeFormationDiplome" NOT IN (SELECT DISTINCT "ancienCFD" FROM "formationHistorique")
    GROUP BY
        "formation".id,
        "libelleOfficielFamille",
        "indicateurEntree"."millesimeEntree",
        "libelleDispositif",
        "dispositifId",
        "libelleOfficielFamille",
        "libelleNiveauDiplome"
    ${
      orderBy
        ? db.sql`ORDER BY ${db.cols({ [orderBy.column]: true })} ${
            orderBy.order === "asc"
              ? db.sql`ASC NULLS LAST,`
              : db.sql`DESC NULLS LAST,`
          }`
        : db.sql`ORDER BY`
    }
    formation."libelleDiplome" ASC,
    "libelleDiplome" asc,
    "libelleNiveauDiplome" asc,
    "libelleDispositif" asc,
    "nbEtablissement" desc,
    "codeFormationDiplome" ASC
    OFFSET ${db.param(offset)}
    LIMIT ${db.param(limit)};
`;

  const data = await query.run(pool);

  return {
    count: data[0]?.count ?? 0,
    formations: data.map(cleanNull),
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
      ...communeConditon,
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
      ...codeRegionConditon,
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
  >`SELECT DISTINCT "formation"."libelleDiplome" as label, "formation"."codeFormationDiplome" as value
  ${from}
  AND ${{
    codeFormationDiplome: db.sql`"formation"."codeFormationDiplome" IS NOT NULL`,
    ...cfdFamilleCondition,
    ...codeDiplomeConditon,
  }}
  ORDER BY "formation"."libelleDiplome" ASC`.run(pool);

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
  const references = await db.sql<
    SQL,
    {
      tauxPoursuiteEtudes: number;
      tauxInsertion12mois: number;
      codeNiveauDiplome: string;
    }[]
  >`
  SELECT
    "niveauDiplome"."codeNiveauDiplome",
    (100 * SUM("indicateurSortie"."nbPoursuiteEtudes") / SUM("indicateurSortie"."effectifSortie")) as "tauxPoursuiteEtudes",
    (100 * SUM("indicateurSortie"."nbInsertion12mois") / SUM("indicateurSortie"."nbSortants")) as "tauxInsertion12mois"
  FROM formation
  LEFT JOIN "formationEtablissement"
      ON "formationEtablissement"."cfd" = "formation"."codeFormationDiplome"
  LEFT JOIN dispositif
      ON "dispositif"."codeDispositif" = "formationEtablissement"."dispositifId"
  LEFT JOIN "familleMetier" 
      ON "formation"."codeFormationDiplome" = "familleMetier"."cfdSpecialite"
  LEFT JOIN "niveauDiplome"
      ON "niveauDiplome"."codeNiveauDiplome" = formation."codeNiveauDiplome"
  LEFT JOIN "indicateurEntree"
      ON "indicateurEntree"."formationEtablissementId" = "formationEtablissement"."id" 
  LEFT JOIN "indicateurSortie"
      ON "indicateurSortie"."formationEtablissementId" = "formationEtablissement"."id" 
      AND "indicateurSortie"."millesimeSortie" = '2020_2021'
  LEFT JOIN "etablissement"
      ON "etablissement"."UAI" = "formationEtablissement"."UAI"
  LEFT JOIN "region"
      ON "region"."codeRegion" = "etablissement"."codeRegion"
  WHERE "region"."codeRegion" IN (${db.vals(codeRegion)})
  GROUP BY "niveauDiplome"."codeNiveauDiplome"
  `.run(pool);

  return references;
};

export const dependencies = {
  findFormationsInDb,
  findFiltersInDb,
  findReferencesInDb,
};
