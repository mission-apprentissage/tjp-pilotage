import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import * as jwt from "jsonwebtoken";

import config from "@/config";
import { shootTemplate } from "@/modules/core/services/mailer/mailer";

import { findUserQuery } from "./findUserQuery.dep";
export const [sendResetPassword, sendResetPasswordFactory] = inject(
  {
    findUserQuery,
    shootTemplate,
    jwtSecret: config.auth.resetPasswordJwtSecret,
  },
  (deps) =>
    async ({ email }: { email: string }) => {
      const user = await deps.findUserQuery({ email });

      if (!user) {
        throw Boom.notFound("Email inconnu dans Orion.");
      }

      if (user.sub) {
        throw Boom.badRequest(
          "Vous ne pouvez pas réinitialiser votre mot de passe, veuillez vous connecter à Orion via le portail ARENA."
        );
      }

      const resetPasswordToken = jwt.sign({ email }, deps.jwtSecret, {
        expiresIn: "1h",
      });

      await deps.shootTemplate({
        template: "reset_password",
        subject: "Orion : réinitialisation du mot de passe",
        to: email,
        data: {
          resetPasswordToken,
          recipient: {
            email,
            firstname: user.firstname,
            lastname: user.lastname,
          },
        },
      });
    }
);
