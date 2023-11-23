import Boom from "@hapi/boom";
import { inject } from "injecti";
import jwt from "jsonwebtoken";
import { emailRegex } from "shared";

import { config } from "../../../../../config/config";
import { shootTemplate } from "../../services/mailer/mailer";
import { findUserQuery } from "./findUserQuery.dep";
import { insertUserQuery } from "./insertUserQuery.dep";

export const [createUser, createUserFactory] = inject(
  {
    insertUserQuery,
    findUserQuery,
    shootTemplate,
  },
  (deps) =>
    async ({
      email,
      firstname,
      lastname,
      role,
      codeRegion,
    }: {
      email: string;
      firstname?: string;
      lastname?: string;
      role: string;
      codeRegion?: string;
    }) => {
      if (!email.match(emailRegex)) throw Boom.badRequest("email is not valid");

      const formattedEmail = email.toLowerCase();

      const existingUser = await deps.findUserQuery({ email });
      if (existingUser) throw Boom.badRequest("email already exist");

      await deps.insertUserQuery({
        email: formattedEmail,
        firstname,
        lastname,
        role,
        codeRegion,
      });
      const activationToken = jwt.sign(
        { email: formattedEmail },
        config.auth.activationJwtSecret,
        {
          issuer: "orion",
        }
      );

      const template =
        (
          {
            pilote: "activate_account_pilote",
            pilote_region: "activate_account_region",
            gestionnaire_region: "activate_account_region",
          } as const
        )[role] ?? ("activate_account" as const);

      deps.shootTemplate({
        to: formattedEmail,
        subject: "Orion : activez votre compte personnel",
        template,
        data: {
          activationToken,
          recipient: { email: formattedEmail, firstname, lastname, role },
        },
      });
    }
);
