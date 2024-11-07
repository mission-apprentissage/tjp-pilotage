import { createRoute } from "@http-wizard/core";
import { API_ROUTES } from "shared/routes";

import type { Server } from "@/server/server";

import { checkActivationToken } from "./checkActivationToken.usecase";

const route = API_ROUTES.GET["/auth/check-activation-token"];

export const checkActivationTokenRoute = (server: Server) => {
  return createRoute(route.path, {
    method: route.method,
    schema: route.schema,
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
