"use client";

import { ReactNode } from "react";
import { permissions } from "shared";

import { usePermission } from "./usePermission";

export const GuardPermission = ({
  permission,
  children,
}: {
  permission: typeof permissions[number];
  children: ReactNode;
}) => {
  const hasPermission = usePermission(permission);
  return hasPermission ? <>{children}</> : <></>;
};
