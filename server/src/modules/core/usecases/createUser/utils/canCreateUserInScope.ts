import type { RequestUser } from "@/modules/core/model/User";
import type { BodySchema } from "@/modules/core/usecases/createUser/createUser.schema";
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
