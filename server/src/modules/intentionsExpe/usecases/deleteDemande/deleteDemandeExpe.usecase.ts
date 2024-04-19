import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import { logger } from "../../../../logger";
import { RequestUser } from "../../../core/model/User";
import { findOneDemandeExpe } from "../../repositories/findOneDemandeExpe.query";
import { deleteDemandeExpeQuery } from "./deleteDemandeExpe.dep";

export const deleteDemandeFactory =
  (deps = { findOneDemandeExpe, deleteDemandeExpeQuery }) =>
  async ({
    numero,
    user,
  }: {
    numero: string;
    user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
  }) => {
    const demandeExpe = await deps.findOneDemandeExpe(numero);
    if (!demandeExpe) throw Boom.notFound();

    const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
    const isAllowed = guardScope(scope?.default, {
      uai: () => user.uais?.includes(demandeExpe.uai) ?? false,
      region: () => user.codeRegion === demandeExpe.codeRegion,
      national: () => true,
    });
    if (!isAllowed) throw Boom.forbidden();
    await deps.deleteDemandeExpeQuery(demandeExpe);
    logger.info("DemandeExpe supprimée", { numero, demandeExpe: demandeExpe });
  };

export const deleteDemande = deleteDemandeFactory();
