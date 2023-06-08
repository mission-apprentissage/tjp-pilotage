import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getRegions } from "../usecases/getRegions/getRegions.usecase";

export const regionsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/regions",
    { schema: ROUTES_CONFIG.getRegions },
    async (_, response) => {
      const regions = await getRegions();
      response.status(200).send(regions);
    }
  );
};
