import Boom from "@hapi/boom";
import { inject } from "injecti";
import jwt from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { shootTemplate } from "../../services/mailer/mailer";
import { findUserQuery } from "./findUserQuery.dep";
export const [sendResetPassword, sendResetPasswordFactory] = inject(
  {
    findUserQuery,
    shootTemplate,
    jwtSecret: config.auth.resetPasswordJwtSecret,
  },
  (deps) =>
    async ({ email }: { email: string }) => {
      const formattedEmail = email.toLocaleLowerCase();
      const user = await deps.findUserQuery({ email: formattedEmail });
      if (!user) throw Boom.notFound("email does not exist");

      const resetPasswordToken = jwt.sign(
        { email: formattedEmail },
        deps.jwtSecret,
        {
          expiresIn: "1h",
        }
      );

      await deps.shootTemplate({
        template: "reset_password",
        subject: "Orion : réinitialisation du mot de passe",
        to: formattedEmail,
        data: {
          resetPasswordToken,
          recipient: {
            email: formattedEmail,
            firstname: user.firstname,
            lastname: user.lastname,
          },
        },
      });
    }
);
