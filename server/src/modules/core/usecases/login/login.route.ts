import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { loginSchema } from "./login.schema";
import { login } from "./login.usecase";

export const loginRoute = (server: Server) => {
  return createRoute("/auth/login", {
    method: "POST",
    schema: loginSchema,
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
