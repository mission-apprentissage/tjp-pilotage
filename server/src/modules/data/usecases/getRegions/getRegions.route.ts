import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getRegions } from "./getRegions.query";

const ROUTE = ROUTES["[GET]/regions"];

export const getRegionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
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
