import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

const seuil = 20;

export const selectDenominateurInsertion6mois = (
  indicateurSortieAlias: string
) => sql<number>`
case when 
${sql.table(indicateurSortieAlias)}."nbInsertion6mois" is not null 
then ${sql.table(indicateurSortieAlias)}."nbSortants" 
end`;

export const selectTauxInsertion6mois = (
  indicateurSortieAlias: string
) => sql<number>`
    case when 
    ${selectDenominateurInsertion6mois(indicateurSortieAlias)} >= ${seuil}
    then (100 * ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" 
    / ${selectDenominateurInsertion6mois(indicateurSortieAlias)})
    end
  `;

export const selectDenominateurInsertion6moisAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    SUM(
      case when 
      ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" is not null 
      then ${sql.table(indicateurSortieAlias)}."nbSortants" 
      end
    )`;

export const selectTauxInsertion6moisAgg = (
  indicateurSortieAlias: string
) => sql<number>`
      case when 
      ${selectDenominateurInsertion6moisAgg(indicateurSortieAlias)} >= ${seuil}
      then (100 * SUM(${sql.table(indicateurSortieAlias)}."nbInsertion6mois") 
      / ${selectDenominateurInsertion6moisAgg(indicateurSortieAlias)})
      end
    `;

export function withInsertionRedg({
  eb,
  millesimeSortie,
  codeRegion,
}: {
  eb: ExpressionBuilder<
    DB,
    "formationEtablissement" | "etablissement" | "indicateurEntree"
  >;
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
    .innerJoin("indicateurEntree as subIE", (join) =>
      join
        .onRef("subFE.id", "=", "subIE.formationEtablissementId")
        .onRef("subIE.rentreeScolaire", "=", "indicateurEntree.rentreeScolaire")
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
    .select([selectTauxInsertion6moisAgg("subIS").as("s")])
    .groupBy(["cfd", "dispositifId"]);
}

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
    .selectFrom("indicateurRegionSortie as subIRS")
    .whereRef("subIRS.cfd", "=", "formationEtablissement.cfd")
    .whereRef("subIRS.dispositifId", "=", "formationEtablissement.dispositifId")
    .where("subIRS.millesimeSortie", "=", millesimeSortie)
    .$call((q) => {
      if (!codeRegion) return q;
      if (codeRegion === "ref") {
        return q.whereRef("subIRS.codeRegion", "=", "etablissement.codeRegion");
      }
      return q.where("subIRS.codeRegion", "=", codeRegion);
    })
    .select([selectTauxInsertion6moisAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.dispositifId"]);
}
