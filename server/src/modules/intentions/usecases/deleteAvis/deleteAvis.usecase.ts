import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import logger from "@/services/logger";

import { deleteAvisQuery } from "./deps/deleteAvis.query";
import { findOneAvisQuery } from "./deps/findOneAvis.query";

export const deleteAvisFactory =
  (deps = { findOneIntention, findOneAvisQuery, deleteAvisQuery }) =>
  async ({ id, user }: { id: string; user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais"> }) => {
    const avis = await deps.findOneAvisQuery(id);
    if (!avis) throw Boom.notFound("Avis not found");

    const intention = await deps.findOneIntention(avis.intentionNumero);
    if (!intention) throw Boom.notFound("Intention not found");

    const scope = getPermissionScope(user.role, "intentions-perdir-avis/ecriture");
    const isAllowed = guardScope(scope?.default, {
      region: () => user.codeRegion === intention.codeRegion,
      national: () => true,
    });
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteAvisQuery(id);
    logger.info("Avis supprimé", { id, avis: avis });
  };

export const deleteAvisUsecase = deleteAvisFactory();
