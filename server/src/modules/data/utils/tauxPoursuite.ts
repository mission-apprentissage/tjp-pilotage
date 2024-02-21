import { ExpressionBuilder, expressionBuilder, sql } from "kysely";

import { DB } from "../../../db/db";

const seuil = 20;

export const selectDenominateurPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
    CASE WHEN ${sql.table(
      indicateurSortieAlias
    )}."nbPoursuiteEtudes" IS NOT NULL
    THEN ${sql.table(indicateurSortieAlias)}."effectifSortie"::FLOAT
    END`;

export const selectTauxPoursuite = (
  indicateurSortieAlias: string
) => sql<number>`
    CASE WHEN ${selectDenominateurPoursuite(indicateurSortieAlias)} >= ${seuil}
    THEN ROUND((${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes"::FLOAT
    / ${selectDenominateurPoursuite(indicateurSortieAlias)})::NUMERIC, 2)
    END`;

export const selectDenominateurPoursuiteAgg = (
  indicateurSortieAlias: string
) => sql<number>`
      SUM(
        CASE WHEN ${sql.table(
          indicateurSortieAlias
        )}."nbPoursuiteEtudes" IS NOT NULL
        THEN ${sql.table(indicateurSortieAlias)}."effectifSortie"
        END
      )::FLOAT`;

export const selectTauxPoursuiteAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    CASE WHEN ${selectDenominateurPoursuiteAgg(
      indicateurSortieAlias
    )} >= ${seuil}
    THEN ROUND((SUM(${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes")
      / ${selectDenominateurPoursuiteAgg(indicateurSortieAlias)})::NUMERIC, 2)
    END`;

export function withPoursuiteReg<
  EB extends
    | ExpressionBuilder<DB, "formationEtablissement" | "etablissement">
    | ExpressionBuilder<DB, "demande" | "dataEtablissement">,
>({
  millesimeSortie,
  cfdRef,
  codeDispositifRef,
  codeRegionRef,
}: {
  eb: EB;
  millesimeSortie: string;
  cfdRef: Parameters<EB["ref"]>[0];
  codeDispositifRef: Parameters<EB["ref"]>[0];
  codeRegionRef: Parameters<EB["ref"]>[0];
}) {
  const eb = expressionBuilder<DB, keyof DB>();
  return eb
    .selectFrom("indicateurRegionSortie as subIRS")
    .whereRef("subIRS.cfd", "=", cfdRef)
    .whereRef("subIRS.dispositifId", "=", codeDispositifRef)
    .where("subIRS.millesimeSortie", "=", millesimeSortie)
    .where("subIRS.voie", "=", "scolaire")
    .whereRef(
      "subIRS.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
    )
    .select([selectTauxPoursuiteAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.dispositifId"]);
}
