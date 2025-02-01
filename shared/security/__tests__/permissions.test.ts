import { describe, expect, it } from "vitest";

import type { Role } from "../../enum/roleEnum";
import { HIERARCHY, PERMISSIONS } from "../permissions";

describe("Permissions", () => {
  describe("Structure des permissions", () => {
    it("devrait avoir des permissions définies pour chaque rôle", () => {
      // Given
      const roles = Object.keys(HIERARCHY) as Role[];

      // Then
      roles.forEach((role) => {
        expect(PERMISSIONS[role]).toBeDefined();
      });
    });

    it("devrait avoir une hiérarchie définie pour chaque rôle", () => {
      // Given
      const roles = Object.keys(PERMISSIONS) as Role[];

      // Then
      roles.forEach((role) => {
        expect(HIERARCHY[role]).toBeDefined();
        expect(HIERARCHY[role].scope).toBeDefined();
        expect(HIERARCHY[role].sub).toBeDefined();
        expect(Array.isArray(HIERARCHY[role].sub)).toBe(true);
      });
    });
  });

  describe("Cohérence des permissions", () => {
    it("devrait avoir des scopes valides", () => {
      // Given
      const validScopes = ["national", "region", "uai", "user", "role"];

      // Then
      Object.values(PERMISSIONS).forEach((rolePermissions) => {
        Object.values(rolePermissions).forEach((permission) => {
          expect(validScopes).toContain(permission.default);
          if (permission.draft) {
            expect(validScopes).toContain(permission.draft);
          }
        });
      });
    });
  });

  describe("Hierarchie", () => {
    it("un admin peut avoir tous les rôles en sub", () => {
      // Given
      const admin = HIERARCHY.admin;

      // Then
      expect(admin.sub).toEqual(Object.keys(PERMISSIONS));
    });

    it("un admin_region peut avoir tous les rôles sauf admin et pilote en sub", () => {
      // Given
      const admin_region = HIERARCHY.admin_region;
      const allowedSubs = Object.keys(PERMISSIONS).filter((role) => role !== "admin" && role !== "pilote");

      // Then
      expect(admin_region.sub.every((role) => allowedSubs.includes(role))).toBe(true);
    });
  });
});
