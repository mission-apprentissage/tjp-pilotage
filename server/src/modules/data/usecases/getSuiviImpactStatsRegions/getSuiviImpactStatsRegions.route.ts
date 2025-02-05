import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getSuiviImpactStatsRegions } from "./getSuiviImpactStatsRegions.usecase";

const ROUTE = ROUTES["[GET]/suivi-impact/stats/regions"];

export const getSuiviImpactStatsRegionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("suivi-impact/lecture"),
      handler: async (request, response) => {
        const { order, orderBy, ...rest } = request.query;
        const stats = await getSuiviImpactStatsRegions({
          ...rest,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        response.status(200).send(stats);
      },
    });
  });
};
