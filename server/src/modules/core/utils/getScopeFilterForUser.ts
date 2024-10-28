import { getPermissionScope } from "shared";
import type { Permission, Scope } from "shared/security/permissions";

import type { RequestUser } from "@/modules/core/model/User";

interface ScopeWithFilter {
  scope: Scope;
  scopeFilter: Array<string>;
}

export const getScopeFilterForUser = (permission: Permission, user: RequestUser): ScopeWithFilter => {
  const scope = getPermissionScope(user.role, permission)?.default;
  if (scope) {
    const scopeWithFilter: ScopeWithFilter = {
      scope,
      scopeFilter: [],
    };

    switch (scope) {
      case "region":
        if (user.codeRegion) {
          scopeWithFilter.scopeFilter = [user.codeRegion];
        }
        break;
      default:
        scopeWithFilter.scopeFilter = [];
        break;
    }

    return scopeWithFilter;
  }
  throw new Error(`Missing scope for permission ${permission} on user ${user.id}.`);
};
