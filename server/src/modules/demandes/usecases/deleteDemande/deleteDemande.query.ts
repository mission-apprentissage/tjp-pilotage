import type { Insertable } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import type { Demande } from "@/db/schema";
import { updateDemandeWithHistory } from "@/modules/demandes/repositories/updateDemandeWithHistory.query";

export const deleteDemandeQuery = async ({
  demande,
  updatedBy,
}: {
  demande?: Insertable<Demande>;
  updatedBy: string;
}) => {
  if (demande)
    updateDemandeWithHistory({
      ...demande,
      statut: DemandeStatutEnum["supprimée"],
      updatedBy,
    });
};
