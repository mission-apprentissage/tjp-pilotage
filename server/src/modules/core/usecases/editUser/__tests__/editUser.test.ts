import { RoleEnum } from 'shared/enum/roleEnum';
import { describe, expect, it, vi } from "vitest";

import { editUserFactory } from "@/modules/core/usecases/editUser/editUser.usecase";

const user = {
  email: "test@test.fr",
  firstname: "firstname",
  lastname: "lastname",
  role: RoleEnum["admin"],
  codeRegion: "84",
  enabled: true,
  fonction: null,
  uais: null,
} as const;

const requestUser = {
  id: "requestUserId",
  email: "requestUser@requestUser.fr",
  firstname: "firstname",
  lastname: "lastname",
  password: "password",
  role: RoleEnum["admin"],
} as const;

describe("editUser usecase", () => {
  describe("permissions", () => {
    describe("admin", () => {
      it("should edit the user", async () => {
        const deps = {
          updateUser: vi.fn(async () => {}),
          findUser: vi.fn(async () => ({id: "test", email: "test@test.fr"})),
          findDifferentUserWithSameEmail: vi.fn(async () => undefined),
        };
        const editUser = editUserFactory(deps);
        await editUser({ userId: "test", data: user, requestUser });
        await expect(deps.updateUser).toHaveBeenCalled();
      });
    });

    describe("admin_region", () => {
      it("should edit the user with the right role within the same region", async () => {
        const deps = {
          updateUser: vi.fn(async () => {}),
          findUser: vi.fn(async () => ({id: "test", email: "test@test.fr"})),
          findDifferentUserWithSameEmail: vi.fn(async () => undefined)
        };
        const editUser = editUserFactory(deps);
        await editUser({ userId: "test", data: user, requestUser });
        await expect(deps.updateUser).toHaveBeenCalled();
      });

      it("should throw an error if the user has a role that requestUser cannot modify", async () => {
        const deps = {
          updateUser: vi.fn(async () => {}),
          findUser: vi.fn(async () => ({id: "test", email: "test@test.fr"})),
          findDifferentUserWithSameEmail: vi.fn(async () => undefined)
        };
        const editUser = editUserFactory(deps);
        await expect(async () =>
          editUser({
            userId: "test",
            data: user,
            requestUser: { ...requestUser, role: RoleEnum["admin_region"] },
          })
        ).rejects.toThrow("cannot edit user with this role");
        await expect(async () =>
          editUser({
            userId: "test",
            data: { ...user, role: RoleEnum["admin_region"] },
            requestUser: { ...requestUser, role: RoleEnum["admin_region"] },
          })
        ).rejects.toThrow("cannot edit user with this role");
      });

      it("should throw an error if the user already exist", async () => {
        const deps = {
          updateUser: vi.fn(async () => {}),
          findUser: vi.fn(async () => ({id: "test", email: "test@test.fr"})),
          findDifferentUserWithSameEmail: vi.fn(async () => undefined)
        };
        const editUser = editUserFactory(deps);
        await expect(async () =>
          editUser({
            userId: "test",
            data: { ...user, codeRegion: "84", role: RoleEnum["pilote_region"] },
            requestUser: {
              ...requestUser,
              role: RoleEnum["admin_region"],
              codeRegion: "76",
            },
          })
        ).rejects.toThrow("cannot edit user within this scope");
      });
    });

    it("should edit the user with role perdir and uais", async () => {
      const deps = {
        updateUser: vi.fn(async () => {}),
        findUser: vi.fn(async () => ({id: "test", email: "test@test.fr"})),
        findDifferentUserWithSameEmail: vi.fn(async () => undefined),
      };
      const editUser = editUserFactory(deps);
      await editUser({ userId: "test", data: {
        ...user,
        role: RoleEnum["perdir"],
        uais: [{value: "1234567A", label: "1234567A - Test"}]
      }, requestUser });
      await expect(deps.updateUser).toHaveBeenCalled();
    });

    it("should throw an error if the user is a perdir and has no uai", async () => {
        const deps = {
          updateUser: vi.fn(async () => {}),
          findUser: vi.fn(async () => ({id: "test", email: "test@test.fr"})),
          findDifferentUserWithSameEmail: vi.fn(async () => undefined)
        };
        const editUser = editUserFactory(deps);
        await expect(async () =>
          editUser({
            userId: "test",
            data: {
              ...user,
              role: RoleEnum["perdir"],
              uais: null
            },
            requestUser
          })
        ).rejects.toThrow("Un utilisateur avec le rôle perdir doit avoir au moins un établissement.");
    });
  });
});
