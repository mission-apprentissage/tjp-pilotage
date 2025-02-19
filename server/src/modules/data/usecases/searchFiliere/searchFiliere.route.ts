import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import type { Server } from "@/server/server";

import { searchFiliereUsecase } from "./searchFiliere.usecase";

const ROUTE = ROUTES["[GET]/filiere/search/:search"];

export const searchFiliereRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchFiliereUsecase({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
