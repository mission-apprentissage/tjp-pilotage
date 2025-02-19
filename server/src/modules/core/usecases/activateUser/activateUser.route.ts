import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import type { Server } from "@/server/server";

import { activateUser } from "./activateUser.usecase";

const ROUTE = ROUTES["[POST]/auth/activate"];

export const activateUserRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { password, repeatPassword, activationToken } = request.body;

        await activateUser({
          password,
          repeatPassword,
          activationToken,
        });
        response.status(200).send();
      },
    });
  });
};
