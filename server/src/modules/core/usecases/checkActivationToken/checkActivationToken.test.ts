import jwt from "jsonwebtoken";

import { checkActivationTokenFactory } from "./checkActivationToken.usecase";

const jwtSecret = "jwtSecret";
const activationToken = jwt.sign({ email: "test@test.fr" }, jwtSecret, {
  issuer: "issuer",
  expiresIn: "7d",
});

describe("activateUser usecase", () => {
  it("should throw an exception if the token is wrong", async () => {
    const activateUser = checkActivationTokenFactory({
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: undefined,
      }),
      jwtSecret,
    });

    await expect(async () => activateUser({ activationToken: "fake" })).rejects.toThrow("wrong token");
  });

  it("should throw an exception if password is defined", async () => {
    const activateUser = checkActivationTokenFactory({
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: "password",
      }),
      jwtSecret,
    });

    await expect(async () => activateUser({ activationToken })).rejects.toThrow("user active");
  });

  it("should return ok if the user exist without password", async () => {
    const activateUser = checkActivationTokenFactory({
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: undefined,
      }),
      jwtSecret,
    });

    const response = await activateUser({ activationToken });

    await expect(response).toBe(true);
  });
});
