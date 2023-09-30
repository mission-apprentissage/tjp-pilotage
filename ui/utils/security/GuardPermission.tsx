"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Permission } from "shared";

import { usePermission } from "./usePermission";

export const GuardPermission = ({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) => {
  const router = useRouter();
  const hasPermission = usePermission(permission);
  if (!hasPermission && typeof document !== "undefined") {
    router.replace("/");
  }
  return hasPermission ? <>{children}</> : <></>;
};
