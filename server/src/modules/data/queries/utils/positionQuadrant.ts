import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";
import { notHistoriqueIndicateurRegionSortie } from "./notHistorique";
import {
  selectTauxInsertion6mois,
  selectTauxInsertion6moisAgg,
  withInsertionReg,
} from "./tauxInsertion6mois";
import {
  selectTauxPoursuite,
  selectTauxPoursuiteAgg,
  withPoursuiteReg,
} from "./tauxPoursuite";

export const getPositionQuadrant = (
  indicateurRegionSortieAlias: string,
  indicateurRegionSortieRegAlias: string
) => {
  const tauxPoursuite = sql<number>`${selectTauxPoursuite(
    indicateurRegionSortieAlias
  )}`;
  const tauxInsertion = sql<number>`${selectTauxInsertion6mois(
    indicateurRegionSortieAlias
  )}`;
  const tauxPoursuiteReg = sql<number>`${selectTauxPoursuiteAgg(
    indicateurRegionSortieRegAlias
  )}`;
  const tauxInsertionReg = sql<number>`${selectTauxInsertion6moisAgg(
    indicateurRegionSortieRegAlias
  )}`;

  return sql<string>`
    CASE
      WHEN (${tauxInsertion} >= ${tauxInsertionReg} AND ${tauxPoursuite} >= ${tauxPoursuiteReg}) THEN 'Q1'
      WHEN (${tauxInsertion} >= ${tauxInsertionReg} AND ${tauxPoursuite} < ${tauxPoursuiteReg}) THEN 'Q2'
      WHEN (${tauxInsertion} < ${tauxInsertionReg} AND ${tauxPoursuite} >= ${tauxPoursuiteReg}) THEN 'Q3'
      WHEN (${tauxInsertion} < ${tauxInsertionReg} AND ${tauxPoursuite} < ${tauxPoursuiteReg}) THEN 'Q4'
      ELSE 'Hors quadrant'
    END
  `;
};

type EbRef<EB extends ExpressionBuilder<DB, never>> = Parameters<EB["ref"]>[0];

export function withPositionQuadrant<EB extends ExpressionBuilder<DB, never>>({
  eb,
  cfdRef,
  dispositifIdRef,
  codeRegionRef,
  millesimeSortie,
  codesNiveauxDiplomes,
}: {
  eb: EB;
  cfdRef: EbRef<EB>;
  dispositifIdRef: EbRef<EB>;
  codeRegionRef: EbRef<EB>;
  millesimeSortie: string;
  codesNiveauxDiplomes?: string[];
}) {
  const tauxInsertionReg = withInsertionReg({
    eb,
    cfdRef,
    dispositifIdRef,
    codeRegionRef,
    millesimeSortie,
  });

  const tauxPoursuiteReg = withPoursuiteReg({
    eb,
    cfdRef,
    dispositifIdRef,
    codeRegionRef,
    millesimeSortie,
  });

  return eb
    .selectFrom("indicateurRegionSortie")
    .whereRef(
      "indicateurRegionSortie.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
    )
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .$call((eb) => {
      if (codesNiveauxDiplomes)
        return eb
          .innerJoin(
            "formation",
            "formation.codeFormationDiplome",
            "indicateurRegionSortie.cfd"
          )
          .where("formation.codeNiveauDiplome", "in", codesNiveauxDiplomes);
      return eb;
    })
    .select([
      sql<string>`
      CASE
        WHEN (${tauxInsertionReg} >= ${selectTauxInsertion6moisAgg(
          "indicateurRegionSortie"
        )}
        AND ${tauxPoursuiteReg} >= ${selectTauxPoursuiteAgg(
          "indicateurRegionSortie"
        )})
        THEN 'Q1'
        WHEN (${tauxInsertionReg} >= ${selectTauxInsertion6moisAgg(
          "indicateurRegionSortie"
        )}
        AND ${tauxPoursuiteReg} < ${selectTauxPoursuiteAgg(
          "indicateurRegionSortie"
        )})
        THEN 'Q2'
        WHEN (${tauxInsertionReg} < ${selectTauxInsertion6moisAgg(
          "indicateurRegionSortie"
        )}
        AND ${tauxPoursuiteReg} >= ${selectTauxPoursuiteAgg(
          "indicateurRegionSortie"
        )})
        THEN 'Q3'
        WHEN (${tauxInsertionReg} < ${selectTauxInsertion6moisAgg(
          "indicateurRegionSortie"
        )}
        AND ${tauxPoursuiteReg} < ${selectTauxPoursuiteAgg(
          "indicateurRegionSortie"
        )})
        THEN 'Q4'
        ELSE 'Hors quadrant'
      END`.as("positionQuadrant"),
    ]);
}
