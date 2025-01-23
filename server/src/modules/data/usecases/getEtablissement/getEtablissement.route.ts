import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getEtablissement } from "./getEtablissement.usecase";

const ROUTE = ROUTES["[GET]/etablissement/:uai"];

export const getEtablissementRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const result = await getEtablissement({ uai });
        response.status(200).send(result);
      },
    });
  });
};
