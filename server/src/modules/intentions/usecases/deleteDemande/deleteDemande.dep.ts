import { Insertable } from "kysely";

import { Demande } from "../../../../db/schema";
import { updateDemandeWithHistory } from "../../repositories/updateDemandeWithHistory.query";

export const deleteDemandeQuery = async (demande?: Insertable<Demande>) => {
  if (demande) updateDemandeWithHistory({ ...demande, statut: "deleted" });
};
