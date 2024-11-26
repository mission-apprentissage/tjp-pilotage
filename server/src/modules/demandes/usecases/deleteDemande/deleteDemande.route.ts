import { createRoute } from "@http-wizard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteDemandeSchema } from "./deleteDemande.schema";
import { deleteDemande } from "./deleteDemande.usecase";

export const deleteDemandeRoute = (server: Server) => {
  return createRoute("/demande/:numero", {
    method: "DELETE",
    schema: deleteDemandeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteDemande({ numero: request.params.numero, user });
        response.status(200).send();
      },
    });
  });
};
