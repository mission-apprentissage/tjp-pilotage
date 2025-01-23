import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

const ROUTE = ROUTES["[POST]/auth/logout"];

export const logoutRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
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
