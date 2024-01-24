import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getTransformationStatsSchema } from "./getTransformationsStats.schema";
import { getTransformationStats } from "./getTransformationStats.usecase";

export const getTransformationsStatsRoutes = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/pilotage-transformation/stats", {
    method: "GET",
    schema: getTransformationStatsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const stats = await getTransformationStats(request.query);
        response.status(200).send(stats);
      },
    });
  });
};
