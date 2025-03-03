// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type {PermissionScope} from 'shared/enum/permissionScopeEnum';

import { searchUserQuery } from "./searchUser.query";

export const [searchUser] = inject(
  { searchUserQuery },
  (deps) =>
    async ({ search, scope, scopeFilter }: { search: string; scope: PermissionScope; scopeFilter: Array<string> }) => {
      if (!search) return [];

      const users = await deps.searchUserQuery({
        search,
        scope,
        scopeFilter,
      });
      return users;
    }
);
