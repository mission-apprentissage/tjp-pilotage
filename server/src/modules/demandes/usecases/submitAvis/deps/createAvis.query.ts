import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { castAvisStatut } from "@/modules/utils/castStatutAvis";
import { castAvisType } from "@/modules/utils/castTypeAvis";
import { cleanNull } from "@/utils/noNull";

export const createAvisQuery = async (avis: Insertable<DB["avis"]>) => {
  return await getKbdClient()
    .insertInto("avis")
    .values({
      ...avis,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .onConflict((oc) => oc.columns(["createdBy", "demandeNumero", "userFonction", "typeAvis"]).doUpdateSet(avis))
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
