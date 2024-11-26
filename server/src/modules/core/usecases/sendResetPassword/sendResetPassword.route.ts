import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { sendResetPasswordSchema } from "./sendResetPassword.schema";
import { sendResetPassword } from "./sendResetPassword.usecase";

export const sendResetPasswordRoute = (server: Server) => {
  return createRoute("/auth/send-reset-password", {
    method: "POST",
    schema: sendResetPasswordSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { email } = request.body;
        await sendResetPassword({ email });
        response.status(200).send();
      },
    });
  });
};
