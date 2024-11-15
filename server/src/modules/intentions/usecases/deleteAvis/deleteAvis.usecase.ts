import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import { logger } from "../../../../logger";
import { RequestUser } from "../../../core/model/User";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { deleteAvisQuery } from "./deps/deleteAvis.query";
import { findOneAvisQuery } from "./deps/findOneAvis.query";

export const deleteAvisFactory =
  (deps = { findOneIntention, findOneAvisQuery, deleteAvisQuery }) =>
  async ({
    id,
    user,
  }: {
    id: string;
    user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
  }) => {
    const avis = await deps.findOneAvisQuery(id);
    if (!avis) throw Boom.notFound("Avis non trouvé en base");

    const intention = await deps.findOneIntention(avis.intentionNumero);
    if (!intention) throw Boom.notFound("Intention non trouvée en base");

    const scope = getPermissionScope(
      user.role,
      "intentions-perdir-avis/ecriture"
    );
    const isAllowed = guardScope(scope?.default, {
      region: () => user.codeRegion === intention.codeRegion,
      national: () => true,
    });
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteAvisQuery(id);
    logger.info("Avis supprimé", { id, avis: avis });
  };

export const deleteAvisUsecase = deleteAvisFactory();
