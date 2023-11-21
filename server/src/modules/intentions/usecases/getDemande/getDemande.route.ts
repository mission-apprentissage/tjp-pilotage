import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";
import { getPermissionScope, guardScope } from "shared";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { findDemande } from "./findDemande.query";
import { getDemandeSchema } from "./getDemande.schema";

export const getDemandeRoute = (server: Server) => {
  return createRoute("/demande/:id", {
    method: "GET",
    schema: getDemandeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const user = request.user;
        if (!user) throw Boom.forbidden();
        const demande = await findDemande({ id: request.params.id, user });
        if (!demande) return response.status(404).send();

        const scope = getPermissionScope(user.role, "intentions/ecriture");
        const canEdit = guardScope(scope?.default, {
          user: () => user.id === demande.createurId,
          region: () => user.codeRegion === demande.codeRegion,
          national: () => true,
        });

        response.status(200).send({ ...demande, canEdit });
      },
    });
  });
};
