import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getDataForPanoramaEtablissement } from "./getDataForPanoramaEtablissement.usecase";
const ROUTE = ROUTES["[GET]/panorama/stats/etablissement/:uai"];

export const getDataForPanoramaEtablissementRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { order, orderBy, ...filters } = request.query;
        const etablissement = await getDataForPanoramaEtablissement({
          ...filters,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        if (!etablissement) return response.status(404).send();
        response.status(200).send(etablissement);
      },
    });
  });
};
