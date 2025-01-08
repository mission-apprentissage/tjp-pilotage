import { describe, expect, it } from "vitest";

import { hashPassword } from "@/modules/core/utils/passwordUtils";

import { loginFactory } from "./login.usecase";

const correctPassword = "Azerty123!";
const jwtSecret = "jwtSecret";
const hashedPassword = hashPassword(correctPassword);

describe("login usecase", () => {
  it("should throw an exception if the user does not exist", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => undefined,
    });

    await expect(async () =>
      login({
        password: hashedPassword,
        email: "test@test.fr",
      }),
    ).rejects.toThrow("wrong credentials");
  });

  it("should throw an exception if the user has not configured password", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: undefined,
      }),
    });

    await expect(async () =>
      login({
        password: hashedPassword,
        email: "test@test.fr",
      }),
    ).rejects.toThrow("wrong credentials");
  });

  it("should throw an exception if the given password is incorrect", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: hashedPassword,
      }),
    });

    await expect(async () =>
      login({
        password: "other",
        email: "test@test.fr",
      }),
    ).rejects.toThrow();
  });

  it("should return a login token", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: hashedPassword,
      }),
    });

    const token = await login({
      password: correctPassword,
      email: "test@test.fr",
    });

    await expect(token).toBeDefined();
  });
});
