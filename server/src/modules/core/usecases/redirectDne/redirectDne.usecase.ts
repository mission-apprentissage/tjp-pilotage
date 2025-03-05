import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import { flatten, uniq } from "lodash-es";
import type { UserinfoResponse } from "openid-client";
import {RoleEnum} from 'shared';

import config from "@/config";
import { getDneClient } from "@/modules/core/services/dneClient/dneClient";
import logger from "@/services/logger";

import { createUserInDB } from "./createUser.dep";
import { findEtablissement } from "./findEtablissement.dep";
import { findUserQuery } from "./findUserQuery.dep";

dayjs.extend(customParseFormat);

type ExtraUserInfo = {
  FrEduFonctAdm: string;
  FrEduRne: Array<string>;
  FrEduResDel?: Array<string>;
  FrEduRneResp?: Array<string>;
};

const extractUaisRep = (userInfo: UserinfoResponse<ExtraUserInfo>) => {
  const uais: Array<string> = [];
  const perdirOnUais = userInfo.FrEduRne?.map((item) => item.split("$")[0]);

  if (userInfo.FrEduFonctAdm === "DIR") {
    if (perdirOnUais.length > 0) {
      uais.push(...perdirOnUais);
    }
  }

  if (perdirOnUais?.length > 0) {
    /**
     * Format des délégations : <nom appli>|<nom ressource>|<date debut>|<date fin>|<delegant>|<fredurneresp>|<id serveur>|<fonction deleguee>|
     * Les délégations ici présentes sont forcément des perdir puisque c'est spécifié dans le scope de demande
     * openId.
     * Il est aussi nécessaire de dé-dupliquer les entrées puisqu'elles peuvent correspondre à d'anciennes
     * délégations.
     * frEduRneResp est au format suivant : FrEduRneResp=UAI$UAJ$PU$N$T3$LP$320
     **/
    const delegations = uniq(
      flatten(
        // @ts-expect-error TODO
        userInfo?.FrEduResDel?.map((del) => {
          const frEduRneResp = del.split("|")[5];
          const startDate = dayjs(del.split("|")[2], "DD/MM/YYYY");
          const endDate = dayjs(del.split("|")[3], "DD/MM/YYYY");
          const now = dayjs();

          if (startDate.isBefore(now) && endDate.isAfter(now)) {
            const frEduRnes = frEduRneResp.replace("FrEduRneResp=", "");
            return frEduRnes.split(";").map((frEduRne) => frEduRne.split("$")[0]);
          }
        })
      ).filter((del) => {
        return del !== undefined;
      }) as unknown as Array<string>
    );

    if (delegations.length > 0) {
      uais.push(...delegations);
    }
  }
  return uais;
};
// @ts-expect-error TODO
const getUserRoleAttributes = (userInfo: UserinfoResponse<ExtraUserInfo>) => {
  if (userInfo.FrEduFonctAdm === "DIR" || userInfo.FrEduResDel) {
    const uais = extractUaisRep(userInfo);

    if (uais.length > 0) {
      return {
        role: RoleEnum["perdir"],
        uais,
      };
    }
  }
};

const decodeCodeVerifierJwt = (token: string, secret: string) => {
  try {
    const decoded = (jwt.verify(token, secret) ?? {}) as {
      code_verifier: string;
    };
    if (decoded.code_verifier) {
      return decoded.code_verifier;
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (_e) {
    throw new Error("wrong codeVerifierJwt");
  }
  throw new Error("missing codeVerifierJwt");
};

export const [redirectDne, redirectDneFactory] = inject(
  {
    codeVerifierJwtSecret: config.dne.codeVerifierJwt,
    authJwtSecret: config.auth.authJwtSecret,
    getDneClient,
    findUserQuery,
    createUserInDB,
    findEtablissement,
  },
  (deps) =>
    async ({ codeVerifierJwt, url }: { codeVerifierJwt: string; url: string }) => {
      const code_verifier = decodeCodeVerifierJwt(codeVerifierJwt, deps.codeVerifierJwtSecret);

      if (!code_verifier) throw new Error("missing code_verifier");

      const client = await deps.getDneClient();
      const params = client.callbackParams(url);
      const tokenSet = await client.callback(config.dne.redirectUri, params, {
        code_verifier,
      });
      if (!tokenSet.access_token) throw new Error("missing access_token");

      const userinfo = await client.userinfo<ExtraUserInfo>(tokenSet.access_token);

      const email = userinfo.email?.toLowerCase();
      if (!email) {
        logger.error({
          error: new Error("missing user email"),
          userinfo,
        }, "[SSO] Il manque l'email de l'utilisateur");
        throw new Error("missing user email");
      }

      const user = await deps.findUserQuery(email);
      if (user && !user.enabled) {
        logger.error({
          error: new Error("user not enabled"),
          userinfo,
          email,
        }, "[SSO] L'utilisateur existe et est désactivé");
        throw new Error("user not enabled");
      }

      const attributes = getUserRoleAttributes(userinfo);
      if (!attributes) {
        logger.error({
          error: new Error("missing rights"),
          userinfo,
          email,
        }, "[SSO] Il manque les droits perdir pour l'utilisateur");
        throw new Error("missing right attributes");
      }

      const etablissement = attributes.uais && (await deps.findEtablissement({ uais: attributes.uais }));

      if (!etablissement?.codeRegion) {
        logger.error({
          error: new Error("missing codeRegion"),
          userinfo,
          email,
          attributes,
          etablissement,
        }, "[SSO] Il manque le code région pour l'établissement");
        throw new Error("missing codeRegion");
      }

      const userToInsert = {
        ...user,
        email,
        firstname: userinfo.given_name,
        lastname: userinfo.family_name,
        sub: userinfo.sub,
        codeRegion: etablissement?.codeRegion,
        enabled: true,
        ...attributes,
      };

      await deps.createUserInDB({ user: userToInsert });

      if (user) {
        logger.info(
          {
            user: userToInsert,
          },
          `[SSO] Nouveau login`
        );
      } else {
        logger.info(
          {
            user: userToInsert,
          },
          `[SSO] Nouvel utilisateur DNE`
        );
      }

      const authorizationToken = jwt.sign({ email }, deps.authJwtSecret, {
        issuer: "orion",
        expiresIn: "7d",
      });

      return { token: authorizationToken, user: userToInsert };
    }
);
