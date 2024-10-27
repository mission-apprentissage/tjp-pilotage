import type { ExpressionBuilder } from "kysely";
import { expressionBuilder, sql } from "kysely";

import type { DB } from "@/db/db";

const seuil = 20;

export const selectDenominateurInsertion6mois = (indicateurSortieAlias: string) => sql<number>`
    CASE WHEN ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" IS NOT NULL
    THEN ${sql.table(indicateurSortieAlias)}."nbSortants"::FLOAT
    END`;

export const selectTauxInsertion6mois = (indicateurSortieAlias: string) => sql<number>`
    CASE WHEN ${selectDenominateurInsertion6mois(indicateurSortieAlias)} >= ${seuil}
    THEN (${sql.table(indicateurSortieAlias)}."nbInsertion6mois"::FLOAT
    / ${selectDenominateurInsertion6mois(indicateurSortieAlias)})::NUMERIC
    END`;

export const selectDenominateurInsertion6moisAgg = (indicateurSortieAlias: string) => sql<number>`
    SUM(
      CASE WHEN ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" IS NOT NULL
      THEN ${sql.table(indicateurSortieAlias)}."nbSortants"
      END
    )::FLOAT`;

export const selectNumerateurInsertion6MoisAgg = (indicateurSortieAlias: string) =>
  sql<number>`SUM(${sql.table(indicateurSortieAlias)}."nbInsertion6mois")`;

export const selectTauxInsertion6moisAgg = (indicateurSortieAlias: string) => sql<number>`
    CASE WHEN ${selectDenominateurInsertion6moisAgg(indicateurSortieAlias)} >= ${seuil}
    THEN (SUM(${sql.table(indicateurSortieAlias)}."nbInsertion6mois")
    / ${selectDenominateurInsertion6moisAgg(indicateurSortieAlias)})::NUMERIC
    END`;

export function withInsertionReg<
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
    .whereRef("subIRS.codeDispositif", "=", codeDispositifRef)
    .where("subIRS.millesimeSortie", "=", millesimeSortie)
    .where("subIRS.voie", "=", "scolaire")
    .whereRef("subIRS.codeRegion", "=", sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`)
    .select([selectTauxInsertion6moisAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.codeDispositif"]);
}
