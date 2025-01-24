import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getCampagnesRegion } from "./getCampagnesRegion.query";

const ROUTE = ROUTES["[GET]/campagnes-region"];

export const getCampagnesRegionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes-region/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const campagnes = await getCampagnesRegion(user);
        response.status(200).send(campagnes);
      },
    });
  });
};
