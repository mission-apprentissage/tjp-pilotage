import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { checkActivationToken } from "./checkActivationToken.usecase";

const ROUTE = ROUTES["[GET]/auth/check-activation-token"];

export const checkActivationTokenRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { activationToken } = request.query;

        const valid = await checkActivationToken({
          activationToken,
        });
        response.status(200).send({ valid });
      },
    });
  });
};
