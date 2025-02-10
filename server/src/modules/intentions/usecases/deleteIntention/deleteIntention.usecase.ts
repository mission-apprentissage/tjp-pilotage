import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import logger from "@/services/logger";

import { deleteIntentionQuery } from "./deleteIntention.query";

export const deleteIntentionFactory =
  (deps = { findOneIntention, deleteIntentionQuery }) =>
    async ({ numero, user }: { numero: string; user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais"> }) => {
      const intention = await deps.findOneIntention(numero);
      if (!intention) throw Boom.notFound();

      const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
      const isAllowed = guardScope(scope, {
        uai: () => user.uais?.includes(intention.uai) ?? false,
        région: () => user.codeRegion === intention.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();
      await deps.deleteIntentionQuery({ intention, updatedBy: user.id });
      logger.info({ numero, intention: intention }, "Intention supprimée");
    };

export const deleteIntentionUsecase = deleteIntentionFactory();
