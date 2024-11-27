import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteSuiviUsecase } from "./deleteSuivi.usecase";

const ROUTE = ROUTES["[DELETE]/intention/suivi/:id"];

export const deleteSuiviRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteSuiviUsecase({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
