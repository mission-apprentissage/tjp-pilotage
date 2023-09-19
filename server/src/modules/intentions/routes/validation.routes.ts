import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
import { searchDiplome } from "../usecases/searchDiplome/searchDiplome.usecase";
import { searchEtab } from "../usecases/searchEtab/searchEtab.usecase";

export const validationRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/etab/search/:search",
    {
      schema: ROUTES_CONFIG.searchEtab,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const { search } = request.params;
      const result = await searchEtab({ search });
      response.status(200).send(result);
    }
  );

  server.get(
    "/diplome/search/:search",
    {
      schema: ROUTES_CONFIG.searchDiplome,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const { search } = request.params;
      const result = await searchDiplome({ search });
      response.status(200).send(result);
    }
  );
};
