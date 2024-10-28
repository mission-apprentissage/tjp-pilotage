import type { Permission } from "shared";
import { hasPermission } from "shared";

import { useAuth } from "./useAuth";

export const usePermission = (permission: Permission) => {
  const { auth } = useAuth();
  if (!auth || !hasPermission(auth?.user.role, permission)) {
    return false;
  }
  return true;
};
