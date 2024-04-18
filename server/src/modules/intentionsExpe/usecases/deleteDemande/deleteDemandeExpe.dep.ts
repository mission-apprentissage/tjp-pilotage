import { Insertable } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { DemandeExpe } from "../../../../db/schema";
import { updateDemandeExpeWithHistory } from "../../repositories/updateDemandeExpeWithHistory.query";

export const deleteDemandeExpeQuery = async (
  demandeExpe?: Insertable<DemandeExpe>
) => {
  if (demandeExpe)
    updateDemandeExpeWithHistory({
      ...demandeExpe,
      statut: DemandeStatutEnum.deleted,
    });
};
