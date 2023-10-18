import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

const seuil = 20;

export const selectDenominateurDevenirFavorable = (
  indicateurSortieAlias: string
) => sql<number>`
    case when
    ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes" is not null
    and ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" is not null
    then ${sql.table(indicateurSortieAlias)}."effectifSortie"
    end`;

export const selectTauxDevenirFavorable = (
  indicateurSortieAlias: string
) => sql<number>`
    case when
    ${selectDenominateurDevenirFavorable(indicateurSortieAlias)} >= ${seuil}
    then (100 *
      (${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes"
      + ${sql.table(indicateurSortieAlias)}."nbInsertion6mois")
    / ${selectDenominateurDevenirFavorable(indicateurSortieAlias)})
    end`;

export const selectDenominateurDevenirFavorableAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    SUM(
      case when ${sql.table(
        indicateurSortieAlias
      )}."nbPoursuiteEtudes" is not null
      and ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" is not null
      then ${sql.table(indicateurSortieAlias)}."effectifSortie"
      end
    )`;

export const selectTauxDevenirFavorableAgg = (
  indicateurSortieAlias: string
) => sql<number>`
      case when
      ${selectDenominateurDevenirFavorableAgg(
        indicateurSortieAlias
      )} >= ${seuil}
      then (100 * (SUM(${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes")
      + SUM(${sql.table(indicateurSortieAlias)}."nbInsertion6mois"))
      / ${selectDenominateurDevenirFavorableAgg(indicateurSortieAlias)})
      end
    `;

export function withDevenirFavorableReg({
  eb,
  millesimeSortie,
}: {
  eb: ExpressionBuilder<DB, "formationEtablissement" | "etablissement">;
  millesimeSortie: string;
}) {
  return eb
    .selectFrom("indicateurRegionSortie as subIRS")
    .whereRef("subIRS.cfd", "=", "formationEtablissement.cfd")
    .whereRef("subIRS.dispositifId", "=", "formationEtablissement.dispositifId")
    .where("subIRS.millesimeSortie", "=", millesimeSortie)
    .whereRef(
      "subIRS.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref("etablissement.codeRegion")}))`
    )
    .select([selectTauxDevenirFavorableAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.dispositifId"]);
}
