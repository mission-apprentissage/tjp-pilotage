import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getFormationIndicateursUseCase } from "./getFormationIndicateurs.usecase";

const ROUTE = ROUTES["[GET]/formation/:cfd/indicators"];

export const getFormationIndicateursRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const { cfd } = request.params;
        const result = await getFormationIndicateursUseCase(cfd, request.query);
        response.status(200).send(result);
      },
    })
  );
};
