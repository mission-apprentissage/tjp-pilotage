import { hasPermission } from "shared";
import type { Permission } from "shared/security/permissions";

import { useAuth } from "./useAuth";

export const usePermission = (permission: Permission) => {
  const { role } = useAuth();
  return hasPermission(role, permission);
};

