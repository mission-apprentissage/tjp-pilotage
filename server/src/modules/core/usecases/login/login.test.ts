import { LoginErrorsEnum } from "shared/enum/loginErrorsEnum";
import { describe, expect, it } from "vitest";

import { hashPassword } from "@/modules/core/utils/passwordUtils";

import { loginFactory } from "./login.usecase";

const correctPassword = "Azerty123!";
const jwtSecret = "jwtSecret";
const hashedPassword = hashPassword(correctPassword);

describe("server > src > modules > usecases > login", () => {
  it("Doit retourner une erreur si l'utilisateur n'existe pas", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => undefined,
    });

    await expect(async () =>
      login({
        password: hashedPassword,
        email: "test@test.fr",
      })
    ).rejects.toThrow(LoginErrorsEnum.WRONG_CREDENTIALS);
  });

  it("Doit retourner une erreur si l'utilisateur n'a pas configuré son mot de passe", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: undefined,
        sub: undefined,
        enabled: true
      }),
    });

    await expect(async () =>
      login({
        password: hashedPassword,
        email: "test@test.fr",
      })
    ).rejects.toThrow(LoginErrorsEnum.NO_PASSWORD);
  });

  it("Doit retourner une erreur si le mot de passe est erroné", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: hashedPassword,
        sub: undefined,
        enabled: true
      }),
    });

    await expect(async () =>
      login({
        password: "other",
        email: "test@test.fr",
      })
    ).rejects.toThrow();
  });

  it("Doit remonté une erreur si le compte est desactivé", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: hashedPassword,
        sub: "1234",
        enabled: false
      }),
    });

    await expect(async () =>
      login({
        password: hashedPassword,
        email: "test@test.fr",
      })
    ).rejects.toThrow(LoginErrorsEnum.DISABLED);
  });

  it("Doit remonté une erreur si le compte est un compte utilisant le SSO", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: hashedPassword,
        sub: "1234",
        enabled: true
      }),
    });

    await expect(async () =>
      login({
        password: hashedPassword,
        email: "test@test.fr",
      })
    ).rejects.toThrow(LoginErrorsEnum.EXTERNAL_USER);
  });

  it("Doit retourner un token d'authentification si l'utilisateur existe, n'est pas lié au SSO et le mot de passe correspond", async () => {
    const login = loginFactory({
      jwtSecret,
      findUserQuery: async () => ({
        email: "test@test.fr",
        password: hashedPassword,
        sub: undefined,
        enabled: true
      }),
    });

    const token = await login({
      password: correctPassword,
      email: "test@test.fr",
    });

    await expect(token).toBeDefined();
  });
});
