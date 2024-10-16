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
import { canCreateRole } from "./utils/canCreateRole";
import { canCreateUserInScope } from "./utils/canCreateUserInScope";

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

      if (!email.match(emailRegex))
        throw Boom.badRequest(`L'email est invalide`);

      if (requestUser) {
        if (!canCreateRole({ requestUser, role: body.role }))
          throw Boom.unauthorized(
            `Vous n'avez pas les droits de créer un utilisateur avec le rôle ${body.role}`
          );
        if (!canCreateUserInScope({ requestUser, body }))
          throw Boom.unauthorized(
            "Vous ne pouvez pas créer un utilisateur dans ce périmètre."
          );
      }

      const existingUser = await deps.findUserQuery({ email });

      if (existingUser) {
        throw Boom.badRequest(`${email} est déjà éxistant dans l'application.`);
      }

      await deps.insertUserQuery({
        email,
        firstname,
        lastname,
        role,
        codeRegion,
        enabled: true,
      });
      const activationToken = jwt.sign(
        { email },
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
            region: "activate_account_region",
            invite: "activate_account_region",
          } as const
        )[role] ?? ("activate_account" as const);

      deps.shootTemplate({
        to: email,
        subject: "Orion : activez votre compte personnel",
        template,
        data: {
          activationToken,
          recipient: { email, firstname, lastname, role },
        },
      });
    }
);
