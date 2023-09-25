import { useRouter } from "next/navigation";
import { useContext } from "react";
import { hasPermission, Permission } from "shared";

import { AuthContext } from "../../app/(wrapped)/auth/authContext";

export const usePermission = (permission: Permission) => {
  const { auth } = useContext(AuthContext);
  const router = useRouter();
  if (!auth || !hasPermission(auth?.user.role, permission)) {
    if (typeof document === "undefined") return false;
    router.replace("/");
    return false;
  }
  return true;
};
