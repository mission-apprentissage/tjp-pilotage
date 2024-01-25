const PREMIERE_COMMUNE = "1ere_commune";
const SECONDE_COMMUNE = "2nde_commune";

const Q1 = "Q1";
const Q2 = "Q2";
const Q3 = "Q3";
const Q4 = "Q4";
const HORS_QUADRANT = "Hors quadrant";
const UNDEFINED_QUADRANT = "-";

export const getPositionQuadrant = (
  formation: {
    tauxInsertion?: number;
    tauxPoursuite?: number;
    typeFamille?: string;
  },
  moyenne?: {
    tauxInsertion?: number;
    tauxPoursuite?: number;
  }
): string => {
  if (
    formation.typeFamille === PREMIERE_COMMUNE ||
    formation.typeFamille === SECONDE_COMMUNE
  )
    return UNDEFINED_QUADRANT;

  if (
    formation.tauxInsertion === undefined ||
    formation.tauxPoursuite === undefined ||
    moyenne?.tauxInsertion === undefined ||
    moyenne?.tauxPoursuite === undefined
  )
    return HORS_QUADRANT;

  const tauxInsertion = formation.tauxInsertion;
  const tauxPoursuite = formation.tauxPoursuite;
  const tauxInsertionMoyen = moyenne.tauxInsertion;
  const tauxPoursuiteMoyen = moyenne.tauxPoursuite;

  if (
    tauxInsertion >= tauxInsertionMoyen &&
    tauxPoursuite >= tauxPoursuiteMoyen
  ) {
    return Q1;
  } else if (
    tauxInsertion >= tauxInsertionMoyen &&
    tauxPoursuite < tauxPoursuiteMoyen
  ) {
    return Q2;
  } else if (
    tauxInsertion < tauxInsertionMoyen &&
    tauxPoursuite >= tauxPoursuiteMoyen
  ) {
    return Q3;
  } else if (
    tauxInsertion < tauxInsertionMoyen &&
    tauxPoursuite < tauxPoursuiteMoyen
  ) {
    return Q4;
  } else return HORS_QUADRANT;
};

export const filterPositionQuadrant = (
  formations: { positionQuadrant: string }[],
  positionQuadrantFilter?: string
) => {
  if (!positionQuadrantFilter || positionQuadrantFilter === "all")
    return formations;
  return formations.filter(
    (formation) => formation.positionQuadrant === positionQuadrantFilter
  );
};

export const orderPositionQuadrant = (
  formations: { positionQuadrant: string }[],
  orderBy?: { column: string; order: "asc" | "desc" }
) => {
  if (orderBy && orderBy.column === "positionQuadrant")
    return formations.sort((a, b) =>
      orderBy.order === "asc"
        ? a.positionQuadrant.localeCompare(b.positionQuadrant)
        : b.positionQuadrant.localeCompare(a.positionQuadrant)
    );
  return formations;
};

export const filterOrderPositionQuadrant = (
  formations: { positionQuadrant: string }[],
  positionQuadrantFilter?: string,
  orderBy?: { column: string; order: "asc" | "desc" }
) => {
  return orderPositionQuadrant(
    filterPositionQuadrant(formations, positionQuadrantFilter),
    orderBy
  );
};
