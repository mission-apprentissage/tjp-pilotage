//@ts-ignore
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getDataForPanorama } from "../usecases/getDataForPanorama/getDataForPanorama.usecase";
import { getFiltersForCadran } from "../usecases/getFiltersForCadran/getFiltersForCadran.usecase";
export const cadranRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/panorama/stats",
    { schema: ROUTES_CONFIG.getDataForPanorama },
    async (request, response) => {
      const stats = await getDataForPanorama({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );

  server.get(
    "/panorama/filters",
    { schema: ROUTES_CONFIG.getFiltersForCadran },
    async (request, response) => {
      const stats = await getFiltersForCadran({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );
};
