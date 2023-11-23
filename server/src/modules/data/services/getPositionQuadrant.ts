export const getPositionQuadrant = (
  formation: {
    tauxInsertion?: string | number;
    tauxPoursuite?: string | number;
  },
  moyenne?: {
    tauxInsertion?: string | number;
    tauxPoursuite?: string | number;
  }
): string => {
  if (
    !formation.tauxInsertion ||
    !formation.tauxPoursuite ||
    !moyenne?.tauxInsertion ||
    !moyenne.tauxPoursuite
  )
    return "Hors quadrant";

  const tauxInsertion =
    typeof formation.tauxInsertion === "string"
      ? parseFloat(formation.tauxInsertion)
      : formation.tauxInsertion;
  const tauxPoursuite =
    typeof formation.tauxPoursuite === "string"
      ? parseFloat(formation.tauxPoursuite)
      : formation.tauxPoursuite;
  const tauxInsertionMoyen =
    typeof moyenne.tauxInsertion === "string"
      ? parseFloat(moyenne.tauxInsertion)
      : moyenne.tauxInsertion;
  const tauxPoursuiteMoyen =
    typeof moyenne.tauxPoursuite === "string"
      ? parseFloat(moyenne.tauxPoursuite)
      : moyenne.tauxPoursuite;

  if (
    tauxInsertion >= tauxInsertionMoyen &&
    tauxPoursuite >= tauxPoursuiteMoyen
  ) {
    return "Q1";
  } else if (
    tauxInsertion >= tauxInsertionMoyen &&
    tauxPoursuite < tauxPoursuiteMoyen
  ) {
    return "Q2";
  } else if (
    tauxInsertion < tauxInsertionMoyen &&
    tauxPoursuite >= tauxPoursuiteMoyen
  ) {
    return "Q3";
  } else if (
    tauxInsertion < tauxInsertionMoyen &&
    tauxPoursuite < tauxPoursuiteMoyen
  ) {
    return "Q4";
  } else return "Hors quadrant";
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
