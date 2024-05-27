import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { castAvisStatut } from "../../../../utils/castStatutAvis";
import { castAvisType } from "../../../../utils/castTypeAvis";

export const createAvisQuery = async (avis: Insertable<DB["avis"]>) => {
  return await kdb
    .insertInto("avis")
    .values({
      ...avis,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .onConflict((oc) =>
      oc
        .columns(["userId", "intentionNumero", "userFonction", "typeAvis"])
        .doUpdateSet(avis)
    )
    .returningAll()
    .executeTakeFirstOrThrow()
    .then((avis) =>
      cleanNull({
        ...avis,
        statutAvis: castAvisStatut(avis.statutAvis),
        typeAvis: castAvisType(avis.typeAvis),
      })
    );
};
