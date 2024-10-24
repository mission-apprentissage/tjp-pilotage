import { inject } from "injecti";
import { Scope } from "shared/security/permissions";

import { findUsers } from "./findUsers.dep";

export const [getUsers] = inject(
  { findUsers },
  (deps) =>
    async ({
      offset = 0,
      limit = 30,
      search,
      orderBy,
      scope,
      scopeFilter,
    }: {
      offset?: number;
      limit?: number;
      search?: string;
      orderBy?: { order: "asc" | "desc"; column: string };
      scope: Scope;
      scopeFilter: Array<string>;
    }) => {
      return deps.findUsers({
        offset,
        limit,
        search,
        orderBy,
        scope,
        scopeFilter,
      });
    }
);
