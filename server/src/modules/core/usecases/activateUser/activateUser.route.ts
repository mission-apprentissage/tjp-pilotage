import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { activateUserSchema } from "./activateUser.schema";
import { activateUser } from "./activateUser.usecase";

export const activateUserRoute = (server: Server) => {
  return createRoute("/auth/activate", {
    method: "POST",
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
