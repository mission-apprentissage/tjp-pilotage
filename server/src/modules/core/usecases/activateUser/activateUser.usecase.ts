import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import { passwordRegex } from "shared/utils/passwordRegex";

import config from "@/config";
import { hashPassword } from "@/modules/core/utils/passwordUtils";

import { updateUserQuery } from "./updateUserQuery.dep";

export const [activateUser, activateUserFactory] = inject(
  {
    updateUserQuery: updateUserQuery,
    jwtSecret: config.auth.activationJwtSecret,
  },
  (deps) =>
    async ({
      password,
      repeatPassword,
      activationToken,
    }: {
      password: string;
      repeatPassword: string;
      activationToken: string;
    }) => {
      if (!activationToken) throw Boom.unauthorized("missing token");

      let decryptedToken: { email: string };
      try {
        decryptedToken = jwt.verify(activationToken, deps.jwtSecret) as {
          email: string;
        };
      } catch {
        throw Boom.unauthorized("wrong token");
      }

      const email = decryptedToken.email.toLowerCase();

      if (password !== repeatPassword) {
        throw Boom.badRequest("different passwords");
      }

      if (!password.match(passwordRegex)) {
        throw Boom.badRequest("password unsafe");
      }

      const hashedPassword = hashPassword(password);
      await deps.updateUserQuery({ email, password: hashedPassword });
    }
);
