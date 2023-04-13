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
  cfd,
  orderBy,
}: {
  offset?: number;
  limit?: number;
  millesimeEntree?: string;
  millesimeSortie?: string;
  codeRegion?: string;
  cfd?: string;
  orderBy?: { column: string; order: "asc" | "desc" };
} = {}): Promise<{
  count: number;
  formations: (Formation & {
    libelleDispositif: string;
    libelleNiveauDiplome: string;
    nbEtablissement: number;
    effectif: number;
    nbInsertion6mois: number;
    nbSortants: number;
    nbPoursuiteEtudes: number;
    effectifSortie: number;
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
      nbInsertion6mois: number;
      nbSortants: number;
      nbPoursuiteEtudes: number;
      effectifSortie: number;
    })[]
  >`
    SELECT
        COUNT(*) OVER() as count,
        "formation".*, 
        "libelleOfficielFamille",
        "libelleDispositif",
        "libelleNiveauDiplome",
        COUNT(etablissement.*) as "nbEtablissement", 
        SUM("indicateurEntree"."effectifEntree") as effectif,
        SUM("indicateurSortie"."nbInsertion6mois") as "nbInsertion6mois",
        SUM("indicateurSortie"."nbPoursuiteEtudes") as "nbPoursuiteEtudes",
        SUM("indicateurSortie"."nbSortants") as "nbSortants",
        SUM("indicateurSortie"."effectifSortie") as "effectifSortie"
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
    WHERE ${codeRegion ? { codeRegion } : {}}
        AND ${cfd ? { codeFormationDiplome: cfd } : {}} 
        and "codeFormationDiplome" NOT IN (SELECT DISTINCT "ancienCFD" FROM "formationHistorique")
    GROUP BY
        "formation".id,
        "libelleOfficielFamille",
        "indicateurEntree"."millesimeEntree",
        "libelleDispositif",
        "libelleOfficielFamille",
        "libelleNiveauDiplome"
    ${
      orderBy
        ? db.sql`ORDER BY ${db.cols({ [orderBy.column]: true })} ${
            orderBy.order === "asc"
              ? db.sql`ASC NULLS FIRST`
              : db.sql`DESC NULLS LAST`
          }`
        : db.sql`ORDER BY formation."libelleDiplome" ASC`
    },
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
    formations: data.map((item) => ({
      ...cleanNull(item),
      // dateOuverture: item.dateOuverture.toISOString() ?? undefined,
      // dateFermeture: item.dateFermeture?.toISOString() ?? undefined,
    })),
  };
};

export const dependencies = { findFormationsInDb };
