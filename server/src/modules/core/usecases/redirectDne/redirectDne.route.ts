import type { FastifyRequest } from "fastify";
import { DneSSOErrorsEnum } from "shared/enum/dneSSOErrorsEnum";
import { DneSSOInfoEnum } from "shared/enum/dneSSOInfoEnum";
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { getDneUrl } from "@/modules/core/usecases/getDneUrl/getDneUrl.usecase";
import type { Server } from "@/server/server";
import logger from "@/services/logger";

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

          const { token, user, userCommunication } = await redirectDne({
            codeVerifierJwt: codeVerifierJwt as string,
            url: request.url,
          });

          let url = '/';
          if (user.uais.length > 0) {
            url = `/panorama/etablissement/${user.uais[0]}`;
          }

          userCommunication.push(DneSSOInfoEnum.USER_LOGGED_IN);

          logger.info({ user, url, userCommunication }, "[SSO] Redirection Utilisateur");

          response
            .setCookie("Authorization", token, {
              maxAge: 30 * 24 * 3600000,
              httpOnly: true,
              sameSite: "lax",
              secure: true,
              path: "/",
            })
            .redirect(`${url}${userCommunication ? `?sso=${userCommunication.join(',')}` : ''}`, 302)
            .send();
        } catch (err) {
          let error = err as Error;
          if (!((Object).values(DneSSOErrorsEnum) as string[]).includes(error.message)) {
            error = new Error(DneSSOErrorsEnum.FAILURE_ON_DNE_REDIRECT);
          }
          logger.error({ error }, `[SSO] ${error.message.toLocaleLowerCase().replace(/_/g, " ")}`);
          response.redirect(`/auth/login?error=${error.message}`, 302).send();
        }
      },
    });
  });
};
