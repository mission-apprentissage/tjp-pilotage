import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getDefaultCampagneUsecase } from "./getDefaultCampagne.usecase";

const ROUTE = ROUTES["[GET]/campagne/expe/default"];

export const getCurrentCampagneRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (_request, response) => {
        const campagne = await getDefaultCampagneUsecase();
        response.status(200).send(campagne);
      },
    });
  });
};
