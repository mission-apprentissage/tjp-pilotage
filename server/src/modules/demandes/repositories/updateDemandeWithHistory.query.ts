import { Insertable } from "kysely";
import _ from "lodash";

import { DB, kdb } from "../../../db/db";
import { castDemandeStatutWithoutSupprimee } from "../../utils/castDemandeStatut";
import { generateId } from "../../utils/generateId";

export const updateDemandeWithHistory = async (
  demande: Insertable<DB["demande"]>
) =>
  kdb
    .insertInto("demande")
    .values({
      ...(_.omit(demande, ["id", "updatedAt", "isIntention"]) as Insertable<
        DB["demande"]
      >),
      id: generateId(),
      updatedAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then((demande) => ({
      ...demande,
      statut: castDemandeStatutWithoutSupprimee(demande.statut),
    }));
