import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getPilotageReformeStatsSchema } from "./getPilotageReformeStats.schema";
import { getPilotageReformeStats } from "./getPilotageReformeStats.usecase";

export const getPilotageReformeStatsRoute = (server: Server) => {
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
