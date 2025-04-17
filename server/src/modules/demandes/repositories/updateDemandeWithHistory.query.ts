import type { Insertable } from "kysely";
import { omit } from "lodash-es";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import { generateId } from "@/modules/utils/generateId";

export const updateDemandeWithHistory = (demande: Insertable<DB["demande"]>) =>
  getKbdClient()
    .insertInto("demande")
    .values({
      ...(omit(demande, ["id", "updatedAt", "isOldDemande"]) as Insertable<DB["demande"]>),
      id: generateId(),
      updatedAt: new Date(),
      isOldDemande: demande.isOldDemande ?? false,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then((demande) => ({
      ...demande,
      statut: castDemandeStatutWithoutSupprimee(demande.statut),
    }));
