import type {PermissionScope} from '../enum/permissionScopeEnum';
import type {Role} from "../enum/roleEnum";
import { RoleEnum } from "../enum/roleEnum";
import type { Permission} from "./permissions";
import {HIERARCHY, PERMISSIONS} from './permissions';

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
  if(hasRole({ user, role: RoleEnum["admin"] }) || hasRole({ user, role : RoleEnum["pilote"]})) return true;
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

export const getPermissionScope = (role: Role | undefined, permission: Permission): PermissionScope | undefined => {
  if (!role) return;
  const userPermissions = PERMISSIONS[role];
  if (!userPermissions || !(permission in userPermissions)) return;

  const permissionScope = (userPermissions as KOfUnion<typeof userPermissions>)[permission];
  return permissionScope;
};

export const guardScope = (
  scope: PermissionScope | undefined,
  guards: Partial<Record<PermissionScope, () => boolean>>
): boolean => {
  if (!scope) return false;
  return guards[scope] ? guards[scope]() : false;
};

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
