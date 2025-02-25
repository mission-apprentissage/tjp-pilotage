import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { searchCampusUsecase } from "./searchCampus.usecase";

const ROUTE = ROUTES["[GET]/campus/search/:search"];

export const searchCampusRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchCampusUsecase({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
