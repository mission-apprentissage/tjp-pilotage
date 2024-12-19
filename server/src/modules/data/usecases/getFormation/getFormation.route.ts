import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getFormationUsecase } from "./getFormation.usecase";

const ROUTE = ROUTES["[GET]/formation/:cfd"];

export const getFormationRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const { cfd } = request.params;
        const result = await getFormationUsecase(cfd, request.query);
        response.status(200).send(result);
      },
    })
  );
};
