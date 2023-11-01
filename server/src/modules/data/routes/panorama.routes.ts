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
      const q = request.query;
      if (!("codeRegion" in q)) {
        q;
      }
      const stats = await getDataForPanoramaRegion({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );
  server.get(
    "/panorama/stats/departement",
    { schema: ROUTES_CONFIG.getDataForPanoramaDepartement },
    async (request, response) => {
      const q = request.query;
      if (!("codeDepartement" in q)) {
        q;
      }
      const stats = await getDataForPanoramaDepartement({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );
};
