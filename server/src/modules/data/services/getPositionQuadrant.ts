import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

const PREMIERE_COMMUNE = "1ere_commune";
const SECONDE_COMMUNE = "2nde_commune";

export const UNDEFINED_QUADRANT = "-";

export const getPositionQuadrant = (
  formation: {
    tauxInsertion?: number;
    tauxPoursuite?: number;
    typeFamille?: string;
  },
  moyenne?: {
    tauxInsertion?: number;
    tauxPoursuite?: number;
  },
): string => {
  if (formation.typeFamille === PREMIERE_COMMUNE || formation.typeFamille === SECONDE_COMMUNE)
    return UNDEFINED_QUADRANT;

  if (
    formation.tauxInsertion === undefined ||
    formation.tauxPoursuite === undefined ||
    moyenne?.tauxInsertion === undefined ||
    moyenne?.tauxPoursuite === undefined
  )
    return PositionQuadrantEnum["Hors quadrant"];

  const tauxInsertion = formation.tauxInsertion;
  const tauxPoursuite = formation.tauxPoursuite;
  const tauxInsertionMoyen = moyenne.tauxInsertion;
  const tauxPoursuiteMoyen = moyenne.tauxPoursuite;

  if (tauxInsertion >= tauxInsertionMoyen && tauxPoursuite >= tauxPoursuiteMoyen) {
    return PositionQuadrantEnum.Q1;
  } else if (tauxInsertion >= tauxInsertionMoyen && tauxPoursuite < tauxPoursuiteMoyen) {
    return PositionQuadrantEnum.Q2;
  } else if (tauxInsertion < tauxInsertionMoyen && tauxPoursuite >= tauxPoursuiteMoyen) {
    return PositionQuadrantEnum.Q3;
  } else if (tauxInsertion < tauxInsertionMoyen && tauxPoursuite < tauxPoursuiteMoyen) {
    return PositionQuadrantEnum.Q4;
  } else return PositionQuadrantEnum["Hors quadrant"];
};

export const filterPositionQuadrant = (formations: { positionQuadrant: string }[], positionQuadrantFilter?: string) => {
  if (!positionQuadrantFilter || positionQuadrantFilter === "all") return formations;
  return formations.filter((formation) => formation.positionQuadrant === positionQuadrantFilter);
};

export const orderPositionQuadrant = (
  formations: { positionQuadrant: string }[],
  orderBy?: { column: string; order: "asc" | "desc" },
) => {
  if (orderBy && orderBy.column === "positionQuadrant")
    return formations.sort((a, b) =>
      orderBy.order === "asc"
        ? a.positionQuadrant.localeCompare(b.positionQuadrant)
        : b.positionQuadrant.localeCompare(a.positionQuadrant),
    );
  return formations;
};

export const filterOrderPositionQuadrant = (
  formations: { positionQuadrant: string }[],
  positionQuadrantFilter?: string,
  orderBy?: { column: string; order: "asc" | "desc" },
) => {
  return orderPositionQuadrant(filterPositionQuadrant(formations, positionQuadrantFilter), orderBy);
};
