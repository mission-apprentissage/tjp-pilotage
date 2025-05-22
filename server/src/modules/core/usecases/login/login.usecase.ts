import * as Boom from "@hapi/boom";
/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import { LoginErrorsEnum } from "shared/enum/loginErrorsEnum";

import config from "@/config";
import { verifyPassword } from "@/modules/core/utils/passwordUtils";
import { inject } from "@/utils/inject";

import { findUserQuery } from "./findUserQuery.dep";

export const [login, loginFactory] = inject(
  {
    findUserQuery,
    jwtSecret: config.auth.authJwtSecret,
  },
  (deps) =>
    async ({ email, password }: { email: string; password: string }) => {
      const user = await deps.findUserQuery({ email });
      if (!user) throw Boom.unauthorized(LoginErrorsEnum.WRONG_CREDENTIALS);
      if (!user.enabled) throw Boom.unauthorized(LoginErrorsEnum.DISABLED);
      if (!user.password) throw Boom.unauthorized(LoginErrorsEnum.NO_PASSWORD);
      if (user.sub) throw Boom.unauthorized(LoginErrorsEnum.EXTERNAL_USER);

      const correctPassword = verifyPassword(password, user.password);
      if (!correctPassword) throw Boom.unauthorized(LoginErrorsEnum.WRONG_CREDENTIALS);

      return jwt.sign({ email }, deps.jwtSecret, {
        issuer: "orion",
        expiresIn: "7d",
      });
    }
);
