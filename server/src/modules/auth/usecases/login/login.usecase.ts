import Boom from "@hapi/boom";
import { inject } from "injecti";
import jwt from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { kdb } from "../../../../db/db";
import { verifyPassword } from "../../utils/passwordUtils";

export const [login] = inject(
  {
    findUserQuery: ({ email }: { email: string }) =>
      kdb
        .selectFrom("user")
        .where("user.email", "=", email)
        .select(["email", "password"])
        .executeTakeFirst(),
  },
  (deps) =>
    async ({ email, password }: { email: string; password: string }) => {
      const user = await deps.findUserQuery({ email });
      if (!user) throw Boom.unauthorized("wrong credentials");
      if (!user.password) throw Boom.unauthorized("wrong credentials");

      const correctPassword = verifyPassword(password, user.password);
      if (!correctPassword) throw Boom.unauthorized("wrong credentials");

      return jwt.sign({ email }, config.auth.jwtSecret, {
        issuer: "orion",
        expiresIn: "7d",
      });
    }
);
