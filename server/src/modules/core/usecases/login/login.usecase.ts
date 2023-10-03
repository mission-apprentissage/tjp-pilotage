import Boom from "@hapi/boom";
import { inject } from "injecti";
import jwt from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { verifyPassword } from "../../utils/passwordUtils";
import { findUserQuery } from "./findUserQuery.dep";

export const [login, loginFactory] = inject(
  {
    findUserQuery,
    jwtSecret: config.auth.authJwtSecret,
  },
  (deps) =>
    async ({ email, password }: { email: string; password: string }) => {
      const formattedEmail = email.toLowerCase();
      const user = await deps.findUserQuery({ email: formattedEmail });
      if (!user) throw Boom.unauthorized("wrong credentials");
      if (!user.password) throw Boom.unauthorized("wrong credentials");

      const correctPassword = verifyPassword(password, user.password);
      if (!correctPassword) throw Boom.unauthorized("wrong credentials");

      return jwt.sign({ email: formattedEmail }, deps.jwtSecret, {
        issuer: "orion",
        expiresIn: "7d",
      });
    }
);
