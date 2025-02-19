import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import type { Server } from "@/server/server";

import { searchNsfUsecase } from "./searchNsf.usecase";

const ROUTE = ROUTES["[GET]/nsf/search/:search"];

export const searchNsfRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchNsfUsecase({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
