import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
import { checkCfd } from "../usecases/checkCfd/checkCfd.usecase";
import { checkUai } from "../usecases/checkUai/checkUai.usecase";
import { searchDiplome } from "../usecases/searchDiplome/searchDiplome.usecase";
import { searchEtab } from "../usecases/searchEtab/searchEtab";

export const validationRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/uai/:uai/check",
    {
      schema: ROUTES_CONFIG.checkUai,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const { uai } = request.params;
      const result = await checkUai({ uai });
      response.status(200).send(result);
    }
  );

  server.get(
    "/cfd/:cfd/check",
    {
      schema: ROUTES_CONFIG.checkCfd,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const { cfd } = request.params;
      const result = await checkCfd({ cfd });
      response.status(200).send(result);
    }
  );

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
