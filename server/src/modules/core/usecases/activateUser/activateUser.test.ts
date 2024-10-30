import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

import { activateUserFactory } from "./activateUser.usecase";

const correctPassword = "Azerty123!";
const jwtSecret = "jwtSecret";
const activationToken = jwt.sign({ email: "test@test.fr" }, jwtSecret, {
  issuer: "issuer",
  expiresIn: "1h",
});

describe("activateUser usecase", () => {
  it("should throw an exception if the token is missing", async () => {
    const activateUser = activateUserFactory({
      updateUserQuery: async () => {},
      jwtSecret,
    });

    await expect(async () =>
      activateUser({
        password: correctPassword,
        repeatPassword: correctPassword,
        activationToken: undefined as unknown as string,
      })
    ).rejects.toThrow("missing token");
  });

  it("should throw an exception if the token is invalid", async () => {
    const activateUser = activateUserFactory({
      updateUserQuery: async () => {},
      jwtSecret,
    });

    await expect(async () =>
      activateUser({
        password: correctPassword,
        repeatPassword: correctPassword,
        activationToken: "fakeToken",
      })
    ).rejects.toThrow("wrong token");
  });

  it("should throw an exception if passwords are different", async () => {
    const activateUser = activateUserFactory({
      updateUserQuery: async () => {},
      jwtSecret,
    });

    await expect(async () =>
      activateUser({
        password: "aaa",
        repeatPassword: "bbb",
        activationToken,
      })
    ).rejects.toThrow("different passwords");
  });

  it("should throw an exception if password is unsafe", async () => {
    const activateUser = activateUserFactory({
      updateUserQuery: async () => {},
      jwtSecret,
    });

    await expect(async () =>
      activateUser({
        password: "azerty",
        repeatPassword: "azerty",
        activationToken,
      })
    ).rejects.toThrow("password unsafe");
  });

  it("should set password", async () => {
    const deps = {
      updateUserQuery: vi.fn(async () => {}),
      jwtSecret,
    };

    const activateUser = activateUserFactory(deps);

    await activateUser({
      password: correctPassword,
      repeatPassword: correctPassword,
      activationToken,
    });
    await expect(deps.updateUserQuery).toBeCalledWith(
      expect.objectContaining({
        email: "test@test.fr",
      })
    );
  });
});
