import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";
import { getPermissionScope, guardScope } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getDemandeExpeSchema } from "./getDemandeExpe.schema";
import { getDemandeExpeUsecase } from "./getDemandeExpe.usecase";

export const getDemandeExpeRoute = (server: Server) => {
  return createRoute("/demande/expe/:numero", {
    method: "GET",
    schema: getDemandeExpeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const user = request.user;
        if (!user) throw Boom.forbidden();
        const demandeExpe = await getDemandeExpeUsecase({
          numero: request.params.numero,
          user,
        });
        if (!demandeExpe) return response.status(404).send();
        if (demandeExpe.statut === DemandeStatutEnum.deleted)
          throw Boom.forbidden();

        const scope = getPermissionScope(user.role, "intentions/ecriture");
        const canEdit = guardScope(scope?.default, {
          user: () => user.id === demandeExpe.createurId,
          region: () => user.codeRegion === demandeExpe.codeRegion,
          national: () => true,
        });
        response.status(200).send({
          ...demandeExpe,
          statut: demandeExpe.statut,
          canEdit,
        });
      },
    });
  });
};
