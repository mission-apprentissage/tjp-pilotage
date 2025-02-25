import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getAnalyseDetailleeEtablissement } from "./getAnalyseDetailleeEtablissement.usecase";

const ROUTE = ROUTES["[GET]/etablissement/:uai/analyse-detaillee"];

export const getAnalyseDetailleeEtablissementRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const analyseDetaillee = await getAnalyseDetailleeEtablissement({
          uai,
        });
        response.status(200).send(analyseDetaillee);
      },
    });
  });
};
