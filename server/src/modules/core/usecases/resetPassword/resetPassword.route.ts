import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { resetPasswordSchema } from "./resetPassword.schema";
import { resetPassword } from "./resetPassword.usecase";

export const resetPasswordRoute = (server: Server) => {
  return createRoute("/auth/reset-password", {
    method: "POST",
    schema: resetPasswordSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { password, repeatPassword, resetPasswordToken } = request.body;
        await resetPassword({ password, repeatPassword, resetPasswordToken });
        response.status(200).send();
      },
    });
  });
};
