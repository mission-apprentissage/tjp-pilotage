import { z } from "zod";

export const permissionScope = z.enum(["national", "région", "uai" ,"role", "user"]);

export const PermissionScopeEnum = permissionScope.Enum;

export type PermissionScope = z.infer<typeof permissionScope>;
