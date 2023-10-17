import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

const seuil = 20;

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
    ${selectDenominateurPoursuiteAgg(indicateurSortieAlias)} >= ${seuil}
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
    ${selectDenominateurPoursuite(indicateurSortieAlias)} >= ${seuil}
    then (100 * ${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes"
    / ${selectDenominateurPoursuite(indicateurSortieAlias)})
    end
  `;

export function withPoursuiteReg({
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
    .select([selectTauxPoursuiteAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.dispositifId"]);
}
