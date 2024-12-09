import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getHeaderEtablissement } from "./getHeaderEtablissement.usecase";

const ROUTE = ROUTES["[GET]/etablissement/:uai/header"];

export const getHeaderEtablissementRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const result = await getHeaderEtablissement({ uai });
        response.status(200).send(result);
      },
    });
  });
};
