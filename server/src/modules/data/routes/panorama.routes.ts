import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import {
  getDataForPanoramaDepartement,
  getDataForPanoramaRegion,
} from "../usecases/getDataForPanorama/getDataForPanorama.usecase";
export const panoramaRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/panorama/stats/region",
    { schema: ROUTES_CONFIG.getDataForPanoramaRegion },
    async (request, response) => {
      const { order, orderBy, ...filters } = request.query;
      const stats = await getDataForPanoramaRegion({
        ...filters,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(stats);
    }
  );
  server.get(
    "/panorama/stats/departement",
    { schema: ROUTES_CONFIG.getDataForPanoramaDepartement },
    async (request, response) => {
      const { order, orderBy, ...filters } = request.query;
      const stats = await getDataForPanoramaDepartement({
        ...filters,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(stats);
    }
  );
};
