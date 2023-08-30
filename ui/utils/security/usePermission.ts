import { useRouter } from "next/navigation";
import { useContext } from "react";
import { hasPermission, permissions } from "shared";

import { AuthContext } from "../../app/(wrapped)/auth/authContext";

export const usePermission = (permission: typeof permissions[number]) => {
  const { auth } = useContext(AuthContext);
  const router = useRouter();
  if (typeof document === "undefined") return;
  if (!auth || !hasPermission(auth?.user.role, permission)) {
    router.replace("/");
    return false;
  }
  return true;
};
