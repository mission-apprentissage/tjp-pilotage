"use client";

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
  const hasPermission = usePermission(permission);
  return hasPermission ? <>{children}</> : <></>;
};
