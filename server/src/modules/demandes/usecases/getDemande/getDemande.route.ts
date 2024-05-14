import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";
import { getPermissionScope, guardScope } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getDemandeSchema } from "./getDemande.schema";
import { getDemandeUsecase } from "./getDemande.usecase";

export const getDemandeRoute = (server: Server) => {
  return createRoute("/demande/:numero", {
    method: "GET",
    schema: getDemandeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const user = request.user;
        if (!user) throw Boom.forbidden();
        const demande = await getDemandeUsecase({
          numero: request.params.numero,
          user,
        });
        if (!demande) return response.status(404).send();
        if (demande.statut === DemandeStatutEnum.deleted)
          throw Boom.forbidden();

        const scope = getPermissionScope(user.role, "intentions/ecriture");
        const canEdit = guardScope(scope?.default, {
          region: () => user.codeRegion === demande.codeRegion,
          national: () => true,
        });
        response.status(200).send({
          ...demande,
          statut: demande.statut,
          canEdit,
        });
      },
    });
  });
};
