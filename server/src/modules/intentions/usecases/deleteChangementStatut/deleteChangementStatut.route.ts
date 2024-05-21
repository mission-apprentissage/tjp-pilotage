import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { RequestUser } from "../../../core/model/User";
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
