import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getDomainesDeFormation } from "./getDomainesDeFormation.usecase";

const ROUTE = ROUTES["[GET]/domaine-de-formation"];

export const getDomainesDeFormationRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.query;
        const result = await getDomainesDeFormation(search);
        response.status(200).send(result);
      },
    }),
  );
};
