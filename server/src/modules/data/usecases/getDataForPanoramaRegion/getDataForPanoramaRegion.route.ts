import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getDataForPanoramaRegionSchema } from "./getDataForPanoramaRegion.schema";
import { getDataForPanoramaRegion } from "./getDataForPanoramaRegion.usecase";

export const getDataForPanoramaRegionRoute = (server: Server) => {
  return createRoute("/panorama/stats/region", {
    method: "GET",
    schema: getDataForPanoramaRegionSchema,
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
