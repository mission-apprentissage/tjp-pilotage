import Boom from "@hapi/boom";
import { inject } from "injecti";
import { verify } from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { findUserQuery } from "./findUserQuery.dep";

export const [checkActivationToken, checkActivationTokenFactory] = inject(
  {
    findUserQuery,
    jwtSecret: config.auth.activationJwtSecret,
  },
  (deps) =>
    async ({ activationToken }: { activationToken: string }) => {
      let decryptedToken: { email: string };
      try {
        decryptedToken = verify(activationToken, deps.jwtSecret) as {
          email: string;
        };
      } catch {
        throw Boom.unauthorized("wrong token");
      }

      const email = decryptedToken.email;
      const user = await deps.findUserQuery({ email });

      if (!user) {
        throw Boom.unauthorized("wrong token");
      }

      if (user.password) {
        throw Boom.badRequest("user active");
      }

      return true as const;
    }
);
