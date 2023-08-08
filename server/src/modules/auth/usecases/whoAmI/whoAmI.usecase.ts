import Boom from "@hapi/boom";
import { inject } from "injecti";
import jwt from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { findUserQuery } from "./findUserQuery.dep";
export const [whoAmI] = inject(
  { findUserQuery },
  (deps) =>
    async ({ token }: { token: string }) => {
      const { email } = jwt.verify(token, config.auth.jwtSecret) as {
        email: string;
      };
      const user = await deps.findUserQuery({ email });
      if (!user) throw Boom.unauthorized();
      return user;
    }
);
