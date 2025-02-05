import type { Role } from "../enum/roleEnum";
import type { Permission } from "./permissions";
import { HIERARCHY, PERMISSIONS } from "./permissions";

export const CODES_REGIONS_EXPE_2024 = [
  //Occitanie
  "76",
  // AURA
  "84",
];

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type KeyOfUnion<T> = T extends any ? keyof T : never;

type KOfUnion<T> = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [D in KeyOfUnion<T>]: T extends { [Ks in D]: any } ? T[D] : never;
};

export const isUserInRegionsExperimentation2024 = ({ user }: { user?: { codeRegion?: string, role?: Role } }) => {
  if(hasRole({ user, role: "admin" }) || hasRole({ user, role : "pilote"})) return true;
  if (!user?.codeRegion) return false;
  return CODES_REGIONS_EXPE_2024.includes(user.codeRegion);
};

export const hasRole = ({ user, role }: { user?: { role?: Role }; role: Role }) => {
  return user?.role === role;
};

export const hasPermission = (role: Role | undefined, permission: Permission) => {
  if (!role) return false;
  const scope = getPermissionScope(role, permission);
  return !!scope;
};

export const getPermissionScope = <P extends Permission>(role: Role | undefined, permission: P) => {
  if (!role) return;
  const userPermissions = PERMISSIONS[role];
  if (!userPermissions || !(permission in userPermissions)) return;

  const permissionScope = (userPermissions as KOfUnion<typeof userPermissions>)[permission];
  if (!permissionScope) return;

  type D = KOfUnion<typeof userPermissions>[P];
  // @ts-ignore
  return permissionScope as { [DS in KeyOfUnion<D>]: KOfUnion<D>[DS] };
};

export function guardScope<S extends string>(
  scope: S | undefined,
  guards: { [C in S]: () => boolean }
): scope is Exclude<S, undefined> {
  if (!scope) return false;
  return guards[scope]();
}

export function getHierarchy(role: Role): Array<Role> {
  if (HIERARCHY[role]) {
    return HIERARCHY[role].sub;
  }
  return [];
}

export function hasRightOverRole({ sourceRole, targetRole }: { sourceRole: Role; targetRole: Role }) {
  const roleHierarchy = getHierarchy(sourceRole);
  return roleHierarchy.includes(targetRole);
}
