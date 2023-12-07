import jwt from "jsonwebtoken";

import { redirectDneFactory } from "./redirectDne.usecase";

describe("redirectDne usecase", () => {
  it("should throw an error if there is no valid code_verifier", async () => {
    const redirectDne = redirectDneFactory({
      getDneClient: jest.fn().mockResolvedValue({
        callbackParams: jest.fn(),
        callback: jest.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: jest.fn().mockResolvedValue({ email: "user@test.test" }),
      }),
      createUserInDB: jest.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: jest.fn().mockResolvedValue({ email: "salut" }),
    });

    await expect(() =>
      redirectDne({
        codeVerifierJwt: jwt.sign({}, "codeVerifierJwtSecret"),
        url: "localhost?code=mycode",
      })
    ).rejects.toThrow();
  });

  it("should throw an Error if the sso user is not allowed", async () => {
    const ssoUserInfo = {
      email: "user@test.test",
      given_name: "firstname",
      family_name: "lastname",
      FrEduFonctAdm: "ENS",
    };
    const deps = {
      getDneClient: jest.fn().mockResolvedValue({
        callbackParams: jest.fn(),
        callback: jest.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: jest.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: jest.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: jest.fn().mockResolvedValue(undefined),
    };
    const redirectDne = redirectDneFactory(deps);

    await expect(() =>
      redirectDne({
        codeVerifierJwt: jwt.sign(
          { code_verifier: "code_verifier" },
          "codeVerifierJwtSecret"
        ),
        url: "localhost?code=mycode",
      })
    ).rejects.toThrow();
  });

  it("should return an Authorization token if the user exist and upsert the existing user", async () => {
    const ssoUserInfo = {
      email: "user@test.test",
      given_name: "firstname",
      family_name: "lastname",
      FrEduFonctAdm: "DIR",
      FrEduRne: ["code-uai$rest"],
    };
    const deps = {
      getDneClient: jest.fn().mockResolvedValue({
        callbackParams: jest.fn(),
        callback: jest.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: jest.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: jest.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: jest.fn().mockResolvedValue({ email: "email@test.test" }),
    };
    const redirectDne = redirectDneFactory(deps);

    const result = await redirectDne({
      codeVerifierJwt: jwt.sign(
        { code_verifier: "code_verifier" },
        "codeVerifierJwtSecret"
      ),
      url: "localhost?code=mycode",
    });
    expect(deps.createUserInDB).toHaveBeenCalledWith({
      user: expect.objectContaining({
        email: ssoUserInfo.email,
        firstname: ssoUserInfo.given_name,
        lastname: ssoUserInfo.family_name,
        role: "perdir",
        uais: ["code-uai"],
      }),
    });
    expect(result).toMatchObject({
      token: expect.stringMatching(""),
    });
  });

  it("should create the user with the correct role if the user exist and return an Authorization token", async () => {
    const ssoUserInfo = {
      email: "user@test.test",
      given_name: "firstname",
      family_name: "lastname",
      FrEduFonctAdm: "DIR",
      FrEduRne: ["code-uai$rest"],
    };
    const deps = {
      getDneClient: jest.fn().mockResolvedValue({
        callbackParams: jest.fn(),
        callback: jest.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: jest.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: jest.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: jest.fn().mockResolvedValue(undefined),
    };
    const redirectDne = redirectDneFactory(deps);

    const result = await redirectDne({
      codeVerifierJwt: jwt.sign(
        { code_verifier: "code_verifier" },
        "codeVerifierJwtSecret"
      ),
      url: "localhost?code=mycode",
    });
    expect(deps.createUserInDB).toHaveBeenCalledWith({
      user: expect.objectContaining({
        email: ssoUserInfo.email,
        firstname: ssoUserInfo.given_name,
        lastname: ssoUserInfo.family_name,
        role: "perdir",
        uais: ["code-uai"],
      }),
    });
    expect(result).toMatchObject({
      token: expect.stringMatching(""),
    });
  });
});
