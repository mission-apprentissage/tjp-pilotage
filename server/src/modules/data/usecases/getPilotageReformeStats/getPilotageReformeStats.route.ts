import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getPilotageReformeStatsSchema } from "./getPilotageReformeStats.schema";
import { getPilotageReformeStats } from "./getPilotageReformeStats.usecase";

export const getPilotageReformeStatsRoute = ({ server }: { server: Server }) => {
  return createRoute("/pilotage-reforme/stats", {
    method: "GET",
    schema: getPilotageReformeStatsSchema,
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
