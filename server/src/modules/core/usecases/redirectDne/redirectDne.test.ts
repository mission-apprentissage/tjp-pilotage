import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

import { redirectDneFactory } from "./redirectDne.usecase";

describe("redirectDne usecase", () => {
  it("should throw an error if there is no valid code_verifier", async () => {
    const redirectDne = redirectDneFactory({
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue({ email: "user@test.test" }),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue({ email: "salut", enabled: true }),
      findEtablissement: vi.fn(),
    });

    await expect(async () =>
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
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue(undefined),
      findEtablissement: vi.fn(),
    };
    const redirectDne = redirectDneFactory(deps);

    await expect(async () =>
      redirectDne({
        codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
        url: "localhost?code=mycode",
      })
    ).rejects.toThrow();
  });

  it("should throw an Error if the sso user is not allowed", async () => {
    const ssoUserInfo = {
      email: "user@test.test",
      given_name: "firstname",
      family_name: "lastname",
      FrEduFonctAdm: "DIR",
      FrEduRne: ["code-uai$rest"],
    };
    const deps = {
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue(undefined),
      findEtablissement: vi.fn().mockResolvedValue(undefined),
    } as Parameters<typeof redirectDneFactory>[0];
    const redirectDne = redirectDneFactory(deps);

    await expect(async () =>
      redirectDne({
        codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
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
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue({ email: "email@test.test", enabled: true }),
      findEtablissement: vi.fn().mockResolvedValue({ uai: "monuai", codeRegion: "75" }),
    };
    const redirectDne = redirectDneFactory(deps);

    const result = await redirectDne({
      codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
      url: "localhost?code=mycode",
    });

    expect(deps.createUserInDB).toHaveBeenCalledWith({
      user: expect.objectContaining({
        email: ssoUserInfo.email,
        firstname: ssoUserInfo.given_name,
        lastname: ssoUserInfo.family_name,
        role: "perdir",
        uais: ["code-uai"],
        codeRegion: "75",
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
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue(undefined),
      findEtablissement: vi.fn().mockResolvedValue({ uai: "monuai", codeRegion: "75" }),
    };
    const redirectDne = redirectDneFactory(deps);

    const result = await redirectDne({
      codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
      url: "localhost?code=mycode",
    });
    expect(deps.createUserInDB).toHaveBeenCalledWith({
      user: expect.objectContaining({
        email: ssoUserInfo.email,
        firstname: ssoUserInfo.given_name,
        lastname: ssoUserInfo.family_name,
        role: "perdir",
        uais: ["code-uai"],
        codeRegion: "75",
      }),
    });
    expect(result).toMatchObject({
      token: expect.stringMatching(""),
    });
  });

  it("should create the user with the correct role if there is a authorization delegation", async () => {
    const ssoUserInfo = {
      FrEduRne: ["0693045K$UAJ$PU$ADM$0693045K$T3$LP$320"],
      FrEduResDel: [
        "orioninserjeunes|/mdp/redirectionhub/redirect.jsp?applicationname=orioninserjeunes|03/03/2024|31/12/9999|cpizzagalli|FrEduRneResp=0693045K$UAJ$PU$N$T3$LP$320|rev-proxy-dmz-portail||",
        "orioninserjeunes|/redirectionhub/redirect.jsp?applicationname=orioninserjeunes_etab|03/03/2024|31/12/9999|cpizzagalli|FrEduRneResp=0693045K$UAJ$PU$N$T3$LP$320|rev-proxy-dmz-portail||",
      ],
      FrEduRneResp: ["X"],
      email: "user@test.test",
      given_name: "firstname",
      family_name: "lastname",
    };
    const deps = {
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue(undefined),
      findEtablissement: vi.fn().mockResolvedValue({ uai: "monuai", codeRegion: "75" }),
    };
    const redirectDne = redirectDneFactory(deps);

    const result = await redirectDne({
      codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
      url: "localhost?code=mycode",
    });
    expect(deps.createUserInDB).toHaveBeenCalledWith({
      user: expect.objectContaining({
        email: ssoUserInfo.email,
        firstname: ssoUserInfo.given_name,
        lastname: ssoUserInfo.family_name,
        role: "perdir",
        uais: ["0693045K"],
        codeRegion: "75",
      }),
    });
    expect(result).toMatchObject({
      token: expect.stringMatching(""),
    });
  });

  it("should not create the user with the correct role if there is a authorization delegation, but no perdir role", async () => {
    const ssoUserInfo = {
      FrEduResDel: [
        "orioninserjeunes|/mdp/redirectionhub/redirect.jsp?applicationname=orioninserjeunes|03/03/2024|31/12/9999|cpizzagalli|FrEduRneResp=0693045K$UAJ$PU$N$T3$LP$320|rev-proxy-dmz-portail||",
        "orioninserjeunes|/redirectionhub/redirect.jsp?applicationname=orioninserjeunes_etab|03/03/2024|31/12/9999|cpizzagalli|FrEduRneResp=0693045K$UAJ$PU$N$T3$LP$320|rev-proxy-dmz-portail||",
      ],
      FrEduRneResp: ["X"],
      email: "user@test.test",
      given_name: "firstname",
      family_name: "lastname",
    };
    const deps = {
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue(undefined),
      findEtablissement: vi.fn().mockResolvedValue({ uai: "monuai", codeRegion: "75" }),
    };
    const redirectDne = redirectDneFactory(deps);

    await expect(async () =>
      redirectDne({
        codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
        url: "localhost?code=mycode",
      })
    ).rejects.toThrow();
  });

  it("should create the user with the correct role if there is a authorization delegation, but no perdir role on uai", async () => {
    const ssoUserInfo = {
      FrEduRne: ["XXXXXXXK$UAJ$PU$ADM$0693045K$T3$LP$320"],
      FrEduResDel: [
        "orioninserjeunes|/mdp/redirectionhub/redirect.jsp?applicationname=orioninserjeunes|03/03/2024|31/12/9999|cpizzagalli|FrEduRneResp=0693045K$UAJ$PU$N$T3$LP$320|rev-proxy-dmz-portail||",
        "orioninserjeunes|/redirectionhub/redirect.jsp?applicationname=orioninserjeunes_etab|03/03/2024|31/12/9999|cpizzagalli|FrEduRneResp=0693045K$UAJ$PU$N$T3$LP$320|rev-proxy-dmz-portail||",
      ],
      FrEduRneResp: ["X"],
      email: "user@test.test",
      given_name: "firstname",
      family_name: "lastname",
    };
    const deps = {
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue(undefined),
      findEtablissement: vi.fn().mockResolvedValue({ uai: "monuai", codeRegion: "75" }),
    };
    const redirectDne = redirectDneFactory(deps);

    const result = await redirectDne({
      codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
      url: "localhost?code=mycode",
    });

    expect(deps.createUserInDB).toHaveBeenCalledWith({
      user: expect.objectContaining({
        email: ssoUserInfo.email,
        firstname: ssoUserInfo.given_name,
        lastname: ssoUserInfo.family_name,
        role: "perdir",
        uais: ["0693045K"],
        codeRegion: "75",
      }),
    });
    expect(result).toMatchObject({
      token: expect.stringMatching(""),
    });
  });

  it("should not create the user if authorization delegation is past or future", async () => {
    const currentYear = new Date().getFullYear();
    const ssoUserInfo = {
      FrEduRne: ["0693045K$UAJ$PU$ADM$0693045K$T3$LP$320"],
      FrEduResDel: [
        `orioninserjeunes|/mdp/redirectionhub/redirect.jsp?applicationname=orioninserjeunes|03/03/${
          currentYear - 2
        }|31/12/${currentYear - 1}|cpizzagalli|FrEduRneResp=0693045K$UAJ$PU$N$T3$LP$320|rev-proxy-dmz-portail||`,
        `orioninserjeunes|/redirectionhub/redirect.jsp?applicationname=orioninserjeunes_etab|03/10/${
          currentYear + 1
        }|31/12/${currentYear + 2}|cpizzagalli|FrEduRneResp=0693045K$UAJ$PU$N$T3$LP$320|rev-proxy-dmz-portail||`,
      ],
      FrEduRneResp: ["X"],
      email: "user@test.test",
      given_name: "firstname",
      family_name: "lastname",
    };
    const deps = {
      getDneClient: vi.fn().mockResolvedValue({
        callbackParams: vi.fn(),
        callback: vi.fn().mockResolvedValue({ access_token: "access_token" }),
        userinfo: vi.fn().mockResolvedValue(ssoUserInfo),
      }),
      createUserInDB: vi.fn(),
      authJwtSecret: "authJwtSecret",
      codeVerifierJwtSecret: "codeVerifierJwtSecret",
      findUserQuery: vi.fn().mockResolvedValue(undefined),
      findEtablissement: vi.fn().mockResolvedValue({ uai: "monuai", codeRegion: "75" }),
    };
    const redirectDne = redirectDneFactory(deps);

    await expect(async () =>
      redirectDne({
        codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
        url: "localhost?code=mycode",
      })
    ).rejects.toThrow();
  });
});
