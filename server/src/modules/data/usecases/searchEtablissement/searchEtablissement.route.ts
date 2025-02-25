import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { searchEtablissement } from "./searchEtablissement.usecase";

const ROUTE = ROUTES["[GET]/etablissement/search/:search"];

export const searchEtablissementRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const { filtered } = request.query;
        const result = await searchEtablissement({
          search,
          filtered,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
