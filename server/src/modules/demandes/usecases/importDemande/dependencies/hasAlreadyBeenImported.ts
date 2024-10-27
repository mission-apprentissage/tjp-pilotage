// @ts-nocheck -- TODO

import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import { isDemandeCampagneEnCours } from "@/modules/utils/isDemandeCampagneEnCours";

export const hasAlreadyBeenImported = async ({ numero }: { numero: string }) =>
  getKbdClient()
    .selectFrom(({ selectFrom }) =>
      selectFrom("latestDemandeView as demande")
        .where(isDemandeCampagneEnCours)
        .where("numeroHistorique", "=", numero)
        .selectAll()
        .as("lastestDemandes")
    )
    .selectAll()
    .where("lastestDemandes.statut", "<>", DemandeStatutEnum["supprimée"])
    .executeTakeFirst();
