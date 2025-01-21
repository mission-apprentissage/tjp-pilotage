import { describe, expect, it, vi } from "vitest";

import { editUserFactory } from "./editUser.usecase";
const user = {
  email: "test@test.fr",
  firstname: "firstname",
  lastname: "lastname",
  role: "admin",
  codeRegion: "84",
  enabled: true,
} as const;

const requestUser = {
  id: "requestUserId",
  email: "requestUser@requestUser.fr",
  firstname: "firstname",
  lastname: "lastname",
  password: "password",
  role: "admin",
} as const;

describe("createUser usecase", () => {
  describe("permissions", () => {
    describe("admin", () => {
      it("should edit the user", async () => {
        const deps = {
          updateUser: vi.fn(async () => {}),
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
        };
        const editUser = editUserFactory(deps);
        await editUser({ userId: "test", data: user, requestUser });
        await expect(deps.updateUser).toHaveBeenCalled();
      });

      it("should throw an error if the user has a role that requestUser cannot modify", async () => {
        const deps = {
          updateUser: vi.fn(async () => {}),
        };
        const editUser = editUserFactory(deps);
        await expect(async () =>
          editUser({
            userId: "test",
            data: user,
            requestUser: { ...requestUser, role: "admin_region" },
          })
        ).rejects.toThrow("cannot edit user with this role");
        await expect(async () =>
          editUser({
            userId: "test",
            data: { ...user, role: "admin_region" },
            requestUser: { ...requestUser, role: "admin_region" },
          })
        ).rejects.toThrow("cannot edit user with this role");
      });

      it("should throw an error if the user already exist", async () => {
        const deps = {
          updateUser: vi.fn(async () => {}),
        };
        const editUser = editUserFactory(deps);
        await expect(async () =>
          editUser({
            userId: "test",
            data: { ...user, codeRegion: "84", role: "pilote_region" },
            requestUser: {
              ...requestUser,
              role: "admin_region",
              codeRegion: "76",
            },
          })
        ).rejects.toThrow("cannot edit user within this scope");
      });
    });
  });
});
