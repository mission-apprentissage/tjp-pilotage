import { createRoute } from "@http-wizard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteSuiviSchema } from "./deleteSuivi.schema";
import { deleteSuiviUsecase } from "./deleteSuivi.usecase";

export const deleteSuiviRoute = (server: Server) => {
  return createRoute("/demande/suivi/:id", {
    method: "DELETE",
    schema: deleteSuiviSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteSuiviUsecase({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
