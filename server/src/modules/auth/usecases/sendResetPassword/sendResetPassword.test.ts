import { sendResetPasswordFactory } from "./sendResetPassword.usecase";

const jwtSecret = "jwtSecret";

const user = {
  email: "test@test.fr",
  firstname: "firstname",
  lastname: "lastname",
  password: "password",
};

describe("sendResetPassword usecase", () => {
  it("should throw an exception if the email does not exist", async () => {
    const sendResetPassword = sendResetPasswordFactory({
      jwtSecret,
      findUserQuery: async () => undefined,
      shootTemplate: async () => {},
    });

    await expect(() =>
      sendResetPassword({
        email: "other@test.fr",
      })
    ).rejects.toThrow("email does not exist");
  });

  it("should send the reset password email", async () => {
    const deps = {
      jwtSecret,
      findUserQuery: async () => user,
      shootTemplate: jest.fn(async () => {}),
    };

    const sendResetPassword = sendResetPasswordFactory(deps);

    await sendResetPassword({
      email: "test@test.fr",
    });

    await expect(deps.shootTemplate).toBeCalledWith(
      expect.objectContaining({ template: "reset_password" })
    );
  });
});
