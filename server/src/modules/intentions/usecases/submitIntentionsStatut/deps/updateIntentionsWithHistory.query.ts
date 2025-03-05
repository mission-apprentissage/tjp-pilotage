import type {Insertable} from 'kysely';
import {omit} from 'lodash-es';

import type {DB} from '@/db/db';
import { getKbdClient} from '@/db/db';
import {castDemandeStatut,castDemandeStatutWithoutSupprimee} from '@/modules/utils/castDemandeStatut';
import {generateId} from '@/modules/utils/generateId';
import { cleanNull } from '@/utils/noNull';

export const updateChangementsStatutAndIntentionsWithHistory = async ({
  intentions,
  changementsStatut
} : {
  intentions: Array<Insertable<DB["intention"]>>;
  changementsStatut: Array<Insertable<DB["changementStatut"]>>;
}) =>
  getKbdClient()
    .transaction().execute(async (transaction) => {
      const changementsStatutData = await transaction
        .insertInto("changementStatut")
        .values(changementsStatut.map((changementStatut) => ({
          ...changementStatut,
          updatedAt: new Date(),
        })))
        .onConflict((oc) =>
          oc.columns(["createdBy", "intentionNumero", "statutPrecedent", "statut"]).doUpdateSet({ updatedAt: new Date() })
        )
        .returningAll()
        .execute()
        .then((changementsStatut) => changementsStatut.map(
          (changementStatut) =>
            cleanNull({
              ...changementStatut,
              statut: castDemandeStatut(changementStatut.statut),
              statutPrecedent: castDemandeStatut(changementStatut.statutPrecedent),
            })
        ));

      await transaction
        .insertInto("intention")
        .values(intentions.map((intention) => ({
          ...(omit(intention, ["id", "updatedAt", "isIntention"]) as Insertable<DB["intention"]>),
          id: generateId(),
          updatedAt: new Date(),
        })))
        .returningAll()
        .execute()
        .then((intentions) => intentions.map(
          (intention) => cleanNull({
            ...intention,
            statut: castDemandeStatutWithoutSupprimee(intention.statut),
          })
        ));

      return changementsStatutData;
    });
