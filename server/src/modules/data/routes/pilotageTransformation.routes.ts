import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
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
      preHandler: hasPermissionHandler("pilotage_reforme/lecture"),
    },
    async (request, response) => {
      const stats = await getTransformationStats();
      response.status(200).send(stats);
    }
  );
};
