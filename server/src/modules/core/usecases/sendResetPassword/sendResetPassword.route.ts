import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { sendResetPassword } from "./sendResetPassword.usecase";

const ROUTE = ROUTES["[POST]/auth/send-reset-password"];

export const sendResetPasswordRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
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
