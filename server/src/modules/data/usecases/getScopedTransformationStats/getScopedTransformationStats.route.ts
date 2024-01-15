import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getScopedTransformationStatsSchema } from "./getScopedTransformationStats.schema";
import { getScopedTransformationStats } from "./getScopedTransformationStats.usecase";

export const getScopedTransformationStatsRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute(
    "/pilotage-transformation/get-scoped-transformations-stats",
    {
      method: "GET",
      schema: getScopedTransformationStatsSchema,
    }
  ).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const statsTauxTransfo = await getScopedTransformationStats(
          request.query
        );
        response.status(200).send(statsTauxTransfo);
      },
    });
  });
};
