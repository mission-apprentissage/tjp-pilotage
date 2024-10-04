import { Insertable } from "kysely";

import { kdb } from "../../../../../db/db";
import { DB } from "../../../../../db/schema";

export const insertPositionFormationRegionaleQuadrant = async (
  positionQuadrant: Insertable<DB["positionFormationRegionaleQuadrant"]>
) => {
  return kdb
    .insertInto("positionFormationRegionaleQuadrant")
    .values(positionQuadrant)
    .onConflict((cb) =>
      cb
        .columns([
          "codeRegion",
          "cfd",
          "millesimeSortie",
          "codeNiveauDiplome",
          "codeDispositif",
        ])
        .doUpdateSet(positionQuadrant)
    )
    .execute();
};
