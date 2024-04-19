import { Permission, PERMISSIONS } from "./permissions";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type KeyOfUnion<T> = T extends any ? keyof T : never;

type KOfUnion<T> = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [D in KeyOfUnion<T>]: T extends { [Ks in D]: any } ? T[D] : never;
};

export const hasRole = ({
  user,
  role,
}: {
  user?: { role?: keyof typeof PERMISSIONS };
  role: keyof typeof PERMISSIONS;
}) => {
  return user?.role === role;
};

export const hasPermission = (
  role: keyof typeof PERMISSIONS | undefined,
  permission: Permission
) => {
  if (!role) return false;
  const scope = getPermissionScope(role, permission);
  return !!scope;
};

export const getPermissionScope = <P extends Permission>(
  role: keyof typeof PERMISSIONS | undefined,
  permission: P
) => {
  if (!role) return;
  const userPermissions = PERMISSIONS[role];
  if (!userPermissions || !(permission in userPermissions)) return;

  const permissionScope = (userPermissions as KOfUnion<typeof userPermissions>)[
    permission
  ];
  if (!permissionScope) return;

  type D = KOfUnion<typeof userPermissions>[P];
  return permissionScope as { [DS in KeyOfUnion<D>]: KOfUnion<D>[DS] };
};

export function guardScope<S extends string>(
  scope: S | undefined,
  guards: { [C in S]: () => boolean }
): scope is Exclude<S, undefined> {
  if (!scope) return false;
  return guards[scope]();
}
