import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

export const selectDenominateurPoursuiteAgg = (
  indicateurSortieAlias: string
) => sql<number>`
  SUM(
    case when 
    ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes" is not null 
    then ${sql.table(indicateurSortieAlias)}."effectifSortie" 
    end
  )`;

export const selectTauxPoursuiteAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurPoursuiteAgg(indicateurSortieAlias)} >= 20
    then (100 * SUM(${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes") 
    / ${selectDenominateurPoursuiteAgg(indicateurSortieAlias)})
    end
  `;

export const selectDenominateurPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
  case when 
  ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes" is not null 
  then ${sql.table(indicateurSortieAlias)}."effectifSortie" 
  end`;

export const selectTauxPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurPoursuite(indicateurSortieAlias)} >= 20
    then (100 * ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes" 
    / ${selectDenominateurPoursuite(indicateurSortieAlias)})
    end
  `;

export function withPoursuiteReg({
  eb,
  millesimeSortie,
  codeRegion,
}: {
  eb: ExpressionBuilder<DB, "formationEtablissement" | "etablissement">;
  millesimeSortie: string;
  codeRegion?: string | "ref";
}) {
  return eb
    .selectFrom("formationEtablissement as subFE")
    .innerJoin("indicateurSortie as subIS", (join) =>
      join
        .onRef("subFE.id", "=", "subIS.formationEtablissementId")
        .on("subIS.millesimeSortie", "=", millesimeSortie)
    )
    .innerJoin("etablissement as subEtab", "subEtab.UAI", "subFE.UAI")
    .whereRef("subFE.cfd", "=", "formationEtablissement.cfd")
    .whereRef("subFE.dispositifId", "=", "formationEtablissement.dispositifId")
    .$call((q) => {
      if (!codeRegion) return q;
      if (codeRegion === "ref") {
        return q.whereRef(
          "subEtab.codeRegion",
          "=",
          "etablissement.codeRegion"
        );
      }
      return q.where("subEtab.codeRegion", "=", codeRegion);
    })
    .select([selectTauxPoursuiteAgg("subIS").as("sa")])
    .groupBy(["cfd", "dispositifId"]);
}
