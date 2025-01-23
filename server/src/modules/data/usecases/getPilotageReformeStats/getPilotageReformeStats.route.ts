import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getPilotageReformeStats } from "./getPilotageReformeStats.usecase";

const ROUTE = ROUTES["[GET]/pilotage-reforme/stats"];

export const getPilotageReformeStatsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage_reforme/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const stats = await getPilotageReformeStats(filters);
        response.status(200).send(stats);
      },
    });
  });
};
