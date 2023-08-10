import { inject } from "injecti";
import jwt from "jsonwebtoken";

import { config } from "../../../../../config/config";
import { shootTemplate } from "../../../core/services/mailer/mailer";
import { insertUserQuery } from "./insertUserQuery.dep";

export const [createUser, createUserFactory] = inject(
  {
    insertUserQuery,
    shootTemplate,
  },
  (deps) =>
    async ({
      email,
      firstname,
      lastname,
      role,
    }: {
      email: string;
      firstname?: string;
      lastname?: string;
      role: string;
    }) => {
      await deps.insertUserQuery({ email, firstname, lastname });
      const activationToken = jwt.sign({ email }, config.auth.jwtSecret, {
        issuer: "orion",
        expiresIn: "1h",
      });

      deps.shootTemplate({
        to: email,
        subject: "Activez votre compte personnel Orion",
        template: "activate_account",
        data: {
          activationToken,
          recipient: { email, firstname, lastname, role },
        },
      });
    }
);
