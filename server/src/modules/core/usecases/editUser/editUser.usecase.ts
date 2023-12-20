import { inject } from "injecti";

import { BodySchema } from "./editUser.schema";
import { updateUser } from "./updateUser.dep";

export const [editUser] = inject(
  { updateUser },
  (deps) =>
    async ({ userId, data }: { userId: string; data: BodySchema }) => {
      return await deps.updateUser({ userId, data });
    }
);
