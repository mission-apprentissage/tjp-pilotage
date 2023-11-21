import Boom from "@hapi/boom";
import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { deleteDemandeSchema } from "./deleteDemande.schema";
import { deleteDemande } from "./deleteDemande.usecase";

export const deleteDemandeRoute = (server: Server) => {
  return createRoute("/demande/:id", {
    method: "DELETE",
    schema: deleteDemandeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const user = request.user;
        if (!user) throw Boom.forbidden();
        await deleteDemande({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
