//@ts-ignore
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getEtablissement } from "../queries/getEtablissement/getEtablissement.query";
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
    "/etablissement/:uai",
    { schema: ROUTES_CONFIG.getEtablissement },
    async (request, response) => {
      const { uai } = request.params;
      const etablissement = await getEtablissement({ uai });
      if (!etablissement) return response.status(404).send();
      response.status(200).send(etablissement);
    }
  );
};
