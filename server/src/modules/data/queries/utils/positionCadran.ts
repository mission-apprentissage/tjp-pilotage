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

export const getPositionCadran = (
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
      WHEN (${tauxInsertion} >= ${tauxInsertionReg} AND ${tauxPoursuite} > ${tauxPoursuiteReg}) THEN 'Q1'
      WHEN (${tauxInsertion} >= ${tauxInsertionReg} AND ${tauxPoursuite} < ${tauxPoursuiteReg}) THEN 'Q2'
      WHEN (${tauxInsertion} < ${tauxInsertionReg} AND ${tauxPoursuite} >= ${tauxPoursuiteReg}) THEN 'Q3'
      WHEN (${tauxInsertion} < ${tauxInsertionReg} AND ${tauxPoursuite} < ${tauxPoursuiteReg}) THEN 'Q4'
      ELSE 'Hors cadran'
    END
  `;
};

type EbRef<EB extends ExpressionBuilder<DB, never>> = Parameters<EB["ref"]>[0];

export function withPositionCadran<EB extends ExpressionBuilder<DB, never>>({
  eb,
  cfdRef,
  dispositifIdRef,
  codeRegionRef,
  millesimeSortie,
  codeNiveauDiplomeRef,
}: {
  eb: EB;
  cfdRef: EbRef<EB>;
  dispositifIdRef: EbRef<EB>;
  codeRegionRef: EbRef<EB>;
  millesimeSortie: string;
  codeNiveauDiplomeRef?: EbRef<EB>;
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
    .innerJoin(
      "formation",
      "formation.codeFormationDiplome",
      "indicateurRegionSortie.cfd"
    )
    .$call((eb) => {
      if (codeNiveauDiplomeRef)
        return eb.whereRef(
          "formation.codeNiveauDiplome",
          "=",
          codeNiveauDiplomeRef
        );
      return eb;
    })
    .select([
      sql<string>`
      CASE
        WHEN (${tauxInsertionReg} >= ${selectTauxInsertion6moisAgg(
          "indicateurRegionSortie"
        )}
        AND ${tauxPoursuiteReg} > ${selectTauxPoursuiteAgg(
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
        ELSE 'Hors cadran'
      END`.as("positionCadran"),
    ]);
}
