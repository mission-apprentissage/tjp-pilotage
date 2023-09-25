import Boom from "@hapi/boom";

import { Permission, PERMISSIONS } from "./permissions";

type KeyOfUnion<T> = T extends any ? keyof T : never;

type KOfUnion<T> = {
  [D in KeyOfUnion<T>]: T extends { [Ks in D]: any } ? T[D] : never;
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

export function assertScopeIsAllowed<S extends string>(
  scope: S | undefined,
  assertions: { [C in S]: () => void }
): asserts scope is Exclude<S, undefined> {
  if (!scope) throw Boom.forbidden();
  assertions[scope]();
}
