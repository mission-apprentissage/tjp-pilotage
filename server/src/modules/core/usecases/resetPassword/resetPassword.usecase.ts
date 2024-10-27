import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import jwt from "jsonwebtoken";
import { passwordRegex } from "shared/utils/passwordRegex";

import config from "@/config";
import { hashPassword } from "@/modules/core/utils/passwordUtils";

import { setPasswordQuery } from "./setPasswordQuery.dep";

export const [resetPassword, resetPasswordFactory] = inject(
  {
    setPasswordQuery,
    jwtSecret: config.auth.resetPasswordJwtSecret,
  },
  (deps) =>
    async ({
      password,
      repeatPassword,
      resetPasswordToken,
    }: {
      password: string;
      repeatPassword: string;
      resetPasswordToken: string;
    }) => {
      if (!resetPasswordToken) throw Boom.unauthorized("missing token");

      let decryptedToken: { email: string };
      try {
        decryptedToken = jwt.verify(resetPasswordToken, deps.jwtSecret) as {
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
      await deps.setPasswordQuery({ email, password: hashedPassword });
    }
);
