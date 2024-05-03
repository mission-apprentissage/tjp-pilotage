import { Insertable } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { Intention } from "../../../../db/schema";
import { updateIntentionWithHistory } from "../../repositories/updateIntentionWithHistory.query";

export const deleteIntentionQuery = async (
  intention?: Insertable<Intention>
) => {
  if (intention)
    updateIntentionWithHistory({
      ...intention,
      statut: DemandeStatutEnum.deleted,
    });
};
