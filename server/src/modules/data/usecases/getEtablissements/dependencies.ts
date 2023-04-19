import { SQL } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { schema } from "../../../../db/zapatos.schema";
import { cleanNull } from "../../../../utils/noNull";
import { Etablissement } from "../../entities/Etablissement";
import { Formation } from "../../entities/Formation";

const findEtablissementsInDb = async ({
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
  uai,
  secteur,
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
  uai?: string[];
  secteur?: string[];
  orderBy?: { column: string; order: "asc" | "desc" };
} = {}): Promise<{
  count: number;
  etablissements: (Etablissement &
    Formation & {
      libelleDispositif: string;
      libelleNiveauDiplome: string;
      nbEtablissement: number;
      effectif: number;
    })[];
}> => {
  const query = await db.sql<
    SQL,
    (schema.etablissement.Selectable &
      schema.formation.Selectable & {
        count: number;
        libelleOfficielFamille?: string;
        libelleDispositif: string;
        libelleNiveauDiplome: string;
        nbEtablissement: number;
        effectif: number;
        valeurAjoutee: number;
      })[]
  >`
    SELECT
        COUNT(*) OVER() as count,
        "etablissement".*, 
        "formation".*,
        "libelleOfficielFamille",
        "libelleDispositif",
        "dispositifId",
        "libelleNiveauDiplome",
        "indicateurEtablissement"."valeurAjoutee" as "valeurAjoutee",
        SUM("indicateurEntree"."effectifEntree") as effectif,
        SUM("indicateurEntree"."capacite") as capacite,
        SUM("indicateurSortie"."nbSortants") as "nbSortants",
        (100* SUM("indicateurEntree"."effectifEntree") / SUM("indicateurEntree"."capacite")) as "tauxRemplissage",
        (100 * SUM("indicateurSortie"."nbPoursuiteEtudes") / SUM("indicateurSortie"."effectifSortie")) as "tauxPoursuiteEtudes"
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
    LEFT JOIN "indicateurEtablissement"
        ON "indicateurEtablissement"."UAI" = "etablissement"."UAI" 
        AND "indicateurEtablissement"."millesime" = ${db.param(millesimeSortie)}
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
        AND ${uai ? db.sql`"etablissement"."UAI" IN (${db.vals(uai)})` : {}}
        AND ${
          secteur
            ? db.sql`"etablissement"."secteur" IN (${db.vals(secteur)})`
            : {}
        }
        AND "codeFormationDiplome" NOT IN (SELECT DISTINCT "ancienCFD" FROM "formationHistorique")
    GROUP BY
        "formation"."id",
        "etablissement"."id",
        "libelleOfficielFamille",
        "indicateurEntree"."millesimeEntree",
        "indicateurSortie"."millesimeSortie",
        "dispositifId",
        "libelleDispositif",
        "libelleOfficielFamille",
        "libelleNiveauDiplome",
        "indicateurEtablissement"."UAI",
        "indicateurEtablissement"."millesime"
    ${
      orderBy
        ? db.sql`ORDER BY ${db.cols({ [orderBy.column]: true })} ${
            orderBy.order === "asc"
              ? db.sql`ASC NULLS LAST,`
              : db.sql`DESC NULLS LAST,`
          }`
        : db.sql`ORDER BY`
    }
    "etablissement"."libelleEtablissement" ASC,
    "formation"."libelleDiplome" ASC,
    "libelleNiveauDiplome" asc,
    "effectif" DESC,
    "nbSortants" DESC

    OFFSET ${db.param(offset)}
    LIMIT ${db.param(limit)};
`;

  const data = await query.run(pool);

  return {
    count: data[0]?.count ?? 0,
    etablissements: data.map(cleanNull),
  };
};

const findFiltersInDb = async ({
  codeRegion,
  codeAcademie,
  codeDepartement,
  commune,
  cfdFamille,
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
      ...(codeAcademie && {
        codeAcademie: db.sql`"academie"."codeAcademie" IN (${db.vals(
          codeAcademie
        )})`,
      }),
      ...(codeDepartement && {
        codeDepartement: db.sql`"departement"."codeDepartement" IN (${db.vals(
          codeDepartement
        )})`,
      }),
      ...(commune && {
        commune: db.sql`"etablissement"."commune" IN (${db.vals(commune)})`,
      }),
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
      ...(codeRegion && {
        codeRegion: db.sql`"region"."codeRegion" IN (${db.vals(codeRegion)})`,
      }),
      ...(codeDepartement && {
        codeDepartement: db.sql`"departement"."codeDepartement" IN (${db.vals(
          codeDepartement
        )})`,
      }),
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
      ...(codeAcademie && {
        codeAcademie: db.sql`"academie"."codeAcademie" IN (${db.vals(
          codeAcademie
        )})`,
      }),
      ...(commune && {
        commune: db.sql`"etablissement"."commune" IN (${db.vals(commune)})`,
      }),
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
      ...(codeRegion && {
        codeRegion: db.sql`"region"."codeRegion" IN (${db.vals(codeRegion)})`,
      }),
      ...(codeAcademie && {
        codeAcademie: db.sql`"academie"."codeAcademie" IN (${db.vals(
          codeAcademie
        )})`,
      }),
      ...(codeDepartement && {
        codeDepartement: db.sql`"departement"."codeDepartement" IN (${db.vals(
          codeDepartement
        )})`,
      }),
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
      ...(codeRegion && {
        codeRegion: db.sql`"region"."codeRegion" IN (${db.vals(codeRegion)})`,
      }),
      ...(codeAcademie && {
        codeAcademie: db.sql`"academie"."codeAcademie" IN (${db.vals(
          codeAcademie
        )})`,
      }),
      ...(codeDepartement && {
        codeDepartement: db.sql`"departement"."codeDepartement" IN (${db.vals(
          codeDepartement
        )})`,
      }),
    }}
    ORDER BY "niveauDiplome"."libelleNiveauDiplome" ASC`.run(pool);

  const dispositifs = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "dispositif"."libelleDispositif" as label, "dispositif"."codeDispositif" as value
    ${from}
    AND ${{
      codeDispositif: db.sql`"dispositif"."codeDispositif" IS NOT NULL`,
      ...(codeDepartement && {
        codeDepartement: db.sql`"departement"."codeDepartement" IN (${db.vals(
          codeDepartement
        )})`,
      }),
    }}
    ORDER BY "dispositif"."libelleDispositif" ASC`.run(pool);

  const familles = db.sql<
    SQL,
    {
      label: string;
      value: string;
    }[]
  >`SELECT DISTINCT "familleMetier"."libelleOfficielFamille" as label, "familleMetier"."cfdFamille" as "value"
    ${from}
    AND ${{ cfdFamille: db.sql`"familleMetier"."cfdFamille" IS NOT NULL` }}
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
    ...(cfdFamille && {
      cfdFamille: db.sql`"familleMetier"."cfdFamille" IN (${db.vals(
        cfdFamille
      )})`,
    }),
  }}
  ORDER BY "formation"."libelleDiplome" ASC`.run(pool);

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
    ...(codeRegion && {
      codeRegion: db.sql`"region"."codeRegion" IN (${db.vals(codeRegion)})`,
    }),
    ...(codeAcademie && {
      codeAcademie: db.sql`"academie"."codeAcademie" IN (${db.vals(
        codeAcademie
      )})`,
    }),
    ...(codeDepartement && {
      codeDepartement: db.sql`"departement"."codeDepartement" IN (${db.vals(
        codeDepartement
      )})`,
    }),
    ...(commune && {
      commune: db.sql`"etablissement"."commune" IN (${db.vals(commune)})`,
    }),
  }}
  AND ${{ UAI: db.sql`"etablissement"."UAI" IS NOT NULL` }}
  ORDER BY "etablissement"."libelleEtablissement" ASC`.run(pool);

  return await {
    regions: (await regions).map(cleanNull),
    departements: (await departements).map(cleanNull),
    academies: (await academies).map(cleanNull),
    communes: (await communes).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
    dispositifs: (await dispositifs).map(cleanNull),
    familles: (await familles).map(cleanNull),
    formations: (await formations).map(cleanNull),
    etablissements: (await etablissements).map(cleanNull),
  };
};

export const dependencies = {
  findEtablissementsInDb,
  findFiltersInDb,
};
