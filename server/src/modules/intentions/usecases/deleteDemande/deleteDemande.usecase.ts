import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import { logger } from "../../../../logger";
import { RequestUser } from "../../../core/model/User";
import { findOneDemande } from "../../repositories/findOneDemande.query";
import { deleteDemandeQuery } from "./deleteDemande.dep";

export const deleteDemandeFactory =
  (deps = { findOneDemande, deleteDemandeQuery }) =>
  async ({
    id,
    user,
  }: {
    id: string;
    user: Pick<RequestUser, "id" | "role" | "codeRegion">;
  }) => {
    const demande = await deps.findOneDemande(id);
    if (!demande) throw Boom.notFound();

    const scope = getPermissionScope(user.role, "intentions/ecriture");
    const isAllowed = guardScope(scope?.default, {
      user: () => user.id === demande.createurId,
      region: () => user.codeRegion === demande.codeRegion,
      national: () => true,
    });
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteDemandeQuery(demande.id);
    logger.info("Demande supprimée", { id, demande: demande });
  };

export const deleteDemande = deleteDemandeFactory();
