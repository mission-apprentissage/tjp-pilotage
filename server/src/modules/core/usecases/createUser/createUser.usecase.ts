import Boom from "@hapi/boom";
import { inject } from "injecti";
import jwt from "jsonwebtoken";
import { emailRegex } from "shared";

import { config } from "../../../../../config/config";
import { RequestUser } from "../../model/User";
import { shootTemplate } from "../../services/mailer/mailer";
import { BodySchema } from "./createUser.schema";
import { findUserQuery } from "./findUserQuery.dep";
import { insertUserQuery } from "./insertUserQuery.dep";
import { canCreateRole } from "./services/canCreateRole";
import { verifyScope } from "./services/verifyScope";

export const [createUser, createUserFactory] = inject(
  {
    insertUserQuery,
    findUserQuery,
    shootTemplate,
  },
  (deps) =>
    async ({
      body,
      requestUser,
    }: {
      body: BodySchema;
      requestUser?: RequestUser;
    }) => {
      const { email, firstname, lastname, role, codeRegion } = body;
      if (!email.match(emailRegex)) throw Boom.badRequest("email is not valid");

      if (requestUser) {
        if (!canCreateRole({ requestUser, role: body.role }))
          throw Boom.unauthorized("cannot create user with this role");
        if (!verifyScope({ requestUser, body }))
          throw Boom.unauthorized("cannot create user within this scope");
      }

      const formattedEmail = email.toLowerCase();

      const existingUser = await deps.findUserQuery({ email });
      if (existingUser) throw Boom.badRequest("email already exist");

      await deps.insertUserQuery({
        email: formattedEmail,
        firstname,
        lastname,
        role,
        codeRegion,
        enabled: true,
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
            perdir: "activate_account",
            admin_region: "activate_account_region",
            expert_region: "activate_account_region",
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
