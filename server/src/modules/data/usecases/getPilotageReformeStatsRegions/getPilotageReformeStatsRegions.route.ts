import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getPilotageReformeStatsRegionsSchema } from "./getPilotageReformeStatsRegions.schema";
import { getPilotageReformeStatsRegions } from "./getPilotageReformeStatsRegions.usecase";

export const getPilotageReformeStatsRegionsRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/pilotage-reforme/stats/regions", {
    method: "GET",
    schema: getPilotageReformeStatsRegionsSchema,
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
