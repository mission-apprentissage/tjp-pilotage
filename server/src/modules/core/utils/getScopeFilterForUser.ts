import { getPermissionScope } from "shared";
import type {PermissionScope} from 'shared/enum/permissionScopeEnum';
import { PermissionScopeEnum} from 'shared/enum/permissionScopeEnum';
import type { Permission } from "shared/security/permissions";

import type { RequestUser } from "@/modules/core/model/User";

interface ScopeWithFilter {
  scope: PermissionScope;
  scopeFilter: Array<string>;
}

export const getScopeFilterForUser = (permission: Permission, user: RequestUser): ScopeWithFilter => {
  const scope = getPermissionScope(user.role, permission);
  if (scope) {
    const scopeWithFilter: ScopeWithFilter = {
      scope,
      scopeFilter: [],
    };

    switch (scope) {
    case PermissionScopeEnum["région"]:
      if (user.codeRegion) {
        scopeWithFilter.scopeFilter = [user.codeRegion];
      }
      break;
    case PermissionScopeEnum["national"]:
    case PermissionScopeEnum["uai"]:
    case PermissionScopeEnum["role"]:
    case PermissionScopeEnum["user"]:
    default:
      scopeWithFilter.scopeFilter = [];
      break;
    }

    return scopeWithFilter;
  }
  throw new Error(`Missing scope for permission ${permission} on user ${user.id}.`);
};
