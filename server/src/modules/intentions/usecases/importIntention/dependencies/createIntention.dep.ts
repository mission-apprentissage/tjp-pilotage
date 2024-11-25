import type { Insertable } from "kysely";
import { omit } from "lodash-es";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { generateId, generateShortId } from "@/modules/utils/generateId";

export const createIntentionQuery = ({
  intention,
  campagne,
  user,
}: {
  intention: Insertable<DB["intention"]>;
  campagne: { id: string };
  user: Pick<RequestUser, "id">;
}) => {
  const getTypeDemande = (intention: Insertable<DB["intention"]>) => {
    if (intention.typeDemande === "augmentation_compensation") {
      return "augmentation_nette";
    }
    if (intention.typeDemande === "ouverture_compensation") {
      return "ouverture_nette";
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
      amiCma: null,
      createdBy: user.id,
      statut: DemandeStatutEnum["proposition"],
      typeDemande: getTypeDemande(intention),
    })
    .returning("id")
    .executeTakeFirst();
};
