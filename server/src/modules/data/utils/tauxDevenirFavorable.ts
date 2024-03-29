import { ExpressionBuilder, expressionBuilder, sql } from "kysely";

import { DB } from "../../../db/db";

const seuil = 20;

export const selectDenominateurDevenirFavorable = (
  indicateurSortieAlias: string
) => sql<number>`
    CASE WHEN ${sql.table(
      indicateurSortieAlias
    )}."nbPoursuiteEtudes" IS NOT NULL
    AND ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" IS NOT NULL
    THEN ${sql.table(indicateurSortieAlias)}."effectifSortie"::FLOAT
    END`;

export const selectTauxDevenirFavorable = (
  indicateurSortieAlias: string
) => sql<number>`
    CASE WHEN ${selectDenominateurDevenirFavorable(
      indicateurSortieAlias
    )} >= ${seuil}
    THEN ROUND(((${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes"
      + ${sql.table(indicateurSortieAlias)}."nbInsertion6mois")
    / ${selectDenominateurDevenirFavorable(indicateurSortieAlias)})::NUMERIC,2)
    END`;

export const selectDenominateurDevenirFavorableAgg = (
  indicateurSortieAlias: string
) => sql<number>`
    SUM(
      CASE WHEN ${sql.table(
        indicateurSortieAlias
      )}."nbPoursuiteEtudes" IS NOT NULL
      AND ${sql.table(indicateurSortieAlias)}."nbInsertion6mois" IS NOT NULL
      THEN ${sql.table(indicateurSortieAlias)}."effectifSortie"
      END
    )::FLOAT`;

export const selectTauxDevenirFavorableAgg = (
  indicateurSortieAlias: string
) => sql<number>`
      CASE WHEN ${selectDenominateurDevenirFavorableAgg(
        indicateurSortieAlias
      )} >= ${seuil}
      THEN ROUND((
        (SUM(${sql.table(indicateurSortieAlias)}."nbPoursuiteEtudes")
        + SUM(${sql.table(indicateurSortieAlias)}."nbInsertion6mois"))
      / ${selectDenominateurDevenirFavorableAgg(
        indicateurSortieAlias
      )})::NUMERIC,2)
      END
    `;

export function withTauxDevenirFavorableReg<
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
    .select([selectTauxDevenirFavorableAgg("subIRS").as("sa")])
    .groupBy(["subIRS.cfd", "subIRS.dispositifId"]);
}
