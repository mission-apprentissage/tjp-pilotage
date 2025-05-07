import type { Insertable } from "kysely";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const createChangementStatutQuery = async (changementStatut: Insertable<DB["changementStatut"]>) => {
  return await getKbdClient()
    .insertInto("changementStatut")
    .values({
      ...changementStatut,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .onConflict((oc) =>
      oc.columns(["createdBy", "demandeNumero", "statutPrecedent", "statut"]).doUpdateSet(changementStatut)
    )
    .returningAll()
    .$narrowType<{
      statut: DemandeStatutType;
      statutPrecedent: DemandeStatutType;
    }>()
    .executeTakeFirstOrThrow()
    .then(cleanNull);
};
