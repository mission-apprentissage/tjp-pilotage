//@ts-ignore
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getFiltersForCadran } from "../usecases/getFiltersForCadran/getFiltersForCadran.usecase";
import { getFormationsForCadran } from "../usecases/getFormationsForCadran/getFormationsForCadran.usecase";
import { getRegionStatsForCadran } from "../usecases/getRegionStatsForCadran/getRegionStatsForCadran.usecase";
export const cadranRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/cadran/formations",
    { schema: ROUTES_CONFIG.getFormationsForCadran },
    async (request, response) => {
      const formations = await getFormationsForCadran({
        ...request.query,
      });
      response.status(200).send(formations);
    }
  );

  server.get(
    "/cadran/stats",
    { schema: ROUTES_CONFIG.getRegionStatsForCadran },
    async (request, response) => {
      const stats = await getRegionStatsForCadran({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );

  server.get(
    "/cadran/filters",
    { schema: ROUTES_CONFIG.getFiltersForCadran },
    async (request, response) => {
      const stats = await getFiltersForCadran({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );
};
