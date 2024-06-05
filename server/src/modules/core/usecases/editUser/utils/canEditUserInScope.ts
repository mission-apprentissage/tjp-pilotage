import { RequestUser } from "../../../model/User";
import { getScopeFilterForUser } from "../../../utils/getScopeFilterForUser";
import { BodySchema } from "../editUser.schema";

export function canEditUserInScope({
  body,
  requestUser,
}: {
  body: BodySchema;
  requestUser: RequestUser;
}) {
  const { scope, scopeFilter } = getScopeFilterForUser(
    "users/ecriture",
    requestUser
  );
  switch (scope) {
    case "national":
      return true;
    case "region":
      return body.codeRegion !== null && scopeFilter.includes(body.codeRegion);
    default:
      return false;
  }
}
