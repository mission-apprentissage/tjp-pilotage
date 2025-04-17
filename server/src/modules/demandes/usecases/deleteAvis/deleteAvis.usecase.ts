import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import logger from "@/services/logger";

import { deleteAvisQuery } from "./deps/deleteAvis.query";
import { findOneAvisQuery } from "./deps/findOneAvis.query";

export const deleteAvisFactory =
  (deps = { findOneDemandeQuery, findOneAvisQuery, deleteAvisQuery }) =>
    async ({ id, user }: { id: string; user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais"> }) => {
      const avis = await deps.findOneAvisQuery(id);
      if (!avis) throw Boom.notFound("Avis non trouvé en base");

      const demande = await deps.findOneDemandeQuery(avis.demandeNumero);
      if (!demande) throw Boom.notFound("Demande non trouvée en base");

      const scope = getPermissionScope(user.role, PermissionEnum["demande-avis/ecriture"]);
      const isAllowed = guardScope(scope, {
        région: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();
      await deps.deleteAvisQuery(id);
      logger.info({ id, avis: avis }, "[DELETE_AVIS] Avis supprimé");
    };

export const deleteAvisUsecase = deleteAvisFactory();
