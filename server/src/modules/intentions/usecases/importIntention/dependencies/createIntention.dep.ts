import { Insertable } from "kysely";
import _ from "lodash";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { DB, kdb } from "../../../../../db/db";
import { RequestUser } from "../../../../core/model/User";
import { generateId, generateShortId } from "../../../../utils/generateId";

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

  return kdb
    .insertInto("intention")
    .values({
      ...(_.omit(intention, [
        "id",
        "numero",
        "numeroHistorique",
        "createdAt",
        "rentreeScolaire",
        "updatedAt",
        "campagneId",
        "createurId",
        "statut",
        "motifRefus",
        "autreMotifRefus",
        "typeDemande",
      ]) as Insertable<DB["intention"]>),
      id: generateId(),
      numero: generateShortId(),
      numeroHistorique: intention.numero,
      createdAt: new Date(),
      updatedAt: new Date(),
      campagneId: campagne.id,
      amiCma: null,
      createurId: user.id,
      statut: DemandeStatutEnum.draft,
      typeDemande: getTypeDemande(intention),
    })
    .returning("id")
    .executeTakeFirst();
};
