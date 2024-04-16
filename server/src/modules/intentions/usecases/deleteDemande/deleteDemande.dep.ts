import { Insertable } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { Demande } from "../../../../db/schema";
import { updateDemandeWithHistory } from "../../repositories/updateDemandeWithHistory.query";

export const deleteDemandeQuery = async (demande?: Insertable<Demande>) => {
  if (demande)
    updateDemandeWithHistory({ ...demande, statut: DemandeStatutEnum.deleted });
};
