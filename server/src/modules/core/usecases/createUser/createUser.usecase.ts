import Boom from "@hapi/boom";
import { inject } from "injecti";
import jwt from "jsonwebtoken";
import { emailRegex } from "shared";

import { config } from "../../../../../config/config";
import { shootTemplate } from "../../services/mailer/mailer";
import { BodySchema } from "./createUser.schema";
import { findUserQuery } from "./findUserQuery.dep";
import { insertUserQuery } from "./insertUserQuery.dep";

export const [createUser, createUserFactory] = inject(
  {
    insertUserQuery,
    findUserQuery,
    shootTemplate,
  },
  (deps) =>
    async ({ email, firstname, lastname, role, codeRegion }: BodySchema) => {
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
            admin: "activate_account",
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
