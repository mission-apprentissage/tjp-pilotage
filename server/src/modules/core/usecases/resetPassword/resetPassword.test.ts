import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

import { resetPasswordFactory } from "./resetPassword.usecase";

const correctPassword = "Azerty123!";
const jwtSecret = "jwtSecret";
const resetPasswordToken = jwt.sign({ email: "test@test.fr" }, jwtSecret, {
  issuer: "issuer",
  expiresIn: "1h",
});

describe("resetPassword usecase", () => {
  it("should throw an exception if the token is missing", async () => {
    const resetPassword = resetPasswordFactory({
      setPasswordQuery: async () => {},
      jwtSecret,
    });

    await expect(async () =>
      resetPassword({
        password: correctPassword,
        repeatPassword: correctPassword,
        resetPasswordToken: undefined as unknown as string,
      })
    ).rejects.toThrow("missing token");
  });

  it("should throw an exception if the token is invalid", async () => {
    const resetPassword = resetPasswordFactory({
      setPasswordQuery: async () => {},
      jwtSecret,
    });

    await expect(async () =>
      resetPassword({
        password: correctPassword,
        repeatPassword: correctPassword,
        resetPasswordToken: "fakeToken",
      })
    ).rejects.toThrow("wrong token");
  });

  it("should throw an exception if passwords are different", async () => {
    const resetPassword = resetPasswordFactory({
      setPasswordQuery: async () => {},
      jwtSecret,
    });

    await expect(async () =>
      resetPassword({
        password: "aaa",
        repeatPassword: "bbb",
        resetPasswordToken,
      })
    ).rejects.toThrow("different passwords");
  });

  it("should throw an exception if password is unsafe", async () => {
    const resetPassword = resetPasswordFactory({
      setPasswordQuery: async () => {},
      jwtSecret,
    });

    await expect(async () =>
      resetPassword({
        password: "azerty",
        repeatPassword: "azerty",
        resetPasswordToken,
      })
    ).rejects.toThrow("password unsafe");
  });

  it("should set password", async () => {
    const deps = {
      setPasswordQuery: vi.fn(async () => {}),
      jwtSecret,
    };

    const resetPassword = resetPasswordFactory(deps);

    await resetPassword({
      password: correctPassword,
      repeatPassword: correctPassword,
      resetPasswordToken,
    });
    await expect(deps.setPasswordQuery).toBeCalledWith(
      expect.objectContaining({
        email: "test@test.fr",
      })
    );
  });
});
