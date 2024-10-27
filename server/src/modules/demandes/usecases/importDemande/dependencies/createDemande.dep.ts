import type { Insertable } from "kysely";
import { omit } from "lodash-es";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { generateId, generateShortId } from "@/modules/utils/generateId";

export const createDemandeQuery = ({
  demande,
  campagne,
  user,
}: {
  demande: Insertable<DB["demande"]>;
  campagne: { id: string };
  user: Pick<RequestUser, "id">;
}) => {
  const getTypeDemande = (demande: Insertable<DB["demande"]>) => {
    if (demande.typeDemande === "augmentation_compensation") {
      return "augmentation_nette";
    }
    if (demande.typeDemande === "ouverture_compensation") {
      return "ouverture_nette";
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
        "rentreeScolaire",
        "updatedAt",
        "campagneId",
        "compensationUai",
        "compensationCfd",
        "compensationCodeDispositif",
        "compensationRentreeScolaire",
        "createdBy",
        "statut",
        "motifRefus",
        "autreMotifRefus",
        "typeDemande",
      ]) as Insertable<DB["demande"]>),
      id: generateId(),
      numero: generateShortId(),
      numeroHistorique: demande.numero,
      createdAt: new Date(),
      updatedAt: new Date(),
      campagneId: campagne.id,
      compensationUai: null,
      compensationCfd: null,
      compensationCodeDispositif: null,
      compensationRentreeScolaire: null,
      amiCma: null,
      createdBy: user.id,
      statut: DemandeStatutEnum["projet de demande"],
      typeDemande: getTypeDemande(demande),
    })
    .returning("id")
    .executeTakeFirst();
};
