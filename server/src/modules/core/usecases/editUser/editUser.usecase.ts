import Boom from "@hapi/boom";
import { inject } from "injecti";

import { RequestUser } from "../../model/User";
import { BodySchema } from "./editUser.schema";
import { updateUser } from "./updateUser.dep";
import { canEditRole } from "./utils/canEditRole";
import { canEditUserInScope } from "./utils/canEditUserInScope";

export const [editUser, editUserFactory] = inject(
  { updateUser },
  (deps) =>
    async ({
      userId,
      data,
      requestUser,
    }: {
      userId: string;
      data: BodySchema;
      requestUser: RequestUser;
    }) => {
      if (!canEditRole({ requestUser, role: data.role }))
        throw Boom.unauthorized("cannot edit user with this role");
      if (!canEditUserInScope({ requestUser, body: data }))
        throw Boom.unauthorized("cannot edit user within this scope");
      return await deps.updateUser({ userId, data });
    }
);
