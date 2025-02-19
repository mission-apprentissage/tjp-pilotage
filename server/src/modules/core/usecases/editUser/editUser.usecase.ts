import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { BodySchema } from "shared/routes/schemas/put.users.userId.schema";

import type { RequestUser } from "@/modules/core/model/User";

import { updateUser } from "./updateUser.dep";
import { canEditRole } from "./utils/canEditRole";
import { canEditUserInScope } from "./utils/canEditUserInScope";

export const [editUser, editUserFactory] = inject(
  { updateUser },
  (deps) =>
    async ({ userId, data, requestUser }: { userId: string; data: BodySchema; requestUser: RequestUser }) => {
      if (!canEditRole({ requestUser, role: data.role })) throw Boom.unauthorized("cannot edit user with this role");
      if (!canEditUserInScope({ requestUser, body: data }))
        throw Boom.unauthorized("cannot edit user within this scope");
      return await deps.updateUser({ userId, data });
    }
);
