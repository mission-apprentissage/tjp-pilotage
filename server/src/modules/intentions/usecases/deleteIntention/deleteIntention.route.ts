import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteIntentionUsecase } from "./deleteIntention.usecase";

const ROUTE = ROUTES["[DELETE]/intention/:numero"];

export const deleteIntentionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
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
