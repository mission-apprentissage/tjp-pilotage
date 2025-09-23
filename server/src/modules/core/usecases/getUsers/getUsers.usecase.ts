import type {OrderType} from 'shared/enum/orderEnum';
import type { PermissionScope } from "shared/enum/permissionScopeEnum";

import { inject } from "@/utils/inject";

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
      orderBy?: { order: OrderType; column: string };
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
