import { PERMISSIONS } from "shared";

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
      insertUserQuery: jest.fn(async () => {}),
      findUserQuery: jest.fn(async () => ({ email: user.email })),
      shootTemplate: jest.fn(async () => {}),
    };
    const createUser = createUserFactory(deps);
    expect(() =>
      createUser({
        body: user,
        requestUser,
      })
    ).rejects.toThrow("email already exist");
  });

  it("should throw an error if the given email is not valid", async () => {
    const deps = {
      insertUserQuery: jest.fn(async () => {}),
      findUserQuery: jest.fn(async () => undefined),
      shootTemplate: jest.fn(async () => {}),
      verifyScope: jest.fn(() => true),
    };
    const createUser = createUserFactory(deps);
    expect(() =>
      createUser({
        body: { ...user, email: "fakeEmail" },
        requestUser,
      })
    ).rejects.toThrow("email is not valid");
  });

  it("should create the user and send the activation email", async () => {
    const deps = {
      insertUserQuery: jest.fn(async () => {}),
      findUserQuery: jest.fn(async () => undefined),
      shootTemplate: jest.fn(async () => {}),
    };
    const createUser = createUserFactory(deps);
    await createUser({
      body: user,
      requestUser,
    });

    await expect(deps.insertUserQuery).toHaveBeenCalled();
    await expect(deps.shootTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ template: "activate_account" })
    );
  });

  describe("role validation", () => {
    it("should throw an error if the requestUser role is not admin or admin_region", async () => {
      const deps = {
        insertUserQuery: jest.fn(async () => {}),
        findUserQuery: jest.fn(async () => undefined),
        shootTemplate: jest.fn(async () => {}),
      };
      const createUser = createUserFactory(deps);
      const notAllowedRoles: Array<keyof typeof PERMISSIONS> = Object.keys(
        PERMISSIONS
      ).filter((p) => !["admin", "admin_region"].includes(p)) as Array<
        keyof typeof PERMISSIONS
      >;

      for (const role of notAllowedRoles) {
        expect(() =>
          createUser({
            body: user,
            requestUser: { ...requestUser, role },
          })
        ).rejects.toThrow("cannot create user with this role");
      }
    });

    it("should only allow requestUser with role admin_region and admin to create", async () => {
      const deps = {
        insertUserQuery: jest.fn(async () => {}),
        findUserQuery: jest.fn(async () => undefined),
        shootTemplate: jest.fn(async () => {}),
      };
      const createUser = createUserFactory(deps);

      await createUser({
        body: { ...user },
        requestUser,
      });

      await expect(deps.insertUserQuery).toHaveBeenCalled();
      await expect(deps.shootTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ template: "activate_account" })
      );

      await createUser({
        body: { ...user, codeRegion: "84", role: "pilote_region" },
        requestUser: { ...requestUser, role: "admin_region", codeRegion: "84" },
      });

      await expect(deps.insertUserQuery).toHaveBeenCalled();
      await expect(deps.shootTemplate).toHaveBeenCalledWith(
        expect.objectContaining({ template: "activate_account" })
      );
    });
  });

  describe("scope validation", () => {
    it("should create the user and send the activation email if the requestUser scope is region and code region is matching", async () => {
      const deps = {
        insertUserQuery: jest.fn(async () => {}),
        findUserQuery: jest.fn(async () => undefined),
        shootTemplate: jest.fn(async () => {}),
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
        insertUserQuery: jest.fn(async () => {}),
        findUserQuery: jest.fn(async () => undefined),
        shootTemplate: jest.fn(async () => {}),
      };
      const createUser = createUserFactory(deps);
      expect(() =>
        createUser({
          body: { ...user, codeRegion: "76", role: "pilote_region" },
          requestUser: {
            ...requestUser,
            codeRegion: "84",
            role: "admin_region",
          },
        })
      ).rejects.toThrow("cannot create user within this scope");
    });
  });
});
