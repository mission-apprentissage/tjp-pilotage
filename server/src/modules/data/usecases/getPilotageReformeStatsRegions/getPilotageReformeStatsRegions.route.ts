import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getPilotageReformeStatsRegions } from "./getPilotageReformeStatsRegions.usecase";

const ROUTE = ROUTES["[GET]/pilotage-reforme/stats/regions"];

export const getPilotageReformeStatsRegionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage_reforme/lecture"),
      handler: async (request, response) => {
        const { order, orderBy, ...rest } = request.query;
        const stats = await getPilotageReformeStatsRegions({
          ...rest,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        response.status(200).send(stats);
      },
    });
  });
};
