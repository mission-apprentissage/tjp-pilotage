import type {Insertable} from 'kysely';
import {omit} from 'lodash-es';

import type {DB} from '@/db/db';
import { getKbdClient} from '@/db/db';
import { castDemandeStatut } from '@/modules/utils/castDemandeStatut';
import { generateId } from '@/modules/utils/generateId';
import { cleanNull } from '@/utils/noNull';

export const updateChangementsStatutAndDemandesIntentionsWithHistory = async ({
  intentions,
  demandes,
  changementsStatut
} : {
  intentions?: Array<Insertable<DB["intention"]>>;
  demandes?: Array<Insertable<DB["demande"]>>;
  changementsStatut?: Array<Insertable<DB["changementStatut"]>>;
}) =>
  getKbdClient()
    .transaction()
    .execute(async (transaction) => {
      if(demandes?.length) await transaction
        .insertInto("demande")
        .values(demandes.map((demande) => ({
          ...(omit(demande, ["id", "updatedAt", "isIntention"]) as Insertable<DB["demande"]>),
          id: generateId(),
          updatedAt: new Date(),
        })))
        .execute();

      if(intentions?.length) await transaction
        .insertInto("intention")
        .values(intentions.map((intention) => ({
          ...(omit(intention, ["id", "updatedAt", "isIntention"]) as Insertable<DB["intention"]>),
          id: generateId(),
          updatedAt: new Date(),
        })))
        .execute();

      if(changementsStatut?.length) return await transaction
        .insertInto("changementStatut")
        .values(changementsStatut.map((changementStatut) => ({
          ...changementStatut,
          updatedAt: new Date(),
          createdAt: new Date(),
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

      return [];
    });
