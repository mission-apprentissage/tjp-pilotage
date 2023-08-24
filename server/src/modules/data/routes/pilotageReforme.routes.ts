import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getPilotageReformeStats } from "../queries/getPilotageReformeStats/getPilotageReformeStats.query";
import { getPilotageReformeStatsRegions } from "../queries/getPilotageReformeStatsRegions/getPilotageReformeStatsRegions.query";

export const pilotageReformeRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/pilotage-reforme/stats",
    { schema: ROUTES_CONFIG.getPilotageReformeStats },
    async (request, response) => {
      const stats = await getPilotageReformeStats({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );

  server.get(
    "/pilotage-reforme/stats/regions",
    { schema: ROUTES_CONFIG.getPilotageReformeStatsRegions },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      const stats = await getPilotageReformeStatsRegions({
        ...rest,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(stats);
    }
  );
};
