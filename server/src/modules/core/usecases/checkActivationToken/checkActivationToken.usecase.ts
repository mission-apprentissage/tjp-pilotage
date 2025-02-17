import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import * as jwt from "jsonwebtoken";

import config from "@/config";

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
        decryptedToken = jwt.verify(activationToken, deps.jwtSecret) as {
          email: string;
        };
      } catch {
        throw Boom.unauthorized("wrong token");
      }

      const email = decryptedToken.email.toLowerCase();
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
