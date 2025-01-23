import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { login } from "./login.usecase";

const ROUTE = ROUTES["[POST]/auth/login"];

export const loginRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { email, password } = request.body;

        const token = await login({ email, password });

        response
          .status(200)
          .setCookie("Authorization", token, {
            maxAge: 30 * 24 * 3600000,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/",
          })
          .send({ token });
      },
    });
  });
};
