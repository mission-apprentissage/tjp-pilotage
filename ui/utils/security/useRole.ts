import { hasRole, Role } from "shared";

import { useAuth } from "./useAuth";

export const useRole = (role: Role) => {
  const { auth } = useAuth();
  if (!auth || !hasRole({ user: auth?.user, role })) {
    return false;
  }
  return true;
};
