import { createRoute } from "@http-wizard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

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
