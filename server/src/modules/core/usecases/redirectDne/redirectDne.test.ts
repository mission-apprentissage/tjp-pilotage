/* eslint-disable-next-line import/default */
import jwt from "jsonwebtoken";
import { RoleEnum } from "shared";
import { DneSSOErrorsEnum } from "shared/enum/dneSSOErrorsEnum";
import { DneSSOInfoEnum } from "shared/enum/dneSSOInfoEnum";
import { ROLE_DNE_ROLE_ORION_CORRESPONDANCE, RoleDNEEnum, supportedLDAPGroupsEnum } from "shared/security/sso";
import { describe, expect, it, vi } from "vitest";

import { redirectDneFactory } from "./redirectDne.usecase";

describe("server > src > modules > core > usecases > redirectDne > usecase", () => {
  it("Doit throw s'il n'y a pas de code_verifier", async () => {
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
      findRegionFromAcademie: vi.fn(),
    });

    await expect(async () =>
      redirectDne({
        codeVerifierJwt: jwt.sign({}, "codeVerifierJwtSecret"),
        url: "localhost?code=mycode",
      })
    ).rejects.toThrow();
  });

  describe("Perdir", () => {
    it("Doit throw si l'utilisateur n'a pas le bon FrEduFonctAdm", async () => {
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
        findRegionFromAcademie: vi.fn(),
      };
      const redirectDne = redirectDneFactory(deps);

      await expect(async () =>
        redirectDne({
          codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
          url: "localhost?code=mycode",
        })
      ).rejects.toThrow();
    });

    it("Doit throw si l'utilisateur n'a pas d'établissement associé dans notre base de données", async () => {
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
        findRegionFromAcademie: vi.fn(),
      } as Parameters<typeof redirectDneFactory>[0];
      const redirectDne = redirectDneFactory(deps);

      await expect(async () =>
        redirectDne({
          codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
          url: "localhost?code=mycode",
        })
      ).rejects.toThrow();
    });

    it("Doit retourner un AuthorizationToken et créer l'utilisateur (sans son rôle) si l'utilisateur existe", async () => {
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
        findUserQuery: vi.fn().mockResolvedValue({ email: "email@test.test", enabled: true, role: "gestionnaire_region", password: "toto" }),
        findEtablissement: vi.fn().mockResolvedValue({ uai: "monuai", codeRegion: "75" }),
        findRegionFromAcademie: vi.fn(),
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
          role: RoleEnum["gestionnaire_region"],
          uais: ["code-uai"],
          codeRegion: "75",
          password: null,
        }),
      });

      expect(result).toMatchObject({
        token: expect.stringMatching(""),
        userCommunication: [
          DneSSOInfoEnum.USER_SWITCHED,
        ]
      });
    });

    it("Doit retourner un AuthorizationToken et créer l'utilisateur si l'utilisateur n'existe pas", async () => {
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
        findRegionFromAcademie: vi.fn(),
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
          role: RoleEnum["perdir"],
          uais: ["code-uai"],
          codeRegion: "75",
          password: null,
        }),
      });
      expect(result).toMatchObject({
        token: expect.stringMatching(""),
      });
    });

    it("Doit créer l'utilisateur avec le bon rôle s'il y a une délégation de rôle", async () => {
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
        findRegionFromAcademie: vi.fn(),
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
          role: RoleEnum["perdir"],
          uais: ["0693045K"],
          codeRegion: "75",
          password: null,
        }),
      });
      expect(result).toMatchObject({
        token: expect.stringMatching(""),
      });
    });

    it("Ne doit pas créer l'utilisateur s'il y a la délégation de droits mais pas FrEduRne sur un UAI", async () => {
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
        findRegionFromAcademie: vi.fn(),
      };
      const redirectDne = redirectDneFactory(deps);

      await expect(async () =>
        redirectDne({
          codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
          url: "localhost?code=mycode",
        })
      ).rejects.toThrow();
    });

    it("Doit créer l'utilisateur avec le bon rôle s'il y a une délégation de droits et le FrEduRne sur l'UAI", async () => {
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
        findRegionFromAcademie: vi.fn(),
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
          role: RoleEnum["perdir"],
          uais: ["0693045K"],
          codeRegion: "75",
          password: null,
        }),
      });
      expect(result).toMatchObject({
        token: expect.stringMatching(""),
      });
    });

    it("Ne doit pas créer l'utilisateur si la délégation de droits est dans le passé ou le futur", async () => {
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
        findRegionFromAcademie: vi.fn(),
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

  describe("Assignation depuis les groupes LDAP", () => {
    it("Doit privilégier les groupes LDAP par rapport aux title, FrEduGestResp et droits perdir pour l'assignation des rôles", async () => {
      const ssoUserInfo = {
        email: "user@test.test",
        given_name: "firstname",
        family_name: "lastname",
        FrEduFonctAdm: "DIR",
        FrEduRne: ["code-uai$rest"],
        ctgrps: [supportedLDAPGroupsEnum.GRP_ORIONIJ_DGESCO],
        codaca: "1"
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
        findRegionFromAcademie: vi.fn().mockResolvedValue({ codeRegion: "11" }),
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
          role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE[RoleDNEEnum.DGESCO],
          uais: undefined,
          password: null,
          codeRegion: undefined,
          sub: undefined,
          enabled: true,
        }),
      });
      expect(result).toMatchObject({
        token: expect.stringMatching(""),
      });
    });
  });

  describe("Assignation depuis le title pour les Inspecteurs", () => {
    it("Doit pouvoir récupérer l'information dans le title du userinfo", async () => {
      const ssoUserInfo = {
        email: "user@test.test",
        given_name: "firstname",
        family_name: "lastname",
        FrEduFonctAdm: "DIR",
        FrEduRne: ["code-uai$rest"],
        title: "INS",
        codaca: "1"
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
        findRegionFromAcademie: vi.fn().mockResolvedValue({ codeRegion: "11" }),
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
          role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE[RoleDNEEnum.INS],
          uais: undefined,
          password: null,
          codeRegion: "11",
          sub: undefined,
          enabled: true,
        }),
      });
      expect(result).toMatchObject({
        token: expect.stringMatching(""),
      });
    });

    it("Doit remonter une erreur sir le codaca n'est pas reconnu", async () => {
      const ssoUserInfo = {
        email: "user@test.test",
        given_name: "firstname",
        family_name: "lastname",
        FrEduFonctAdm: "DIR",
        FrEduRne: ["code-uai$rest"],
        title: "INS",
        codaca: "1"
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
        findRegionFromAcademie: vi.fn().mockResolvedValue(undefined),
      };
      const redirectDne = redirectDneFactory(deps);

      try {
        await redirectDne({
          codeVerifierJwt: jwt.sign({ code_verifier: "code_verifier" }, "codeVerifierJwtSecret"),
          url: "localhost?code=mycode",
        });
      } catch (e) {
        expect(e).toEqual(new Error(DneSSOErrorsEnum.MISSING_CODE_REGION_CODACA));
      }
    });
  });

  describe("Assignation depuis le FrEduGestResp pour les DASEN", () => {
    it("Doit pouvoir récupérer la fin du FrEduGestResp", async () => {
      const ssoUserInfo = {
        email: "user@test.test",
        given_name: "firstname",
        family_name: "lastname",
        FrEduFonctAdm: "DIR",
        FrEduRne: ["code-uai$rest"],
        FrEduGestResp: ["code-uai$rest$805$ORIONINSERJEUNES"],
        codaca: "1"
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
        findRegionFromAcademie: vi.fn().mockResolvedValue({ codeRegion: "11" }),
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
          role: ROLE_DNE_ROLE_ORION_CORRESPONDANCE[RoleDNEEnum.DASEN],
          uais: undefined,
          password: null,
          codeRegion: undefined,
          sub: undefined,
          enabled: true,
        }),
      });
      expect(result).toMatchObject({
        token: expect.stringMatching(""),
      });
    });
  });
});
