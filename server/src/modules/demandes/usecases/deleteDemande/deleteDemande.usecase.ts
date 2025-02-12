import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemande } from "@/modules/demandes/repositories/findOneDemande.query";
import logger from "@/services/logger";

import { deleteDemandeQuery } from "./deleteDemande.dep";

export const deleteDemandeFactory =
  (deps = { findOneDemande, deleteDemandeQuery }) =>
    async ({ numero, user }: { numero: string; user: Pick<RequestUser, "id" | "role" | "codeRegion"> }) => {
      const demande = await deps.findOneDemande(numero);
      if (!demande) throw Boom.notFound();

      const scope = getPermissionScope(user.role, "intentions/ecriture");
      const isAllowed = guardScope(scope?.default, {
        region: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();
      await deps.deleteDemandeQuery(demande);
      logger.info({ numero, demande: demande }, "[DELETE_DEMANDE] Demande supprimée");
    };

export const deleteDemande = deleteDemandeFactory();
