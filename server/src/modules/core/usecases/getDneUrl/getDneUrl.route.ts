import { createRoute } from "@http-wizard/core";
import cookie from "cookie";

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
        const cookies = cookie.serialize("dne-code-verifier", codeVerifierJwt, {
          maxAge: 240 * 60 * 1000,
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          path: "/",
        });
        response.status(200).header("set-cookie", cookies).send({ url });
      },
    });
  });
};
