import { createRoute } from "shared/http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { getDneUrl } from "./getDneUrl.usecase";

const ROUTE = ROUTES["[GET]/dne_url"];

export const getDneAuthorizationUrlRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        const { url, codeVerifierJwt } = await getDneUrl();
        response
          .status(200)
          .setCookie("dne-code-verifier", codeVerifierJwt, {
            maxAge: 240 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/",
          })
          .send({ url });
      },
    });
  });
};
