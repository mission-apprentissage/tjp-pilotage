import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { searchDisciplineUsecase } from "./searchDiscipline.usecase";

const ROUTE = ROUTES["[GET]/discipline/search/:search"];

export const searchDisciplineRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchDisciplineUsecase({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
