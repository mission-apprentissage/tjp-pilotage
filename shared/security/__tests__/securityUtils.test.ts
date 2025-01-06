import { describe, expect, it } from "vitest";

import type { Permission, Role } from "../permissions";
import { HIERARCHY, PERMISSIONS } from "../permissions";
import { getPermissionScope, hasRightOverRole } from "../securityUtils";

describe("securityUtils", () => {
  describe("getPermissionScope", () => {
    it("Should return scope for each role/permission couple", () => {
      Object.keys(PERMISSIONS).forEach((role) => {
        const typedRole: Role = role as unknown as Role;
        Object.keys(PERMISSIONS[typedRole]).forEach((permission) => {
          const scope = getPermissionScope(typedRole, permission as Permission);
          expect(typeof scope?.default !== "undefined").toEqual(true);
        });
      });
    });
  });

  describe("hasRightOverRole", () => {
    it("Should return hierarchy rights for each role/sub role couple", () => {
      Object.keys(HIERARCHY).forEach((role) => {
        const typedRole: Role = role as unknown as Role;
        HIERARCHY[typedRole].sub.forEach((subRole) => {
          const hasRightOver = hasRightOverRole({
            sourceRole: typedRole,
            targetRole: subRole,
          });
          expect(hasRightOver).toEqual(true);
        });
      });
    });
  });
});
