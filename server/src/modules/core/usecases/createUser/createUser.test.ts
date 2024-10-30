import { PERMISSIONS } from "shared";
import { describe, expect, it, vi } from "vitest";

import { createUserFactory } from "./createUser.usecase";

const user = {
  email: "test@test.fr",
  firstname: "firstname",
  lastname: "lastname",
  password: "password",
  role: "admin",
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
  it("should throw an error if the user already exist", async () => {
    const deps = {
      insertUserQuery: vi.fn(async () => {}),
      findUserQuery: vi.fn(async () => ({ email: user.email })),
      shootTemplate: vi.fn(async () => {}),
    };
    const createUser = createUserFactory(deps);
    expect(async () =>
      createUser({
        body: user,
        requestUser,
      })
    ).rejects.toThrow("test@test.fr est déjà éxistant dans l'application.");
  });

  it("should throw an error if the given email is not valid", async () => {
    const deps = {
      insertUserQuery: vi.fn(async () => {}),
      findUserQuery: vi.fn(async () => undefined),
      shootTemplate: vi.fn(async () => {}),
      verifyScope: vi.fn(() => true),
    };
    const createUser = createUserFactory(deps);
    expect(async () =>
      createUser({
        body: { ...user, email: "fakeEmail" },
        requestUser,
      })
    ).rejects.toThrow("L'email est invalide");
  });

  it("should create the user and send the activation email", async () => {
    const deps = {
      insertUserQuery: vi.fn(async () => {}),
      findUserQuery: vi.fn(async () => undefined),
      shootTemplate: vi.fn(async () => {}),
    };
    const createUser = createUserFactory(deps);
    await createUser({
      body: user,
      requestUser,
    });

    await expect(deps.insertUserQuery).toHaveBeenCalled();
    await expect(deps.shootTemplate).toHaveBeenCalledWith(expect.objectContaining({ template: "activate_account" }));
  });

  describe("role validation", () => {
    it("should throw an error if the requestUser role is not admin or admin_region", async () => {
      const deps = {
        insertUserQuery: vi.fn(async () => {}),
        findUserQuery: vi.fn(async () => undefined),
        shootTemplate: vi.fn(async () => {}),
      };
      const createUser = createUserFactory(deps);
      const notAllowedRoles: Array<keyof typeof PERMISSIONS> = Object.keys(PERMISSIONS).filter(
        (p) => !["admin", "admin_region"].includes(p)
      ) as Array<keyof typeof PERMISSIONS>;

      for (const role of notAllowedRoles) {
        expect(async () =>
          createUser({
            body: user,
            requestUser: { ...requestUser, role },
          })
        ).rejects.toThrow(`Vous n'avez pas les droits de créer un utilisateur avec le rôle ${user.role}`);
      }
    });

    it("should only allow requestUser with role admin_region and admin to create", async () => {
      const deps = {
        insertUserQuery: vi.fn(async () => {}),
        findUserQuery: vi.fn(async () => undefined),
        shootTemplate: vi.fn(async () => {}),
      };
      const createUser = createUserFactory(deps);

      await createUser({
        body: { ...user },
        requestUser,
      });

      await expect(deps.insertUserQuery).toHaveBeenCalled();
      await expect(deps.shootTemplate).toHaveBeenCalledWith(expect.objectContaining({ template: "activate_account" }));

      await createUser({
        body: { ...user, codeRegion: "84", role: "pilote_region" },
        requestUser: { ...requestUser, role: "admin_region", codeRegion: "84" },
      });

      await expect(deps.insertUserQuery).toHaveBeenCalled();
      await expect(deps.shootTemplate).toHaveBeenCalledWith(expect.objectContaining({ template: "activate_account" }));
    });
  });

  describe("scope validation", () => {
    it("should create the user and send the activation email if the requestUser scope is region and code region is matching", async () => {
      const deps = {
        insertUserQuery: vi.fn(async () => {}),
        findUserQuery: vi.fn(async () => undefined),
        shootTemplate: vi.fn(async () => {}),
      };
      const createUser = createUserFactory(deps);
      await createUser({
        body: { ...user, codeRegion: "84", role: "pilote_region" },
        requestUser: { ...requestUser, codeRegion: "84", role: "admin_region" },
      });

      await expect(deps.insertUserQuery).toHaveBeenCalled();
      await expect(deps.shootTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ template: "activate_account_region" })
      );
    });

    it("should not create the user and send the activation email if the requestUser scope is region and code region is not matching", async () => {
      const deps = {
        insertUserQuery: vi.fn(async () => {}),
        findUserQuery: vi.fn(async () => undefined),
        shootTemplate: vi.fn(async () => {}),
      };
      const createUser = createUserFactory(deps);
      expect(async () =>
        createUser({
          body: { ...user, codeRegion: "76", role: "pilote_region" },
          requestUser: {
            ...requestUser,
            codeRegion: "84",
            role: "admin_region",
          },
        })
      ).rejects.toThrow("Vous ne pouvez pas créer un utilisateur dans ce périmètre.");
    });
  });
});
