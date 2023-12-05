import { inject } from "injecti";
import jwt from "jsonwebtoken";
import { UserinfoResponse } from "openid-client";

import { config } from "../../../../../config/config";
import { getDneClient } from "../../services/dneClient/dneClient";
import { createUserInDB } from "./createUser.dep";
import { findUserQuery } from "./findUserQuery.dep";

type ExtraUserInfo = { FrEduFonctAdm: string; FrEduRne: [string] };

const getUserRoleAttributes = (userInfo: UserinfoResponse<ExtraUserInfo>) => {
  if (userInfo.FrEduFonctAdm === "DIR") {
    return {
      role: "perdir",
      // uai: userInfo.FrEduRne[0].split("$")[0],
    };
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
  } catch (e) {
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
  },
  (deps) =>
    async ({
      codeVerifierJwt,
      url,
    }: {
      codeVerifierJwt: string;
      url: string;
    }) => {
      const code_verifier = decodeCodeVerifierJwt(
        codeVerifierJwt,
        deps.codeVerifierJwtSecret
      );

      if (!code_verifier) throw new Error("missing code_verifier");

      const client = await deps.getDneClient();
      const params = client.callbackParams(url);
      const tokenSet = await client.callback(config.dne.redirectUri, params, {
        code_verifier,
      });
      if (!tokenSet.access_token) throw new Error("missing access_token");

      const userinfo = await client.userinfo<ExtraUserInfo>(
        tokenSet.access_token
      );

      const email = userinfo.email;
      if (!email) throw new Error("missing user email");

      const user = await deps.findUserQuery(email);

      if (user) {
        return {
          token: jwt.sign({ email }, deps.authJwtSecret, {
            issuer: "orion",
            expiresIn: "7d",
          }),
        };
      }

      const attributes = getUserRoleAttributes(userinfo);

      if (!attributes) throw new Error("missing user info");

      await deps.createUserInDB({
        user: {
          email,
          firstname: userinfo.given_name,
          lastname: userinfo.family_name,
          ...attributes,
        },
      });

      const authorizationToken = jwt.sign({ email }, deps.authJwtSecret, {
        issuer: "orion",
        expiresIn: "7d",
      });

      return { token: authorizationToken };
    }
);
