import { hasRightOverRole, Role } from "shared";

import { RequestUser } from "../../../model/User";

export function canCreateRole({
  requestUser,
  role,
}: {
  requestUser: RequestUser;
  role: Role;
}) {
  if (!requestUser.role) return [];
  return hasRightOverRole({ sourceRole: requestUser.role, targetRole: role });
}
