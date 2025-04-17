import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import logger from "@/services/logger";

import { deleteDemandeQuery } from "./deleteDemande.query";

export const deleteDemandeFactory =
  (deps = { findOneDemandeQuery, deleteDemandeQuery }) =>
    async ({ numero, user }: { numero: string; user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais"> }) => {
      const demande = await deps.findOneDemandeQuery(numero);
      if (!demande) throw Boom.notFound();

      const scope = getPermissionScope(user.role, PermissionEnum["demande/ecriture"]);
      const isAllowed = guardScope(scope, {
        uai: () => user.uais?.includes(demande.uai) ?? false,
        région: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();
      await deps.deleteDemandeQuery({ demande, updatedBy: user.id });
      logger.info({ numero, demande: demande }, "Demande supprimée");
    };

export const deleteDemandeUsecase = deleteDemandeFactory();
