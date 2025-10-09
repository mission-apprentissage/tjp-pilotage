import * as Boom from "@hapi/boom";
import { RoleEnum } from "shared";
import type { BodySchema } from "shared/routes/schemas/put.users.userId.schema";

import type { RequestUser } from "@/modules/core/model/User";
import { inject } from "@/utils/inject";

import { findDifferentUserWithSameEmail, findUser, updateUser } from "./dependencies";
import { canEditRole } from "./utils/canEditRole";
import { canEditUserInScope } from "./utils/canEditUserInScope";

export const [editUser, editUserFactory] = inject(
  { updateUser, findUser, findDifferentUserWithSameEmail },
  (deps) =>
    async ({ userId, data, requestUser }: { userId: string; data: BodySchema; requestUser: RequestUser }) => {
      if (!canEditRole({ requestUser, role: data.role })) throw Boom.unauthorized("cannot edit user with this role");
      if (!canEditUserInScope({ requestUser, body: data }))
        throw Boom.unauthorized("cannot edit user within this scope");

      const user = await deps.findUser({ userId });

      if(!user) {
        throw Boom.notFound("Utilisateur inconnu dans l'application");
      }

      if(data.role === RoleEnum["perdir"] && (!data.uais || data.uais?.length === 0)) {
        throw Boom.badRequest("Un utilisateur avec le rôle perdir doit avoir au moins un établissement.");
      }

      if(user.email !== data.email) {
        const differentUserWithSameEmail = await deps.findDifferentUserWithSameEmail({ email: data.email, userId });
        if(differentUserWithSameEmail) {
          throw Boom.badRequest("Cette adresse email est déjà utilisée par un autre utilisateur");
        }
      }

      return await deps.updateUser({ userId, data: {
        ...data,
        uais: data.uais?.map((etablissement) => etablissement.value) ?? null
      } });
    }
);
