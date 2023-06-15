import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

export const selectDenominateurInsertion12mois = (
  indicateurSortieAlias: string
) => sql<number>`
case when 
${sql.table(indicateurSortieAlias)}."nbInsertion12mois" is not null 
then ${sql.table(indicateurSortieAlias)}."nbSortants" 
end`;

export const selectTauxInsertion12mois = (
  indicateurSortieAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurInsertion12mois(indicateurSortieAlias)} >= 20
    then (100 * ${sql.table(indicateurSortieAlias)}."nbInsertion12mois" 
    / ${selectDenominateurInsertion12mois(indicateurSortieAlias)})
    end
  `;

export const selectDenominateurInsertion12moisAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    SUM(
      case when 
      ${sql.table(indicateurSortieAlias)}."nbInsertion12mois" is not null 
      then ${sql.table(indicateurSortieAlias)}."nbSortants" 
      end
    )`;

export const selectTauxInsertion12moisAgg = (
  indicateurSortieAlias: string
) => sql<number>`
      case when 
      ${selectDenominateurInsertion12moisAgg(indicateurSortieAlias)} >= 20
      then (100 * SUM(${sql.table(indicateurSortieAlias)}."nbInsertion12mois") 
      / ${selectDenominateurInsertion12moisAgg(indicateurSortieAlias)})
      end
    `;

export function withInsertionReg({
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
    .select([selectTauxInsertion12moisAgg("subIS").as("s")])
    .groupBy(["cfd", "dispositifId"]);
}
