//@ts-ignore
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getDataForPanorama } from "../usecases/getDataForPanorama/getDataForPanorama.usecase";
export const cadranRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/panorama/stats",
    { schema: ROUTES_CONFIG.getDataForPanorama },
    async (request, response) => {
      const q = request.query;
      if (!("codeRegion" in q)) {
        q;
      }
      const stats = await getDataForPanorama({
        ...request.query,
      });
      response.status(200).send(stats);
    }
  );
};
