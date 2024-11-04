import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getDneUrlSchema } from "./getDneUrl.schema";
import { getDneUrl } from "./getDneUrl.usecase";

export const getDneAuthorizationUrlRoute = (server: Server) => {
  return createRoute("/dne_url", {
    method: "GET",
    schema: getDneUrlSchema,
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
