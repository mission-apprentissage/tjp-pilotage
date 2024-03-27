import { Insertable } from "kysely";
import _ from "lodash";

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
  const importedDemande = kdb
    .insertInto("demande")
    .values({
      ...(_.omit(demande, [
        "id",
        "numero",
        "numeroHistorique",
        "dateCreation",
        "rentreeScolaire",
        "dateModification",
        "campagneId",
        "compensationUai",
        "compensationCfd",
        "compensationCodeDispositif",
        "compensationRentreeScolaire",
        "createurId",
        "statut",
      ]) as Insertable<DB["demande"]>),
      id: generateId(),
      numero: generateShortId(),
      numeroHistorique: demande.numero,
      dateCreation: new Date(),
      dateModification: new Date(),
      campagneId: campagne.id,
      compensationUai: null,
      compensationCfd: null,
      compensationCodeDispositif: null,
      compensationRentreeScolaire: null,
      createurId: user.id,
      statut: "draft",
    })
    .returning("id")
    .executeTakeFirst();

  return importedDemande;
};
