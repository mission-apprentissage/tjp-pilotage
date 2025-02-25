import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getDataForPanoramaRegion } from "./getDataForPanoramaRegion.usecase";

const ROUTE = ROUTES["[GET]/panorama/stats/region"];

export const getDataForPanoramaRegionRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const stats = await getDataForPanoramaRegion({
          ...filters,
        });
        response.status(200).send(stats);
      },
    });
  });
};
