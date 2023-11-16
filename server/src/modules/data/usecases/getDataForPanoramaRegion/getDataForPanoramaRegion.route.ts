import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getDataForPanoramaRegionSchema } from "./getDataForPanoramaRegion.schema";
import { getDataForPanoramaRegion } from "./getDataForPanoramaRegion.usecase";

export const getDataForPanoramaRegionRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/panorama/stats/region", {
    method: "GET",
    schema: getDataForPanoramaRegionSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const q = request.query;
        if (!("codeRegion" in q)) {
          q;
        }
        const stats = await getDataForPanoramaRegion({
          ...request.query,
        });
        response.status(200).send(stats);
      },
    });
  });
};
