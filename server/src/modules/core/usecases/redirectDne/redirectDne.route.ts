import { createRoute } from "@http-wizard/core";
import cookie from "cookie";
import type { FastifyRequest } from "fastify";

import { getDneUrl } from "@/modules/core/usecases/getDneUrl/getDneUrl.usecase";
import type { Server } from "@/server/server";
import logger from "@/services/logger";

import { ERROR_TYPE } from "./const";
import { redirectDneSchema } from "./redirectDne.schema";
import { redirectDne } from "./redirectDne.usecase";

interface RedirectDNEQueryString {
  code?: string;
}

export const redirectDneRoute = (server: Server) => {
  return createRoute("/dne_connect", {
    method: "GET",
    schema: redirectDneSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request: FastifyRequest<{ Querystring: RedirectDNEQueryString }>, response) => {
        try {
          const codeVerifierJwt = cookie.parse(request.headers.cookie ?? "")["dne-code-verifier"];

          /**
           * Lors d'une séquence d'authentification initiée par le portail Orion,
           * l'utliisateur sera redirigé par le provider d'authentification DNE sur
           * cette route avec un code en paramètre d'URL. Ce code est nécessaire à
           * la poursuite de la séquence d'autentification (en paramètre de la callback
           * d'authentification).
           *
           * Si celui-ci n'est pas  présent, nous devons faire cette redirection
           * manuellement pour l'obtenir. L'utilisateur sera redirigé par le provider
           * sur cette même url, avec cette fois-ci le code en paramètre d'url.
           */
          if (request.query.code === undefined) {
            const { url, codeVerifierJwt: tmpCodeVerifierJwt } = await getDneUrl();
            const cookies = cookie.serialize("dne-code-verifier", tmpCodeVerifierJwt, {
              maxAge: 240 * 60 * 1000,
              httpOnly: true,
              sameSite: "lax",
              secure: true,
              path: "/",
            });

            /**
             * Return est obligatoire ici pour interrompre l'exécution de la fonction
             * et empêcher la séquence d'authentification d'être exécutée en entière.
             */
            return response.header("set-cookie", cookies).redirect(302, url).send();
          }

          const { token, user } = await redirectDne({
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

          response.header("set-cookie", cookies).redirect(302, `/panorama/etablissement/${user.uais[0]}`).send();
        } catch (error) {
          logger.error("echec dne redirect", { error: error as Error });
          response.redirect(302, `/auth/login?error=${ERROR_TYPE}`).send();
        }
      },
    });
  });
};
