import { inject } from "injecti";

import { findUsers } from "./findUsers.dep";

export const [getUsers] = inject(
  { findUsers },
  (deps) =>
    async ({
      offset = 0,
      limit = 30,
      search,
      orderBy,
    }: {
      offset?: number;
      limit?: number;
      search?: string;
      orderBy?: { order: "asc" | "desc"; column: string };
    }) => {
      return deps.findUsers({ offset, limit, search, orderBy });
    }
);
