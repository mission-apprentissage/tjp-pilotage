import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { searchDiplome } from "./searchNsfFormation.usecase";

const ROUTE = ROUTES["[GET]/nsf-diplome/search/:search"];

export const searchNsfDiplomeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const filters = request.query;
        const result = await searchDiplome({ search, filters });
        response.status(200).send(result);
      },
    });
  });
};
