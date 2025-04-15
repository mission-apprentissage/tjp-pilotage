import type { FastifyRequest } from "fastify";
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { getDneUrl } from "@/modules/core/usecases/getDneUrl/getDneUrl.usecase";
import type { Server } from "@/server/server";
import logger from "@/services/logger";

import { ERROR_TYPE } from "./const";
import { redirectDne } from "./redirectDne.usecase";

const ROUTE = ROUTES["[GET]/dne_connect"];

interface RedirectDNEQueryString {
  code?: string;
}

export const redirectDneRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request: FastifyRequest<{ Querystring: RedirectDNEQueryString }>, response) => {
        try {
          const codeVerifierJwt = request.cookies["dne-code-verifier"];

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

            /**
             * Return est obligatoire ici pour interrompre l'exécution de la fonction
             * et empêcher la séquence d'authentification d'être exécutée en entière.
             */
            return response
              .setCookie("dne-code-verifier", tmpCodeVerifierJwt, {
                maxAge: 240 * 60 * 1000,
                httpOnly: true,
                sameSite: "lax",
                secure: true,
                path: "/",
              })
              .redirect(url, 302)
              .send();
          }

          const { token, user } = await redirectDne({
            codeVerifierJwt: codeVerifierJwt as string,
            url: request.url,
          });

          let url = '/';
          if (user.uais.length > 0) {
            url = `/panorama/etablissement/${user.uais[0]}`;
          }

          logger.info("[SSO] Redirection de l'utilisateur", { user, url });

          response
            .setCookie("Authorization", token, {
              maxAge: 30 * 24 * 3600000,
              httpOnly: true,
              sameSite: "lax",
              secure: true,
              path: "/",
            })
            .redirect(url, 302)
            .send();
        } catch (error) {
          logger.error({ error: error as Error }, "[SSO] echec dne redirect");
          response.redirect(302, `/auth/login?error=${ERROR_TYPE}`).send();
        }
      },
    });
  });
};
