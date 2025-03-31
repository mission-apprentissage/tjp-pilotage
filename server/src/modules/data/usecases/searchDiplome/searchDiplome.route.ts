import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { searchDiplome } from "./searchDiplome.usecase";

const ROUTE = ROUTES["[GET]/diplome/search/:search"];

export const searchDiplomeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const { ...filters } = request.query;
        const user = request.user!;
        const result = await searchDiplome({ ...filters, user, search });
        response.status(200).send(result);
      },
    });
  });
};
