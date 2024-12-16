import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getDomaineDeFormation } from "./getDomaineDeFormation.usecase";

const ROUTE = ROUTES["[GET]/domaine-de-formation/:codeNsf"];

export const getDomaineDeFormationRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const { codeNsf } = request.params;
        const result = await getDomaineDeFormation(codeNsf, request.query);
        response.status(200).send(result);
      },
    })
  );
};
