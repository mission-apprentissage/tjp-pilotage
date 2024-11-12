import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getRegions } from "./getRegions.query";
import { getRegionsSchema } from "./getRegions.schema";

export const getRegionsRoute = (server: Server) => {
  return createRoute("/regions", {
    method: "GET",
    schema: getRegionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        const regions = await getRegions();
        response.status(200).send(regions);
      },
    });
  });
};
