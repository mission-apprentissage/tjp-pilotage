import type { RequestUser } from "@/modules/core/model/User";
import type { BodySchema } from "@/modules/core/usecases/editUser/editUser.schema";
import { getScopeFilterForUser } from "@/modules/core/utils/getScopeFilterForUser";

export function canEditUserInScope({ body, requestUser }: { body: BodySchema; requestUser: RequestUser }) {
  const { scope, scopeFilter } = getScopeFilterForUser("users/ecriture", requestUser);
  switch (scope) {
    case "national":
      return true;
    case "region":
      return body.codeRegion !== null && scopeFilter.includes(body.codeRegion);
    default:
      return false;
  }
}
