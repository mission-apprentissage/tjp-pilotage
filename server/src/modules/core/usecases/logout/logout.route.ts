import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { logoutSchema } from "./logout.schema";

export const logoutRoute = (server: Server) => {
  return createRoute("/auth/logout", {
    method: "POST",
    schema: logoutSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        response
          .status(200)
          .setCookie("Authorization", "", {
            maxAge: 30 * 24 * 3600000,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/",
          })
          .send();
      },
    });
  });
};
