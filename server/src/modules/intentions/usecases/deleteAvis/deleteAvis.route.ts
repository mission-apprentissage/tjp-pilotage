import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { RequestUser } from "../../../core/model/User";
import { deleteAvisSchema } from "./deleteAvis.schema";
import { deleteAvisUsecase } from "./deleteAvis.usecase";

export const deleteAvisRoute = (server: Server) => {
  return createRoute("/intention/avis/:id", {
    method: "DELETE",
    schema: deleteAvisSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/ecriture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteAvisUsecase({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
