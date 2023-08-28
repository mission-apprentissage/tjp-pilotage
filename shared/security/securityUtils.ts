import { PERMISSIONS, permissions, roles } from "./permissions";

export const hasPermission = <P extends typeof permissions[number]>(
  role: typeof roles[number] | undefined,
  permission: P
) => {
  if (!role) return false;
  if (!(role in PERMISSIONS)) return false;

  const userPermissions =
    PERMISSIONS[role as keyof typeof PERMISSIONS].permissions;

  return userPermissions.includes(permission);
};
