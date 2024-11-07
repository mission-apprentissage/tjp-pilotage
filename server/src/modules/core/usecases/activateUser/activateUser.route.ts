import { createRoute } from "@http-wizard/core";
import { API_ROUTES } from "shared/routes";
import { activateUserSchema } from "shared/routes/auth/schemas/post.auth.activate";

import type { Server } from "@/server/server";

import { activateUser } from "./activateUser.usecase";

const route = API_ROUTES["POST"]["/auth/activate"];

export const activateUserRoute = (server: Server) => {
  return createRoute(route.path, {
    method: route.method,
    schema: activateUserSchema,
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
