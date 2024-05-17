import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";

export const createChangementStatutQuery = async (
  changementStatut: Insertable<DB["changementStatut"]>
) => {
  return await kdb
    .insertInto("changementStatut")
    .values({
      ...changementStatut,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .onConflict((oc) =>
      oc
        .columns(["userId", "intentionNumero", "statutPrecedent", "statut"])
        .doUpdateSet(changementStatut)
    )
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(cleanNull);
};
