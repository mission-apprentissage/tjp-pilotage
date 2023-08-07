//@ts-ignore
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getPilotageReformeStats } from "../queries/getPilotageReformeStats/getPilotageReformeStats.query";

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
};
