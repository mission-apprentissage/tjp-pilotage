import type { Insertable } from "kysely";
import { omit } from "lodash-es";
import type {DemandeStatutType, DemandeStatutTypeWithoutSupprimee} from 'shared/enum/demandeStatutEnum';

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { generateId } from "@/modules/utils/generateId";
import { cleanNull } from "@/utils/noNull";

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
    .$narrowType<{
      statut: DemandeStatutTypeWithoutSupprimee;
      statutPrecedent: DemandeStatutType;
    }>()
    .executeTakeFirstOrThrow()
    .then(cleanNull);
