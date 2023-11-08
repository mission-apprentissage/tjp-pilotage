import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getDepartements } from "../queries/getDepartements/getDepartements.query";
import { getDepartementsStats } from "../queries/getDepartementsStats/getDepartementsStats.query";

export const departementsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/departements",
    { schema: ROUTES_CONFIG.getDepartements },
    async (_, response) => {
      const departements = await getDepartements();
      response.status(200).send(departements);
    }
  );

  server.get(
    "/departement/:codeDepartement",
    { schema: ROUTES_CONFIG.getDepartementStats },
    async (request, response) => {
      const departementsStats = await getDepartementsStats({
        ...request.params,
        ...request.query,
      });
      if (!departementsStats) return response.status(404).send();
      response.status(200).send(departementsStats);
    }
  );
};
