import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
import { getEtab } from "../usecases/getEtab/getEtab.usecase";
import { searchDiplome } from "../usecases/searchDiplome/searchDiplome.usecase";
import { searchEtab } from "../usecases/searchEtab/searchEtab.usecase";

export const validationRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/etab/search/:search",
    {
      schema: ROUTES_CONFIG.searchEtab,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { search } = request.params;
      const result = await searchEtab({ search, user: request.user });
      response.status(200).send(result);
    }
  );

  server.get(
    "/etab/:uai",
    {
      schema: ROUTES_CONFIG.getEtab,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { uai } = request.params;
      const result = await getEtab({ uai });
      response.status(200).send(result);
    }
  );

  server.get(
    "/diplome/search/:search",
    {
      schema: ROUTES_CONFIG.searchDiplome,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { search } = request.params;
      const result = await searchDiplome({ search });
      response.status(200).send(result);
    }
  );
};
