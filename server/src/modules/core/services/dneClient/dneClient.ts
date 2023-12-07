import { Issuer } from "openid-client";

import { config } from "../../../../../config/config";

export const getDneClient = async () => {
  const pdsIssuer = await Issuer.discover(
    "https://hub-oidc.orion.education.fr/.well-known/openid-configuration"
  );

  const client = new pdsIssuer.Client({
    client_id: config.dne.clientId,
    client_secret: config.dne.clientSecret,
    redirect_uris: [config.dne.redirectUri],
    response_types: ["code"],
    token_endpoint_auth_method: "client_secret_post",
  });
  return client;
};
