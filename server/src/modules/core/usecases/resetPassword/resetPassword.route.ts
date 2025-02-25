import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { resetPassword } from "./resetPassword.usecase";

const ROUTE = ROUTES["[POST]/auth/reset-password"];

export const resetPasswordRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
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
