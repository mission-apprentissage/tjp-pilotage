import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getCapacitePrecedenteUsecase } from "./getCapacitePrecedente.usecase";

const ROUTE = ROUTES["[GET]/capacite-precedente"];

export const getCapacitePrecedenteRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const capacite = await getCapacitePrecedenteUsecase(filters);

        response.status(200).send(capacite);
      },
    });
  });
};
