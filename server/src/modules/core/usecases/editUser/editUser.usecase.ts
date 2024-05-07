import Boom from "@hapi/boom";
import { inject } from "injecti";

import { RequestUser } from "../../model/User";
import { BodySchema } from "./editUser.schema";
import { canCreateRole } from "./services/canCreateRole";
import { verifyScope } from "./services/verifyScope";
import { updateUser } from "./updateUser.dep";

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
      if (!canCreateRole({ requestUser, role: data.role }))
        throw Boom.unauthorized("cannot edit user with this role");
      if (!verifyScope({ requestUser, body: data }))
        throw Boom.unauthorized("cannot edit user within this scope");
      return await deps.updateUser({ userId, data });
    }
);
