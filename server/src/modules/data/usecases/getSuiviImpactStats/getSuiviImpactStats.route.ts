import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getSuiviImpactStats } from "./getSuiviImpactStats";

const ROUTE = ROUTES["[GET]/suivi-impact/stats"];

export const getSuiviImpactStatsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("suivi-impact/lecture"),
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const stats = await getSuiviImpactStats(filters);
        response.status(200).send(stats);
      },
    });
  });
};
