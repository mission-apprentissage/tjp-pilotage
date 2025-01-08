import { describe, expect, it, vi } from "vitest";

import { sendResetPasswordFactory } from "./sendResetPassword.usecase";

const jwtSecret = "jwtSecret";

const user = {
  email: "test@test.fr",
  firstname: "firstname",
  lastname: "lastname",
  password: "password",
  sub: undefined,
};

describe("sendResetPassword usecase", () => {
  it("should throw an exception if the email does not exist", async () => {
    const sendResetPassword = sendResetPasswordFactory({
      jwtSecret,
      findUserQuery: async () => undefined,
      shootTemplate: async () => {},
    });

    await expect(async () =>
      sendResetPassword({
        email: "other@test.fr",
      }),
    ).rejects.toThrow("Email inconnu dans Orion.");
  });

  it("should throw an exception if the user is connected with SSO", async () => {
    const sendResetPassword = sendResetPasswordFactory({
      jwtSecret,
      findUserQuery: async () => ({ ...user, sub: "XABCD" }),
      shootTemplate: async () => {},
    });

    await expect(async () =>
      sendResetPassword({
        email: "test@test.fr",
      }),
    ).rejects.toThrow(
      "Vous ne pouvez pas réinitialiser votre mot de passe, veuillez vous connecter à Orion via le portail ARENA.",
    );
  });

  it("should send the reset password email", async () => {
    const deps = {
      jwtSecret,
      findUserQuery: async () => user,
      shootTemplate: vi.fn(async () => {}),
    };

    const sendResetPassword = sendResetPasswordFactory(deps);

    await sendResetPassword({
      email: "test@test.fr",
    });

    await expect(deps.shootTemplate).toHaveBeenCalledWith(expect.objectContaining({ template: "reset_password" }));
  });
});
