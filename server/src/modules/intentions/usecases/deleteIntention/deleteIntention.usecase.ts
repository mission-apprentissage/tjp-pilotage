import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import { logger } from "../../../../logger";
import { RequestUser } from "../../../core/model/User";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { deleteIntentionQuery } from "./deleteIntention.query";

export const deleteIntentionFactory =
  (deps = { findOneIntention, deleteIntentionQuery }) =>
  async ({
    numero,
    user,
  }: {
    numero: string;
    user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
  }) => {
    const intention = await deps.findOneIntention(numero);
    if (!intention) throw Boom.notFound();

    const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
    const isAllowed = guardScope(scope?.default, {
      uai: () => user.uais?.includes(intention.uai) ?? false,
      region: () => user.codeRegion === intention.codeRegion,
      national: () => true,
    });
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteIntentionQuery(intention);
    logger.info("Demande supprimée", { numero, intention: intention });
  };

export const deleteIntentionUsecase = deleteIntentionFactory();
