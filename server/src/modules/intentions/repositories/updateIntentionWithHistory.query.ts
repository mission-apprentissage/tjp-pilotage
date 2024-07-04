import { Insertable } from "kysely";
import _ from "lodash";

import { DB, kdb } from "../../../db/db";
import { castDemandeStatutWithoutSupprimee } from "../../utils/castDemandeStatut";
import { generateId } from "../../utils/generateId";

export const updateIntentionWithHistory = async (
  intention: Insertable<DB["intention"]>
) =>
  kdb
    .insertInto("intention")
    .values({
      ...(_.omit(intention, ["id", "updatedAt", "isIntention"]) as Insertable<
        DB["intention"]
      >),
      id: generateId(),
      updatedAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then((intention) => ({
      ...intention,
      statut: castDemandeStatutWithoutSupprimee(intention.statut),
    }));
