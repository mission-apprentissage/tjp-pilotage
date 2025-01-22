import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { createCampagneRegion } from "./createCampagneRegion.usecase";

const ROUTE = ROUTES["[POST]/campagnes-region/:campagneRegionId"];

export const createCampagneRegionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes-region/ecriture"),
      handler: async (request, response) => {
        await createCampagneRegion(request.body);

        response.code(200).send();
      },
    });
  });
};
