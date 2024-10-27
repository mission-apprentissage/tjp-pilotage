import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { checkActivationTokenSchema } from "./checkActivationToken.schema";
import { checkActivationToken } from "./checkActivationToken.usecase";

export const checkActivationTokenRoute = (server: Server) => {
  return createRoute("/auth/check-activation-token", {
    method: "GET",
    schema: checkActivationTokenSchema,
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
