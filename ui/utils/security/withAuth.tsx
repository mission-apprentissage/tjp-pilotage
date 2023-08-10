import { FC, useContext } from "react";
import { hasPermission, permissions } from "shared";

import { AuthContext } from "../../app/(wrapped)/auth/authContext";
import { usePermission } from "./usePermission";

export const withAuth =
  (Page: FC, permission: typeof permissions[number]) =>
  (props: Parameters<FC>[0]) => {
    const { auth } = useContext(AuthContext);
    usePermission(permission);
    if (!hasPermission(auth?.user.role, permission)) return <></>;
    return <Page {...props} />;
  };
