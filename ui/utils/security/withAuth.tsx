import { useRouter } from "next/navigation";
import { FC } from "react";
import { Permission } from "shared";

import { usePermission } from "./usePermission";

export const withAuth =
  (permission: Permission, Page: FC) => (props: Parameters<FC>[0]) => {
    const router = useRouter();
    const hasPermission = usePermission(permission);
    if (!hasPermission && typeof document !== "undefined") {
      router.replace("/");
    }
    if (!hasPermission) return <></>;
    return <Page {...props} />;
  };
