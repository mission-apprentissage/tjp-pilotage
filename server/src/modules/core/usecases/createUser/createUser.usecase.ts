import * as Boom from "@hapi/boom";
/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import { emailRegex } from "shared";
import type { BodySchema } from "shared/routes/schemas/post.users.userId.schema";

import config from "@/config";
import type { RequestUser } from "@/modules/core/model/User";
import { shootTemplate } from "@/modules/core/services/mailer/mailer";
import { inject } from "@/utils/inject";

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
    async ({ body, requestUser }: { body: BodySchema; requestUser?: RequestUser }) => {
      const { email, firstname, lastname, role, codeRegion, fonction, uai } = body;

      if (!email.match(emailRegex)) throw Boom.badRequest(`L'email est invalide`);

      if (requestUser) {
        if (!canCreateRole({ requestUser, role: body.role }))
          throw Boom.unauthorized(`Vous n'avez pas les droits de créer un utilisateur avec le rôle ${body.role}`);
        if (!canCreateUserInScope({ requestUser, body }))
          throw Boom.unauthorized("Vous ne pouvez pas créer un utilisateur dans ce périmètre.");
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
        fonction,
        uais: uai ? [uai] : undefined,
      });

      const activationToken = jwt.sign({ email }, config.auth.activationJwtSecret, {
        issuer: "orion",
      });

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
