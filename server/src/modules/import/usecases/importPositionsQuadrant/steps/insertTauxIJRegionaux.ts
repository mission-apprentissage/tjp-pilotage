import type { Insertable } from "kysely";

import { getKbdClient } from "@/db/db";
import type { DB } from "@/db/schema";

export const insertTauxIJRegionaux = async (tauxIJ: Insertable<DB["tauxIJNiveauDiplomeRegion"]>) => {
  return getKbdClient()
    .insertInto("tauxIJNiveauDiplomeRegion")
    .values(tauxIJ)
    .onConflict((cb) => cb.columns(["codeRegion", "codeNiveauDiplome", "millesimeSortie"]).doUpdateSet(tauxIJ))
    .execute();
};
