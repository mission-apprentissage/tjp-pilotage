import * as Boom from "@hapi/boom";
/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";

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
      if (!user) throw Boom.unauthorized("wrong credentials");
      if (!user.password) throw Boom.unauthorized("wrong credentials");

      const correctPassword = verifyPassword(password, user.password);
      if (!correctPassword) throw Boom.unauthorized("wrong credentials");

      return jwt.sign({ email }, deps.jwtSecret, {
        issuer: "orion",
        expiresIn: "7d",
      });
    }
);
