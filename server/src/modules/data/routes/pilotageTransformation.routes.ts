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
      schema: ROUTES_CONFIG.getStatsTransformation,
      preHandler: hasPermissionHandler("pilotage_reforme/lecture"),
    },
    async (request, response) => {
      const stats = await getTransformationStats({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );
};
