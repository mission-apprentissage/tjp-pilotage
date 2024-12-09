import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getFormations } from "./getFormations.usecase";

const ROUTE = ROUTES["[GET]/formations"];

export const getFormationsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const formations = await getFormations({
          ...filters,
        });
        response.status(200).send(formations);
      },
    });
  });
};
