import jwt from "jsonwebtoken";

import { activateUserFactory } from "./activateUser.usecase";

const correctPassword = "Azerty123!";
const jwtSecret = "jwtSecret";
const activationToken = jwt.sign({ email: "test@test.fr" }, jwtSecret, {
  issuer: "issuer",
  expiresIn: "1h",
});

describe("setUserPassword usecase", () => {
  it("should throw an exception if the token is missing", async () => {
    const setUserPassword = activateUserFactory({
      setPasswordQuery: async () => {},
      jwtSecret,
    });

    await expect(() =>
      setUserPassword({
        password: correctPassword,
        repeatPassword: correctPassword,
        activationToken: undefined as unknown as string,
      })
    ).rejects.toThrow("missing token");
  });

  it("should throw an exception if the token invalid", async () => {
    const setUserPassword = activateUserFactory({
      setPasswordQuery: async () => {},
      jwtSecret,
    });

    await expect(() =>
      setUserPassword({
        password: correctPassword,
        repeatPassword: correctPassword,
        activationToken: "fakeToken",
      })
    ).rejects.toThrow("wrong token");
  });

  it("should throw an exception if passwords are different", async () => {
    const setUserPassword = activateUserFactory({
      setPasswordQuery: async () => {},
      jwtSecret,
    });

    await expect(() =>
      setUserPassword({
        password: "aaa",
        repeatPassword: "bbb",
        activationToken,
      })
    ).rejects.toThrow("different passwords");
  });

  it("should throw an exception if password is unsafe", async () => {
    const setUserPassword = activateUserFactory({
      setPasswordQuery: async () => {},
      jwtSecret,
    });

    await expect(() =>
      setUserPassword({
        password: "azerty",
        repeatPassword: "azerty",
        activationToken,
      })
    ).rejects.toThrow("password unsafe");
  });

  it("should set password", async () => {
    const deps = {
      setPasswordQuery: jest.fn(async () => {}),
      jwtSecret,
    };

    const setUserPassword = activateUserFactory(deps);

    await setUserPassword({
      password: correctPassword,
      repeatPassword: correctPassword,
      activationToken,
    });
    await expect(deps.setPasswordQuery).toBeCalledWith(
      expect.objectContaining({
        email: "test@test.fr",
      })
    );
  });
});
