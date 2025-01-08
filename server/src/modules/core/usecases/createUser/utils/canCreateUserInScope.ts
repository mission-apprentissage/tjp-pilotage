import type { BodySchema } from "shared/routes/schemas/post.users.userId.schema";

import type { RequestUser } from "@/modules/core/model/User";
import { getScopeFilterForUser } from "@/modules/core/utils/getScopeFilterForUser";

export function canCreateUserInScope({ body, requestUser }: { body: BodySchema; requestUser: RequestUser }) {
  const { scope, scopeFilter } = getScopeFilterForUser("users/ecriture", requestUser);
  switch (scope) {
    case "national":
      return true;
    case "region":
      return body.codeRegion !== undefined && scopeFilter.includes(body.codeRegion);
    default:
      return false;
  }
}
