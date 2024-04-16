import { Insertable } from "kysely";
import _ from "lodash";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { DB, kdb } from "../../../../../db/db";
import { RequestUser } from "../../../../core/model/User";
import { generateId, generateShortId } from "../../../../utils/generateId";

export const createDemandeQuery = ({
  demande,
  campagne,
  user,
}: {
  demande: Insertable<DB["demande"]>;
  campagne: { id: string };
  user: Pick<RequestUser, "id">;
}) => {
  return kdb
    .insertInto("demande")
    .values({
      ...(_.omit(demande, [
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
        "createurId",
        "statut",
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
      createurId: user.id,
      statut: DemandeStatutEnum.draft,
      typeDemande:
        demande.typeDemande === "augmentation_compensation"
          ? "augmentation_nette"
          : demande.typeDemande === "ouverture_compensation"
          ? "ouverture_nette"
          : demande.typeDemande,
    })
    .returning("id")
    .executeTakeFirst();
};
