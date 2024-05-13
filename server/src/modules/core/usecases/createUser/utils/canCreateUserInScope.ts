import { RequestUser } from "../../../model/User";
import { getScopeFilterForUser } from "../../../utils/getScopeFilterForUser";
import { BodySchema } from "../createUser.schema";

export function canCreateUserInScope({
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
      return (
        body.codeRegion !== undefined && scopeFilter.includes(body.codeRegion)
      );
    default:
      return false;
  }
}
