import Boom from "@hapi/boom";
import { inject } from "injecti";
import { verify } from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { hashPassword } from "../../utils/passwordUtils";
import { setPasswordQuery } from "./setPasswordQuery.dep";

export const [setUserPassword] = inject(
  {
    setPasswordQuery,
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
        decryptedToken = verify(activationToken, config.auth.jwtSecret) as {
          email: string;
        };
      } catch {
        throw Boom.unauthorized("wrong token");
      }

      const email = decryptedToken.email;

      if (password !== repeatPassword) {
        throw Boom.badRequest("different passwords");
      }

      const hashedPassword = hashPassword(password);
      await deps.setPasswordQuery({ email, password: hashedPassword });
    }
);
