import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";
import { PermissionEnum } from "shared/enum/permissionEnum";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneChangementStatut } from "@/modules/demandes/repositories/findOneChangementStatut.query";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";

import { deleteChangementStatutQuery } from "./deleteChangementStatut.query";

export const deleteChangementStatutFactory =
  (
    deps = {
      findOneDemandeQuery,
      findOneChangementStatut,
      deleteChangementStatutQuery,
    }
  ) =>
    async ({ id, user }: { id: string; user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais"> }) => {
      const changementStatut = await deps.findOneChangementStatut(id);
      if (!changementStatut) throw Boom.notFound();

      const demande = await deps.findOneDemandeQuery(changementStatut.demandeNumero);
      if (!demande) throw Boom.notFound("Demande non trouvée en base");

      const scope = getPermissionScope(user.role, PermissionEnum["demande-statut/ecriture"]);
      const isAllowed = guardScope(scope, {
        région: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();
      await deps.deleteChangementStatutQuery(changementStatut);
    };

export const deleteChangementStatutUsecase = deleteChangementStatutFactory();
