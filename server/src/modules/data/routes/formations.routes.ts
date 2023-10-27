import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getFormations } from "../usecases/getFormations/getFormations.usecase";
export const formationsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/formations",
    {
      schema: ROUTES_CONFIG.getFormations,
    },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      const formations = await getFormations({
        ...rest,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(formations);
    }
  );
};
