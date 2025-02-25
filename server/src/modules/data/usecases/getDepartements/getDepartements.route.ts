import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getDepartements } from "./getDepartements.query";

const ROUTE = ROUTES["[GET]/departements"];

export const getDepartementsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        const departements = await getDepartements();
        response.status(200).send(departements);
      },
    });
  });
};
