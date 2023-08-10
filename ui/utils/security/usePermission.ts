import { useRouter } from "next/navigation";
import { useContext } from "react";
import { hasPermission, permissions } from "shared";

import { AuthContext } from "../../app/(wrapped)/auth/authContext";

export const usePermission = (permission: typeof permissions[number]) => {
  const { auth } = useContext(AuthContext);
  console.log("authauth", auth);
  if (typeof document === "undefined") return;
  const router = useRouter();
  if (!auth) router.replace("/");
  if (!hasPermission(auth?.user.role, permission)) router.replace("/");
};
