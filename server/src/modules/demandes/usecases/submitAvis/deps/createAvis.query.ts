import type { Insertable } from "kysely";
import type { AvisStatutType } from "shared/enum/avisStatutEnum";
import type { TypeAvisType } from "shared/enum/typeAvisEnum";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
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
    .$narrowType<{
      statutAvis: AvisStatutType;
      typeAvis: TypeAvisType;
    }>()
    .executeTakeFirstOrThrow()
    .then(cleanNull);
};
