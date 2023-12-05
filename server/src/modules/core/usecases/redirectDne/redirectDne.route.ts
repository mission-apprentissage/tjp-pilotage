import { createRoute } from "@http-wizard/core";
import cookie from "cookie";

import { logger } from "../../../../logger";
import { Server } from "../../../../server";
import { redirectDneSchema } from "./redirectDne.schema";
import { redirectDne } from "./redirectDne.usecase";

export const redirectDneRoute = (server: Server) => {
  return createRoute("/dne_connect", {
    method: "GET",
    schema: redirectDneSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        try {
          const codeVerifierJwt = cookie.parse(request.headers.cookie ?? "")[
            "dne-code-verifier"
          ];

          const { token } = await redirectDne({
            codeVerifierJwt,
            url: request.url,
          });

          const cookies = cookie.serialize("Authorization", token, {
            maxAge: 30 * 24 * 3600000,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/",
          });

          response.header("set-cookie", cookies).redirect(302, "/").send();
        } catch (error) {
          logger.error("echec dne redirect", { error: error as Error });
          response.redirect(302, "/login").send();
        }
      },
    });
  });
};
