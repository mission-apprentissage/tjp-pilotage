import Boom from "@hapi/boom";
import { inject } from "injecti";
import jwt from "jsonwebtoken";
import { emailRegex } from "shared";

import { config } from "../../../../../config/config";
import { shootTemplate } from "../../../core/services/mailer/mailer";
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
    }: {
      email: string;
      firstname?: string;
      lastname?: string;
      role: string;
    }) => {
      if (!email.match(emailRegex)) throw Boom.badRequest("email is not valid");

      const existingUser = await deps.findUserQuery({ email });
      if (existingUser) throw Boom.badRequest("email already exist");

      await deps.insertUserQuery({
        email,
        firstname,
        lastname,
        role,
      });
      const activationToken = jwt.sign({ email }, config.auth.jwtSecret, {
        issuer: "orion",
      });

      deps.shootTemplate({
        to: email,
        subject: "Orion : activez votre compte personnel",
        template: "activate_account",
        data: {
          activationToken,
          recipient: { email, firstname, lastname, role },
        },
      });
    }
);
