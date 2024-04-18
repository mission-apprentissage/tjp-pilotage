import { Insertable } from "kysely";
import _ from "lodash";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { DB, kdb } from "../../../../../db/db";
import { RequestUser } from "../../../../core/model/User";
import { generateId, generateShortId } from "../../../../utils/generateId";

export const createDemandeExpeQuery = ({
  demandeExpe,
  campagne,
  user,
}: {
  demandeExpe: Insertable<DB["demandeExpe"]>;
  campagne: { id: string };
  user: Pick<RequestUser, "id">;
}) => {
  return kdb
    .insertInto("demandeExpe")
    .values({
      ...(_.omit(demandeExpe, [
        "id",
        "numero",
        "numeroHistorique",
        "createdAt",
        "rentreeScolaire",
        "updatedAt",
        "campagneId",
        "createurId",
        "statut",
        "typeDemande",
      ]) as Insertable<DB["demandeExpe"]>),
      id: generateId(),
      numero: generateShortId(),
      numeroHistorique: demandeExpe.numero,
      createdAt: new Date(),
      updatedAt: new Date(),
      campagneId: campagne.id,
      amiCma: null,
      createurId: user.id,
      statut: DemandeStatutEnum.draft,
      typeDemande:
        demandeExpe.typeDemande === "augmentation_compensation"
          ? "augmentation_nette"
          : demandeExpe.typeDemande === "ouverture_compensation"
          ? "ouverture_nette"
          : demandeExpe.typeDemande,
    })
    .returning("id")
    .executeTakeFirst();
};
