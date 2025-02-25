import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getRegionStats } from "./getRegion.query";

const ROUTE = ROUTES["[GET]/region/:codeRegion"];

export const getRegionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const regionsStats = await getRegionStats({
          ...request.params,
          ...request.query,
        });
        if (!regionsStats) return response.status(404).send();
        response.status(200).send(regionsStats);
      },
    });
  });
};
