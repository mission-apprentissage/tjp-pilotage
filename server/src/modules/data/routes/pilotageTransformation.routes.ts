import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
import { getformationsTransformationStats } from "../usecases/getformationsTransformationStats/getformationsTransformationStats.usecase";
import { getTransformationStats } from "../usecases/getTransformationStats/getTransformationStats.usecase";

export const pilotageTransformationRoutes = ({
  server,
}: {
  server: Server;
}) => {
  server.get(
    "/pilotage-transformation/stats",
    {
      schema: ROUTES_CONFIG.getTransformationStats,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
    },
    async (request, response) => {
      const stats = await getTransformationStats();
      response.status(200).send(stats);
    }
  );

  server.get(
    "/pilotage-transformation/formations",
    {
      schema: ROUTES_CONFIG.getformationsTransformationStats,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
    },
    async (request, response) => {
      const stats = await getformationsTransformationStats(request.query);
      response.status(200).send(stats);
    }
  );
};
