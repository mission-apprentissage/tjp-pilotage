import { createRoute } from "@http-wizard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteIntentionSchema } from "./deleteIntention.schema";
import { deleteIntentionUsecase } from "./deleteIntention.usecase";

export const deleteIntentionRoute = (server: Server) => {
  return createRoute("/intention/:numero", {
    method: "DELETE",
    schema: deleteIntentionSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/ecriture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteIntentionUsecase({ numero: request.params.numero, user });
        response.status(200).send();
      },
    });
  });
};
