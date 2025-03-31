import type { Insertable } from "kysely";
import { omit } from "lodash-es";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import {DemandeTypeEnum} from 'shared/enum/demandeTypeEnum';

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { generateId, generateShortId } from "@/modules/utils/generateId";

const getNextRentreeScolaire = (campagne: { annee: string }) => {
  return Number.parseInt(campagne.annee) + 1;
};

export const createIntentionQuery = ({
  intention,
  campagne,
  user,
}: {
  intention: Insertable<DB["intention"]>;
  campagne: { id: string, annee: string };
  user: Pick<RequestUser, "id">;
}) => {
  const getTypeDemande = (intention: Insertable<DB["intention"]>) => {
    if (intention.typeDemande === DemandeTypeEnum["augmentation_compensation"]) {
      return DemandeTypeEnum["augmentation_nette"];
    }
    if (intention.typeDemande === DemandeTypeEnum["ouverture_compensation"]) {
      return DemandeTypeEnum["ouverture_nette"];
    }
    return intention.typeDemande;
  };

  return getKbdClient()
    .insertInto("intention")
    .values({
      ...(omit(intention, [
        "id",
        "numero",
        "numeroHistorique",
        "createdAt",
        "updatedAt",
        "campagneId",
        "rentreeScolaire",
        "createdBy",
        "statut",
        "motifRefus",
        "autreMotifRefus",
        "typeDemande",
        "isIntention",
      ]) as Insertable<DB["intention"]>),
      id: generateId(),
      numero: generateShortId(),
      numeroHistorique: intention.numero,
      createdAt: new Date(),
      updatedAt: new Date(),
      campagneId: campagne.id,
      rentreeScolaire: getNextRentreeScolaire(campagne),
      createdBy: user.id,
      statut: DemandeStatutEnum["proposition"],
      typeDemande: getTypeDemande(intention),
    })
    .returning("id")
    .executeTakeFirst();
};
