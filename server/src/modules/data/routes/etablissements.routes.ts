import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getEtablissement } from "../usecases/getEtablissement/getEtablissement.usecase";
import { getEtablissements } from "../usecases/getEtablissements/getEtablissements.usecase";
export const etablissementsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/etablissements",
    { schema: ROUTES_CONFIG.getEtablissements },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      const etablissements = await getEtablissements({
        ...rest,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(etablissements);
    }
  );

  server.get(
    "/etablissement",
    { schema: ROUTES_CONFIG.getEtablissement },
    async (request, response) => {
      const { order, orderBy, ...filters } = request.query;
      const etablissement = await getEtablissement({
        ...filters,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      if (!etablissement) return response.status(404).send();
      response.status(200).send(etablissement);
    }
  );
};
