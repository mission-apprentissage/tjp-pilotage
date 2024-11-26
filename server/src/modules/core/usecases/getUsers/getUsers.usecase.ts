// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { Scope } from "shared/security/permissions";

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
