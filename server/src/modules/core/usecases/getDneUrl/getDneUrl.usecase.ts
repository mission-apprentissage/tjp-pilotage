import { inject } from "injecti";
/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import { generators } from "openid-client";

import config from "@/config";
import { getDneClient } from "@/modules/core/services/dneClient/dneClient";

export const [getDneUrl, getDneUrlFactory] = inject(
  {
    getDneClient,
    signJwt: jwt.sign,
  },
  (deps) => async () => {
    const client = await deps.getDneClient();

    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);

    const url = client.authorizationUrl({
      scope: "openid email profile hub.scope.perdir hub.scope.cnx hub.scope.orionij",
      response_type: "code",
      code_challenge,
      code_challenge_method: "S256",
    });

    const codeVerifierJwt = deps.signJwt({ code_verifier }, config.dne.codeVerifierJwt, {
      issuer: "orion",
    });

    return { url, codeVerifierJwt };
  }
);
