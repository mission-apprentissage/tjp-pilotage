import type { Role } from "shared";
import { hasRightOverRole } from "shared";

import type { RequestUser } from "@/modules/core/model/User";

export function canEditRole({ requestUser, role }: { requestUser: RequestUser; role: Role }) {
  if (!requestUser.role) return [];
  return hasRightOverRole({ sourceRole: requestUser.role, targetRole: role });
}
