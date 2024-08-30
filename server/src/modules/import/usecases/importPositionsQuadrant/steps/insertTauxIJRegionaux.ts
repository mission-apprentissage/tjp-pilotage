import { Insertable } from "kysely";

import { kdb } from "../../../../../db/db";
import { DB } from "../../../../../db/schema";

export const insertTauxIJRegionaux = async (
  tauxIJ: Insertable<DB["tauxIJNiveauDiplomeRegion"]>
) => {
  return kdb
    .insertInto("tauxIJNiveauDiplomeRegion")
    .values(tauxIJ)
    .onConflict((cb) =>
      cb
        .columns(["codeRegion", "codeNiveauDiplome", "millesimeSortie"])
        .doUpdateSet(tauxIJ)
    )
    .execute();
};
