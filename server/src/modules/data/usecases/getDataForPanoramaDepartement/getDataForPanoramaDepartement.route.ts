import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getDataForPanoramaDepartement } from "./getDataForPanoramaDepartement.usecase";

const ROUTE = ROUTES["[GET]/panorama/stats/departement"];

export const getDataForPanoramaDepartementRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const stats = await getDataForPanoramaDepartement({
          ...filters,
        });
        response.status(200).send(stats);
      },
    });
  });
};
