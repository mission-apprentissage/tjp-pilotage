// @ts-nocheck -- TODO

import type { Insertable } from "kysely";
import { omit } from "lodash-es";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import { generateId } from "@/modules/utils/generateId";

export const updateIntentionWithHistory = async (intention: Insertable<DB["intention"]>) =>
  getKbdClient()
    .insertInto("intention")
    .values({
      ...(omit(intention, ["id", "updatedAt", "isIntention"]) as Insertable<DB["intention"]>),
      id: generateId(),
      updatedAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then((intention) => ({
      ...intention,
      statut: castDemandeStatutWithoutSupprimee(intention.statut),
    }));
