import { createRoute } from "@http-wizard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteChangementStatutSchema } from "./deleteChangementStatut.schema";
import { deleteIntentionUsecase } from "./deleteChangementStatut.usecase";

export const deleteChangementStatutRoute = (server: Server) => {
  return createRoute("/intention/statut/:id", {
    method: "DELETE",
    schema: deleteChangementStatutSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir-statut/ecriture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteIntentionUsecase({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
