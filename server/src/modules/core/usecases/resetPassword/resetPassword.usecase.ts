import * as Boom from "@hapi/boom";
/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import { passwordRegex } from "shared/utils/passwordRegex";

import config from "@/config";
import { hashPassword } from "@/modules/core/utils/passwordUtils";
import { inject } from "@/utils/inject";

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
      if (!resetPasswordToken)
        throw Boom.unauthorized(
          "Lien de réinitialisation incorrect ou expiré. Veuillez reprendre la procédure de réinitialisation depuis le début."
        );

      let decryptedToken: { email: string };
      try {
        decryptedToken = jwt.verify(resetPasswordToken, deps.jwtSecret) as {
          email: string;
        };
      } catch {
        throw Boom.unauthorized(
          "Lien de réinitialisation incorrect ou expiré. Veuillez reprendre la procédure de réinitialisation depuis le début."
        );
      }

      const email = decryptedToken.email.toLowerCase();

      if (password !== repeatPassword) {
        throw Boom.badRequest("Mot de passe non identiques.");
      }

      if (!password.match(passwordRegex)) {
        throw Boom.badRequest(
          "Le mot de passe doit contenir entre 8 et 15 caractères, une lettre en minuscule, une lettre en majuscule, un chiffre et un caractère spécial (les espaces ne sont pas acceptés)"
        );
      }

      const hashedPassword = hashPassword(password);
      await deps.setPasswordQuery({ email, password: hashedPassword });
    }
);
