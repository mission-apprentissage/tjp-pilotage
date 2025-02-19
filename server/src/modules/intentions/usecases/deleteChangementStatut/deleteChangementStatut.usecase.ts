import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneChangementStatut } from "@/modules/intentions/repositories/findOneChangementStatut.query";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";

import { deleteChangementStatutQuery } from "./deleteChangementStatut.query";

export const deleteChangementStatutFactory =
  (
    deps = {
      findOneIntention,
      findOneChangementStatut,
      deleteChangementStatutQuery,
    }
  ) =>
    async ({ id, user }: { id: string; user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais"> }) => {
      const changementStatut = await deps.findOneChangementStatut(id);
      if (!changementStatut) throw Boom.notFound();

      const intention = await deps.findOneIntention(changementStatut.intentionNumero);
      if (!intention) throw Boom.notFound("Intention non trouvée en base");

      const scope = getPermissionScope(user.role, "intentions-perdir-statut/ecriture");
      const isAllowed = guardScope(scope?.default, {
        region: () => user.codeRegion === intention.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();
      await deps.deleteChangementStatutQuery(changementStatut);
    };

export const deleteIntentionUsecase = deleteChangementStatutFactory();
