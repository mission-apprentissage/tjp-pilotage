import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getDepartementStats } from "./getDepartement.query";

const ROUTE = ROUTES["[GET]/departement/:codeDepartement"];

export const getDepartementRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const departementsStats = await getDepartementStats({
          ...request.params,
          ...request.query,
        });
        if (!departementsStats) return response.status(404).send();
        response.status(200).send(departementsStats);
      },
    });
  });
};
