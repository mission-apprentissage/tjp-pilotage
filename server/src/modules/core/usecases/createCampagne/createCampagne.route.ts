import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { createCampagne } from "./createCampagne.usecase";

const ROUTE = ROUTES["[POST]/campagnes/:campagneId"];

export const createCampagneRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes/ecriture"),
      handler: async (request, response) => {
        await createCampagne(request.body);

        response.code(200).send();
      },
    });
  });
};
