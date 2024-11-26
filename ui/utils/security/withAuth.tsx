import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { Permission } from "shared/security/permissions";

import { usePermission } from "./usePermission";

// eslint-disable-next-line react/display-name
export const withAuth = (permission: Permission, Page: FC) => (props: Parameters<FC>[0]) => {
  const router = useRouter();
  const hasPermission = usePermission(permission);
  if (!hasPermission && typeof document !== "undefined") {
    router.replace("/");
  }
  if (!hasPermission) return <></>;
  return <Page {...props} />;
};
