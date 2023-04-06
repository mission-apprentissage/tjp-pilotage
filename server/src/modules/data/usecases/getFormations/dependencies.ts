import { SQL } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { schema } from "../../../../db/zapatos.schema";
import { formatFormation } from "../../adapters/formatFormation";
import { Formation } from "../../entities/Formation";

const requestFormations = async ({ offset = 0, limit = 20 } = {}): Promise<
  (Formation & {
    dispositifId: string;
    nbEtablissement: number;
    effectif: number;
  })[]
> => {
  const data = await db.sql<
    SQL,
    (schema.formation.JSONSelectable & {
      dispositifId: string;
      nbEtablissement: number;
      effectif: number;
    })[]
  >`
SELECT "formation".*, fe."dispositifId", COUNT(formation.*) as "nbEtablissement", SUM(ie."effectifEntree") as effectif
FROM "formation"
LEFT JOIN "formationEtablissement" fe
    ON "fe"."cfd" = "formation"."codeFormationDiplome"
LEFT JOIN "indicateurEntree" ie
    ON "ie"."formationEtablissementId" = "fe"."id" AND ie."millesimeEntree" = '2022'
GROUP BY formation.id, fe."dispositifId", ie."millesimeEntree"
ORDER BY "formation"."codeFormationDiplome" ASC
OFFSET ${db.param(offset)}
LIMIT ${db.param(limit)};
`.run(pool);

  return data.map((item) => ({
    ...formatFormation(item),
    dispositifId: item.dispositifId,
    nbEtablissement: item.nbEtablissement,
    effectif: item.effectif,
  }));
};

export const dependencies = { requestFormations };
