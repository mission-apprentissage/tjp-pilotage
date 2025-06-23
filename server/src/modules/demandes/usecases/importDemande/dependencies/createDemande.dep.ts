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

export const createDemandeQuery = ({
  demande,
  campagne,
  user,
}: {
  demande: Insertable<DB["demande"]>;
  campagne: { id: string, annee: string };
  user: Pick<RequestUser, "id">;
}) => {
  const getTypeDemande = (demande: Insertable<DB["demande"]>) => {
    if (demande.typeDemande === DemandeTypeEnum["augmentation_compensation"]) {
      return DemandeTypeEnum["augmentation_nette"];
    }
    if (demande.typeDemande === DemandeTypeEnum["ouverture_compensation"]) {
      return DemandeTypeEnum["ouverture_nette"];
    }
    return demande.typeDemande;
  };

  return getKbdClient()
    .insertInto("demande")
    .values({
      ...(omit(demande, [
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
        "isOldDemande",
      ]) as Insertable<DB["demande"]>),
      id: generateId(),
      numero: generateShortId(),
      numeroHistorique: demande.numero,
      createdAt: new Date(),
      updatedAt: new Date(),
      campagneId: campagne.id,
      rentreeScolaire: getNextRentreeScolaire(campagne),
      createdBy: user.id,
      statut: DemandeStatutEnum["proposition"],
      typeDemande: getTypeDemande(demande),
      isOldDemande: false,
    })
    .returning("id")
    .executeTakeFirst();
};
