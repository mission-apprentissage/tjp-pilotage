import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getRegionSchema } from "./getRegion.schema";
import { getRegionStats } from "./getRegionsStats.query";

export const getRegionRoute = ({ server }: { server: Server }) => {
  return createRoute("/region/:codeRegion", {
    method: "GET",
    schema: getRegionSchema,
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
