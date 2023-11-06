import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
import { getFormationsTransformationStats } from "../usecases/getFormationsTransformationStats/getFormationsTransformationStats.usecase";
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
      const { order, orderBy, ...filters } = request.query;

      const stats = await getTransformationStats({
        ...filters,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(stats);
    }
  );

  server.get(
    "/pilotage-transformation/formations",
    {
      schema: ROUTES_CONFIG.getFormationsTransformationStats,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
    },
    async (request, response) => {
      const { order, orderBy, ...filters } = request.query;
      const stats = await getFormationsTransformationStats({
        ...filters,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(stats);
    }
  );
};
