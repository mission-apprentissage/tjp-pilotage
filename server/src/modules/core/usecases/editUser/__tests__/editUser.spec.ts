import { usePg } from "@tests/utils/pg.test.utils";
import { clearUsers, createUserBuilder, generateAuthCookie } from "@tests/utils/schema/users.spec.utils";
import type { Insertable } from "kysely";
import { RoleEnum } from "shared";
import { UserFonctionEnum } from "shared/enum/userFonctionEnum";
import type { IResError } from "shared/models/errors";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import type { Server } from "@/server/server.js";
import createServer from "@/server/server.js";
import { cleanNull } from "@/utils/noNull";

type User = Insertable<DB["user"]>

usePg();

describe("[PUT]/users/:userId", () => {
  let app: Server;
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeAll(async () => {
    app = await createServer();
    await app.ready();

    return async () => app.close();
  }, 15_000);

  beforeEach(() => {
    fixture = fixtureBuilder(app);
  });

  afterEach(async () => {
    await clearUsers();
  });

  it("doit retourner une erreur unauthorized si l'utilisateur n'est pas autorisé à modifier", async () => {
    const user : User  = {
      id: "88e21879-9b1d-47a5-8ec1-5e8d7fca5de3",
      email: "jean.perdir@ac-grenoble.fr",
      role: RoleEnum["perdir"],
      firstname: "Jean",
      lastname: "Perdir",
      enabled: true,
      codeRegion: null,
      fonction: null,
    };

    await fixture.given.currentUserNotAdmin();
    await fixture.when.editUser(user);
    fixture.then.verifierResponseForbidden();
  });

  it("doit retourner une erreur 404 si l'utilisateur n'existe pas", async () => {
    const user : User  = {
      id: "88e21879-9b1d-47a5-8ec1-5e8d7fca5de3",
      email: "jean.perdir@ac-grenoble.fr",
      role: RoleEnum["perdir"],
      firstname: "Jean",
      lastname: "Perdir",
      enabled: true,
      codeRegion: null,
      fonction: null,
    };

    await fixture.given.currentUserAdmin();
    await fixture.given.userNotExists();
    await fixture.when.editUser(user);
    fixture.then.verifierResponseNotFound();
    fixture.then.verifierErrorMessage("Utilisateur inconnu dans l'application");
  });

  it("doit retourner une erreur si l'email de l'utilisateur est modifié et qu'il existe déjà un email similaire", async () => {
    const user : User  = {
      id: "88e21879-9b1d-47a5-8ec1-5e8d7fca5de3",
      email: "jean.pas.perdir@ac-grenoble.fr",
      role: RoleEnum["perdir"],
      firstname: "Jean",
      lastname: "Perdir",
      enabled: true,
      codeRegion: null,
      fonction: null,
    };

    await fixture.given.currentUserAdmin();
    await fixture.given.existingUser({...user, email: "jean.perdir@ac-grenoble.fr"});
    await fixture.given.existingUser({...user, email: "jean.pas.perdir@ac-grenoble.fr", id: "88e21879-9b1d-47a5-8ec1-5e8d7fca5de4"});
    await fixture.when.editUser(user);
    fixture.then.verifierResponseBadRequest();
    fixture.then.verifierErrorMessage("Cette adresse email est déjà utilisée par un autre utilisateur");
  });

  it("doit retourner une erreur si l'email de l'utilisateur est modifié et qu'il existe déjà un email similaire et s'affranchir des majuscules", async () => {
    const user : User  = {
      id: "88e21879-9b1d-47a5-8ec1-5e8d7fca5de3",
      email: "Jean.pas.PERDIR@ac-grenoble.fr",
      role: RoleEnum["perdir"],
      firstname: "Jean",
      lastname: "Perdir",
      enabled: true,
      codeRegion: null,
      fonction: null,
    };

    await fixture.given.currentUserAdmin();
    await fixture.given.existingUser({...user, email: "jean.perdir@ac-grenoble.fr"});
    await fixture.given.existingUser({...user, email: "jean.pas.perdir@ac-grenoble.fr", id: "88e21879-9b1d-47a5-8ec1-5e8d7fca5de4"});
    await fixture.when.editUser(user);
    fixture.then.verifierResponseBadRequest();
    fixture.then.verifierErrorMessage("Cette adresse email est déjà utilisée par un autre utilisateur");
  });

  it("doit pouvoir modifier un utilisateur avec un compte inactif", async () => {
    const user : User  = {
      id: "88e21879-9b1d-47a5-8ec1-5e8d7fca5de3",
      email: "jean.perdir@ac-grenoble.fr",
      role: RoleEnum["perdir"],
      firstname: "Jean",
      lastname: "Perdir",
      enabled: false,
      codeRegion: null,
      fonction: null,
    };

    await fixture.given.currentUserAdmin();
    await fixture.given.existingUser({...user, enabled: true, fonction: null, role: RoleEnum["invite"]});
    await fixture.when.editUser(user);
    fixture.then.verifierReponseSucces();
    await fixture.then.verifierUserInformations(user);
  });

  it("doit pouvoir changer la fonction et la région d'un utilisateur", async () => {
    const user : User  = {
      id: "88e21879-9b1d-47a5-8ec1-5e8d7fca5de3",
      email: "jean.perdir@ac-grenoble.fr",
      role: RoleEnum["perdir"],
      firstname: "Jean",
      lastname: "Perdir",
      enabled: true,
      codeRegion: "84",
      fonction: UserFonctionEnum["CSA"],
    };

    await fixture.given.currentUserAdmin();
    await fixture.given.existingUser({...user, enabled: true, fonction: null, codeRegion: null, role: RoleEnum["invite"]});
    await fixture.when.editUser(user);
    fixture.then.verifierReponseSucces();
    await fixture.then.verifierUserInformations(user);
  });


  const fixtureBuilder = (app: Server) => {
    let currentUser: RequestUser | undefined = undefined;
    let responseCode: number;
    let errorMessage: string;

    return {
      given: {
        currentUserNotAdmin: async () => {
          currentUser = await createUserBuilder().withRole(RoleEnum["invite"]).create();
        },
        userNotExists: async () => {
          await getKbdClient().deleteFrom("user").where("id", '!=', currentUser!.id).execute();
        },
        currentUserAdmin: async () => {
          currentUser = await createUserBuilder().withRole(RoleEnum["admin"]).create();
        },
        existingUser: async (user: User) => {
          await getKbdClient().insertInto("user").values({...user}).execute();
        }
      },
      when: {
        editUser: async (user: User) => {
          const response = await app.inject({
            method: "PUT",
            url: `/api/users/${user.id}`,
            body: user,
            cookies: currentUser ? generateAuthCookie(currentUser) : undefined,
          });

          responseCode = response.statusCode;

          if(responseCode !== 200) {
            const responseBody = await response.json<IResError>();
            errorMessage = responseBody.message;
          }
        }
      },
      then: {
        verifierReponseSucces: () => {
          expect(responseCode).toBe(200);
        },
        verifierReponseErreur: () => {
          expect(responseCode).toBe(400);
        },
        verifierResponseNotFound: () => {
          expect(responseCode).toBe(404);
        },
        verifierResponseForbidden: () => {
          expect(responseCode).toBe(403);
        },
        verifierErrorMessage: (error: string) => {
          expect(errorMessage).toEqual(error);
        },
        verifierResponseBadRequest: () => {
          expect(responseCode).toBe(400);
        },
        verifierUserInformations: async (user: User) => {
          const cleanUser = cleanNull(user);
          const userFromDb = await getKbdClient().selectFrom("user").where("id", "=", user.id!).selectAll().executeTakeFirst();

          const userFromDbClean = cleanNull(userFromDb);

          expect(userFromDbClean).not.toBeUndefined();
          expect(userFromDbClean?.email).toEqual(cleanUser.email);
          expect(userFromDbClean?.role).toEqual(cleanUser.role);
          expect(userFromDbClean?.firstname).toEqual(cleanUser.firstname);
          expect(userFromDbClean?.lastname).toEqual(cleanUser.lastname);
          expect(userFromDbClean?.enabled).toEqual(cleanUser.enabled);
          expect(userFromDbClean?.codeRegion).toEqual(cleanUser.codeRegion);
          expect(userFromDbClean?.fonction).toEqual(cleanUser.fonction);
          expect(userFromDbClean?.uais).toEqual(cleanUser.uais);
          expect(userFromDbClean?.id).toEqual(cleanUser.id);
        }
      }
    };
  };
});
