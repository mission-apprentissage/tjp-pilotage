import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { castDemandeStatut } from "@/modules/utils/castDemandeStatut";
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
      oc.columns(["createdBy", "intentionNumero", "statutPrecedent", "statut"]).doUpdateSet(changementStatut),
    )
    .returningAll()
    .executeTakeFirstOrThrow()
    .then((changementStatut) =>
      cleanNull({
        ...changementStatut,
        statut: castDemandeStatut(changementStatut.statut),
        statutPrecedent: castDemandeStatut(changementStatut.statutPrecedent),
      }),
    );
};
