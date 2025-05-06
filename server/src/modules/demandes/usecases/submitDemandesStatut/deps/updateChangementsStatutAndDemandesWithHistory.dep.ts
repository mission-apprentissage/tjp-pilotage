import type {Insertable} from 'kysely';
import {omit} from 'lodash-es';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';

import type {DB} from '@/db/db';
import { getKbdClient} from '@/db/db';
import { generateId } from '@/modules/utils/generateId';

export const updateChangementsStatutAndDemandesWithHistory = async ({
  demandes,
  changementsStatut
} : {
  demandes?: Array<Insertable<DB["demande"]>>;
  changementsStatut?: Array<Insertable<DB["changementStatut"]>>;
}) =>
  getKbdClient()
    .transaction()
    .execute(async (transaction) => {
      if(demandes?.length) await transaction
        .insertInto("demande")
        .values(demandes.map((demande) => ({
          ...(omit(demande, ["id", "updatedAt", "isOldDemande"]) as Insertable<DB["demande"]>),
          id: generateId(),
          updatedAt: new Date(),
          isOldDemande: demande.isOldDemande ?? false,
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
          oc.columns(["createdBy", "demandeNumero", "statutPrecedent", "statut"]).doUpdateSet({ updatedAt: new Date() })
        )
        .returningAll()
        .$narrowType<{
          statut: DemandeStatutType;
          statutPrecedent: DemandeStatutType;
        }>()
        .execute();

      return [];
    });
