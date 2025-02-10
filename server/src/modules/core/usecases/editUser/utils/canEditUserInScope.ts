import { PermissionScopeEnum } from "shared/enum/permissionScopeEnum";
import type { BodySchema } from "shared/routes/schemas/put.users.userId.schema";

import type { RequestUser } from "@/modules/core/model/User";
import { getScopeFilterForUser } from "@/modules/core/utils/getScopeFilterForUser";

export function canEditUserInScope({ body, requestUser }: { body: BodySchema; requestUser: RequestUser }) {
  const { scope, scopeFilter } = getScopeFilterForUser("users/ecriture", requestUser);
  switch (scope) {
  case PermissionScopeEnum["national"]:
    return true;
  case PermissionScopeEnum["région"]:
    return body.codeRegion !== null && scopeFilter.includes(body.codeRegion);
  default:
    return false;
  }
}
