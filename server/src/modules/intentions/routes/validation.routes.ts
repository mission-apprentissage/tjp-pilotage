import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { checkUai } from "../usecases/checkUai/checkUai.usecase";

export const validationRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/uai/:uai/check",
    { schema: ROUTES_CONFIG.checkUai },
    async (request, response) => {
      const { uai } = request.params;
      const result = await checkUai({ uai });
      response.status(200).send(result);
    }
  );
};
