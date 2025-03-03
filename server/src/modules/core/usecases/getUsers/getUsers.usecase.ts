import { inject } from "injecti";
import type { PermissionScope } from "shared/enum/permissionScopeEnum";

import { findUsers } from "./findUsers.dep";

export const [getUsers] = inject(
  { findUsers },
  (deps) =>
    async ({
      offset,
      limit,
      search,
      orderBy,
      scope,
      scopeFilter,
    }: {
      offset?: number;
      limit?: number;
      search?: string;
      orderBy?: { order: "asc" | "desc"; column: string };
      scope: PermissionScope;
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
