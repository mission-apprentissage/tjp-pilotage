import type { Insertable } from "kysely";

import { getKbdClient } from "@/db/db";
import type { DB } from "@/db/schema";

export const insertPositionFormationRegionaleQuadrant = async (
  positionQuadrant: Insertable<DB["positionFormationRegionaleQuadrant"]>,
) => {
  return getKbdClient()
    .insertInto("positionFormationRegionaleQuadrant")
    .values(positionQuadrant)
    .onConflict((cb) =>
      cb
        .columns(["codeRegion", "cfd", "millesimeSortie", "codeNiveauDiplome", "codeDispositif"])
        .doUpdateSet(positionQuadrant),
    )
    .execute();
};
