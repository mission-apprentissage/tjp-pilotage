import Boom from "@hapi/boom";
import { inject } from "injecti";
import { verify } from "jsonwebtoken";
import { passwordRegex } from "shared/utils/passwordRegex";

import { config } from "../../../../../config/config";
import { hashPassword } from "../../utils/passwordUtils";
import { setPasswordQuery } from "./setPasswordQuery.dep";

export const [activateUser, activateUserFactory] = inject(
  {
    setPasswordQuery,
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
        decryptedToken = verify(activationToken, deps.jwtSecret) as {
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
